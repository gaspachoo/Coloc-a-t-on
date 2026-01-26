import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopSearchBar from "../components/home/TopSearchBar";
import MapView from "../components/home/MapView";
import ColocPreviewBar from "../components/home/ColocPreviewBar";
import type { Coloc } from "../mock/colocs";
import { useUi } from "../context/uiContext";
import { useAuth } from "../context/authContext";
import { applyFilters } from "../utils/applyFilters";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedColocId, setSelectedColocId, filters } = useUi();
  const [colocs, setColocs] = useState<Coloc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColocs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/flatshares`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des colocations");
        }
        
        const data = await response.json();
        
        // Mapper les données du backend au format attendu par le frontend
        const mappedColocs = data.map((flatshare: any) => ({
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
        
        setColocs(mappedColocs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColocs();
  }, []);

  const filteredColocs = useMemo(() => {
    return applyFilters(colocs, filters);
  }, [colocs, filters]);

console.log("filters:", filters);
console.log("filteredColocs:", filteredColocs.length);


  // si la coloc sélectionnée n’est plus dans les résultats, on la ferme
  useEffect(() => {
    if (!selectedColocId) return;
    if (!filteredColocs.some((c) => c.id === selectedColocId)) {
      setSelectedColocId(null);
    }
  }, [selectedColocId, filteredColocs, setSelectedColocId]);

  const selectedColoc: Coloc | null = selectedColocId
    ? colocs.find((c) => c.id === selectedColocId) || null
    : null;

  if (isLoading) {
    return <div className="home-main">Chargement...</div>;
  }

  if (error) {
    return <div className="home-main">Erreur: {error}</div>;
  }

  return (
    <div className="home-main">
      <MapView
        colocs={filteredColocs}                
        onSelectColoc={setSelectedColocId}
        selectedColocId={selectedColocId}
      />

      <TopSearchBar />

      {selectedColoc && <ColocPreviewBar coloc={selectedColoc} />}

      {user && (
        <button
          className="floating-add-btn"
          onClick={() => navigate("/create-coloc")}
          title="Créer une colocation"
        >
          +
        </button>
      )}
    </div>
  );
};

export default HomePage;
