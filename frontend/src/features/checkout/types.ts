export type DraftItem = { uid: string; size: string | null; qty: number };

export type CheckoutDraft = { items: DraftItem[]; couponCode: string | null };

export type QuoteItem = {
  productId: string;
  sku: string;
  title: string;
  image: string;
  size: string | null;
  quantity: number;
  price: number;
  originalPrice: number;
  issue: string | null;
};

export type Quote = {
  items: QuoteItem[];
  itemCount: number;
  mrpTotal: number;
  subtotal: number;
  couponCode: string | null;
  couponDiscount: number;
  shippingFee: number;
  platformFee: number;
  total: number;
  couponError: string | null;
  canOrder: boolean;
};