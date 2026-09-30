import { ShoppingBag } from "lucide-react";
import Drawer from "@/shared/components/Drawer";

type CartDrawerProps = { isOpen: boolean; onClose: () => void };

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Shopping Bag">
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <ShoppingBag size={56} className="text-gray-300" />
        <h3 className="text-lg font-semibold text-[#0a1f44]">
          Your shopping bag is empty
        </h3>
        <p className="text-sm text-gray-500">
          Looks like you haven't added anything yet.
        </p>
        <button
          onClick={onClose}
          className="mt-2 bg-[#0a1f44] px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-600"
        >
          Continue Shopping
        </button>
      </div>
    </Drawer>
  );
}