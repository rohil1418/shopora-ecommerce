import { motion } from "motion/react";
import type { ProductFilter } from "../types";

type FilterOption = { value: ProductFilter; label: string };

type CategoryFilterProps = {
  options: FilterOption[];
  value: ProductFilter;
  onChange: (value: ProductFilter) => void;
};

export default function CategoryFilter({ options, value, onChange }: CategoryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter products"
      className="flex flex-wrap justify-center gap-2"
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className="relative px-5 py-2 text-sm font-medium uppercase tracking-wide"
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 bg-[#0a1f44]"
              />
            )}
            <span
              className={`relative transition-colors ${
                isActive ? "text-white" : "text-gray-700 hover:text-red-600"
              }`}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}