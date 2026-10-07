import { useEffect, useRef, useState, type FormEvent } from "react";
import { Search, X } from "lucide-react";
import { useOverlay } from "@/shared/hooks/useOverlay";
import { POPULAR_SEARCHES, SUGGESTIONS } from "../constants";

type SearchPanelProps = { isOpen: boolean; onClose: () => void };

export default function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  useOverlay(isOpen, onClose);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen]);

  const term = query.trim().toLowerCase();
  const results = term
    ? SUGGESTIONS.filter((item) => item.toLowerCase().includes(term))
    : POPULAR_SEARCHES;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

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
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={`absolute left-0 top-0 w-full bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-3xl px-4 py-6">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 border-b-2 border-[#0a1f44] pb-2">
              <Search size={22} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="flex-1 bg-transparent text-lg outline-none"
              />
              <button type="button" onClick={onClose} aria-label="Close search">
                <X size={22} />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
              {term ? "Suggestions" : "Popular Searches"}
            </h3>

            {results.length === 0 ? (
              <p className="text-sm text-gray-500">
                No results found for “{query}”. Try searching for something else.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {results.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => setQuery(item)}
                      className="border border-gray-300 px-4 py-1.5 text-sm text-gray-700 transition hover:border-red-600 hover:text-red-600"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}