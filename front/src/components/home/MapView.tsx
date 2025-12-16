type MapViewProps = {
  onSelectColoc: (colocId: string) => void;
};

const MapView = ({ onSelectColoc }: MapViewProps) => {
  return (
    <div className="map-view">
      {/* Ici il y aura la vraie carte OpenStreetMap plus tard */}
      <div>
        <p>🗺️ Carte (mock)</p>
        <button type="button" onClick={() => onSelectColoc("la-flash")}>
          Simuler un clic sur &quot;La Flash&quot;
        </button>
      </div>
    </div>
  );
};

export default MapView;
