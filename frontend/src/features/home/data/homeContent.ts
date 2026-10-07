import heroImage from "../assets/hero-1.jpg";
import type { HeroBannerProps } from "../components/HeroBanner";
import { getImage } from "./images";
import { getCollection } from "@/features/products";
import type {
  CategoryItem,
  CollectionItem,
  FeatureItem,
  HighlightItem,
  SectionHeadingContent,
} from "../types";

export const heroPrimary: HeroBannerProps = {
  eyebrow: "Fall 2026",
  title: "Only In The City",
  description: "Iconic style, rewritten for the new season.",
  ctaLabel: "Shop the Campaign",
  href: "/collections/fall-2026",
  image: heroImage,
};

export const collectionsHeading: SectionHeadingContent = {
  eyebrow: "Just In",
  title: "Trending Now",
};

export const collections: CollectionItem[] = [
  { title: "Perfume", image: getImage("collection-1", 600, 800), href: "/collections/perfume" },
  { title: "Beauty", image: getImage("collection-2", 600, 800), href: "/collections/beauty" },
  { title: "Varsity Jackets", image: getImage("collection-3", 600, 800), href: "/collections/varsity-jackets" },
  { title: "Kids Clothes", image: getImage("collection-4", 600, 800), href: "/collections/kids" },
];

export const heroSecondary: HeroBannerProps = {
  eyebrow: "Winter Edit",
  title: "Cosy Knits Are Here",
  description: "Soft textures and timeless cuts for colder days.",
  ctaLabel: "Shop Winter Wear",
  href: "/collections/winter",
  image: getImage("hero-2", 1440, 900),
  align: "center",
};

export const categoriesHeading: SectionHeadingContent = {
  eyebrow: "Explore",
  title: "Shop by Category",
};

const categoryLinks = (slug: string) => ({
  href: `/collections/${slug}`,
  womenHref: `/collections/${slug}?filter=women`,
  menHref: `/collections/${slug}?filter=men`,
});

export const categories: CategoryItem[] = [
  { title: "Polo Shirts", image: getImage("category-1", 600, 600), ...categoryLinks("polo-shirts") },
  { title: "Footwear", image: getImage("category-2", 600, 600), ...categoryLinks("footwear") },
  { title: "Trousers", image: getImage("category-3", 600, 600), ...categoryLinks("trousers") },
  { title: "Bags", image: getImage("category-4", 600, 600), ...categoryLinks("bags") },
];

export const features: FeatureItem[] = [
  {
    title: "Denim",
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
    title: "Sportswear",
    description: "Performance meets everyday style.",
    ctaLabel: "Shop Now",
    image: getImage("feature-3", 800, 1000),
    href: "/collections/sport",
  },
];

const countOf = (slug: string): number => getCollection(slug)?.products.length ?? 0;

export const highlightsHeading: SectionHeadingContent = {
  eyebrow: "Featured",
  title: "Shop the Edit",
};

export const highlights: HighlightItem[] = [
  {
    title: "New Arrivals",
    subtitle: "Fresh styles across every category",
    badge: "Just Dropped",
    image: getImage("featured-new", 800, 500),
    href: "/collections/new",
    count: countOf("new"),
  },
  {
    title: "Bestsellers",
    subtitle: "The pieces everyone is buying",
    badge: "Most Loved",
    image: getImage("featured-bestsellers", 800, 500),
    href: "/collections/bestsellers",
    count: countOf("bestsellers"),
  },
  {
    title: "Accessories",
    subtitle: "Bags, bottles, caps and more",
    badge: "Finishing Touch",
    image: getImage("featured-accessories", 800, 500),
    href: "/collections/accessories",
    count: countOf("accessories"),
  },
];