export type SectionHeadingContent = { eyebrow?: string; title: string };

export type CollectionItem = { title: string; image: string; href: string };

export type CategoryItem = {
  title: string;
  image: string;
  href: string;
  menHref: string;
  womenHref: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  ctaLabel: string;
  image: string;
  href: string;
};

export type HighlightItem = {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  href: string;
  count: number;
};