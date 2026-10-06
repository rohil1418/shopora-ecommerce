import { motion } from "motion/react";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { EASE } from "@/shared/animations/variants";
import { useWishlist } from "@/shared/store";
import { formatCount, formatPrice } from "@/shared/utils/format";
import { getProductUid } from "../data/collections";
import type { Product } from "../types";

type ProductCardProps = { product: Product; index: number };

export default function ProductCard({ product, index }: ProductCardProps) {
  const { has, toggle } = useWishlist();
  const uid = getProductUid(product);
  const liked = has(uid);
  const productPath = `/product/${uid}`;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.06, ease: EASE }}
      className="group"
    >
      <div className="relative overflow-hidden bg-gray-100">
        <Link to={productPath} className="block">
          <img
            src={product.image}
            alt={product.title}
            className="aspect-[3/4] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
          />
        </Link>

        {product.tag && (
          <span className="pointer-events-none absolute left-3 top-3 bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            {product.tag}
          </span>
        )}

        <motion.button
          type="button"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
          onClick={() => toggle(uid)}
          whileTap={{ scale: 0.85 }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition-colors hover:bg-white"
        >
          <motion.span
            animate={{ scale: liked ? [1, 1.35, 1] : 1 }}
            transition={{ duration: 0.35 }}
          >
            <Heart
              size={18}
              fill={liked ? "currentColor" : "none"}
              className={liked ? "text-red-600" : "text-gray-700"}
            />
          </motion.span>
        </motion.button>

        {product.rating !== undefined && (
          <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded bg-white/95 px-2 py-1 text-xs font-semibold text-gray-800 shadow">
            <Star size={12} className="fill-green-600 text-green-600" />
            {product.rating.toFixed(1)}
            {product.reviews !== undefined && (
              <span className="border-l border-gray-300 pl-1 font-normal text-gray-500">
                {formatCount(product.reviews)}
              </span>
            )}
          </span>
        )}
      </div>

      <Link to={productPath} className="mt-3 block">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0a1f44]">
          {product.brand ?? product.category}
        </p>
        <h3 className="mt-1 truncate text-sm text-gray-600 md:text-base">{product.title}</h3>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs font-semibold text-red-600">({discount}% OFF)</span>
          )}
        </p>
      </Link>
    </motion.article>
  );
}