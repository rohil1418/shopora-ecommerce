export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "razorpay";
export type PaymentStatus = "pending" | "paid" | "failed";

export type OrderItem = {
  product: string;
  sku: string;
  title: string;
  image: string;
  quantity: number;
  size?: string;
  price: number;
};

export type OrderAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  subtotal: number;
  shippingFee: number;
  platformFee?: number;
  couponCode?: string;
  couponDiscount?: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  razorpayPaymentId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
};