import { useCallback, useMemo, useState, type ReactNode } from "react";
import { PanelContext, type PanelName } from "./context";

export default function PanelProvider({ children }: { children: ReactNode }) {
  const [activePanel, setActivePanel] = useState<PanelName | null>(null);

  const openPanel = useCallback((panel: PanelName) => setActivePanel(panel), []);
  const closePanel = useCallback(() => setActivePanel(null), []);

  const value = useMemo(
    () => ({ activePanel, openPanel, closePanel }),
    [activePanel, openPanel, closePanel]
  );

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
}