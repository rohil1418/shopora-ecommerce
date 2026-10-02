import {
  CategoryCards,
  CollectionGrid,
  FeatureCards,
  HeroBanner,
  categories,
  categoriesHeading,
  collections,
  collectionsHeading,
  features,
  heroPrimary,
  heroSecondary,
} from "@/features/home";

export default function HomePage() {
  return (
    <main>
      <HeroBanner {...heroPrimary} />
      <CollectionGrid heading={collectionsHeading} items={collections} />
      <HeroBanner {...heroSecondary} />
      <CategoryCards heading={categoriesHeading} items={categories} />
      <FeatureCards items={features} />
    </main>
  );
}