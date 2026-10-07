import { motion, type Variants } from "motion/react";
import { EASE } from "@/shared/animations/variants";
import type { NavColumn } from "../types";

type MegaMenuProps = {
  columns: NavColumn[];
  isOpen: boolean;
  onNavigate: () => void;
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const columnVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export default function MegaMenu({ columns, isOpen, onNavigate }: MegaMenuProps) {
  return (
    <div
      className={`absolute left-0 top-full hidden w-full border-t border-gray-100 bg-white shadow-lg transition duration-200 md:block ${
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-2 opacity-0"
      }`}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        className="mx-auto grid max-w-7xl gap-8 px-6 py-8"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((column) => (
          <motion.div key={column.title} variants={columnVariant}>
            <a
              href={column.href}
              onClick={onNavigate}
              className="text-sm font-bold uppercase tracking-wide text-red-600"
            >
              {column.title}
            </a>
            <ul className="mt-3 space-y-2">
              {column.links.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={onNavigate}
                    className="inline-block text-sm text-gray-700 transition hover:translate-x-1 hover:text-red-600"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}