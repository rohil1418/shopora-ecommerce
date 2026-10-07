export type ProductCategory =
  | "men"
  | "women"
  | "accessories"
  | "boys"
  | "girls"
  | "makeup"
  | "skincare"
  | "haircare";
  
export type ProductFilter = "all" | ProductCategory;

export type Product = {
  id: number;
  collection: string;
  title: string;
  price: number;
  category: ProductCategory;
  image: string;
  tag?: string;
  brand?: string;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  banner: string;
  products: Product[];
};
