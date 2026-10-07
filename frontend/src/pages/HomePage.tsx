import {
  CategoryCards,
  CollectionGrid,
  FeatureCards,
  FeaturedHighlights,
  HeroBanner,
  categories,
  categoriesHeading,
  collections,
  collectionsHeading,
  features,
  heroPrimary,
  heroSecondary,
  highlights,
  highlightsHeading,
} from "@/features/home";

export default function HomePage() {
  return (
    <main>
      <HeroBanner {...heroPrimary} />
      <FeaturedHighlights heading={highlightsHeading} items={highlights} />
      <CollectionGrid heading={collectionsHeading} items={collections} />
      <HeroBanner {...heroSecondary} />
      <CategoryCards heading={categoriesHeading} items={categories} />
      <FeatureCards items={features} />
    </main>
  );
}