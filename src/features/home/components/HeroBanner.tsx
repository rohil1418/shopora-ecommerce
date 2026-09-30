import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE, fadeUp, staggerContainer } from "@/shared/animations/variants";

export type HeroBannerProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel: string;
  href: string;
  image: string;
  align?: "left" | "center";
};

export default function HeroBanner({
  eyebrow,
  title,
  description,
  ctaLabel,
  href,
  image,
  align = "left",
}: HeroBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <section
      ref={sectionRef}
      className="relative h-[70vh] min-h-[420px] w-full overflow-hidden"
    >
      <motion.img
        src={image}
        alt={title}
        style={{ y: imageY }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: EASE }}
        className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      <motion.div
        variants={staggerContainer(0.15, 0.3)}
        initial="hidden"
        animate="visible"
        className={`relative mx-auto flex h-full max-w-7xl flex-col justify-end gap-3 px-6 pb-12 text-white ${alignment}`}
      >
        {eyebrow && (
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.25em]">
            {eyebrow}
          </motion.p>
        )}
        <motion.h2 variants={fadeUp} className="text-4xl font-bold md:text-6xl">
          {title}
        </motion.h2>
        {description && (
          <motion.p variants={fadeUp} className="max-w-xl text-sm md:text-base">
            {description}
          </motion.p>
        )}
        <motion.a
          variants={fadeUp}
          href={href}
          className="group relative mt-2 inline-flex items-center overflow-hidden border border-white px-6 py-2.5 text-sm font-medium uppercase tracking-wide"
        >
          <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 ease-out group-hover:translate-x-0" />
          <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-[#0a1f44]">
            {ctaLabel}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}