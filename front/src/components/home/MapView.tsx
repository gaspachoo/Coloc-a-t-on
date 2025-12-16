import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_COLOCS } from "../../mock/colocs";

type MapViewProps = {
  onSelectColoc: (colocId: string) => void;
  selectedColocId: string | null;
};

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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


const MapView = ({ onSelectColoc, selectedColocId }: MapViewProps) => {
  // centre par défaut (à ajuster)
  const INITIAL_CENTER: [number, number] = [
    43.29782056537604,
    5.380969165551183,
  ];


  return (
    <div className="map-view">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedColocId && (() => {
          const coloc = MOCK_COLOCS.find(c => c.id === selectedColocId);
          if (!coloc) return null;

          return <FlyToColoc lat={coloc.lat} lng={coloc.lng} />;
        })()}

        {MOCK_COLOCS.map((c) => (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={defaultIcon}
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

      {/* Bonus : si tu veux recentrer automatiquement quand on clique,
          on pourra brancher FlyTo via un state "selectedColoc" dans HomePage.
          (Je te donne ça juste après si tu veux.) */}
    </div>
  );
};

export default MapView;
