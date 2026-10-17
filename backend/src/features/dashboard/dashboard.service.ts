import type { Types } from "mongoose";
import {
  OrderModel,
  type OrderStatus,
  type PaymentMethod,
  type PaymentStatus,
} from "../orders/order.model";
import { ProductModel } from "../products/product.model";

const TIME_ZONE = "Asia/Kolkata";
const LOW_STOCK_LIMIT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

const dayKey = (date: Date): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);

const startOfDay = (key: string): Date => new Date(`${key}T00:00:00+05:30`);

const notCancelled = { status: { $ne: "cancelled" } };

async function salesTotals(since?: Date): Promise<{ sales: number; orders: number }> {
  const [row] = await OrderModel.aggregate<{ sales: number; orders: number }>([
    { $match: { ...notCancelled, ...(since ? { createdAt: { $gte: since } } : {}) } },
    { $group: { _id: null, sales: { $sum: "$total" }, orders: { $sum: 1 } } },
  ]);
  return { sales: row?.sales ?? 0, orders: row?.orders ?? 0 };
}

async function salesByDay(days: number) {
  const keys = Array.from({ length: days }, (_, index) =>
    dayKey(new Date(Date.now() - (days - 1 - index) * DAY_MS))
  );

  const rows = await OrderModel.aggregate<{ _id: string; sales: number; orders: number }>([
    { $match: { ...notCancelled, createdAt: { $gte: startOfDay(keys[0]!) } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TIME_ZONE } },
        sales: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
  ]);

  const byKey = new Map(rows.map((row) => [row._id, row]));
  return keys.map((date) => ({
    date,
    sales: byKey.get(date)?.sales ?? 0,
    orders: byKey.get(date)?.orders ?? 0,
  }));
}

const totalStockExpression = {
  $cond: [
    { $gt: [{ $size: { $ifNull: ["$sizes", []] } }, 0] },
    { $sum: "$sizes.stock" },
    "$stock",
  ],
};

type LowStockRow = { _id: Types.ObjectId; title: string; sku: string; images: string[]; totalStock: number };

async function lowStockProducts(): Promise<{ items: LowStockRow[]; count: number }> {
  const [result] = await ProductModel.aggregate<{ items: LowStockRow[]; count: { n: number }[] }>([
    { $match: { deletedAt: null, isActive: true } },
    { $addFields: { totalStock: totalStockExpression } },
    { $match: { totalStock: { $lte: LOW_STOCK_LIMIT } } },
    {
      $facet: {
        items: [
          { $sort: { totalStock: 1, title: 1 } },
          { $limit: 5 },
          { $project: { title: 1, sku: 1, images: 1, totalStock: 1 } },
        ],
        count: [{ $count: "n" }],
      },
    },
  ]);

  return { items: result?.items ?? [], count: result?.count[0]?.n ?? 0 };
}

type RecentOrderRow = {
  _id: Types.ObjectId;
  orderNumber: string;
  user: { name: string; email: string } | null;
  items: { quantity: number; image: string }[];
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  createdAt: Date;
};

async function recentOrders(): Promise<RecentOrderRow[]> {
  const rows = await OrderModel.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email")
    .select("orderNumber user items total status paymentMethod paymentStatus createdAt")
    .lean();
  return rows as unknown as RecentOrderRow[];
}

type RecentProductRow = {
  _id: Types.ObjectId;
  title: string;
  sku: string;
  collectionSlug: string;
  price: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
};

async function recentProducts(): Promise<RecentProductRow[]> {
  const rows = await ProductModel.find({ deletedAt: null })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title sku collectionSlug price images isActive createdAt")
    .lean();
  return rows as unknown as RecentProductRow[];
}

export async function getDashboard() {
  const todayStart = startOfDay(dayKey(new Date()));

  const [
    all,
    today,
    pendingOrders,
    activeProducts,
    totalProducts,
    lowStock,
    days,
    orderRows,
    productRows,
  ] = await Promise.all([
    salesTotals(),
    salesTotals(todayStart),
    OrderModel.countDocuments({ status: "pending" }),
    ProductModel.countDocuments({ deletedAt: null, isActive: true }),
    ProductModel.countDocuments({ deletedAt: null }),
    lowStockProducts(),
    salesByDay(7),
    recentOrders(),
    recentProducts(),
  ]);

  return {
    stats: {
      totalSales: all.sales,
      totalOrders: all.orders,
      ordersToday: today.orders,
      salesToday: today.sales,
      pendingOrders,
      activeProducts,
      totalProducts,
      lowStockCount: lowStock.count,
    },
    salesByDay: days,
    recentOrders: orderRows.map((order) => ({
      id: String(order._id),
      orderNumber: order.orderNumber,
      customer: order.user ? { name: order.user.name, email: order.user.email } : null,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      image: order.items[0]?.image ?? "",
      createdAt: order.createdAt,
    })),
    recentProducts: productRows.map((product) => ({
      id: String(product._id),
      title: product.title,
      sku: product.sku,
      collection: product.collectionSlug,
      price: product.price,
      image: product.images[0] ?? "",
      isActive: product.isActive,
      createdAt: product.createdAt,
    })),
    lowStock: lowStock.items.map((product) => ({
      id: String(product._id),
      title: product.title,
      sku: product.sku,
      image: product.images[0] ?? "",
      stock: product.totalStock,
    })),
  };
}