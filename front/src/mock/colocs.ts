import colocLogoPlaceholder from "../assets/react.svg"; // à remplacer plus tard par ton vrai logo

export type Coloc = {
  id: string;
  name: string;
  address: string;
  buzzerInfo: string;
  roommates: string;
  logoUrl: string | null;
  lat: number;
  lng: number;
};

export const MOCK_COLOCS: Coloc[] = [
  {
    id: "la-flash",
    name: "La Flash",
    address: "31 boulevard de la libération",
    buzzerInfo: "En bas à droite de l'interphone — Sonnette : Merval",
    roommates: "Jean, Michel, Gilbert",
    logoUrl: colocLogoPlaceholder,
    lat: 43.299745221592055, 
    lng: 5.386925472729479
  },
  {
    id: "les-rissons",
    name: "Les Rissons",
    address: "12 rue des Rissons",
    buzzerInfo: "Sonnette : Coloc Rissons",
    roommates: "Alice, Bob",
    logoUrl: null,
    lat: 43.29821,
    lng: 5.37230,
  },
  {
    id: "la-ratz",
    name: "La Ratz",
    address: "5 avenue des Ratz",
    buzzerInfo: "Sonnette : La Ratz",
    roommates: "Chloé, David",
    logoUrl: colocLogoPlaceholder,
    lat: 43.30123,
    lng: 5.37520,
  },
];


export const getColocById = (id: string): Coloc | null =>
  MOCK_COLOCS.find((c) => c.id === id) ?? null;
