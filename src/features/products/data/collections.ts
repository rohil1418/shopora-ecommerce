import type { Collection, Product, ProductCategory, ProductFilter } from "../types";
import { getImage } from "./images";

export const PRODUCT_FILTERS: { value: ProductFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "accessories", label: "Accessories" },
];

type Row = [
  id: number,
  brand: string,
  title: string,
  price: number,
  originalPrice: number,
  category: ProductCategory,
  rating: number,
  reviews: number,
  tag?: string,
];

const makeProducts = (prefix: string, rows: Row[]): Product[] =>
  rows.map(([id, brand, title, price, originalPrice, category, rating, reviews, tag]) => ({
    id,
    brand,
    title,
    price,
    originalPrice,
    category,
    rating,
    reviews,
    tag,
    image: getImage(`${prefix}-${id}`, 600, 800),
  }));

const collections: Collection[] = [
  {
    slug: "signature",
    title: "Signature Collection",
    description:
      "Our most loved pieces, refreshed for the season. Timeless cuts, premium fabrics and the details that define us.",
    banner: getImage("signature-banner", 1440, 600),
    products: makeProducts("signature", [
      [1, "Aster & Co", "Signature Logo Tee", 1999, 2999, "men", 4.4, 2300, "Bestseller"],
      [2, "Aster & Co", "Signature Oxford Shirt", 3499, 4999, "men", 4.3, 980],
      [3, "Aster & Co", "Signature Wool Blazer", 8999, 12999, "men", 4.6, 410, "New"],
      [4, "Aster & Co", "Signature Knit Cardigan", 4299, 5999, "women", 4.5, 760],
      [5, "Aster & Co", "Signature Pleated Skirt", 2799, 3999, "women", 4.2, 530],
      [6, "Aster & Co", "Signature Trench Coat", 9499, 13999, "women", 4.7, 320, "New"],
      [7, "Aster & Co", "Signature Leather Belt", 1799, 2499, "accessories", 4.4, 1100],
      [8, "Aster & Co", "Signature Canvas Tote", 2299, 3299, "accessories", 4.5, 870, "Bestseller"],
    ]),
  },
  {
    slug: "denim",
    title: "Denim Edit",
    description:
      "Relaxed fits and modern classics. From everyday straight cuts to statement jackets, find your perfect pair.",
    banner: getImage("denim-banner", 1440, 600),
    products: makeProducts("denim", [
      [1, "Hollis Row", "Classic Straight Jeans", 3299, 4599, "men", 4.4, 3400, "Bestseller"],
      [2, "Hollis Row", "Slim Fit Dark Wash Jeans", 3499, 4999, "men", 4.3, 2100],
      [3, "Kora", "Denim Trucker Jacket", 4999, 7499, "men", 4.5, 640, "New"],
      [4, "Hollis Row", "High-Rise Mom Jeans", 3399, 4799, "women", 4.4, 1800],
      [5, "Kora", "Wide-Leg Denim", 3699, 5299, "women", 4.3, 950, "New"],
      [6, "Kora", "Denim Shirt Dress", 4299, 5999, "women", 4.2, 480],
      [7, "Hollis Row", "Denim Baseball Cap", 1299, 1999, "accessories", 4.1, 360],
      [8, "Kora", "Denim Tote Bag", 1999, 2999, "accessories", 4.4, 520, "Bestseller"],
    ]),
  },
  {
    slug: "sport",
    title: "Sport Edit",
    description:
      "Performance meets everyday style. Breathable fabrics and smart fits built to move with you.",
    banner: getImage("sport-banner", 1440, 600),
    products: makeProducts("sport", [
      [1, "Stridex", "Performance Training Tee", 1799, 2499, "men", 4.4, 2900, "Bestseller"],
      [2, "Stridex", "Quick-Dry Running Shorts", 1599, 2299, "men", 4.2, 1500],
      [3, "Northline", "Zip Track Jacket", 3999, 5999, "men", 4.5, 700, "New"],
      [4, "Stridex", "High-Waist Training Leggings", 2499, 3499, "women", 4.6, 4100, "Bestseller"],
      [5, "Stridex", "Sports Bra Pro", 1999, 2799, "women", 4.4, 2200],
      [6, "Northline", "Lightweight Windbreaker", 3799, 5499, "women", 4.3, 580, "New"],
      [7, "Northline", "Gym Duffel Bag", 2899, 3999, "accessories", 4.5, 890],
      [8, "Stridex", "Insulated Sports Bottle", 1199, 1799, "accessories", 4.3, 1300],
    ]),
  },
  {
    slug: "polo-shirts",
    title: "Polo Shirts",
    description:
      "Classic piqué, rugby stripes and modern fits. Polos that work from weekend brunch to the office.",
    banner: getImage("polo-shirts-banner", 1440, 600),
    products: makeProducts("polo-shirts", [
      [1, "Urban Thread", "Classic Piqué Polo", 1499, 2499, "men", 4.4, 5200, "Bestseller"],
      [2, "Urban Thread", "Striped Rugby Polo", 1799, 2799, "men", 4.3, 1900],
      [3, "Oakwell", "Slim Fit Cotton Polo", 1299, 1999, "men", 4.2, 2600],
      [4, "Oakwell", "Textured Knit Polo", 1999, 3199, "men", 4.5, 740, "New"],
      [5, "Urban Thread", "Fitted Everyday Polo", 1399, 2199, "women", 4.4, 2300],
      [6, "Urban Thread", "Cropped Piqué Polo", 1599, 2499, "women", 4.3, 1100],
      [7, "Oakwell", "Long-Sleeve Polo Top", 1899, 2899, "women", 4.5, 620, "New"],
      [8, "Oakwell", "Embroidered Logo Polo", 1699, 2699, "women", 4.6, 1500, "Bestseller"],
    ]),
  },
  {
    slug: "footwear",
    title: "Footwear",
    description:
      "From clean white sneakers to polished heels. Comfortable, durable pairs for every day and every occasion.",
    banner: getImage("footwear-banner", 1440, 600),
    products: makeProducts("footwear", [
      [1, "Stridex", "Classic White Sneakers", 2999, 4999, "men", 4.5, 6100, "Bestseller"],
      [2, "Stridex", "Everyday Running Shoes", 3499, 5499, "men", 4.4, 3800],
      [3, "Velora", "Leather Derby Shoes", 4499, 6999, "men", 4.3, 910, "New"],
      [4, "Velora", "Suede Loafers", 3999, 5999, "men", 4.2, 640],
      [5, "Velora", "Block Heel Sandals", 2799, 4299, "women", 4.3, 1500],
      [6, "Stridex", "Chunky Platform Sneakers", 3299, 4999, "women", 4.5, 2700, "Bestseller"],
      [7, "Velora", "Ballet Flats", 2199, 3499, "women", 4.2, 1200],
      [8, "Velora", "Ankle Strap Heels", 3199, 4999, "women", 4.4, 830, "New"],
    ]),
  },
  {
    slug: "trousers",
    title: "Trousers",
    description:
      "Tailored chinos, relaxed cargos and flowing wide-legs. Find the fit that suits your day.",
    banner: getImage("trousers-banner", 1440, 600),
    products: makeProducts("trousers", [
      [1, "Northline", "Tailored Chinos", 2499, 3999, "men", 4.4, 3300, "Bestseller"],
      [2, "Northline", "Slim Formal Trousers", 2799, 4299, "men", 4.3, 1700],
      [3, "Oakwell", "Relaxed Cargo Pants", 2999, 4499, "men", 4.2, 980, "New"],
      [4, "Oakwell", "Stretch Jogger Trousers", 1999, 2999, "men", 4.5, 2400],
      [5, "Northline", "High-Waist Pleated Trousers", 2699, 4199, "women", 4.4, 1600],
      [6, "Northline", "Wide-Leg Palazzo Pants", 2299, 3499, "women", 4.3, 1900, "Bestseller"],
      [7, "Oakwell", "Straight Fit Office Trousers", 2599, 3999, "women", 4.2, 880],
      [8, "Oakwell", "Linen Drawstring Pants", 2199, 3299, "women", 4.5, 700, "New"],
    ]),
  },
  {
    slug: "bags",
    title: "Bags",
    description:
      "Backpacks, totes and crossbody bags. Carry your day in style with pieces built to last.",
    banner: getImage("bags-banner", 1440, 600),
    products: makeProducts("bags", [
      [1, "Kora", "Everyday Backpack", 2499, 3999, "men", 4.5, 4300, "Bestseller"],
      [2, "Kora", "Leather Messenger Bag", 4499, 6999, "men", 4.4, 760],
      [3, "Velora", "Slim Laptop Sleeve", 1799, 2799, "men", 4.2, 1200],
      [4, "Kora", "Weekender Duffel", 3299, 4999, "men", 4.3, 640, "New"],
      [5, "Velora", "Structured Tote Bag", 3499, 5499, "women", 4.5, 1800],
      [6, "Velora", "Crossbody Sling Bag", 2299, 3599, "women", 4.4, 2500, "Bestseller"],
      [7, "Kora", "Mini Top-Handle Bag", 2799, 4299, "women", 4.3, 970, "New"],
      [8, "Kora", "Quilted Shoulder Bag", 3199, 4899, "women", 4.6, 1400],
    ]),
  },
  {
    slug: "winter",
    title: "Winter Wear",
    description:
      "Layer up in warm knits, puffers and coats. Cosy pieces to keep you stylish all winter.",
    banner: getImage("winter-banner", 1440, 600),
    products: makeProducts("winter", [
      [1, "Northline", "Puffer Down Jacket", 5999, 8999, "men", 4.5, 2800, "Bestseller"],
      [2, "Oakwell", "Chunky Cable-Knit Sweater", 2999, 4499, "men", 4.4, 1900],
      [3, "Aster & Co", "Fleece Zip Hoodie", 2499, 3799, "men", 4.3, 3100],
      [4, "Northline", "Wool Blend Overcoat", 8499, 12499, "men", 4.6, 520, "New"],
      [5, "Aster & Co", "Longline Wool Coat", 7999, 11999, "women", 4.6, 640, "New"],
      [6, "Oakwell", "Turtleneck Knit Sweater", 2799, 4199, "women", 4.5, 2200, "Bestseller"],
      [7, "Kora", "Quilted Puffer Jacket", 5499, 7999, "women", 4.4, 1700],
      [8, "Kora", "Cosy Fleece Sweatshirt", 2299, 3499, "women", 4.3, 1400],
    ]),
  },
];

export const getCollection = (slug: string | undefined): Collection | undefined =>
  collections.find((collection) => collection.slug === slug);