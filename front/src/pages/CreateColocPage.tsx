import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Upload } from "lucide-react";
import { useAuth } from "../context/authContext";
import "./CreateColocPage.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL.replace(/\/api$/, "");

type AddressSearchResult = {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    postcode?: string;
  };
};

type AddressDisplay = {
  street: string;
  city: string;
  postalCode: string;
};

type UserSearchResult = {
  email: string;
};

const CreateColocPage = () => {
  const { colocId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!colocId;

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rentPerPerson, setRentPerPerson] = useState("");
  const [area, setArea] = useState("");
  const [bedroomsCount, setBedroomsCount] = useState("");
  const [buzzerInfo, setBuzzerInfo] = useState("");
  const [ambiance, setAmbiance] = useState<"studieuse" | "festive">("festive");

  // Address fields
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [addressSelected, setAddressSelected] = useState(false);

  // Logo
  const [existingLogo, setExistingLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("");

  // Photos
  const [existingPhotos, setExistingPhotos] = useState<Array<{ id: number; url: string; position: number }>>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  // Address search
  const [addressSearch, setAddressSearch] = useState("");
  const [addressResults, setAddressResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Roommates by email
  const [allUserEmails, setAllUserEmails] = useState<string[]>([]);
  const [roommateQuery, setRoommateQuery] = useState("");
  const [selectedRoommateEmails, setSelectedRoommateEmails] = useState<string[]>([]);

  const filteredEmailSuggestions = allUserEmails
    .filter((email) => email !== user?.email)
    .filter((email) => !selectedRoommateEmails.includes(email))
    .filter((email) => email.toLowerCase().includes(roommateQuery.trim().toLowerCase()))
    .slice(0, 6);

  const getAddressDisplay = (result: AddressSearchResult): AddressDisplay => {
    const details = result.address;
    const streetName = details?.road || details?.pedestrian || "";
    const street = [details?.house_number, streetName].filter(Boolean).join(" ").trim();
    const city = details?.city || details?.town || details?.village || details?.municipality || "";
    const postalCode = details?.postcode || "";

    if (street || city || postalCode) {
      return {
        street,
        city,
        postalCode,
      };
    }

    const parts = result.display_name.split(",").map((p) => p.trim());
    return {
      street: parts[0] || "",
      city: parts[parts.length - 3] || "",
      postalCode: parts[parts.length - 2] || "",
    };
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, { credentials: "include" });
        if (!response.ok) {
          return;
        }

        const users = (await response.json()) as UserSearchResult[];
        const emails = users
          .map((u) => u.email)
          .filter((email): email is string => typeof email === "string" && email.length > 0);
        setAllUserEmails([...new Set(emails)]);
      } catch (err) {
        console.error("Erreur récupération utilisateurs:", err);
      }
    };

    fetchUsers();
  }, []);

  // Charger les données de la coloc si en mode édition
  useEffect(() => {
    if (isEditMode && colocId) {
      const fetchColoc = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${API_URL}/flatshares/${colocId}`, {
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Colocation introuvable");
          }

          const data = await response.json();
          
          setTitle(data.title || "");
          setDescription(data.description || "");
          setRentPerPerson(data.rent_per_person?.toString() || "");
          setArea(data.area?.toString() || "");
          setBedroomsCount(data.bedrooms_count?.toString() || "");
          setBuzzerInfo(data.buzzer_info || "");
          setAmbiance(data.ambiance || "festive");
          setStreet(data.street || "");
          setPostalCode(data.postal_code || "");
          setCity(data.city || "");
          setLatitude(data.latitude || "");
          setLongitude(data.longitude || "");
          setAddressSelected(Boolean(data.street && data.postal_code && data.city && data.latitude && data.longitude));

          const membersResponse = await fetch(`${API_URL}/flatshares/${colocId}/members`, {
            credentials: "include",
          });
          if (membersResponse.ok) {
            const members = await membersResponse.json();
            const memberEmails = Array.isArray(members)
              ? members
                  .map((m: { email?: string }) => m.email)
                  .filter((email: string | undefined): email is string => Boolean(email))
                  .filter((email: string) => email !== user?.email)
              : [];
            setSelectedRoommateEmails(memberEmails);
          }

          // Charger les photos
          const photosResponse = await fetch(`${API_URL}/flatshares/${colocId}/photos`, {
            credentials: "include",
          });
          if (photosResponse.ok) {
            const photos = await photosResponse.json();
            setExistingPhotos(photos);
          }

          // Charger le logo
          if (data.logo_url) {
            setExistingLogo(`${API_BASE}/uploads/${data.logo_url}`);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Erreur inconnue");
          console.error("Erreur:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchColoc();
    }
  }, [colocId, isEditMode, user?.email]);

  const handleAddRoommateEmail = (email: string) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || selectedRoommateEmails.includes(normalized) || normalized === user?.email) {
      return;
    }
    setSelectedRoommateEmails((prev) => [...prev, normalized]);
    setRoommateQuery("");
  };

  const handleRemoveRoommateEmail = (email: string) => {
    setSelectedRoommateEmails((prev) => prev.filter((item) => item !== email));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewPhotos((prev) => [...prev, ...files]);
      
      // Créer des URLs de prévisualisation
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviewUrls((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Créer une URL de prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreviewUrl("");
  };

  const handleRemoveNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingPhoto = async (photoId: number) => {
    if (!colocId) return;
    
    try {
      const response = await fetch(`${API_URL}/flatshares/${colocId}/photos/${photoId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la photo");
      }

      setExistingPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error("Erreur suppression photo:", err);
      setError("Impossible de supprimer la photo");
    }
  };

  const handleRemoveExistingLogo = async () => {
    if (!colocId) return;
    
    try {
      const response = await fetch(`${API_URL}/flatshares/${colocId}/logo`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du logo");
      }

      setExistingLogo(null);
    } catch (err) {
      console.error("Erreur suppression logo:", err);
      setError("Impossible de supprimer le logo");
    }
  };

  const handleAddressSearch = async () => {
    if (!addressSearch.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressSearch
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            "User-Agent": "Colocaton App",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche d'adresse");
      }

      const data = await response.json();
      setAddressResults(data);
    } catch (err) {
      console.error("Erreur recherche adresse:", err);
      setError("Impossible de rechercher l'adresse");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAddress = (result: AddressSearchResult) => {
    const parsed = getAddressDisplay(result);

    setLatitude(result.lat);
    setLongitude(result.lon);
    setStreet(parsed.street);
    setCity(parsed.city);
    setPostalCode(parsed.postalCode);
    setAddressSelected(true);

    setAddressResults([]);
    setAddressSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!addressSelected) {
        throw new Error("Veuillez sélectionner une adresse dans les résultats proposés.");
      }

      const url = isEditMode ? `${API_URL}/flatshares/${colocId}` : `${API_URL}/flatshares`;
      const method = isEditMode ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          rent_per_person: Number(rentPerPerson),
          area: Number(area),
          bedrooms_count: Number(bedroomsCount),
          buzzer_info: buzzerInfo,
          street,
          postal_code: postalCode,
          city,
          latitude,
          longitude,
          ambiance,
          roommate_emails: selectedRoommateEmails,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Erreur lors de ${isEditMode ? "la modification" : "la création"}`);
      }

      const coloc = await response.json();

      // Upload des nouvelles photos
      if (newPhotos.length > 0) {
        for (const photo of newPhotos) {
          const formData = new FormData();
          formData.append("photo", photo);
          
          await fetch(`${API_URL}/flatshares/${coloc.id}/photos`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
        }
      }

      // Upload du logo
      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile);
        
        const logoResponse = await fetch(`${API_URL}/flatshares/${coloc.id}/logo`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!logoResponse.ok) {
          console.error("Erreur lors de l'upload du logo");
        }
      }

      navigate(`/coloc/${coloc.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-coloc-page">
      <div className="create-coloc-container">
        <h1>{isEditMode ? "Modifier la colocation" : "Créer une colocation"}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-coloc-form">
          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="La coloc de Gaspard"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Décrivez votre colocation..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rentPerPerson">Loyer par personne (€) *</label>
              <input
                type="number"
                id="rentPerPerson"
                value={rentPerPerson}
                onChange={(e) => setRentPerPerson(e.target.value)}
                required
                min="0"
                placeholder="350"
              />
            </div>

            <div className="form-group">
              <label htmlFor="area">Surface (m²) *</label>
              <input
                type="number"
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                min="1"
                placeholder="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bedroomsCount">Nombre de chambres *</label>
              <input
                type="number"
                id="bedroomsCount"
                value={bedroomsCount}
                onChange={(e) => setBedroomsCount(e.target.value)}
                required
                min="1"
                placeholder="5"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="buzzerInfo">Sonnette *</label>
            <input
              type="text"
              id="buzzerInfo"
              value={buzzerInfo}
              onChange={(e) => setBuzzerInfo(e.target.value)}
              required
              placeholder="Nom affiché sur la sonnette"
            />
          </div>

          <div className="form-group">
            <label htmlFor="roommateEmail">Colocataires (emails)</label>
            <div className="roommates-input-wrapper">
              <input
                type="email"
                id="roommateEmail"
                value={roommateQuery}
                onChange={(e) => setRoommateQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (roommateQuery.trim()) {
                      handleAddRoommateEmail(roommateQuery);
                    }
                  }
                }}
                placeholder="Rechercher un email..."
              />
              <button
                type="button"
                className="search-btn"
                onClick={() => handleAddRoommateEmail(roommateQuery)}
                disabled={!roommateQuery.trim()}
              >
                Ajouter
              </button>
            </div>

            {filteredEmailSuggestions.length > 0 && roommateQuery.trim().length > 0 && (
              <div className="email-suggestions">
                {filteredEmailSuggestions.map((email) => (
                  <button
                    key={email}
                    type="button"
                    className="email-suggestion"
                    onClick={() => handleAddRoommateEmail(email)}
                  >
                    {email}
                  </button>
                ))}
              </div>
            )}

            {selectedRoommateEmails.length > 0 && (
              <div className="selected-roommates">
                {selectedRoommateEmails.map((email) => (
                  <div key={email} className="roommate-chip">
                    <span>{email}</span>
                    <button
                      type="button"
                      className="roommate-chip-remove"
                      onClick={() => handleRemoveRoommateEmail(email)}
                      title="Retirer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="ambiance">Ambiance *</label>
            <select
              id="ambiance"
              value={ambiance}
              onChange={(e) => setAmbiance(e.target.value as "studieuse" | "festive" )}
              required
            >
              <option value="studieuse">Studieuse</option>
              <option value="festive">Festive</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="logo">Logo de la colocation</label>
            <div className="logo-upload-section">
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: "none" }}
              />
              <label htmlFor="logo" className="logo-upload-btn">
                <Upload className="upload-icon" />
                Ajouter un logo
              </label>
              
              <div className="logo-preview">
                {existingLogo && !logoFile && (
                  <div className="logo-item">
                    <img src={existingLogo} alt="Logo de la colocation" />
                    <button
                      type="button"
                      className="logo-remove-btn"
                      onClick={handleRemoveExistingLogo}
                      title="Supprimer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                {logoPreviewUrl && (
                  <div className="logo-item">
                    <img src={logoPreviewUrl} alt="Nouveau logo" />
                    <button
                      type="button"
                      className="logo-remove-btn"
                      onClick={handleRemoveLogo}
                      title="Supprimer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Adresse</h3>

            <div className="form-group">
              <label htmlFor="addressSearch">Rechercher une adresse</label>
              <div className="address-search">
                <input
                  type="text"
                  id="addressSearch"
                  value={addressSearch}
                  onChange={(e) => {
                    setAddressSearch(e.target.value);
                    setAddressSelected(false);
                  }}
                  placeholder="Tapez une adresse puis sélectionnez un résultat..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddressSearch();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddressSearch}
                  disabled={isSearching}
                  className="search-btn"
                >
                  {isSearching ? "..." : "🔍"}
                </button>
              </div>

              <p className="address-helper-text">
                L&apos;adresse doit être sélectionnée dans les résultats pour récupérer automatiquement la latitude et la longitude.
              </p>

              {addressResults.length > 0 && (
                <div className="address-results">
                  {addressResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      className="address-result"
                      onClick={() => handleSelectAddress(result)}
                    >
                      <span className="address-result-main">{getAddressDisplay(result).street || "Adresse"}</span>
                      <span className="address-result-meta">
                        <strong>{getAddressDisplay(result).postalCode || "Code postal inconnu"}</strong>
                        {" "}
                        {getAddressDisplay(result).city || "Ville inconnue"}
                      </span>
                      <span className="address-result-full">{result.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="street">Rue *</label>
                <input
                  type="text"
                  id="street"
                  value={street}
                  readOnly
                  required
                  placeholder="Sélectionnez une adresse ci-dessus"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="postalCode">Code postal *</label>
                <input
                  type="text"
                  id="postalCode"
                  value={postalCode}
                  readOnly
                  required
                  placeholder="Sélectionnez une adresse ci-dessus"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Ville *</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  readOnly
                  required
                  placeholder="Sélectionnez une adresse ci-dessus"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">Latitude *</label>
                <input
                  type="text"
                  id="latitude"
                  value={latitude}
                  readOnly
                  required
                  placeholder="Latitude automatique"
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">Longitude *</label>
                <input
                  type="text"
                  id="longitude"
                  value={longitude}
                  readOnly
                  required
                  placeholder="Longitude automatique"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="photos">Photos</label>
            <div className="photo-upload-section">
              <input
                type="file"
                id="photos"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
              <label htmlFor="photos" className="photo-upload-btn">
                <Upload className="upload-icon" />
                Ajouter des photos
              </label>
              
              <div className="photos-preview-grid">
                {/* Photos existantes */}
                {existingPhotos.map((photo) => (
                  <div key={photo.id} className="photo-preview">
                    <img src={photo.url} alt="Photo de la coloc" />
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={() => handleRemoveExistingPhoto(photo.id)}
                      title="Supprimer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {/* Nouvelles photos */}
                {photoPreviewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="photo-preview">
                    <img src={url} alt={`Nouvelle photo ${index + 1}`} />
                    <button
                      type="button"
                      className="photo-remove-btn"
                      onClick={() => handleRemoveNewPhoto(index)}
                      title="Supprimer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-cancel"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading 
                ? (isEditMode ? "Modification..." : "Création...") 
                : (isEditMode ? "Modifier la colocation" : "Créer la colocation")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateColocPage;
