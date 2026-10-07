import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  CategoryFilter,
  PRODUCT_FILTERS,
  ProductCard,
  getCollection,
  type Collection,
  type ProductFilter,
} from "@/features/products";
import { EASE, fadeUp, staggerContainer } from "@/shared/animations/variants";
import NotFoundPage from "./NotFoundPage";

type CollectionViewProps = {
  collection: Collection;
  initialFilter: ProductFilter;
};

function CollectionView({ collection, initialFilter }: CollectionViewProps) {
  const [filter, setFilter] = useState<ProductFilter>(initialFilter);

  const filterOptions = PRODUCT_FILTERS.filter(
    (option) =>
      option.value === "all" ||
      collection.products.some((product) => product.category === option.value)
  );

  const visibleProducts =
    filter === "all"
      ? collection.products
      : collection.products.filter((product) => product.category === filter);

  return (
    <main>
      <section className="relative h-[42vh] min-h-[320px] overflow-hidden">
        <motion.img
          src={collection.banner}
          alt=""
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <motion.div
          variants={staggerContainer(0.12, 0.2)}
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex h-full max-w-7xl flex-col justify-end gap-3 px-6 pb-10 text-white"
        >
          <motion.nav
            variants={fadeUp}
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs uppercase tracking-widest text-white/80"
          >
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight size={14} />
            <span>{collection.title}</span>
          </motion.nav>

          <motion.h1 variants={fadeUp} className="text-4xl font-bold md:text-6xl">
            {collection.title}
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-xl text-sm md:text-base">
            {collection.description}
          </motion.p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <CategoryFilter options={filterOptions} value={filter} onChange={setFilter} />

        <p className="mt-6 text-center text-sm text-gray-500">
          {visibleProducts.length} items
        </p>

        <motion.div
          layout
          className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5"
        >
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, index) => (
              <ProductCard key={`${product.collection}-${product.id}`} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}

const isValidFilter = (value: string | null, collection: Collection): value is ProductFilter =>
  PRODUCT_FILTERS.some((option) => option.value === value) &&
  (value === "all" || collection.products.some((product) => product.category === value));

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const collection = getCollection(slug);

  if (!collection) return <NotFoundPage />;

  const requested = searchParams.get("filter");
  const initialFilter: ProductFilter = isValidFilter(requested, collection)
    ? requested
    : "all";

  return (
    <CollectionView
      key={`${collection.slug}-${initialFilter}`}
      collection={collection}
      initialFilter={initialFilter}
    />
  );
}