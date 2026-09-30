import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { EASE } from "@/shared/animations/variants";
import { usePanels, type PanelName } from "@/shared/panels";
import { NAV_ITEMS } from "../constants";
import type { NavItem } from "../types";
import MegaMenu from "./MegaMenu";
import { Link } from "react-router-dom";
import Logo from "@/shared/components/Logo";

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white"
    >
      {count}
    </motion.span>
  );
}

type IconButtonProps = { label: string; onClick: () => void; children: ReactNode };

function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className="relative transition-colors hover:text-red-600"
    >
      {children}
    </motion.button>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { openPanel } = usePanels();

  const cartCount = 0;
  const wishlistCount = 0;

  const openMenu = (item: NavItem) =>
    setActiveMenu(item.columns ? item.label : null);
  const closeMenu = () => setActiveMenu(null);

  const handleOpenPanel = (panel: PanelName) => {
    setActiveMenu(null);
    setIsOpen(false);
    openPanel(panel);
  };

  return (
    <motion.header
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="sticky top-0 z-50 w-full bg-white shadow-sm"
      onMouseLeave={closeMenu}
      onKeyDown={(e) => e.key === "Escape" && closeMenu()}
    >
      <div className="bg-[#0a1f44] py-1.5 text-center text-xs text-white">
        Free shipping on orders above ₹999
      </div>

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" aria-label="Shopora home">
          <Logo />
        </Link>

        <ul className="hidden h-full items-stretch gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex"
              onMouseEnter={() => openMenu(item)}
            >
              <a
                href={item.href}
                onFocus={() => openMenu(item)}
                className={`relative flex items-center text-sm font-medium uppercase tracking-wide transition-colors ${activeMenu === item.label ? "text-red-600" : "text-gray-800"
                  }`}
              >
                {item.label}
                {activeMenu === item.label && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          <IconButton label="Search" onClick={() => handleOpenPanel("search")}>
            <Search size={20} />
          </IconButton>
          <IconButton label="Login or Sign up" onClick={() => handleOpenPanel("auth")}>
            <User size={20} />
          </IconButton>
          <IconButton label="Wishlist" onClick={() => handleOpenPanel("wishlist")}>
            <Heart size={20} />
            <CountBadge count={wishlistCount} />
          </IconButton>
          <IconButton label="Shopping bag" onClick={() => handleOpenPanel("cart")}>
            <ShoppingBag size={20} />
            <CountBadge count={cartCount} />
          </IconButton>
        </div>
      </nav>

      {NAV_ITEMS.map(
        (item) =>
          item.columns && (
            <MegaMenu
              key={item.label}
              columns={item.columns}
              isOpen={activeMenu === item.label}
              onNavigate={closeMenu}
            />
          )
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t bg-white px-4 md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-sm font-medium uppercase text-gray-800"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}