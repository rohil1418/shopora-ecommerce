import type { ProductTag } from "./constants";
import type { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/features/orders";

export type AdminProductImage = string | { url: string };

export type AdminProduct = {
  id: string;
  sku: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  collection: string;
  images: AdminProductImage[];
  sizes: { label: string; stock: number }[];
  stock: number;
  tag?: ProductTag;
  rating?: number;
  reviewsCount: number;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt: string;
};

export type AdminProductList = {
  items: AdminProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductPayload = {
  title: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  collection: string;
  images: string[];
  sizes: { label: string; stock: number }[];
  stock: number;
  tag?: ProductTag;
  rating?: number;
  reviewsCount: number;
  isActive: boolean;
};

export type CollectionOption = { slug: string; title: string };

export type AdminOrder = Omit<Order, "razorpayPaymentId"> & {
  razorpayPaymentId?: string;
  user: { _id: string; name: string; email: string } | null;
};

export type AdminOrderList = {
  items: AdminOrder[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DashboardData = {
  stats: {
    totalSales: number;
    totalOrders: number;
    ordersToday: number;
    salesToday: number;
    pendingOrders: number;
    activeProducts: number;
    totalProducts: number;
    lowStockCount: number;
  };
  salesByDay: { date: string; sales: number; orders: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customer: { name: string; email: string } | null;
    total: number;
    status: OrderStatus;
    paymentMethod?: PaymentMethod;
    paymentStatus?: PaymentStatus;
    itemCount: number;
    image: string;
    createdAt: string;
  }[];
  recentProducts: {
    id: string;
    title: string;
    sku: string;
    collection: string;
    price: number;
    image: string;
    isActive: boolean;
    createdAt: string;
  }[];
  lowStock: { id: string; title: string; sku: string; image: string; stock: number }[];
};