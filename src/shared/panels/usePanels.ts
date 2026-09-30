import { useContext } from "react";
import { PanelContext, type PanelContextValue } from "./context";

export function usePanels(): PanelContextValue {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanels must be used inside <PanelProvider>");
  }
  return context;
}