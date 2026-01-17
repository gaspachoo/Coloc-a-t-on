import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_COLOCS } from "../../mock/colocs";
import { useEffect, useRef } from "react";

type MapViewProps = {
  onSelectColoc: (colocId: string) => void;
  selectedColocId: string | null;
};

function FlyToColoc({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const map = useMap();

  map.flyTo([lat, lng], Math.max(map.getZoom(), 15), {
    duration: 0.6,
  });

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
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],

  });
}

const MapView = ({ onSelectColoc, selectedColocId }: MapViewProps) => {
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const INITIAL_CENTER: [number, number] = [
    43.29782056537604,
    5.380969165551183,
  ];

  useEffect(() => {
  if (!selectedColocId) return;

  const marker = markerRefs.current[selectedColocId];
  if (!marker) return;

  setTimeout(() => {
    marker.openPopup();
  }, 0);
}, [selectedColocId]);

  return (
    <div className="map-view">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedColocId && (() => {
          const coloc = MOCK_COLOCS.find((c) => c.id === selectedColocId);
          if (!coloc) return null;
          return <FlyToColoc lat={coloc.lat} lng={coloc.lng} />;
        })()}

        {MOCK_COLOCS.map((c) => (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={createColocDivIcon(c.logoUrl, c.id === selectedColocId)}
            zIndexOffset={c.id === selectedColocId ? 1000 : 0}
            ref={(ref) => {
              markerRefs.current[c.id] = ref;
            }}
            eventHandlers={{
              click: (e) => {
                onSelectColoc(c.id);
                setTimeout(() => {
                  (e.target as L.Marker).openPopup();
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
