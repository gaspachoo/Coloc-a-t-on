import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_COLOCS } from "../../mock/colocs";

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

function createColocDivIcon(logoUrl?: string | null) {
  const hasLogo = Boolean(logoUrl);

  const html = hasLogo
    ? `<div class="coloc-marker"><img src="${logoUrl}" alt="coloc logo" /></div>`
    : `<div class="coloc-marker"><div class="coloc-marker-fallback"></div></div>`;

  return L.divIcon({
    html,
    className: "", 
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [11, -8],
  });
}

const MapView = ({ onSelectColoc, selectedColocId }: MapViewProps) => {
  const INITIAL_CENTER: [number, number] = [
    43.29782056537604,
    5.380969165551183,
  ];

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
            icon={createColocDivIcon(c.logoUrl)}
            eventHandlers={{
              click: () => onSelectColoc(c.id),
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
