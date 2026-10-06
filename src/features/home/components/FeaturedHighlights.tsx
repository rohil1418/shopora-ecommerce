import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "@/shared/animations/variants";
import type { HighlightItem, SectionHeadingContent } from "../types";
import SectionHeading from "./SectionHeading";

const MotionLink = motion.create(Link);

type FeaturedHighlightsProps = {
  heading: SectionHeadingContent;
  items: HighlightItem[];
};

export default function FeaturedHighlights({ heading, items }: FeaturedHighlightsProps) {
  return (
    <motion.section
      variants={staggerContainer(0.15)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="mx-auto max-w-7xl px-4 pb-6 pt-14"
    >
      <SectionHeading {...heading} />

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <MotionLink
            key={item.title}
            variants={fadeUp}
            to={item.href}
            className="group relative block aspect-[16/10] overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

            <span className="absolute left-4 top-4 bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              {item.badge}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="mt-1 text-sm text-white/85">{item.subtitle}</p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-white/80">
                  {item.count} styles
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                  Shop
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  />
                </span>
              </div>

              <span className="mt-3 block h-0.5 w-0 bg-red-500 transition-all duration-500 group-hover:w-full" />
            </div>
          </MotionLink>
        ))}
      </div>
    </motion.section>
  );
}