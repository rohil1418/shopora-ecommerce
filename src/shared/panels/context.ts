import { createContext } from "react";

export type PanelName = "search" | "auth" | "wishlist" | "cart";

export type PanelContextValue = {
  activePanel: PanelName | null;
  openPanel: (panel: PanelName) => void;
  closePanel: () => void;
};

export const PanelContext = createContext<PanelContextValue | null>(null);