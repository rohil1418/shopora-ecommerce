import { Heart, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getProduct, getProductUid } from "@/features/products";
import Drawer from "@/shared/components/Drawer";
import { useWishlist } from "@/shared/store";
import { formatPrice } from "@/shared/utils/format";

type WishlistDrawerProps = { isOpen: boolean; onClose: () => void };

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { uids, remove } = useWishlist();

  const products = uids.flatMap((uid) => {
    const product = getProduct(uid);
    return product ? [product] : [];
  });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`My Wishlist (${products.length})`}>
      {products.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <Heart size={56} className="text-gray-300" />
          <h3 className="text-lg font-semibold text-[#0a1f44]">Your wishlist is empty</h3>
          <p className="text-sm text-gray-500">Tap the heart on any product to save it here.</p>
          <button
            onClick={onClose}
            className="mt-2 bg-[#0a1f44] px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-600"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => {
            const uid = getProductUid(product);
            return (
              <li key={uid} className="flex gap-4 border-b pb-4">
                <Link
                  to={`/product/${uid}`}
                  onClick={onClose}
                  className="h-28 w-20 shrink-0 overflow-hidden bg-gray-100"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#0a1f44]">
                    {product.brand ?? product.category}
                  </p>
                  <Link
                    to={`/product/${uid}`}
                    onClick={onClose}
                    className="mt-1 block truncate text-sm text-gray-700 hover:text-red-600"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-2 text-sm font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(uid)}
                  aria-label={`Remove ${product.title} from wishlist`}
                  className="self-start text-gray-500 transition-colors hover:text-red-600"
                >
                  <X size={18} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}