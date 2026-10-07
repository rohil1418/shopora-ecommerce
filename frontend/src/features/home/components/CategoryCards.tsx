import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "@/shared/animations/variants";
import type { CategoryItem, SectionHeadingContent } from "../types";
import SectionHeading from "./SectionHeading";

type CategoryCardsProps = {
  heading: SectionHeadingContent;
  items: CategoryItem[];
};

const linkClass =
  "relative py-0.5 text-gray-700 transition-colors hover:text-red-600 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-red-600 after:transition-transform after:duration-300 hover:after:scale-x-100";

export default function CategoryCards({ heading, items }: CategoryCardsProps) {
  return (
    <motion.section
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="mx-auto max-w-7xl px-4 py-14"
    >
      <SectionHeading {...heading} />

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">
        {items.map((item) => (
          <motion.div key={item.title} variants={fadeUp} className="group text-center">
            <Link to={item.href} className="block overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="aspect-square w-full object-cover transition duration-700 ease-out group-hover:scale-110"
              />
            </Link>
            <h3 className="mt-4 text-lg font-semibold text-[#0a1f44]">
              <Link to={item.href} className="transition-colors hover:text-red-600">
                {item.title}
              </Link>
            </h3>
            <div className="mt-2 flex justify-center gap-5 text-sm">
              <Link to={item.womenHref} className={linkClass}>
                Shop Women
              </Link>
              <Link to={item.menHref} className={linkClass}>
                Shop Men
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}