import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useOverlay } from "@/shared/hooks/useOverlay";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Drawer({ isOpen, onClose, title, children, footer }: DrawerProps) {
  useOverlay(isOpen, onClose);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-[visibility] duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#0a1f44]">
            {title}
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t px-5 py-4">{footer}</div>}
      </aside>
    </div>
  );
}