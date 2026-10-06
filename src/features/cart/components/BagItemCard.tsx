import { motion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductUid, getSizes } from "@/features/products";
import { MAX_QTY } from "@/shared/store";
import { deliveryDateLong, formatPrice } from "@/shared/utils/format";
import type { BagLine } from "../types";

type BagItemCardProps = {
  line: BagLine;
  selected: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
  onSizeChange: (size: string) => void;
};

const selectClass =
  "rounded border border-gray-300 bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-800 outline-none focus:border-[#0a1f44]";

export default function BagItemCard({
  line,
  selected,
  onToggle,
  onRemove,
  onQtyChange,
  onSizeChange,
}: BagItemCardProps) {
  const { item, product } = line;
  const sizes = getSizes(product);
  const mrp = product.originalPrice ?? product.price;
  const saving = (mrp - product.price) * item.qty;
  const productPath = `/product/${getProductUid(product)}`;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="relative flex gap-4 border border-gray-200 p-3 sm:p-4"
    >
      <div className="relative h-36 w-28 shrink-0 overflow-hidden bg-gray-100 sm:h-40 sm:w-32">
        <Link to={productPath}>
          <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
        </Link>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          aria-label={`Select ${product.title}`}
          className="absolute left-2 top-2 h-4 w-4 accent-red-600"
        />
      </div>

      <div className="min-w-0 flex-1 pr-6">
        <p className="font-bold text-gray-900">{product.brand ?? product.category}</p>
        <Link to={productPath} className="block truncate text-sm text-gray-700 hover:text-red-600">
          {product.title}
        </Link>
        <p className="mt-1 text-xs text-gray-400">Sold by: Shopora Retail</p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {sizes.length > 0 && item.size && (
            <label className="flex items-center gap-1.5 text-xs text-gray-600">
              Size:
              <select
                value={item.size}
                onChange={(event) => onSizeChange(event.target.value)}
                className={selectClass}
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="flex items-center gap-1.5 text-xs text-gray-600">
            Qty:
            <select
              value={item.qty}
              onChange={(event) => onQtyChange(Number(event.target.value))}
              className={selectClass}
            >
              {Array.from({ length: MAX_QTY }, (_, index) => index + 1).map((qty) => (
                <option key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-bold text-gray-900">{formatPrice(product.price * item.qty)}</span>
          {saving > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(mrp * item.qty)}
              </span>
              <span className="text-xs font-semibold text-red-500">
                {formatPrice(saving)} OFF
              </span>
            </>
          )}
        </p>

        <p className="mt-2 flex items-center gap-2 text-xs text-gray-600">
          <RotateCcw size={14} />
          <span>
            <span className="font-bold">7 days</span> return available
          </span>
        </p>
        <p className="mt-1 flex items-center gap-2 text-xs text-gray-600">
          <Check size={14} className="text-green-600" />
          Delivery by <span className="font-bold">{deliveryDateLong()}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${product.title}`}
        className="absolute right-3 top-3 text-gray-500 transition-colors hover:text-red-600"
      >
        <X size={18} />
      </button>
    </motion.li>
  );
}