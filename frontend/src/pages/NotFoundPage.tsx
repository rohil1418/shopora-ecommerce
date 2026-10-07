import { motion, type Variants } from "motion/react";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "@/shared/animations/variants";
import { usePanels } from "@/shared/panels";

const digitVariant: Variants = {
  hidden: { opacity: 0, y: 60, rotate: -8 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
};

export default function NotFoundPage() {
  const { openPanel } = usePanels();

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <div
          aria-hidden
          className="flex items-center justify-center gap-2 text-[9rem] font-black leading-none text-[#0a1f44] sm:text-[12rem]"
        >
          <motion.span variants={digitVariant}>4</motion.span>
          <motion.span variants={digitVariant} className="text-red-600">
            <motion.span
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              0
            </motion.span>
          </motion.span>
          <motion.span variants={digitVariant}>4</motion.span>
        </div>

        <motion.h1
          variants={fadeUp}
          className="mt-2 text-2xl font-bold uppercase tracking-wide text-[#0a1f44] md:text-3xl"
        >
          Page Not Found
        </motion.h1>

        <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-md text-gray-600">
          Oops! The page you are looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            to="/"
            className="group relative inline-flex items-center overflow-hidden bg-[#0a1f44] px-6 py-3 text-sm font-medium uppercase tracking-wide text-white"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-red-600 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            <span className="relative flex items-center gap-2">
              Back to Home
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => openPanel("search")}
            className="group inline-flex items-center gap-2 border border-[#0a1f44] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#0a1f44] transition-colors hover:border-red-600 hover:text-red-600"
          >
            <Search
              size={16}
              className="transition-transform duration-300 group-hover:scale-125"
            />
            Search products
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}