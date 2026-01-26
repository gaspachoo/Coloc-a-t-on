import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type AddressSearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

const CreateColocPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rentPerPerson, setRentPerPerson] = useState("");
  const [bedroomsCount, setBedroomsCount] = useState("");
  const [ambiance, setAmbiance] = useState<"festive" | "studious">("festive");

  // Address fields
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Address search
  const [addressSearch, setAddressSearch] = useState("");
  const [addressResults, setAddressResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddressSearch = async () => {
    if (!addressSearch.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressSearch
        )}&limit=5`,
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
    setLatitude(result.lat);
    setLongitude(result.lon);

    // Parse the display_name to extract address components
    const parts = result.display_name.split(",").map((p) => p.trim());
    if (parts.length >= 3) {
      setStreet(parts[0]);
      setCity(parts[parts.length - 3] || "");
      setPostalCode(parts[parts.length - 2] || "");
    }

    setAddressResults([]);
    setAddressSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/flatshares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          rent_per_person: Number(rentPerPerson),
          bedrooms_count: Number(bedroomsCount),
          street,
          postal_code: postalCode,
          city,
          latitude,
          longitude,
          ambiance,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la création");
      }

      const newColoc = await response.json();
      navigate(`/`);
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
        <h1>Créer une colocation</h1>

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
            <label htmlFor="ambiance">Ambiance *</label>
            <select
              id="ambiance"
              value={ambiance}
              onChange={(e) => setAmbiance(e.target.value as "festive" | "studious")}
              required
            >
              <option value="festive">Festive</option>
              <option value="studious">Studieuse</option>
            </select>
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
                  onChange={(e) => setAddressSearch(e.target.value)}
                  placeholder="Tapez une adresse..."
                  onKeyPress={(e) => {
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

              {addressResults.length > 0 && (
                <div className="address-results">
                  {addressResults.map((result, index) => (
                    <div
                      key={index}
                      className="address-result"
                      onClick={() => handleSelectAddress(result)}
                    >
                      {result.display_name}
                    </div>
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
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  placeholder="Boulevard Françoise Duparc"
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
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  placeholder="13004"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Ville *</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Marseille"
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
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  placeholder="43.29973"
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">Longitude *</label>
                <input
                  type="text"
                  id="longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  placeholder="5.38689"
                />
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
              {isLoading ? "Création..." : "Créer la colocation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateColocPage;
