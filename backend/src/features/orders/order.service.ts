import mongoose, { Types, type ClientSession, type HydratedDocument } from "mongoose";
import { AppError } from "../../shared/errors/AppError";
import { ProductModel, type IProduct } from "../products/product.model";
import { OrderModel, type IOrderItem } from "./order.model";
import { priceOrder, type PriceLine } from "./order.pricing";
import type { CreateOrderInput, OrderItemInput, QuoteInput } from "./order.schema";

const MAX_QTY = 10;

type ResolvedLine = {
  product: HydratedDocument<IProduct>;
  size: string | null;
  quantity: number;
};

async function resolveLines(
  items: OrderItemInput[],
  session?: ClientSession
): Promise<ResolvedLine[]> {
  const ids = items.flatMap((item) => (item.productId ? [item.productId] : []));
  const skus = items.flatMap((item) => (item.sku ? [item.sku.toUpperCase()] : []));

  const query = ProductModel.find({
    isActive: true,
    deletedAt: null,
    $or: [{ _id: { $in: ids } }, { sku: { $in: skus } }],
  });
  if (session) query.session(session);
  const products = await query;

  const byId = new Map(products.map((product) => [product.id, product]));
  const bySku = new Map(products.map((product) => [product.sku, product]));
  const grouped = new Map<string, ResolvedLine>();

  for (const item of items) {
    const product =
      (item.productId ? byId.get(item.productId.toLowerCase()) : undefined) ??
      (item.sku ? bySku.get(item.sku.toUpperCase()) : undefined);

    if (!product) {
      throw new AppError(400, "An item in your bag is no longer available. Please review your bag.");
    }

    let size: string | null = null;
    if (product.sizes.length > 0) {
      if (!item.size) throw new AppError(400, `Please select a size for ${product.title}`);

      const match = product.sizes.find(
        (candidate) => candidate.label.toLowerCase() === item.size!.toLowerCase()
      );
      if (!match) {
        throw new AppError(400, `Size ${item.size} is not available for ${product.title}`);
      }
      size = match.label;
    }

    const key = `${product.id}:${size ?? ""}`;
    const quantity = (grouped.get(key)?.quantity ?? 0) + item.quantity;
    if (quantity > MAX_QTY) {
      throw new AppError(400, `You can order at most ${MAX_QTY} units of ${product.title}`);
    }
    grouped.set(key, { product, size, quantity });
  }

  return [...grouped.values()];
}

const originalPriceOf = (product: IProduct): number =>
  Math.max(product.originalPrice ?? product.price, product.price);

const toPriceLines = (lines: ResolvedLine[]): PriceLine[] =>
  lines.map(({ product, quantity }) => ({
    price: product.price,
    originalPrice: originalPriceOf(product),
    quantity,
  }));

function availableStock({ product, size }: ResolvedLine): number {
  if (size) return product.sizes.find((candidate) => candidate.label === size)?.stock ?? 0;
  return product.stock;
}

async function reserveStock(line: ResolvedLine, session: ClientSession): Promise<void> {
  const { product, size, quantity } = line;

  const result = size
    ? await ProductModel.updateOne(
        {
          _id: product._id,
          isActive: true,
          deletedAt: null,
          sizes: { $elemMatch: { label: size, stock: { $gte: quantity } } },
        },
        { $inc: { "sizes.$.stock": -quantity } },
        { session }
      )
    : await ProductModel.updateOne(
        { _id: product._id, isActive: true, deletedAt: null, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { session }
      );

  if (result.modifiedCount !== 1) {
    throw new AppError(
      409,
      `Insufficient stock for ${product.title}${size ? ` (${size})` : ""}`
    );
  }
}

const generateOrderNumber = (): string =>
  `SHP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

export async function buildQuote(input: QuoteInput) {
  const lines = await resolveLines(input.items);
  const { breakdown, couponError } = priceOrder(toPriceLines(lines), input.couponCode);

  const items = lines.map((line) => {
    const available = availableStock(line);
    const issue =
      line.quantity <= available
        ? null
        : available === 0
          ? "Out of stock"
          : `Only ${available} left`;

    return {
      productId: line.product.id,
      sku: line.product.sku,
      title: line.product.title,
      image: line.product.images[0] ?? "",
      size: line.size,
      quantity: line.quantity,
      price: line.product.price,
      originalPrice: originalPriceOf(line.product),
      issue,
    };
  });

  return {
    items,
    ...breakdown,
    couponError: couponError ?? null,
    canOrder: items.every((item) => item.issue === null),
  };
}

export async function createOrder(userId: string, input: CreateOrderInput) {
  const session = await mongoose.startSession();
  let createdOrder: unknown;

  try {
    await session.withTransaction(async () => {
      const lines = await resolveLines(input.items, session);
      const { breakdown, couponError } = priceOrder(toPriceLines(lines), input.couponCode);
      if (couponError) throw new AppError(400, couponError);

      const orderItems: IOrderItem[] = [];
      for (const line of lines) {
        await reserveStock(line, session);
        orderItems.push({
          product: line.product._id as Types.ObjectId,
          sku: line.product.sku,
          title: line.product.title,
          image: line.product.images[0] ?? "",
          quantity: line.quantity,
          ...(line.size ? { size: line.size } : {}),
          price: line.product.price,
        });
      }

      const [order] = await OrderModel.create(
        [
          {
            orderNumber: generateOrderNumber(),
            user: new Types.ObjectId(userId),
            items: orderItems,
            shippingAddress: input.shippingAddress,
            subtotal: breakdown.subtotal,
            shippingFee: breakdown.shippingFee,
            platformFee: breakdown.platformFee,
            ...(breakdown.couponCode ? { couponCode: breakdown.couponCode } : {}),
            couponDiscount: breakdown.couponDiscount,
            total: breakdown.total,
            paymentMethod: input.paymentMethod,
            paymentStatus: "pending",
            status: "pending",
          },
        ],
        { session }
      );

      createdOrder = order.toObject();
    });

    return createdOrder;
  } finally {
    await session.endSession();
  }
}