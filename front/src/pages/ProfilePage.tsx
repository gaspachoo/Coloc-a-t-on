import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { AMBIANCE_LABELS, type Ambiance, type Coloc } from "../types/coloc";
import { User as UserIcon, Mail, Calendar, Home, Pencil, Lock, ChevronDown, ChevronUp } from "lucide-react";
import "./ProfilePage.css";

const API_URL = import.meta.env.VITE_API_URL;

const toAmbiance = (value: unknown): Ambiance => {
  if (typeof value === "string" && value in AMBIANCE_LABELS) return value as Ambiance;
  return "equilibree";
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [userColocs, setUserColocs] = useState<Coloc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit sections open state
  const [openSection, setOpenSection] = useState<"identity" | "email" | "password" | null>(null);

  // Identity form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identityLoading, setIdentityLoading] = useState(false);
  const [identityError, setIdentityError] = useState<string | null>(null);
  const [identitySuccess, setIdentitySuccess] = useState(false);

  // Email form
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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
            buzzerInfo: flatshare.buzzer_info || "",
            roommates: "",
            logoUrl: flatshare.logo_url ? `${API_URL.replace(/\/api$/, "")}/uploads/${flatshare.logo_url}` : null,
            lat: flatshare.latitude ? parseFloat(flatshare.latitude) : 0,
            lng: flatshare.longitude ? parseFloat(flatshare.longitude) : 0,
            rent: flatshare.rent_per_person ? parseFloat(flatshare.rent_per_person) : 0,
            area: flatshare.area || 0,
            rooms: flatshare.bedrooms_count || 0,
            ambiance: toAmbiance(flatshare.ambiance),
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

  const toggleSection = (section: "identity" | "email" | "password") => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
      setIdentityError(null);
      setIdentitySuccess(false);
      setEmailError(null);
      setEmailSuccess(false);
      setPasswordError(null);
      setPasswordSuccess(false);
      if (section === "identity" && user) {
        setFirstName(user.first_name);
        setLastName(user.last_name);
      }
      if (section === "email") {
        setNewEmail("");
        setEmailPassword("");
      }
      if (section === "password") {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    }
  };

  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIdentityLoading(true);
    setIdentityError(null);
    setIdentitySuccess(false);
    try {
      await updateUser(user.id, { first_name: firstName.trim(), last_name: lastName.trim() });
      setIdentitySuccess(true);
    } catch (err) {
      setIdentityError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIdentityLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(false);
    try {
      await updateUser(user.id, { email: newEmail.trim().toLowerCase(), current_password: emailPassword });
      setEmailSuccess(true);
      setNewEmail("");
      setEmailPassword("");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await updateUser(user.id, { current_password: currentPassword, new_password: newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setPasswordLoading(false);
    }
  };

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

        {/* Edit profile sections */}
        <div className="profile-section edit-section">
          <h2><Pencil size={20} /> Modifier mon profil</h2>

          {/* Identity */}
          <div className="edit-accordion">
            <button className="edit-accordion-header" onClick={() => toggleSection("identity")}>
              <span><UserIcon size={16} /> Nom &amp; Prénom</span>
              {openSection === "identity" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSection === "identity" && (
              <form className="edit-form" onSubmit={handleIdentitySubmit}>
                <div className="edit-form-row">
                  <div className="edit-form-group">
                    <label htmlFor="firstName">Prénom</label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="edit-form-group">
                    <label htmlFor="lastName">Nom</label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {identityError && <p className="edit-form-error">{identityError}</p>}
                {identitySuccess && <p className="edit-form-success">Profil mis à jour !</p>}
                <button type="submit" className="btn-save" disabled={identityLoading}>
                  {identityLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </form>
            )}
          </div>

          {/* Email */}
          <div className="edit-accordion">
            <button className="edit-accordion-header" onClick={() => toggleSection("email")}>
              <span><Mail size={16} /> Adresse e-mail</span>
              {openSection === "email" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSection === "email" && (
              <form className="edit-form" onSubmit={handleEmailSubmit}>
                <div className="edit-form-group">
                  <label htmlFor="newEmail">Nouvel e-mail</label>
                  <input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="emailPassword">Mot de passe actuel</label>
                  <input
                    id="emailPassword"
                    type="password"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                {emailError && <p className="edit-form-error">{emailError}</p>}
                {emailSuccess && <p className="edit-form-success">E-mail mis à jour !</p>}
                <button type="submit" className="btn-save" disabled={emailLoading}>
                  {emailLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </form>
            )}
          </div>

          {/* Password */}
          <div className="edit-accordion">
            <button className="edit-accordion-header" onClick={() => toggleSection("password")}>
              <span><Lock size={16} /> Mot de passe</span>
              {openSection === "password" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSection === "password" && (
              <form className="edit-form" onSubmit={handlePasswordSubmit}>
                <div className="edit-form-group">
                  <label htmlFor="currentPassword">Mot de passe actuel</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>
                {passwordError && <p className="edit-form-error">{passwordError}</p>}
                {passwordSuccess && <p className="edit-form-success">Mot de passe mis à jour !</p>}
                <button type="submit" className="btn-save" disabled={passwordLoading}>
                  {passwordLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </form>
            )}
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
                    <span className="coloc-badge-small">{AMBIANCE_LABELS[coloc.ambiance]}</span>
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
