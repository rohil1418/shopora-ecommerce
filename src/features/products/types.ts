export type ProductCategory = "men" | "women" | "accessories";

export type ProductFilter = "all" | ProductCategory;

export type Product = {
  id: number;
  title: string;
  price: number;
  category: ProductCategory;
  image: string;
  tag?: string;
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  banner: string;
  products: Product[];
};