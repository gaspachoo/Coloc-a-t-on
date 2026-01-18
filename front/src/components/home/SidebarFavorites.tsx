import { useNavigate } from "react-router-dom";
import { MOCK_COLOCS } from "../../mock/colocs";
import { useUi } from "../../context/uiContext";

type Props = {
  onClosePanel: () => void;
};

const SidebarFavorites = ({ onClosePanel }: Props) => {
  const navigate = useNavigate();
  const { favoriteIds, selectedColocId, setSelectedColocId } = useUi();

  const favorites = MOCK_COLOCS.filter((c) => favoriteIds.includes(c.id));

  const handlePick = (colocId: string) => {
    setSelectedColocId(colocId); // sélectionne -> map flyTo + popup + preview
    navigate("/");               // s'assure qu'on est sur la carte
    onClosePanel();              // ferme le panneau
  };

  return (
    <div>
      <h2>Favoris</h2>

      {favorites.length === 0 ? (
        <p style={{ margin: 0, opacity: 0.8 }}>
          Aucun favori pour le moment.
        </p>
      ) : (
        <ul className="favorites-list">
          {favorites.map((coloc) => (
            <li key={coloc.id} className="favorites-item">
              <button
                type="button"
                className={`favorites-button ${
                  coloc.id === selectedColocId ? "is-active" : ""
                }`}
                onClick={() => handlePick(coloc.id)}
                title={`Voir ${coloc.name} sur la carte`}
              >
                {coloc.logoUrl ? (
                  <img
                    src={coloc.logoUrl}
                    alt={`Logo de ${coloc.name}`}
                    className="favorites-logo"
                  />
                ) : (
                  <div
                    className="favorites-logo-fallback"
                    aria-label={`Logo de ${coloc.name}`}
                  />
                )}

                <span>{coloc.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarFavorites;
