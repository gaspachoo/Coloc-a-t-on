import { useState } from "react";
import LeftRail from "./LeftRail";
import SidePanel, { type PanelMode } from "./SidePanel";
import { useUi } from "../../context/uiContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { triggerResetUI } = useUi();

  const togglePanel = (mode: Exclude<PanelMode, null>) => {
    if (panelMode === mode) {
      setIsPanelOpen((prev) => !prev);
      return;
    }
    setPanelMode(mode);
    setIsPanelOpen(true);
  };

  const handleHomeClick = () => {
    setIsPanelOpen(false);
    setPanelMode(null);
    triggerResetUI(); // <-- will clear coloc preview (HomePage listens)
  };

  return (
    <div className="app-shell">
      <LeftRail
        panelMode={panelMode}
        onHomeClick={handleHomeClick}
        onToggleFilters={() => togglePanel("filters")}
        onToggleFavorites={() => togglePanel("favorites")}
        onProfile={() => alert("Profil (à faire)")}
        onSettings={() => alert("Paramètres (à faire)")}
      />

      <SidePanel
        panelMode={panelMode}
        isOpen={isPanelOpen}
        onClosePanel={() => setIsPanelOpen(false)}
      />

      <main className="app-content">{children}</main>
    </div>
  );
};

export default Layout;
