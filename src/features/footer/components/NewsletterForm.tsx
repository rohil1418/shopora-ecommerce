import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [scope, animate] = useAnimate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email address.");
      animate(scope.current, { x: [0, -8, 8, -6, 6, 0] }, { duration: 0.4 });
      return;
    }

    setError("");
    setIsSubscribed(true);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isSubscribed ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500 text-white"
          >
            <Check size={24} />
          </motion.span>
          <div>
            <p className="font-semibold text-white">You're in!</p>
            <p className="text-sm text-blue-200">
              Check your inbox for a welcome offer.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={handleSubmit}
          exit={{ opacity: 0, y: -16 }}
        >
          <div ref={scope}>
            <div className="group relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your email"
                aria-label="Email address"
                aria-invalid={error !== ""}
                className="w-full bg-transparent py-3 text-base text-white outline-none placeholder:text-blue-200/70"
              />
              <span className="absolute inset-x-0 bottom-0 h-px bg-blue-200/40" />
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-red-500 transition-transform duration-500 group-focus-within:scale-x-100" />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-2 text-sm text-red-300"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="group relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-full bg-white/90 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#0a1f44]"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-red-500 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            <span className="relative flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
              Subscribe
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}