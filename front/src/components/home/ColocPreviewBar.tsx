import { useNavigate } from "react-router-dom";
import { AMBIANCE_LABELS, type Coloc } from "../../types/coloc";
import "./ColocPreviewBar.css";

type Props = {
  coloc: Coloc;
};

const ColocPreviewBar = ({ coloc }: Props) => {
  const navigate = useNavigate();

  const coverPhoto = coloc.photos?.[0] ?? null;

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

      {/* 3) Badges verticaux */}
      <div className="cp-badges">
        <div className="cp-badge">{coloc.rent} € / mois</div>
        <div className="cp-badge">{coloc.area} m²</div>
        <div className="cp-badge">{coloc.rooms} chambres</div>
        <div className="cp-badge">Ambiance: {AMBIANCE_LABELS[coloc.ambiance]}</div>
      </div>

      {/* 4) Adresse */}
      <div className="cp-address">
        <div className="cp-label">Adresse</div>
        <div className="cp-value">{coloc.address}</div>
      </div>

      {/* 5) Sonnette */}
      <div className="cp-buzzer">
        <div className="cp-label">Sonnette</div>
        <div className="cp-value">{coloc.buzzerInfo}</div>
      </div>

      {/* 6) Colocataires */}
      <div className="cp-roommates">
        <div className="cp-label">Colocataires</div>
        <div className="cp-value">{coloc.roommates}</div>
      </div>

      {/* 7) Photo */}
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
