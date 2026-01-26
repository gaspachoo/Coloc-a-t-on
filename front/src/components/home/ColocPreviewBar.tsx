import { useNavigate } from "react-router-dom";
import type { Coloc } from "../../mock/colocs";
import { useUi } from "../../context/uiContext";
import { Star, StarOff } from "lucide-react";

type Props = {
  coloc: Coloc;
};

const ColocPreviewBar = ({ coloc }: Props) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useUi();

  const coverPhoto = coloc.photos?.[0] ?? null;
  const fav = isFavorite(coloc.id);

  const handleOpen = () => navigate(`/coloc/${coloc.id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      className="coloc-preview"
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      aria-label={`Ouvrir la fiche de ${coloc.name}`}
    >
      {/* 1) Logo */}
      <div className="cp-logo">
        {coloc.logoUrl ? (
          <img src={coloc.logoUrl} alt={`Logo de ${coloc.name}`} />
        ) : (
          <div className="cp-logo-fallback" />
        )}
      </div>

      {/* 2) Nom */}
      <div className="cp-name">
        <div className="cp-title">{coloc.name}</div>
      </div>

      {/* 3) Favoris (NE DOIT PAS NAVIGUER) */}
      <div className="cp-fav">
        <button
          type="button"
          className="cp-fav-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(coloc.id);
          }}
        >
          {fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          {fav ?  <StarOff className="btn-icon" /> :  <Star className="btn-icon" />}
        </button>
      </div>

      {/* 4) Badges verticaux */}
      <div className="cp-badges">
        <div className="cp-badge">{coloc.rent} € / mois</div>
        <div className="cp-badge">{coloc.area} m²</div>
        <div className="cp-badge">{coloc.rooms} chambres</div>
        {coloc.ateuf && (
          <div className="cp-badge cp-badge-ateuf">Coloc A-t&apos;euf</div>
        )}
      </div>

      {/* 5) Adresse */}
      <div className="cp-address">
        <div className="cp-label">Adresse</div>
        <div className="cp-value">{coloc.address}</div>
      </div>

      {/* 6) Sonnette */}
      <div className="cp-buzzer">
        <div className="cp-label">Sonnette</div>
        <div className="cp-value">{coloc.buzzerInfo}</div>
      </div>

      {/* 7) Colocataires */}
      <div className="cp-roommates">
        <div className="cp-label">Colocataires</div>
        <div className="cp-value">{coloc.roommates}</div>
      </div>

      {/* 8) Photo */}
      <div className="cp-photo">
        {coverPhoto ? (
          <img className="cp-photo-img" src={coverPhoto} alt={`Photo de ${coloc.name}`} />
        ) : (
          <div className="cp-photo-fallback" />
        )}
      </div>
    </div>
  );
};

export default ColocPreviewBar;
