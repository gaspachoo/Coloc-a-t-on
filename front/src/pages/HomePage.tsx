import { useState } from "react";
import TopSearchBar from "../components/home/TopSearchBar";
import MapView from "../components/home/MapView";
import ColocPreviewBar from "../components/home/ColocPreviewBar";
import { getColocById } from "../mock/colocs";
import type { Coloc } from "../mock/colocs";

const HomePage = () => {
  const [selectedColocId, setSelectedColocId] = useState<string | null>(null);

  const selectedColoc: Coloc | null = selectedColocId
    ? getColocById(selectedColocId)
    : null;

  return (
    <div className="home-main">
      <MapView onSelectColoc={setSelectedColocId} />
      <TopSearchBar />
      {selectedColoc && <ColocPreviewBar coloc={selectedColoc} />}
    </div>
  );
};

export default HomePage;
