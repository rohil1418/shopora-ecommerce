import { Heart } from "lucide-react";
import Drawer from "@/shared/components/Drawer";

type WishlistDrawerProps = { isOpen: boolean; onClose: () => void };

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="My Wishlist">
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <Heart size={56} className="text-gray-300" />
        <h3 className="text-lg font-semibold text-[#0a1f44]">
          Your wishlist is empty
        </h3>
        <p className="text-sm text-gray-500">
          Tap the heart on any product to save it here.
        </p>
        <button
          onClick={onClose}
          className="mt-2 bg-[#0a1f44] px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-600"
        >
          Start Shopping
        </button>
      </div>
    </Drawer>
  );
}