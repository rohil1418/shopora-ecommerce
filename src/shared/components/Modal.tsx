import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useOverlay } from "@/shared/hooks/useOverlay";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useOverlay(isOpen, onClose);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-[visibility] duration-200 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full max-w-md bg-white p-6 shadow-xl transition duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4">
          <X size={22} />
        </button>
        {children}
      </div>
    </div>
  );
}