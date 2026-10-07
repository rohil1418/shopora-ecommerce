import { motion, type Variants } from "motion/react";
import { EASE } from "@/shared/animations/variants";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

const bagVariants: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 180, damping: 14 },
  },
};

const drawVariants = (delay: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, delay, ease: EASE },
  },
});

export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const isLight = variant === "light";
  const bagColor = isLight ? "#ffffff" : "#0a1f44";
  const letterColor = isLight ? "#0a1f44" : "#ffffff";
  const handleColor = isLight ? "#ef4444" : "#dc2626";

  return (
    <span className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <motion.svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden
        initial="hidden"
        animate="visible"
        whileHover={{ rotate: [0, -8, 8, -4, 0] }}
        className="h-8 w-8 sm:h-10 sm:w-10"
      >
        <motion.rect
          x="12"
          y="22"
          width="40"
          height="36"
          rx="6"
          fill={bagColor}
          variants={bagVariants}
          style={{ originX: 0.5, originY: 1 }}
        />
        <motion.path
          d="M22 22v-5a10 10 0 0 1 20 0v5"
          stroke={handleColor}
          strokeWidth={4}
          strokeLinecap="round"
          variants={drawVariants(0.3)}
        />
        <motion.path
          d="M39 33.5C36 30.5 25 30.5 25 36.5C25 42 39 40 39 46.5C39 52.5 28 52.5 25 49.5"
          stroke={letterColor}
          strokeWidth={4}
          strokeLinecap="round"
          variants={drawVariants(0.6)}
        />
      </motion.svg>

      <span
        className={`text-xl font-extrabold tracking-[0.12em] sm:text-2xl sm:tracking-[0.18em] ${
          isLight ? "text-white" : "text-[#0a1f44]"
        }`}
      >
        SHOP<span className={isLight ? "text-red-500" : "text-red-600"}>ORA</span>
      </span>
    </span>
  );
}