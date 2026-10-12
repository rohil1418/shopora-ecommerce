import mongoose, { Types } from "mongoose";
import { ProductModel } from "../products/product.model";
import { OrderModel, type IOrderItem } from "./order.model";
import type { CreateOrderInput } from "./order.schema";

export async function createOrder(
  userId: string,
  input: CreateOrderInput
) {
  const session = await mongoose.startSession();
  let createdOrder: unknown;

  try {
    await session.withTransaction(async () => {
      const grouped = new Map<
        string,
        { productId: string; quantity: number; size?: string }
      >();

      for (const item of input.items) {
        const key = `${item.productId}:${item.size?.toLowerCase() ?? ""}`;
        const existing = grouped.get(key);

        if (existing) {
          existing.quantity += item.quantity;
        } else {
          grouped.set(key, { ...item });
        }
      }

      const orderItems: IOrderItem[] = [];
      let subtotal = 0;

      for (const item of grouped.values()) {
        if (item.quantity > 10) {
          throw new Error("Maximum 10 units allowed per product and size");
        }

        const product = await ProductModel.findOne({
          _id: item.productId,
          isActive: true,
        }).session(session);

        if (!product) {
          throw new Error(`Product not available: ${item.productId}`);
        }

        if (product.sizes.length > 0) {
          if (!item.size) {
            throw new Error(`Please select a size for ${product.title}`);
          }

          const matchingSize = product.sizes.find(
            (s) => s.label.toLowerCase() === item.size!.toLowerCase()
          );

          if (!matchingSize) {
            throw new Error(`Invalid size for ${product.title}`);
          }

          const updated = await ProductModel.updateOne(
            {
              _id: product._id,
              isActive: true,
              sizes: {
                $elemMatch: {
                  label: matchingSize.label,
                  stock: { $gte: item.quantity },
                },
              },
            },
            {
              $inc: { "sizes.$[selectedSize].stock": -item.quantity },
            },
            {
              session,
              arrayFilters: [
                {
                  "selectedSize.label": matchingSize.label,
                  "selectedSize.stock": { $gte: item.quantity },
                },
            ],
            }
          );

          if (updated.modifiedCount !== 1) {
            throw new Error(`Insufficient stock for ${product.title} (${matchingSize.label})`);
          }
        } else {
          const updated = await ProductModel.updateOne(
            {
              _id: product._id,
              isActive: true,
              stock: { $gte: item.quantity },
            },
            { $inc: { stock: -item.quantity } },
            { session }
          );

          if (updated.modifiedCount !== 1) {
            throw new Error(`Insufficient stock for ${product.title}`);
          }
        }

        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;

        orderItems.push({
          product: product._id as Types.ObjectId,
          sku: product.sku,
          title: product.title,
          image: product.images[0] ?? "",
          quantity: item.quantity,
          ...(item.size ? { size: item.size } : {}),
          price: product.price,
        });
      }

      const shippingFee = subtotal >= 999 ? 0 : 49;

      const orderNumber = `SHP-${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const orders = await OrderModel.create(
        [
          {
            orderNumber,
            user: new Types.ObjectId(userId),
            items: orderItems,
            shippingAddress: input.shippingAddress,
            subtotal,
            shippingFee,
            total: subtotal + shippingFee,
            status: "pending",
          },
        ],
        { session }
      );

      createdOrder = orders[0].toObject();
    });

    return createdOrder;
  } finally {
    await session.endSession();
  }
}
