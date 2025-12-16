import React from "react";
import { useParams } from "react-router-dom";

const ColocDetailPage: React.FC = () => {
  const { colocId } = useParams();

  return (
    <main>
      <h1>Détails de la coloc</h1>
      <p>ID de la coloc : {colocId}</p>
    </main>
  );
};

export default ColocDetailPage;
