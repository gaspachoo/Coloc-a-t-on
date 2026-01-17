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
  rent: number;     
  area: number;     
  rooms: number;     
  ateuf: boolean;    
};

export const MOCK_COLOCS: Coloc[] = [
  {
    id: "la-flash",
    name: "La Flash",
    address: "31 Boulevard de la Libération",
    buzzerInfo: "En bas à droite de l'interphone — Sonnette : Merval",
    roommates: "Jean, Michel, Gilbert",
    logoUrl: "../../public/vite.svg",
    lat: 43.299745221592055, 
    lng: 5.386925472729479,
    rent: 520,
    area: 150,
    rooms: 5,
    ateuf: true,
  },
  {
    id: "les-rissons",
    name: "Les Rissons",
    address: "12 Rue des Rissons",
    buzzerInfo: "Sonnette : Coloc Rissons",
    roommates: "Alice, Bob",
    logoUrl: null,
    lat: 43.29821,
    lng: 5.37230,
    rent: 600,
    area: 90,
    rooms: 4,
    ateuf: false,
  },
  {
    id: "la-ratz",
    name: "La Ratz",
    address: "5 Avenue des Ratz",
    buzzerInfo: "Sonnette : La Ratz",
    roommates: "Chloé, David",
    logoUrl: colocLogoPlaceholder,
    lat: 43.30123,
    lng: 5.37520,
    rent: 400,
    area: 200,
    rooms: 8,
    ateuf: true,
  },
];


export const getColocById = (id: string): Coloc | null =>
  MOCK_COLOCS.find((c) => c.id === id) ?? null;
