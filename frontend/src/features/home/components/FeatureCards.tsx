import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "@/shared/animations/variants";
import type { FeatureItem } from "../types";

const MotionLink = motion.create(Link);

export default function FeatureCards({ items }: { items: FeatureItem[] }) {
  return (
    <motion.section
      variants={staggerContainer(0.15)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="mx-auto max-w-7xl px-4 py-14"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <MotionLink
            key={item.title}
            variants={fadeUp}
            to={item.href}
            className="group relative block h-[420px] overflow-hidden md:h-[520px]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 text-white">
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="text-sm text-white/90">{item.description}</p>
              <span className="mt-1 block h-0.5 w-0 bg-red-500 transition-all duration-500 group-hover:w-16" />
              <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                {item.ctaLabel}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </span>
            </div>
          </MotionLink>
        ))}
      </div>
    </motion.section>
  );
}