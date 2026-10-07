import { motion, type Variants } from "motion/react";
import { EASE, fadeUp, staggerContainer } from "@/shared/animations/variants";
import {
  FOOTER_GROUPS,
  FOOTER_HEADING,
  FOOTER_NOTE,
  FOOTER_TAGLINE,
} from "../constants";
import BackToTop from "./BackToTop";
import FooterLinkGroup from "./FooterLinkGroup";
import NewsletterForm from "./NewsletterForm";

const wordVariant: Variants = {
  hidden: { y: "110%" },
  visible: { y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function Footer() {
  const words = FOOTER_HEADING.split(" ");
  const lastIndex = words.length - 1;

  return (
    <footer className="relative mt-16 overflow-hidden  bg-[#0a1f44] text-blue-100">
      <motion.div
        aria-hidden
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-red-600/20 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl"
      />

      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative mx-auto max-w-7xl px-6 pt-14 md:px-10 lg:pt-16"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div variants={staggerContainer(0.1)}>
            <motion.h2
              variants={staggerContainer(0.1)}
              className="text-4xl font-bold leading-tight text-white md:text-5xl"
            >
              {words.map((word, i) => (
                <span key={i} className="mr-3 inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    variants={wordVariant}
                    className={`inline-block ${i === lastIndex ? "text-red-400" : ""}`}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-4 max-w-md text-base text-blue-200">
              {FOOTER_TAGLINE}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 max-w-lg">
              <NewsletterForm />
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.08)}
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3"
          >
            {FOOTER_GROUPS.map((group) => (
              <FooterLinkGroup key={group.title} group={group} />
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="mt-14 flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="order-3 text-center text-xs text-blue-300 lg:order-1 lg:text-left">
            © {new Date().getFullYear()} Shopora. All rights reserved.
          </p>
          <div className="order-1 lg:order-2">
            <BackToTop />
          </div>
          <p className="order-2 max-w-md border border-blue-200/40 p-4 text-center text-xs font-semibold uppercase tracking-wide text-blue-200 lg:order-3 lg:text-left">
            {FOOTER_NOTE}
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          aria-hidden
          className="pointer-events-none -mb-[4vw] select-none pt-10 text-center text-[22vw] font-black leading-none tracking-tighter text-white/5 lg:text-[15vw]"
        >
          SHOPORA
        </motion.p>
      </motion.div>
    </footer>
  );
}