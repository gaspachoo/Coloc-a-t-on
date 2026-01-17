import { useEffect, useMemo } from "react";
import TopSearchBar from "../components/home/TopSearchBar";
import MapView from "../components/home/MapView";
import ColocPreviewBar from "../components/home/ColocPreviewBar";
import { MOCK_COLOCS, getColocById } from "../mock/colocs";
import type { Coloc } from "../mock/colocs";
import { useUi } from "../context/uiContext";
import { applyFilters } from "../utils/applyFilters";

const HomePage = () => {
  const { selectedColocId, setSelectedColocId, filters } = useUi();

  const filteredColocs = useMemo(() => {
    return applyFilters(MOCK_COLOCS, filters);
  }, [filters]);

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
    ? getColocById(selectedColocId)
    : null;

  return (
    <div className="home-main">
      <MapView
        colocs={filteredColocs}                
        onSelectColoc={setSelectedColocId}
        selectedColocId={selectedColocId}
      />

      <TopSearchBar />

      {selectedColoc && <ColocPreviewBar coloc={selectedColoc} />}
    </div>
  );
};

export default HomePage;
