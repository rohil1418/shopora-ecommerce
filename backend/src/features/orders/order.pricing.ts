export const PLATFORM_FEE = 23;
export const SHIPPING_FEE = 49;
export const FREE_SHIPPING_MIN = 999;

type Coupon = { code: string; percent: number; maxDiscount: number; minOrder: number };

const COUPONS: Coupon[] = [{ code: "SHOPORA10", percent: 10, maxDiscount: 300, minOrder: 999 }];

export type PriceLine = { price: number; originalPrice: number; quantity: number };

export type PriceBreakdown = {
  itemCount: number;
  mrpTotal: number;
  subtotal: number;
  couponCode: string | null;
  couponDiscount: number;
  shippingFee: number;
  platformFee: number;
  total: number;
};

export function priceOrder(
  lines: PriceLine[],
  couponCode?: string
): { breakdown: PriceBreakdown; couponError?: string } {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const mrpTotal = lines.reduce((sum, line) => sum + line.originalPrice * line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  const code = couponCode?.trim().toUpperCase();
  let appliedCode: string | null = null;
  let couponDiscount = 0;
  let couponError: string | undefined;

  if (code) {
    const coupon = COUPONS.find((candidate) => candidate.code === code);
    if (!coupon) {
      couponError = "Invalid coupon code";
    } else if (subtotal < coupon.minOrder) {
      couponError = `This coupon needs an order of at least ₹${coupon.minOrder}`;
    } else {
      appliedCode = coupon.code;
      couponDiscount = Math.min(
        Math.round((subtotal * coupon.percent) / 100),
        coupon.maxDiscount
      );
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_MIN || lines.length === 0 ? 0 : SHIPPING_FEE;
  const platformFee = lines.length > 0 ? PLATFORM_FEE : 0;

  const breakdown: PriceBreakdown = {
    itemCount,
    mrpTotal,
    subtotal,
    couponCode: appliedCode,
    couponDiscount,
    shippingFee,
    platformFee,
    total: subtotal - couponDiscount + shippingFee + platformFee,
  };

  return couponError ? { breakdown, couponError } : { breakdown };
}