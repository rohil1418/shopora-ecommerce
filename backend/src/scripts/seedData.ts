import type { ProductCategory, ProductTag } from "../features/products";

export type SeedRow = [
  id: number,
  brand: string,
  title: string,
  price: number,
  originalPrice: number,
  category: ProductCategory,
  rating: number,
  reviewsCount: number,
  tag?: ProductTag,
];

export type SeedCollection = {
  slug: string;
  title: string;
  description: string;
  isVirtual?: boolean;
  rows: SeedRow[];
};

const CLOTHING_SIZES = ["S", "M", "L", "XL", "XXL"];
const KIDS_SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y"];
const SHOE_SIZES = ["6", "7", "8", "9", "10"];

export function seedSizesFor(collection: string, category: ProductCategory): string[] {
  if (["perfume", "beauty", "bags"].includes(collection)) return [];
  if (["accessories", "makeup", "skincare", "haircare"].includes(category)) return [];
  if (collection === "footwear") return SHOE_SIZES;
  if (category === "boys" || category === "girls") return KIDS_SIZES;
  return CLOTHING_SIZES;
}

export const SEED_COLLECTIONS: SeedCollection[] = [
  {
    slug: "signature",
    title: "Signature Collection",
    description:
      "Our most loved pieces, refreshed for the season. Timeless cuts, premium fabrics and the details that define us.",
    rows: [
      [1, "Aster & Co", "Signature Logo Tee", 1999, 2999, "men", 4.4, 2300, "Bestseller"],
      [2, "Aster & Co", "Signature Oxford Shirt", 3499, 4999, "men", 4.3, 980],
      [3, "Aster & Co", "Signature Wool Blazer", 8999, 12999, "men", 4.6, 410, "New"],
      [4, "Aster & Co", "Signature Knit Cardigan", 4299, 5999, "women", 4.5, 760],
      [5, "Aster & Co", "Signature Pleated Skirt", 2799, 3999, "women", 4.2, 530],
      [6, "Aster & Co", "Signature Trench Coat", 9499, 13999, "women", 4.7, 320, "New"],
      [7, "Aster & Co", "Signature Leather Belt", 1799, 2499, "accessories", 4.4, 1100],
      [8, "Aster & Co", "Signature Canvas Tote", 2299, 3299, "accessories", 4.5, 870, "Bestseller"],
    ],
  },
  {
    slug: "denim",
    title: "Denim Edit",
    description:
      "Relaxed fits and modern classics. From everyday straight cuts to statement jackets, find your perfect pair.",
    rows: [
      [1, "Hollis Row", "Classic Straight Jeans", 3299, 4599, "men", 4.4, 3400, "Bestseller"],
      [2, "Hollis Row", "Slim Fit Dark Wash Jeans", 3499, 4999, "men", 4.3, 2100],
      [3, "Kora", "Denim Trucker Jacket", 4999, 7499, "men", 4.5, 640, "New"],
      [4, "Hollis Row", "High-Rise Mom Jeans", 3399, 4799, "women", 4.4, 1800],
      [5, "Kora", "Wide-Leg Denim", 3699, 5299, "women", 4.3, 950, "New"],
      [6, "Kora", "Denim Shirt Dress", 4299, 5999, "women", 4.2, 480],
      [7, "Hollis Row", "Denim Baseball Cap", 1299, 1999, "accessories", 4.1, 360],
      [8, "Kora", "Denim Tote Bag", 1999, 2999, "accessories", 4.4, 520, "Bestseller"],
    ],
  },
  {
    slug: "sport",
    title: "Sport Edit",
    description:
      "Performance meets everyday style. Breathable fabrics and smart fits built to move with you.",
    rows: [
      [1, "Stridex", "Performance Training Tee", 1799, 2499, "men", 4.4, 2900, "Bestseller"],
      [2, "Stridex", "Quick-Dry Running Shorts", 1599, 2299, "men", 4.2, 1500],
      [3, "Northline", "Zip Track Jacket", 3999, 5999, "men", 4.5, 700, "New"],
      [4, "Stridex", "High-Waist Training Leggings", 2499, 3499, "women", 4.6, 4100, "Bestseller"],
      [5, "Stridex", "Sports Bra Pro", 1999, 2799, "women", 4.4, 2200],
      [6, "Northline", "Lightweight Windbreaker", 3799, 5499, "women", 4.3, 580, "New"],
      [7, "Northline", "Gym Duffel Bag", 2899, 3999, "accessories", 4.5, 890],
      [8, "Stridex", "Insulated Sports Bottle", 1199, 1799, "accessories", 4.3, 1300],
    ],
  },
  {
    slug: "polo-shirts",
    title: "Polo Shirts",
    description:
      "Classic piqué, rugby stripes and modern fits. Polos that work from weekend brunch to the office.",
    rows: [
      [1, "Urban Thread", "Classic Piqué Polo", 1499, 2499, "men", 4.4, 5200, "Bestseller"],
      [2, "Urban Thread", "Striped Rugby Polo", 1799, 2799, "men", 4.3, 1900],
      [3, "Oakwell", "Slim Fit Cotton Polo", 1299, 1999, "men", 4.2, 2600],
      [4, "Oakwell", "Textured Knit Polo", 1999, 3199, "men", 4.5, 740, "New"],
      [5, "Urban Thread", "Fitted Everyday Polo", 1399, 2199, "women", 4.4, 2300],
      [6, "Urban Thread", "Cropped Piqué Polo", 1599, 2499, "women", 4.3, 1100],
      [7, "Oakwell", "Long-Sleeve Polo Top", 1899, 2899, "women", 4.5, 620, "New"],
      [8, "Oakwell", "Embroidered Logo Polo", 1699, 2699, "women", 4.6, 1500, "Bestseller"],
    ],
  },
  {
    slug: "footwear",
    title: "Footwear",
    description:
      "From clean white sneakers to polished heels. Comfortable, durable pairs for every day and every occasion.",
    rows: [
      [1, "Stridex", "Classic White Sneakers", 2999, 4999, "men", 4.5, 6100, "Bestseller"],
      [2, "Stridex", "Everyday Running Shoes", 3499, 5499, "men", 4.4, 3800],
      [3, "Velora", "Leather Derby Shoes", 4499, 6999, "men", 4.3, 910, "New"],
      [4, "Velora", "Suede Loafers", 3999, 5999, "men", 4.2, 640],
      [5, "Velora", "Block Heel Sandals", 2799, 4299, "women", 4.3, 1500],
      [6, "Stridex", "Chunky Platform Sneakers", 3299, 4999, "women", 4.5, 2700, "Bestseller"],
      [7, "Velora", "Ballet Flats", 2199, 3499, "women", 4.2, 1200],
      [8, "Velora", "Ankle Strap Heels", 3199, 4999, "women", 4.4, 830, "New"],
    ],
  },
  {
    slug: "trousers",
    title: "Trousers",
    description:
      "Tailored chinos, relaxed cargos and flowing wide-legs. Find the fit that suits your day.",
    rows: [
      [1, "Northline", "Tailored Chinos", 2499, 3999, "men", 4.4, 3300, "Bestseller"],
      [2, "Northline", "Slim Formal Trousers", 2799, 4299, "men", 4.3, 1700],
      [3, "Oakwell", "Relaxed Cargo Pants", 2999, 4499, "men", 4.2, 980, "New"],
      [4, "Oakwell", "Stretch Jogger Trousers", 1999, 2999, "men", 4.5, 2400],
      [5, "Northline", "High-Waist Pleated Trousers", 2699, 4199, "women", 4.4, 1600],
      [6, "Northline", "Wide-Leg Palazzo Pants", 2299, 3499, "women", 4.3, 1900, "Bestseller"],
      [7, "Oakwell", "Straight Fit Office Trousers", 2599, 3999, "women", 4.2, 880],
      [8, "Oakwell", "Linen Drawstring Pants", 2199, 3299, "women", 4.5, 700, "New"],
    ],
  },
  {
    slug: "bags",
    title: "Bags",
    description:
      "Backpacks, totes and crossbody bags. Carry your day in style with pieces built to last.",
    rows: [
      [1, "Kora", "Everyday Backpack", 2499, 3999, "men", 4.5, 4300, "Bestseller"],
      [2, "Kora", "Leather Messenger Bag", 4499, 6999, "men", 4.4, 760],
      [3, "Velora", "Slim Laptop Sleeve", 1799, 2799, "men", 4.2, 1200],
      [4, "Kora", "Weekender Duffel", 3299, 4999, "men", 4.3, 640, "New"],
      [5, "Velora", "Structured Tote Bag", 3499, 5499, "women", 4.5, 1800],
      [6, "Velora", "Crossbody Sling Bag", 2299, 3599, "women", 4.4, 2500, "Bestseller"],
      [7, "Kora", "Mini Top-Handle Bag", 2799, 4299, "women", 4.3, 970, "New"],
      [8, "Kora", "Quilted Shoulder Bag", 3199, 4899, "women", 4.6, 1400],
    ],
  },
  {
    slug: "winter",
    title: "Winter Wear",
    description:
      "Layer up in warm knits, puffers and coats. Cosy pieces to keep you stylish all winter.",
    rows: [
      [1, "Northline", "Puffer Down Jacket", 5999, 8999, "men", 4.5, 2800, "Bestseller"],
      [2, "Oakwell", "Chunky Cable-Knit Sweater", 2999, 4499, "men", 4.4, 1900],
      [3, "Aster & Co", "Fleece Zip Hoodie", 2499, 3799, "men", 4.3, 3100],
      [4, "Northline", "Wool Blend Overcoat", 8499, 12499, "men", 4.6, 520, "New"],
      [5, "Aster & Co", "Longline Wool Coat", 7999, 11999, "women", 4.6, 640, "New"],
      [6, "Oakwell", "Turtleneck Knit Sweater", 2799, 4199, "women", 4.5, 2200, "Bestseller"],
      [7, "Kora", "Quilted Puffer Jacket", 5499, 7999, "women", 4.4, 1700],
      [8, "Kora", "Cosy Fleece Sweatshirt", 2299, 3499, "women", 4.3, 1400],
    ],
  },
  {
    slug: "perfume",
    title: "Perfume",
    description:
      "Signature scents for every mood. From deep woody notes to fresh florals, find the fragrance that is yours.",
    rows: [
      [1, "Maison Velour", "Noir Intense Eau de Parfum", 3499, 5499, "men", 4.5, 3200, "Bestseller"],
      [2, "Oud & Co", "Royal Oud Eau de Parfum", 4299, 6499, "men", 4.6, 1400, "New"],
      [3, "Noir Atelier", "Citrus Fresh Eau de Toilette", 1999, 3299, "men", 4.3, 2600],
      [4, "Noir Atelier", "Woody Sport Body Mist", 1299, 1999, "men", 4.2, 1800],
      [5, "Aurelle", "Rose Bloom Eau de Parfum", 3299, 4999, "women", 4.6, 2900, "Bestseller"],
      [6, "Aurelle", "Vanilla Musk Eau de Parfum", 3799, 5799, "women", 4.5, 1600, "New"],
      [7, "Maison Velour", "Jasmine Dream Eau de Toilette", 2299, 3699, "women", 4.4, 1300],
      [8, "Aurelle", "Fruity Splash Body Mist", 1199, 1899, "women", 4.3, 2100],
    ],
  },
  {
    slug: "beauty",
    title: "Beauty",
    description:
      "Makeup, skincare and haircare essentials. Glow up with products you will reach for every single day.",
    rows: [
      [1, "Glowa", "Matte Liquid Lipstick", 599, 999, "makeup", 4.3, 5400, "Bestseller"],
      [2, "Lumière Labs", "Soft Matte Foundation", 1099, 1799, "makeup", 4.4, 2300],
      [3, "Glowa", "Smudge-Proof Kajal", 299, 499, "makeup", 4.2, 6800],
      [4, "Petal & Pine", "Vitamin C Face Serum", 799, 1299, "skincare", 4.5, 4100, "Bestseller"],
      [5, "Petal & Pine", "Hydrating Gel Moisturiser", 649, 999, "skincare", 4.4, 2900],
      [6, "Rosewell", "SPF 50 Sunscreen Lotion", 549, 899, "skincare", 4.3, 3600, "New"],
      [7, "Rosewell", "Argan Smooth Shampoo", 449, 749, "haircare", 4.2, 2100],
      [8, "Rosewell", "Nourishing Hair Oil", 399, 649, "haircare", 4.4, 1800, "New"],
    ],
  },
  {
    slug: "varsity-jackets",
    title: "Varsity Jackets",
    description:
      "Campus classics with a modern twist. Wool, leather and satin varsity jackets to layer all season.",
    rows: [
      [1, "Northline", "Classic Wool Varsity Jacket", 5999, 8999, "men", 4.5, 1900, "Bestseller"],
      [2, "Northline", "Leather Sleeve Varsity", 7499, 10999, "men", 4.6, 840, "New"],
      [3, "Hollis Row", "Colour-Block Varsity", 4999, 7499, "men", 4.4, 1200],
      [4, "Hollis Row", "Reversible Varsity Bomber", 5499, 7999, "men", 4.3, 620],
      [5, "Aster & Co", "Cropped Varsity Jacket", 4799, 6999, "women", 4.5, 1500, "Bestseller"],
      [6, "Aster & Co", "Satin Varsity Bomber", 5299, 7699, "women", 4.4, 780, "New"],
      [7, "Hollis Row", "Oversized Letterman Jacket", 5899, 8499, "women", 4.6, 910],
      [8, "Aster & Co", "Corduroy Varsity Jacket", 4999, 7299, "women", 4.3, 540],
    ],
  },
  {
    slug: "kids",
    title: "Kids Clothes",
    description:
      "Soft, comfy and ready to play. Everyday outfits and party favourites for boys and girls.",
    rows: [
      [1, "Little Oak", "Printed Cotton Tee", 699, 1199, "boys", 4.4, 2200, "Bestseller"],
      [2, "Little Oak", "Stretch Denim Jeans", 1199, 1899, "boys", 4.3, 1100],
      [3, "Tiny Trails", "Hooded Sweatshirt", 1299, 1999, "boys", 4.5, 960, "New"],
      [4, "Tiny Trails", "Jogger Track Pants", 899, 1499, "boys", 4.2, 1500],
      [5, "Mini Meadow", "Floral Party Frock", 1499, 2499, "girls", 4.6, 1700, "Bestseller"],
      [6, "Mini Meadow", "Cotton Skater Dress", 1099, 1799, "girls", 4.4, 1300],
      [7, "Little Oak", "Ruffle Sleeve Top", 799, 1299, "girls", 4.3, 890, "New"],
      [8, "Mini Meadow", "Fleece Hoodie Set", 1699, 2699, "girls", 4.5, 740],
    ],
  },
  {
    slug: "fall-2026",
    title: "Only In The City",
    description:
      "Our Fall 2026 campaign. Urban layers, rich textures and city-ready essentials for the new season.",
    rows: [
      [1, "Northline", "Urban Commuter Jacket", 5499, 8199, "men", 4.5, 1300, "New"],
      [2, "Hollis Row", "Merino Crew Neck Sweater", 3299, 4799, "men", 4.4, 980],
      [3, "Oakwell", "Relaxed Pleated Trousers", 2899, 4299, "men", 4.3, 720],
      [4, "Kora", "Minimal Leather Sneakers", 3799, 5599, "men", 4.5, 1600, "Bestseller"],
      [5, "Aster & Co", "Belted Wool Coat", 8299, 11999, "women", 4.6, 540, "New"],
      [6, "Aster & Co", "Ribbed Knit Midi Dress", 3599, 5199, "women", 4.4, 860],
      [7, "Velora", "Slim Ankle Boots", 4299, 6299, "women", 4.5, 1100, "Bestseller"],
      [8, "Kora", "Structured City Tote", 3499, 5199, "accessories", 4.4, 950],
    ],
  },
  {
    slug: "new",
    title: "New Arrivals",
    description: "Fresh drops from every category. Be the first to wear what is new this season.",
    isVirtual: true,
    rows: [],
  },
  {
    slug: "bestsellers",
    title: "Bestsellers",
    description:
      "The pieces everyone keeps coming back for. Our most loved styles, ranked by popularity.",
    isVirtual: true,
    rows: [],
  },
  {
    slug: "accessories",
    title: "Accessories",
    description: "Bags, belts, caps and more. The finishing touches that complete every look.",
    isVirtual: true,
    rows: [],
  },
];