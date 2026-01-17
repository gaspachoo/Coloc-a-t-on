import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Coloc } from "../../mock/colocs";

type MapViewProps = {
  colocs: Coloc[];
  onSelectColoc: (colocId: string) => void;
  selectedColocId: string | null;
};

function FlyToColoc({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
  return null;
}

function createColocDivIcon(logoUrl?: string | null, isActive?: boolean) {
  const size = isActive ? 56 : 44;
  const activeClass = isActive ? " is-active" : "";
  const hasLogo = Boolean(logoUrl);

  const html = hasLogo
    ? `<div class="coloc-marker${activeClass}">
         <img src="${logoUrl}" alt="coloc logo" />
       </div>`
    : `<div class="coloc-marker${activeClass}">
         <div class="coloc-marker-fallback"></div>
       </div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // bas-centre
    popupAnchor: [0, -size],      // popup centré au-dessus
  });
}

const MapView = ({ colocs, onSelectColoc, selectedColocId }: MapViewProps) => {
  const INITIAL_CENTER: [number, number] = [
    43.29782056537604,
    5.380969165551183,
  ];

  // Registry des markers pour ouvrir un popup depuis la sidebar (favoris)
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  // Ouvre le popup quand la sélection change (ex: clic favori)
  useEffect(() => {
    if (!selectedColocId) return;

    const marker = markerRefs.current[selectedColocId];
    if (!marker) return;

    setTimeout(() => {
      marker.openPopup();
    }, 0);
  }, [selectedColocId]);

  const selectedColoc =
    selectedColocId ? colocs.find((c) => c.id === selectedColocId) : null;

  return (
    <div className="map-view">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={14.5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Recentrage auto sur coloc sélectionnée */}
        {selectedColoc && <FlyToColoc lat={selectedColoc.lat} lng={selectedColoc.lng} />}

        {/* Marqueurs filtrés */}
        {colocs.map((c) => (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={createColocDivIcon(c.logoUrl, c.id === selectedColocId)}
            zIndexOffset={c.id === selectedColocId ? 1000 : 0}
            ref={(ref) => {
              markerRefs.current[c.id] = ref;
            }}
            eventHandlers={{
              click: () => {
                onSelectColoc(c.id);
                // ouvre le popup même si l'icône se met à jour (actif)
                setTimeout(() => {
                  const marker = markerRefs.current[c.id];
                  marker?.openPopup();
                }, 0);
              },
            }}
          >
            <Popup>
              <strong>{c.name}</strong>
              <br />
              {c.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
