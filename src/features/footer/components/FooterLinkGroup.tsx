import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { fadeUp } from "@/shared/animations/variants";
import { usePanels } from "@/shared/panels";
import type { FooterGroup } from "../types";

const linkClass =
  "group relative inline-flex items-center gap-2 py-0.5 text-left text-sm text-blue-100/90 transition duration-300 hover:translate-x-1 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-red-400 after:transition-transform after:duration-300 hover:after:scale-x-100";

export default function FooterLinkGroup({ group }: { group: FooterGroup }) {
  const { openPanel } = usePanels();

  return (
    <motion.nav variants={fadeUp} aria-label={group.title}>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
        {group.title}
      </h3>
      <ul className="space-y-2.5">
        {group.links.map(({ label, href, icon: Icon, iconHover, external, panel }) => (
          <li key={label}>
            {panel ? (
              <button type="button" onClick={() => openPanel(panel)} className={linkClass}>
                {label}
              </button>
            ) : href.startsWith("/") ? (
              <Link to={href} className={linkClass}>
                {label}
              </Link>
            ) : (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={linkClass}
              >
                {label}
                {Icon && (
                  <Icon
                    aria-hidden
                    size={14}
                    className={`transition duration-300 group-hover:-rotate-12 group-hover:scale-125 ${iconHover ?? ""}`}
                  />
                )}
              </a>
            )}
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}