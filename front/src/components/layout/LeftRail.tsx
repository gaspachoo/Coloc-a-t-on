import { useNavigate } from "react-router-dom";
import {
  Filter,
  Star,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import colocSiteLogo from "../../assets/logo-projet-coloc.png";
import type { User as AuthUser } from "../../context/authContext";

export type PanelMode = "filters" | "favorites" | null;

type LeftRailProps = {
  panelMode: PanelMode;
  onHomeClick: () => void;
  onToggleFilters: () => void;
  onToggleFavorites: () => void;
  onProfile: () => void;
  onSettings: () => void;
  user: AuthUser | null;
  onLogout: () => Promise<void>;
};

const LeftRail = ({
  panelMode,
  onHomeClick,
  onToggleFilters,
  onToggleFavorites,
  onProfile,
  onSettings,
  user,
  onLogout,
}: LeftRailProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate("/");
  };

  return (
    <aside className="left-rail">
      <div className="left-rail-top">
        <button
          type="button"
          className="left-rail-logo-btn"
          title="Accueil"
          onClick={() => {
            onHomeClick();      // ferme panel + reset preview
            navigate("/");      // ramène à l'accueil
          }}
        >
          <img src={colocSiteLogo} alt="Accueil" />
        </button>

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
        {user && (
          <button type="button" className="left-rail-btn" onClick={handleLogout} title="Déconnexion">
            <LogOut />
          </button>
        )}
      </div>
    </aside>
  );
};

export default LeftRail;
