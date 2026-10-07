import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePersistentState } from "@/shared/hooks/usePersistentState";

type WishlistContextValue = {
  uids: string[];
  count: number;
  has: (uid: string) => boolean;
  add: (uid: string) => void;
  remove: (uid: string) => void;
  toggle: (uid: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [uids, setUids] = usePersistentState<string[]>("shopora-wishlist", []);

  const has = useCallback((uid: string) => uids.includes(uid), [uids]);

  const add = useCallback(
    (uid: string) => setUids((prev) => (prev.includes(uid) ? prev : [...prev, uid])),
    [setUids]
  );

  const remove = useCallback(
    (uid: string) => setUids((prev) => prev.filter((id) => id !== uid)),
    [setUids]
  );

  const toggle = useCallback(
    (uid: string) =>
      setUids((prev) =>
        prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
      ),
    [setUids]
  );

  const value = useMemo(
    () => ({ uids, count: uids.length, has, add, remove, toggle }),
    [uids, has, add, remove, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
}