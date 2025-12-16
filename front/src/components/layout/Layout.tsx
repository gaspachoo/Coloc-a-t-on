import { useState } from "react";
import LeftRail from "./LeftRail";
import SidePanel, { type PanelMode } from "./SidePanel";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = (mode: Exclude<PanelMode, null>) => {
    // si on clique le même mode -> toggle open/close
    if (panelMode === mode) {
      setIsPanelOpen((prev) => !prev);
      // si on ferme, on peut laisser panelMode inchangé, pas grave
      return;
    }
    // sinon, on change le mode et on ouvre
    setPanelMode(mode);
    setIsPanelOpen(true);
  };

  return (
    <div className="app-shell">
      <LeftRail
        panelMode={panelMode}
        onToggleFilters={() => togglePanel("filters")}
        onToggleFavorites={() => togglePanel("favorites")}
        onProfile={() => {
          // plus tard: navigate("/profile") ou modal login
          alert("Profil (à faire)");
        }}
        onSettings={() => {
          // plus tard: navigate("/settings") ou modal
          alert("Paramètres (à faire)");
        }}
      />

      <SidePanel panelMode={panelMode} isOpen={isPanelOpen} />

      <main className="app-content">{children}</main>
    </div>
  );
};

export default Layout;
