import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.9 }}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-200/40 text-white transition-colors hover:border-red-500 hover:bg-red-500"
    >
      <ArrowUp size={20} />
    </motion.button>
  );
}