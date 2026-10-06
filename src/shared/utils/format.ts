export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export const formatCount = (count: number): string =>
  count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(count);

const DELIVERY_DAYS = 5;

const deliveryDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + DELIVERY_DAYS);
  return date;
};

export const deliveryDateShort = (): string =>
  deliveryDate().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });

export const deliveryDateLong = (): string =>
  deliveryDate().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });