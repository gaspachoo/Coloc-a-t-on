import SidebarFilters from "../home/SidebarFilters";
import SidebarFavorites from "../home/SidebarFavorites";

export type PanelMode = "filters" | "favorites" | null;

type SidePanelProps = {
  panelMode: PanelMode;
  isOpen: boolean;
};

const SidePanel = ({ panelMode, isOpen }: SidePanelProps) => {
  if (!isOpen || !panelMode) return null;

  return (
    <aside className="side-panel">
      {panelMode === "filters" && <SidebarFilters />}
      {panelMode === "favorites" && <SidebarFavorites />}
    </aside>
  );
};

export default SidePanel;
