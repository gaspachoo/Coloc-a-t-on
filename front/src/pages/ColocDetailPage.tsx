import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AMBIANCE_LABELS, type Ambiance, type Coloc } from "../types/coloc";
import { useUi } from "../context/uiContext";
import { Eye, Bell, Users, Type, Image as ImageIcon, Edit } from "lucide-react";
import { useAuth } from "../context/authContext";
import "./ColocDetailPage.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL.replace(/\/api$/, "");

const toAmbiance = (value: unknown): Ambiance => {
  if (typeof value === "string" && value in AMBIANCE_LABELS) return value as Ambiance;
  return "equilibree";
};

const ColocDetailPage = () => {
  const { colocId } = useParams();
  const navigate = useNavigate();
  const { setSelectedColocId} = useUi();

  const [coloc, setColoc] = useState<Coloc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMember, setIsMember] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchColoc = async () => {
      if (!colocId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/flatshares/${colocId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Colocation introuvable");
        }

        const data = await response.json();

        // Mapper les données du backend
        const mappedColoc: Coloc = {
          id: data.id.toString(),
          name: data.title,
          address: `${data.street}, ${data.postal_code} ${data.city}`,
          buzzerInfo: data.buzzer_info || "",
          roommates: "",
          logoUrl: data.logo_url ? `${API_BASE}/uploads/${data.logo_url}` : null,
          lat: data.latitude ? parseFloat(data.latitude) : 0,
          lng: data.longitude ? parseFloat(data.longitude) : 0,
          rent: data.rent_per_person ? parseFloat(data.rent_per_person) : 0,
          area: data.area || 0,
          rooms: data.bedrooms_count || 0,
          ambiance: toAmbiance(data.ambiance),
          description: data.description || "",
          photos: [], // Sera rempli juste après
        };

        const membersResponse = await fetch(`${API_URL}/flatshares/${colocId}/members`, {
          credentials: "include",
        });
        if (membersResponse.ok) {
          const members = await membersResponse.json();
          if (user) {
            const isUserMember = members.some((member: any) => member.id === user.id);
            setIsMember(isUserMember);
          }

          const formatMemberName = (member: any) => {
            const firstName = typeof member.first_name === "string" ? member.first_name.trim() : "";
            const lastName = typeof member.last_name === "string" ? member.last_name.trim() : "";
            const fullName = `${firstName} ${lastName}`.trim();
            if (fullName.length > 0) return fullName;

            if (typeof member.name === "string" && member.name.trim().length > 0) {
              return member.name.trim();
            }

            return "Colocataire";
          };

          mappedColoc.roommates = members
            .map((member: any) => formatMemberName(member))
            .join(", ");
        }

        // Charger les photos
        const photosResponse = await fetch(`${API_URL}/flatshares/${colocId}/photos?t=${Date.now()}`, {
          credentials: "include",
          cache: "no-store",
        });
        if (photosResponse.ok) {
          const photos = await photosResponse.json();
          mappedColoc.photos = photos.map((p: any) => `${API_BASE}/uploads/${p.url}`);
        }

        setColoc(mappedColoc);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColoc();
  }, [colocId, user]);

  const closeLightbox = () => setLightboxIndex(null);

  const showPrev = () => {
    if (lightboxIndex === null || !coloc) return;
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + coloc.photos.length) % coloc.photos.length));
  };

  const showNext = () => {
    if (lightboxIndex === null || !coloc) return;
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % coloc.photos.length));
  };

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  const handleViewOnMap = () => {
    if (!coloc) return;
    setSelectedColocId(coloc.id);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="coloc-page">
        <div className="coloc-page-card">
          <h1>Chargement...</h1>
        </div>
      </div>
    );
  }

  if (error || !coloc) {
    return (
      <div className="coloc-page">
        <div className="coloc-page-card">
          <h1>Coloc introuvable</h1>
          <p>{error || "Cette coloc n'existe pas (ou plus)."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="coloc-page">
      <div className="coloc-page-card">
        {/* LIGNE 1 : header */}
        <div className="coloc-header">
          <div className="coloc-header-left">
            <div className="coloc-logo">
              {coloc.logoUrl ? (
                <img src={coloc.logoUrl} alt={`Logo de ${coloc.name}`} />
              ) : (
                <div className="coloc-logo-fallback" />
              )}
            </div>

            <div className="coloc-title">
              <h1>{coloc.name}</h1>
              <p className="coloc-subtitle">{coloc.address}</p>
            </div>
          </div>

          <div className="coloc-header-right">
            <div className="coloc-header-actions">
              <button
                type="button"
                className="coloc-map-btn"
                onClick={handleViewOnMap}
                aria-label="Voir sur la carte"
              >
                <span className="btn-label">Voir sur la carte</span>
                <Eye className="btn-icon" />
              </button>

              {isMember && (
                <button
                  type="button"
                  className="coloc-edit-btn"
                  onClick={() => navigate(`/coloc/${coloc.id}/edit`)}
                  aria-label="Éditer"
                >
                  <span className="btn-label">Éditer</span>
                  <Edit className="btn-icon" />
                </button>
              )}
            </div>

            <div className="coloc-badges">
              <span className="coloc-badge">{coloc.rooms} chambres</span>
              <span className="coloc-badge">{coloc.area} m²</span>
              <span className="coloc-badge">{coloc.rent} €/mois</span>
              <span className="coloc-badge">{AMBIANCE_LABELS[coloc.ambiance]}</span>
            </div>
          </div>
        </div>

        {/* LIGNE 2 : sonnette / colocataires / description */}
        <div className="coloc-row-2">
          <div className="coloc-section">
            <h2>Sonnette <Bell className="title-icon" /></h2>
            <div className="coloc-section-scrollbar">
              <p>{coloc.buzzerInfo}</p>
            </div>
          </div>

          <div className="coloc-section">
            <h2>Colocataires <Users className="title-icon" /></h2>
            <div className="coloc-section-scrollbar">
              <p>{coloc.roommates}</p>
            </div>
          </div>

          <div className="coloc-section">
            <h2>Description <Type className="title-icon" /></h2>
            <div className="coloc-section-scrollbar">
              <p>{coloc.description}</p>
            </div>  
          </div>
        </div>

        {/* LIGNE 3 : carrousel photos */}
        <div className="coloc-row-3">
          <h2>Photos <ImageIcon className="title-icon" /></h2>
          <div className="coloc-carousel" aria-label="Carrousel de photos">
            {coloc.photos.map((url, idx) => (
              <button
                type="button"
                className="coloc-photo"
                key={`${coloc.id}-photo-${idx}`}
                onClick={() => setLightboxIndex(idx)}
                title="Ouvrir la photo"
              >
                <img src={url} alt={`Photo ${idx + 1} de ${coloc.name}`} />
              </button>
            ))}
          </div>
        </div>
        {lightboxIndex !== null && (
          <div
            className="lightbox-overlay"
            role="dialog"
            aria-modal="true"
            onClick={closeLightbox}
          >
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="lightbox-close"
                onClick={closeLightbox}
                aria-label="Fermer"
              >
                ✕
              </button>

              <button
                type="button"
                className="lightbox-nav lightbox-prev"
                onClick={showPrev}
                aria-label="Photo précédente"
              >
                ‹
              </button>

              <img
                className="lightbox-image"
                src={coloc.photos[lightboxIndex]}
                alt={`Photo ${lightboxIndex + 1} de ${coloc.name}`}
              />

              <button
                type="button"
                className="lightbox-nav lightbox-next"
                onClick={showNext}
                aria-label="Photo suivante"
              >
                ›
              </button>

              <div className="lightbox-counter">
                {lightboxIndex + 1} / {coloc.photos.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColocDetailPage;
