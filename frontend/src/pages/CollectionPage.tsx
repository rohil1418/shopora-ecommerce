import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  CategoryFilter,
  PRODUCT_FILTERS,
  ProductCard,
  getCollection,
  useCollection,
  type ProductFilter,
} from "@/features/products";
import { EASE, fadeUp, staggerContainer } from "@/shared/animations/variants";
import NotFoundPage from "./NotFoundPage";

function CollectionSkeleton() {
  return (
    <main>
      <div className="h-[42vh] min-h-[320px] animate-pulse bg-gray-200" />
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-x-3 gap-y-8 px-4 md:grid-cols-4 md:gap-x-5">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse bg-gray-100" />
        ))}
      </div>
    </main>
  );
}

function CollectionView({ slug, initialFilter }: { slug: string; initialFilter: ProductFilter }) {
  const [filter, setFilter] = useState<ProductFilter>(initialFilter);
  const { data, status, error, isFetching, loadingMore, loadMore, reload } = useCollection(
    slug,
    filter
  );

  useEffect(() => {
    if (data && filter !== "all" && !data.filters.includes(filter)) setFilter("all");
  }, [data, filter]);

  if (status === "notfound") return <NotFoundPage />;

  if (status === "error") {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-gray-600">{error || "Could not load this collection."}</p>
        <button
          type="button"
          onClick={reload}
          className="mt-6 bg-[#0a1f44] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!data) return <CollectionSkeleton />;

  const { collection, products, total } = data;
  const banner = collection.banner || getCollection(slug)?.banner || "";
  const filterOptions = PRODUCT_FILTERS.filter((option) => data.filters.includes(option.value));

  return (
    <main>
      <section className="relative h-[42vh] min-h-[320px] overflow-hidden bg-[#0a1f44]">
        {banner && (
          <motion.img
            src={banner}
            alt=""
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
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

        <p className="mt-6 text-center text-sm text-gray-500">{total} items</p>

        {products.length === 0 && !isFetching && (
          <p className="mt-12 text-center text-gray-500">No products here yet.</p>
        )}

        <motion.div
          layout
          className={`mt-8 grid grid-cols-2 gap-x-3 gap-y-8 transition-opacity md:grid-cols-4 md:gap-x-5 ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <ProductCard
                key={`${product.collection}-${product.id}`}
                product={product}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {data.page < data.totalPages && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="border border-[#0a1f44] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#0a1f44] transition hover:bg-[#0a1f44] hover:text-white disabled:opacity-60"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

const isKnownFilter = (value: string | null): value is ProductFilter =>
  PRODUCT_FILTERS.some((option) => option.value === value);

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();

  if (!slug) return <NotFoundPage />;

  const requested = searchParams.get("filter");
  const initialFilter: ProductFilter = isKnownFilter(requested) ? requested : "all";

  return <CollectionView key={`${slug}-${initialFilter}`} slug={slug} initialFilter={initialFilter} />;
}