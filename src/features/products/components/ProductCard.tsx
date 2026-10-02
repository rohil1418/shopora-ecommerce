import { useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { EASE } from "@/shared/animations/variants";
import type { Product } from "../types";

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

type ProductCardProps = { product: Product; index: number };

export default function ProductCard({ product, index }: ProductCardProps) {
  const [liked, setLiked] = useState<boolean>(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      className="group"
    >
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="aspect-[3/4] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
        />

        {product.tag && (
          <span className="absolute left-3 top-3 bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            {product.tag}
          </span>
        )}

        <motion.button
          type="button"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
          onClick={() => setLiked(!liked)}
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
      </div>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-widest text-gray-500">
          {product.category}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-[#0a1f44] md:text-base">
          {product.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-gray-800">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.article>
  );
}