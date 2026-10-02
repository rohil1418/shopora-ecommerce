import heroImage from "../assets/hero-1.jpg";
import type { HeroBannerProps } from "../components/HeroBanner";
import type {
  CategoryItem,
  CollectionItem,
  FeatureItem,
  SectionHeadingContent,
} from "../types";
import { getImage } from "./images";

export const heroPrimary: HeroBannerProps = {
  eyebrow: "Fall 2026",
  title: "Only In The City",
  description: "Iconic style, rewritten for the new season.",
  ctaLabel: "Shop the Campaign",
  href: "#",
  image: heroImage,
};

export const collectionsHeading: SectionHeadingContent = {
  eyebrow: "Just In",
  title: "Trending Now",
};

export const collections: CollectionItem[] = [
  { title: "Classic Polos", image: getImage("collection-1", 600, 800), href: "#" },
  { title: "Varsity Jackets", image: getImage("collection-2", 600, 800), href: "#" },
  { title: "Knit Sweaters", image: getImage("collection-3", 600, 800), href: "#" },
  { title: "Everyday Denim", image: getImage("collection-4", 600, 800), href: "#" },
];

export const heroSecondary: HeroBannerProps = {
  eyebrow: "Winter Edit",
  title: "Cosy Knits Are Here",
  description: "Soft textures and timeless cuts for colder days.",
  ctaLabel: "Shop Knitwear",
  href: "#",
  image: getImage("hero-2", 1440, 900),
  align: "center",
};

export const categoriesHeading: SectionHeadingContent = {
  eyebrow: "Explore",
  title: "Shop by Category",
};

export const categories: CategoryItem[] = [
  { title: "Shirts", image: getImage("category-1", 600, 600), menHref: "#", womenHref: "#" },
  { title: "Footwear", image: getImage("category-2", 600, 600), menHref: "#", womenHref: "#" },
  { title: "Trousers", image: getImage("category-3", 600, 600), menHref: "#", womenHref: "#" },
  { title: "Bags", image: getImage("category-4", 600, 600), menHref: "#", womenHref: "#" },
];

export const features: FeatureItem[] = [
  {
    title: "Denim Edit",
    description: "Relaxed fits and modern classics.",
    ctaLabel: "Shop Now",
    image: getImage("feature-1", 800, 1000),
    href: "/collections/denim",
  },
  {
    title: "Signature Collection",
    description: "Our most loved pieces, refreshed.",
    ctaLabel: "Explore",
    image: getImage("feature-2", 800, 1000),
    href: "/collections/signature",
  },
  {
    title: "Sport Edit",
    description: "Performance meets everyday style.",
    ctaLabel: "Shop Now",
    image: getImage("feature-3", 800, 1000),
    href: "/collections/sport",
  },
];