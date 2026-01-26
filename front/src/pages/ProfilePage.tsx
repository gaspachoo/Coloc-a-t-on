import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import type { Coloc } from "../mock/colocs";
import { User as UserIcon, Mail, Calendar, Home } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userColocs, setUserColocs] = useState<Coloc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchUserColocs = async () => {
      try {
        setIsLoading(true);

        // Récupérer toutes les colocs
        const response = await fetch(`${API_URL}/flatshares`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des colocations");
        }

        const allColocs = await response.json();

        // Filtrer les colocs créées par l'utilisateur connecté
        const myColocs = allColocs
          .filter((flatshare: any) => flatshare.created_by_user_id === user.id)
          .map((flatshare: any) => ({
            id: flatshare.id.toString(),
            name: flatshare.title,
            address: `${flatshare.street}, ${flatshare.postal_code} ${flatshare.city}`,
            buzzerInfo: "",
            roommates: "",
            logoUrl: null,
            lat: flatshare.latitude ? parseFloat(flatshare.latitude) : 0,
            lng: flatshare.longitude ? parseFloat(flatshare.longitude) : 0,
            rent: flatshare.rent_per_person ? parseFloat(flatshare.rent_per_person) : 0,
            area: 0,
            rooms: flatshare.bedrooms_count || 0,
            ateuf: flatshare.ambiance === "festive" || flatshare.ambiance === "tres_festive",
            description: flatshare.description || "",
            photos: [],
          }));

        setUserColocs(myColocs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserColocs();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Chargement...</h1>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profile_photo_url ? (
              <img src={user.profile_photo_url} alt={`Photo de ${user.first_name}`} />
            ) : (
              <div className="profile-avatar-fallback">
                <UserIcon size={48} />
              </div>
            )}
          </div>

          <div className="profile-info">
            <h1>
              {user.first_name} {user.last_name}
            </h1>
            <div className="profile-details">
              <div className="profile-detail">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              {user.class_year && (
                <div className="profile-detail">
                  <Calendar size={16} />
                  <span>Promo {user.class_year}</span>
                </div>
              )}
              <div className="profile-detail">
                <Calendar size={16} />
                <span>Inscrit le {formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>
            <Home size={20} /> Mes colocations ({userColocs.length})
          </h2>

          {error && <div className="error-message">{error}</div>}

          {userColocs.length === 0 ? (
            <div className="empty-state">
              <p>Vous n'avez pas encore créé de colocation.</p>
              <button
                className="btn-create-coloc"
                onClick={() => navigate("/create-coloc")}
              >
                Créer ma première colocation
              </button>
            </div>
          ) : (
            <div className="colocs-grid">
              {userColocs.map((coloc) => (
                <div
                  key={coloc.id}
                  className="coloc-card"
                  onClick={() => navigate(`/coloc/${coloc.id}`)}
                >
                  <div className="coloc-card-header">
                    <h3>{coloc.name}</h3>
                    {coloc.ateuf && (
                      <span className="coloc-badge-small">A-t'euf</span>
                    )}
                  </div>
                  <p className="coloc-card-address">{coloc.address}</p>
                  <div className="coloc-card-stats">
                    <span>{coloc.rooms} chambres</span>
                    <span>•</span>
                    <span>{coloc.rent} €/mois</span>
                  </div>
                  {coloc.description && (
                    <p className="coloc-card-description">
                      {coloc.description.substring(0, 100)}
                      {coloc.description.length > 100 ? "..." : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
