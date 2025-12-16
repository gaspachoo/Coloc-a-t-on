import { useEffect, useState } from "react";
import { useUi } from "../context/uiContext";
import TopSearchBar from "../components/home/TopSearchBar";
import MapView from "../components/home/MapView";
import ColocPreviewBar from "../components/home/ColocPreviewBar";
import { getColocById } from "../mock/colocs";
import type { Coloc } from "../mock/colocs";

const HomePage = () => {
  const [selectedColocId, setSelectedColocId] = useState<string | null>(null);
  const { resetToken } = useUi();

    useEffect(() => {
    setSelectedColocId(null); // <-- closes the preview bar
  }, [resetToken]);

  const selectedColoc: Coloc | null = selectedColocId
    ? getColocById(selectedColocId)
    : null;

  return (
    <div className="home-main">
      <MapView
        onSelectColoc={setSelectedColocId}
        selectedColocId={selectedColocId}
      />

      <TopSearchBar />
      {selectedColoc && <ColocPreviewBar coloc={selectedColoc} />}
    </div>
  );
};

export default HomePage;
