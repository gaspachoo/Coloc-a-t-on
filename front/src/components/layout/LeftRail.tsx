import { Link } from "react-router-dom";
import {
  Filter,
  Star,
  User,
  Settings,
} from "lucide-react";
import colocSiteLogo from "../../assets/react.svg";

export type PanelMode = "filters" | "favorites" | null;

type LeftRailProps = {
  panelMode: PanelMode;
  onToggleFilters: () => void;
  onToggleFavorites: () => void;
  onProfile: () => void;
  onSettings: () => void;
};

const LeftRail = ({
  panelMode,
  onToggleFilters,
  onToggleFavorites,
  onProfile,
  onSettings,
}: LeftRailProps) => {
  return (
    <aside className="left-rail">
      <div className="left-rail-top">
        <Link to="/" className="left-rail-logo" title="Accueil">
          <img src={colocSiteLogo} alt="Coloc-a-t'on" />
        </Link>

        <button
          type="button"
          className={`left-rail-btn ${panelMode === "filters" ? "is-active" : ""}`}
          onClick={onToggleFilters}
          title="Filtres"
        >
          <Filter />
        </button>

        <button
          type="button"
          className={`left-rail-btn ${panelMode === "favorites" ? "is-active" : ""}`}
          onClick={onToggleFavorites}
          title="Favoris"
        >
          <Star />
        </button>
      </div>

      <div className="left-rail-bottom">
        <button type="button" className="left-rail-btn" onClick={onProfile} title="Profil">
          <User />
        </button>
        <button type="button" className="left-rail-btn" onClick={onSettings} title="Paramètres">
          <Settings />
        </button>
      </div>
    </aside>
  );
};

export default LeftRail;
