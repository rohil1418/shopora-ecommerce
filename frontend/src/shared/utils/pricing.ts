export type Coupon = {
  code: string;
  percent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
};

export const PLATFORM_FEE = 23;

const COUPONS: Coupon[] = [
  {
    code: "SHOPORA10",
    percent: 10,
    maxDiscount: 300,
    minOrder: 999,
    description: "10% off up to ₹300 on orders above ₹999",
  },
];

export const findCoupon = (code: string): Coupon | undefined =>
  COUPONS.find((coupon) => coupon.code === code.trim().toUpperCase());

export const couponDiscount = (coupon: Coupon | undefined, amount: number): number =>
  coupon && amount >= coupon.minOrder
    ? Math.min(Math.round((amount * coupon.percent) / 100), coupon.maxDiscount)
    : 0;

export type PriceLine = { price: number; originalPrice: number; qty: number };

export type PriceSummary = {
  itemCount: number;
  totalMrp: number;
  discountOnMrp: number;
  couponDiscount: number;
  platformFee: number;
  total: number;
};

export function summarize(lines: PriceLine[], coupon?: Coupon): PriceSummary {
  const totalMrp = lines.reduce((sum, line) => sum + line.originalPrice * line.qty, 0);
  const sellingTotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const discount = couponDiscount(coupon, sellingTotal);
  const platformFee = lines.length > 0 ? PLATFORM_FEE : 0;

  return {
    itemCount: lines.reduce((sum, line) => sum + line.qty, 0),
    totalMrp,
    discountOnMrp: totalMrp - sellingTotal,
    couponDiscount: discount,
    platformFee,
    total: sellingTotal - discount + platformFee,
  };
}