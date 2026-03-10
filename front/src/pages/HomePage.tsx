import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopSearchBar from "../components/home/TopSearchBar";
import MapView from "../components/home/MapView";
import ColocPreviewBar from "../components/home/ColocPreviewBar";
import { AMBIANCE_LABELS, type Ambiance, type Coloc } from "../types/coloc";
import { useUi } from "../context/uiContext";
import { useAuth } from "../context/authContext";
import { applyFilters } from "../utils/applyFilters";
import "./HomePage.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL.replace(/\/api$/, "");

const toUploadedAssetUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads/")) return `${API_BASE}${url}`;
  return `${API_BASE}/uploads/${url}`;
};

const toNumber = (value: string | number | null): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

type JsonRecord = Record<string, unknown>;

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

const asNullableString = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const asNumberOrStringOrNull = (value: unknown): string | number | null => {
  if (typeof value === "number" || typeof value === "string") return value;
  return null;
};

const asNumberOrNull = (value: unknown): number | null =>
  typeof value === "number" ? value : null;

const toAmbiance = (value: unknown): Ambiance => {
  const raw = asString(value);
  if (raw in AMBIANCE_LABELS) return raw as Ambiance;
  return "equilibree";
};

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
        
        const data = (await response.json()) as unknown;
        const flatshares = Array.isArray(data) ? (data as JsonRecord[]) : [];
        
        // Mapper les données du backend au format attendu par le frontend
        const mappedColocs: Coloc[] = flatshares.map((flatshare) => ({
          id: String(flatshare.id ?? ""),
          name: asString(flatshare.title),
          address: `${asString(flatshare.street)}, ${asString(flatshare.postal_code)} ${asString(flatshare.city)}`,
          roommates: "",
          logoUrl: asNullableString(flatshare.logo_url)
            ? toUploadedAssetUrl(asString(flatshare.logo_url))
            : null,
          lat: toNumber(asNumberOrStringOrNull(flatshare.latitude)),
          lng: toNumber(asNumberOrStringOrNull(flatshare.longitude)),
          rent: toNumber(asNumberOrStringOrNull(flatshare.rent_per_person)),
          area: toNumber(asNumberOrStringOrNull(flatshare.area)),
          rooms: asNumberOrNull(flatshare.bedrooms_count) ?? 0,
          buzzerInfo: asString(flatshare.buzzer_info),
          ambiance: toAmbiance(flatshare.ambiance),
          description: asString(flatshare.description),
          photos: [],
        }));

        const colocsWithPhotos = await Promise.all(
          mappedColocs.map(async (mappedColoc) => {
            try {
              const [photosResponse, membersResponse] = await Promise.all([
                fetch(`${API_URL}/flatshares/${mappedColoc.id}/photos?t=${Date.now()}`, {
                  credentials: "include",
                  cache: "no-store",
                }),
                fetch(`${API_URL}/flatshares/${mappedColoc.id}/members`, {
                  credentials: "include",
                }),
              ]);

              let firstPhoto = "";
              if (photosResponse.ok) {
                const photos = (await photosResponse.json()) as unknown;
                firstPhoto = Array.isArray(photos)
                  ? asString((photos[0] as JsonRecord | undefined)?.url)
                  : "";
              }

              let roommates = "";
              if (membersResponse.ok) {
                const members = (await membersResponse.json()) as unknown;
                if (Array.isArray(members)) {
                  roommates = (members as JsonRecord[])
                    .map((m) => {
                      const firstName = asString(m.first_name).trim();
                      const lastName = asString(m.last_name).trim();
                      const fullName = `${firstName} ${lastName}`.trim();
                      return fullName || asString(m.name).trim() || "Colocataire";
                    })
                    .join(", ");
                }
              }

              return {
                ...mappedColoc,
                photos: firstPhoto ? [toUploadedAssetUrl(firstPhoto)] : [],
                roommates,
              };
            } catch {
              return mappedColoc;
            }
          }),
        );
        
        setColocs(colocsWithPhotos);
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
