import { useState } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Banknote,
  ChevronRight,
  Heart,
  RotateCcw,
  ShoppingBag,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EASE, fadeUp, staggerContainer } from "@/shared/animations/variants";
import { isValidPincode, usePincode } from "@/shared/hooks/usePincode";
import { useCart, useWishlist } from "@/shared/store";
import { deliveryDateShort, formatCount, formatPrice } from "@/shared/utils/format";
import { couponDiscount, findCoupon } from "@/shared/utils/pricing";
import { getCollection, getProductUid } from "../data/collections";
import { getSizes } from "../data/sizes";
import type { Product } from "../types";

export default function ProductDetail({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [pincode, setPincode] = usePincode();
  const [editingPincode, setEditingPincode] = useState<boolean>(false);
  const [pincodeDraft, setPincodeDraft] = useState<string>(pincode);
  const [size, setSize] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);

  const uid = getProductUid(product);
  const sizes = getSizes(product);
  const collection = getCollection(product.collection);
  const liked = has(uid);

  const mrp = product.originalPrice ?? product.price;
  const discount = mrp > product.price ? Math.round((1 - product.price / mrp) * 100) : 0;
  const coupon = findCoupon("SHOPORA10");
  const couponSaving = couponDiscount(coupon, product.price);
  const showSizeError = errorCount > 0 && !size;

  const handleAddToBag = () => {
    if (sizes.length > 0 && !size) {
      setErrorCount((count) => count + 1);
      return;
    }
    addItem(uid, size);
    navigate("/bag");
  };

  const savePincode = () => {
    if (!isValidPincode(pincodeDraft)) return;
    setPincode(pincodeDraft);
    setEditingPincode(false);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-xs text-gray-500"
      >
        <Link to="/" className="transition-colors hover:text-red-600">
          Home
        </Link>
        <ChevronRight size={14} />
        {collection && (
          <>
            <Link
              to={`/collections/${collection.slug}`}
              className="transition-colors hover:text-red-600"
            >
              {collection.title}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="font-semibold text-gray-800">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="relative overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.title}
              className="aspect-[3/4] w-full object-cover"
            />
            {product.tag && (
              <span className="absolute left-4 top-4 bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                {product.tag}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.brand ?? product.title}
            </h1>
            <p className="mt-1 text-lg text-gray-500">{product.title}</p>

            {product.rating !== undefined && (
              <div className="mt-3 inline-flex items-center gap-2 border border-gray-200 px-2.5 py-1 text-sm font-semibold text-gray-800">
                <span className="flex items-center gap-1">
                  {product.rating.toFixed(1)}
                  <Star size={14} className="fill-green-600 text-green-600" />
                </span>
                {product.reviews !== undefined && (
                  <span className="border-l border-gray-300 pl-2 font-normal text-gray-500">
                    {formatCount(product.reviews)} Ratings
                  </span>
                )}
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="border-t pt-6">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-gray-500">
                    MRP <span className="line-through">{formatPrice(mrp)}</span>
                  </span>
                  <span className="text-sm font-semibold text-orange-500">
                    ({discount}% OFF)
                  </span>
                </>
              )}
            </p>
            <p className="mt-1 text-xs font-semibold text-green-700">inclusive of all taxes</p>
          </motion.div>

          {sizes.length > 0 && (
            <motion.div variants={fadeUp}>
              <h2 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                Select size
              </h2>
              <motion.div
                key={errorCount}
                initial={{ x: 0 }}
                animate={{ x: errorCount > 0 ? [0, -6, 6, -4, 4, 0] : 0 }}
                transition={{ duration: 0.4 }}
                className="mt-3 flex flex-wrap gap-3"
              >
                {sizes.map((option) => {
                  const selected = size === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSize(option)}
                      className={`h-12 min-w-12 rounded-full border px-3 text-sm font-medium transition ${
                        selected
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-300 text-gray-800 hover:border-red-600"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </motion.div>
              {showSizeError && (
                <p role="alert" className="mt-2 text-sm font-semibold text-red-600">
                  Please select a size
                </p>
              )}
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToBag}
              className="flex flex-1 items-center justify-center gap-2 bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700"
            >
              <ShoppingBag size={18} />
              Add to bag
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              aria-pressed={liked}
              onClick={() => toggle(uid)}
              className="flex flex-1 items-center justify-center gap-2 border border-gray-300 px-6 py-4 text-sm font-bold uppercase tracking-wide text-gray-800 transition-colors hover:border-gray-800"
            >
              <Heart
                size={18}
                fill={liked ? "currentColor" : "none"}
                className={liked ? "text-red-600" : ""}
              />
              {liked ? "Wishlisted" : "Wishlist"}
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} className="border-t pt-6 text-sm">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-800">
              Delivery options
              <Truck size={16} />
            </h2>

            <div className="mt-3 flex items-center justify-between gap-3 border border-gray-200 px-4 py-3">
              {editingPincode ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    savePincode();
                  }}
                  className="flex flex-1 items-center gap-2"
                >
                  <input
                    inputMode="numeric"
                    maxLength={6}
                    value={pincodeDraft}
                    onChange={(event) => setPincodeDraft(event.target.value.replace(/\D/g, ""))}
                    aria-label="Pincode"
                    className="w-32 border border-gray-300 px-3 py-1.5 outline-none focus:border-[#0a1f44]"
                  />
                  <button
                    type="submit"
                    disabled={!isValidPincode(pincodeDraft)}
                    className="text-xs font-bold uppercase tracking-wide text-red-600 disabled:opacity-40"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <>
                  <span className="font-semibold text-gray-800">{pincode}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPincodeDraft(pincode);
                      setEditingPincode(true);
                    }}
                    className="text-xs font-bold uppercase tracking-wide text-red-600 hover:underline"
                  >
                    Change
                  </button>
                </>
              )}
            </div>

            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <Truck size={18} className="text-gray-500" />
                Get it by {deliveryDateShort()}
              </li>
              <li className="flex items-center gap-3">
                <Banknote size={18} className="text-gray-500" />
                Pay on delivery available
              </li>
              <li className="flex items-center gap-3">
                <RotateCcw size={18} className="text-gray-500" />
                Easy 7 days return and exchange available
              </li>
              <li className="flex items-center gap-3">
                <BadgeCheck size={18} className="text-gray-500" />
                100% original products
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="border-t pt-6 text-sm">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-800">
              Best offers
              <Tag size={14} />
            </h2>
            {couponSaving > 0 && (
              <p className="mt-3 font-bold">
                Best price:{" "}
                <span className="text-red-600">
                  {formatPrice(product.price - couponSaving)}
                </span>
              </p>
            )}
            <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
              <li>Applicable on: orders above ₹999</li>
              <li>
                Coupon code: <span className="font-bold text-gray-900">{coupon?.code}</span>
              </li>
              <li>
                Coupon discount: 10% off, up to ₹300
                {couponSaving > 0 && ` (you save ${formatPrice(couponSaving)})`}
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}