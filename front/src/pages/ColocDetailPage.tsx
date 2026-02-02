import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Coloc } from "../mock/colocs";
import { useUi } from "../context/uiContext";
import { Eye, Bell, Users, Type, Image as ImageIcon, Star, StarOff, Edit } from "lucide-react";
import { useAuth } from "../context/authContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE = API_URL.replace(/\/api$/, "");

const ColocDetailPage = () => {
  const { colocId } = useParams();
  const navigate = useNavigate();
  const { setSelectedColocId, toggleFavorite, isFavorite } = useUi();

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
          buzzerInfo: "",
          roommates: "",
          logoUrl: data.logo_url ? `${API_BASE}/${data.logo_url}` : null,
          lat: data.latitude ? parseFloat(data.latitude) : 0,
          lng: data.longitude ? parseFloat(data.longitude) : 0,
          rent: data.rent_per_person ? parseFloat(data.rent_per_person) : 0,
          area: 0,
          rooms: data.bedrooms_count || 0,
          ateuf: data.ambiance === "festive" || data.ambiance === "tres_festive",
          description: data.description || "",
          photos: [], // Sera rempli juste après
        };

        // Vérifier si l'utilisateur est membre
        if (user) {
          const membersResponse = await fetch(`${API_URL}/flatshares/${colocId}/members`, {
            credentials: "include",
          });
          if (membersResponse.ok) {
            const members = await membersResponse.json();
            const isUserMember = members.some((member: any) => member.id === user.id);
            setIsMember(isUserMember);
          }
        }

        // Charger les photos
        const photosResponse = await fetch(`${API_URL}/flatshares/${colocId}/photos?t=${Date.now()}`, {
          credentials: "include",
          cache: "no-store",
        });
        if (photosResponse.ok) {
          const photos = await photosResponse.json();
          mappedColoc.photos = photos.map((p: any) => `${API_BASE}/${p.url}`);
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

  const fav = coloc ? isFavorite(coloc.id) : false;

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
            <button
              type="button"
              className="coloc-fav-btn"
              onClick={() => toggleFavorite(coloc.id)}
            >
              {fav ? "Retirer des favoris" : "Ajouter aux favoris"}
              {fav ?  <StarOff className="btn-icon" /> :  <Star className="btn-icon" />}
            </button>

            <button
              type="button"
              className="coloc-map-btn"
              onClick={handleViewOnMap}
            >
              Voir sur la carte <Eye className="btn-icon" />
            </button>

              {isMember && (
                <button
                  type="button"
                  className="coloc-edit-btn"
                  onClick={() => navigate(`/coloc/${coloc.id}/edit`)}
                >
                  Éditer <Edit className="btn-icon" />
                </button>
              )}

            <div className="coloc-badges">
              <span className="coloc-badge">{coloc.rooms} chambres</span>
              <span className="coloc-badge">{coloc.area} m²</span>
              <span className="coloc-badge">{coloc.rent} €/mois</span>
              {coloc.ateuf && (
                <span className="coloc-badge coloc-badge-ateuf">A-t’euf</span>
              )}
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
