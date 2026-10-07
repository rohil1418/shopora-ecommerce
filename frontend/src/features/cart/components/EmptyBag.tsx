import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { usePanels } from "@/shared/panels";

export default function EmptyBag() {
  const { openPanel } = usePanels();

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <ShoppingBag size={64} className="mx-auto text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-[#0a1f44]">Your bag is empty</h1>
        <p className="mt-2 text-gray-500">Add something you love from our collections.</p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="bg-[#0a1f44] px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-red-600"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={() => openPanel("wishlist")}
            className="border border-[#0a1f44] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#0a1f44] transition-colors hover:border-red-600 hover:text-red-600"
          >
            Add from wishlist
          </button>
        </div>
      </motion.div>
    </main>
  );
}