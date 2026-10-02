import type { Collection, Product, ProductFilter } from "../types";
import { getImage } from "./images";

export const PRODUCT_FILTERS: { value: ProductFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "accessories", label: "Accessories" },
];

type ProductInput = Omit<Product, "image">;

const makeProducts = (prefix: string, items: ProductInput[]): Product[] =>
  items.map((item) => ({
    ...item,
    image: getImage(`${prefix}-${item.id}`, 600, 800),
  }));

const collections: Collection[] = [
  {
    slug: "signature",
    title: "Signature Collection",
    description:
      "Our most loved pieces, refreshed for the season. Timeless cuts, premium fabrics and the details that define us.",
    banner: getImage("signature-banner", 1440, 600),
    products: makeProducts("signature", [
      { id: 1, title: "Signature Logo Tee", price: 1999, category: "men", tag: "Bestseller" },
      { id: 2, title: "Signature Oxford Shirt", price: 3499, category: "men" },
      { id: 3, title: "Signature Wool Blazer", price: 8999, category: "men", tag: "New" },
      { id: 4, title: "Signature Knit Cardigan", price: 4299, category: "women" },
      { id: 5, title: "Signature Pleated Skirt", price: 2799, category: "women" },
      { id: 6, title: "Signature Trench Coat", price: 9499, category: "women", tag: "New" },
      { id: 7, title: "Signature Leather Belt", price: 1799, category: "accessories" },
      { id: 8, title: "Signature Canvas Tote", price: 2299, category: "accessories", tag: "Bestseller" },
    ]),
  },
  {
    slug: "denim",
    title: "Denim Edit",
    description:
      "Relaxed fits and modern classics. From everyday straight cuts to statement jackets, find your perfect pair.",
    banner: getImage("denim-banner", 1440, 600),
    products: makeProducts("denim", [
      { id: 1, title: "Classic Straight Jeans", price: 3299, category: "men", tag: "Bestseller" },
      { id: 2, title: "Slim Fit Dark Wash Jeans", price: 3499, category: "men" },
      { id: 3, title: "Denim Trucker Jacket", price: 4999, category: "men", tag: "New" },
      { id: 4, title: "High-Rise Mom Jeans", price: 3399, category: "women" },
      { id: 5, title: "Wide-Leg Denim", price: 3699, category: "women", tag: "New" },
      { id: 6, title: "Denim Shirt Dress", price: 4299, category: "women" },
      { id: 7, title: "Denim Baseball Cap", price: 1299, category: "accessories" },
      { id: 8, title: "Denim Tote Bag", price: 1999, category: "accessories", tag: "Bestseller" },
    ]),
  },
  {
    slug: "sport",
    title: "Sport Edit",
    description:
      "Performance meets everyday style. Breathable fabrics and smart fits built to move with you.",
    banner: getImage("sport-banner", 1440, 600),
    products: makeProducts("sport", [
      { id: 1, title: "Performance Training Tee", price: 1799, category: "men", tag: "Bestseller" },
      { id: 2, title: "Quick-Dry Running Shorts", price: 1599, category: "men" },
      { id: 3, title: "Zip Track Jacket", price: 3999, category: "men", tag: "New" },
      { id: 4, title: "High-Waist Training Leggings", price: 2499, category: "women", tag: "Bestseller" },
      { id: 5, title: "Sports Bra Pro", price: 1999, category: "women" },
      { id: 6, title: "Lightweight Windbreaker", price: 3799, category: "women", tag: "New" },
      { id: 7, title: "Gym Duffel Bag", price: 2899, category: "accessories" },
      { id: 8, title: "Insulated Sports Bottle", price: 1199, category: "accessories" },
    ]),
  },
];

export const getCollection = (slug: string | undefined): Collection | undefined =>
  collections.find((collection) => collection.slug === slug);