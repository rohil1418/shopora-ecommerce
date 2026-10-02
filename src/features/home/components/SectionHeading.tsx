import { motion } from "motion/react";
import { EASE, fadeUp } from "@/shared/animations/variants";
import type { SectionHeadingContent } from "../types";

export default function SectionHeading({ eyebrow, title }: SectionHeadingContent) {
  return (
    <div className="mb-8 text-center">
      {eyebrow && (
        <motion.p
          variants={fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUp}
        className="mt-2 text-3xl font-bold text-[#0a1f44] md:text-4xl"
      >
        {title}
      </motion.h2>
      <motion.span
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
        }}
        className="mx-auto mt-4 block h-0.5 w-16 origin-center bg-red-600"
      />
    </div>
  );
}