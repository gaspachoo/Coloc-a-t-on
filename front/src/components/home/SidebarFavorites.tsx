import { Link } from "react-router-dom";
import { MOCK_COLOCS } from "../../mock/colocs";

const SidebarFavorites = () => {
  // pour l'instant, on suppose que toutes les colocs mock sont des favoris
  return (
    <div>
      <h2>Favoris</h2>
      <ul className="favorites-list">
        {MOCK_COLOCS.map((coloc) => (
          <li key={coloc.id} className="favorites-item">
            <Link to={`/coloc/${coloc.id}`} className="favorites-link">
              <img
                src={coloc.logoUrl}
                alt={`Logo de ${coloc.name}`}
                className="favorites-logo"
              />
              <span>{coloc.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarFavorites;
