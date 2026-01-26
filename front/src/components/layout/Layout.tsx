import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftRail from "./LeftRail";
import SidePanel, { type PanelMode } from "./SidePanel";
import { useUi } from "../../context/uiContext";
import { useAuth } from "../../context/authContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { triggerResetUI } = useUi();
  const { user, logout, openLoginModal } = useAuth();

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

  const handleProfile = () => {
    if (!user) {
      openLoginModal();
    } else {
      navigate("/profile");
    }
  };

  const handleSettings = () => {
    if (!user) {
      openLoginModal();
    } else {
      alert("Paramètres (à faire)");
    }
  };

  return (
    <div className="app-shell">
      <LeftRail
        panelMode={panelMode}
        onHomeClick={handleHomeClick}
        onToggleFilters={() => togglePanel("filters")}
        onToggleFavorites={() => togglePanel("favorites")}
        onProfile={handleProfile}
        onSettings={handleSettings}
        user={user}
        onLogout={logout}
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
