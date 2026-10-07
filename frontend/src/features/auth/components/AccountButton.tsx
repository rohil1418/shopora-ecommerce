import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogOut, User } from "lucide-react";
import { EASE } from "@/shared/animations/variants";
import { usePanels } from "@/shared/panels";
import { useAuth } from "@/shared/store";

export default function AccountButton() {
  const { user, logout } = useAuth();
  const { openPanel } = usePanels();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  if (!user) {
    return (
      <motion.button
        aria-label="Login or Sign up"
        onClick={() => openPanel("auth")}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="relative transition-colors hover:text-red-600"
      >
        <User size={20} />
      </motion.button>
    );
  }

  const firstName = user.name.split(" ")[0];

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        aria-label="Account menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 transition-colors hover:text-red-600"
      >
        <span className="relative">
          <User size={20} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
        </span>
        <span className="hidden max-w-24 truncate text-xs font-semibold uppercase tracking-wide lg:inline">
          {firstName}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute right-0 top-full z-50 mt-3 w-60 border border-gray-200 bg-white p-4 shadow-lg"
          >
            <p className="truncate text-sm font-bold text-[#0a1f44]">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-500">{user.phone}</p>

            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await logout();
              }}
              className="mt-4 flex w-full items-center gap-2 border-t pt-3 text-xs font-bold uppercase tracking-wide text-gray-700 transition-colors hover:text-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}