import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePersistentState } from "@/shared/hooks/usePersistentState";

export type CartItem = { uid: string; size: string | null; qty: number };

export const MAX_QTY = 10;

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (uid: string, size: string | null) => void;
  removeItem: (uid: string, size: string | null) => void;
  setQty: (uid: string, size: string | null, qty: number) => void;
  setSize: (uid: string, oldSize: string | null, newSize: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const isSame = (item: CartItem, uid: string, size: string | null): boolean =>
  item.uid === uid && item.size === size;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = usePersistentState<CartItem[]>("shopora-cart", []);

  const addItem = useCallback(
    (uid: string, size: string | null) =>
      setItems((prev) =>
        prev.some((item) => isSame(item, uid, size))
          ? prev.map((item) =>
              isSame(item, uid, size)
                ? { ...item, qty: Math.min(MAX_QTY, item.qty + 1) }
                : item
            )
          : [...prev, { uid, size, qty: 1 }]
      ),
    [setItems]
  );

  const removeItem = useCallback(
    (uid: string, size: string | null) =>
      setItems((prev) => prev.filter((item) => !isSame(item, uid, size))),
    [setItems]
  );

  const setQty = useCallback(
    (uid: string, size: string | null, qty: number) =>
      setItems((prev) =>
        prev.map((item) =>
          isSame(item, uid, size)
            ? { ...item, qty: Math.min(MAX_QTY, Math.max(1, qty)) }
            : item
        )
      ),
    [setItems]
  );

  const setSize = useCallback(
    (uid: string, oldSize: string | null, newSize: string) =>
      setItems((prev) => {
        const current = prev.find((item) => isSame(item, uid, oldSize));
        if (!current) return prev;

        const rest = prev.filter((item) => item !== current);
        const twin = rest.find((item) => isSame(item, uid, newSize));

        if (twin) {
          return rest.map((item) =>
            item === twin
              ? { ...item, qty: Math.min(MAX_QTY, item.qty + current.qty) }
              : item
          );
        }
        return prev.map((item) => (item === current ? { ...item, size: newSize } : item));
      }),
    [setItems]
  );

  const count = items.reduce((total, item) => total + item.qty, 0);

  const value = useMemo(
    () => ({ items, count, addItem, removeItem, setQty, setSize }),
    [items, count, addItem, removeItem, setQty, setSize]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}