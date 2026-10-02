import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/shared/animations/variants";
import type { CollectionItem, SectionHeadingContent } from "../types";
import SectionHeading from "./SectionHeading";

type CollectionGridProps = {
  heading: SectionHeadingContent;
  items: CollectionItem[];
};

export default function CollectionGrid({ heading, items }: CollectionGridProps) {
  return (
    <motion.section
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="mx-auto max-w-7xl px-4 py-14"
    >
      <SectionHeading {...heading} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {items.map((item) => (
          <motion.a
            key={item.title}
            variants={fadeUp}
            href={item.href}
            className="group relative block overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.title}
              className="aspect-[3/4] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/85" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h3 className="text-sm font-semibold uppercase tracking-wide md:text-base">
                {item.title}
              </h3>
              <span className="mt-1 flex items-center gap-1 text-xs font-medium uppercase tracking-wide transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                Shop now
                <ArrowRight size={14} />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}