import { useNavigate } from "react-router-dom";
import type { Coloc } from "../../mock/colocs";

type ColocPreviewBarProps = {
  coloc: Coloc;
};

const ColocPreviewBar = ({ coloc }: ColocPreviewBarProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/coloc/${coloc.id}`);
  };

  return (
    <button type="button" className="coloc-preview" onClick={handleClick}>
      {/* Logo + nom à gauche */}
      <div className="coloc-preview-main">
        <div className="coloc-preview-logo-wrapper">
          {coloc.logoUrl ? (
            <img
              src={coloc.logoUrl}
              alt={`Logo de la coloc ${coloc.name}`}
            />
          ) : (
            <div className="coloc-preview-logo-fallback" />
          )}
        </div>
        <div>
          <h3>{coloc.name}</h3>
        </div>
      </div>

      <div className="coloc-preview-section">
        <h4>Adresse</h4>
        <p>{coloc.address}</p>
      </div>
      <div className="coloc-preview-section">
        <h4>Où sonner ?</h4>
        <p>{coloc.buzzerInfo}</p>
      </div>
      <div className="coloc-preview-section">
        <h4>Colocataires</h4>
        <p>{coloc.roommates}</p>
      </div>
    </button>
  );
};

export default ColocPreviewBar;
