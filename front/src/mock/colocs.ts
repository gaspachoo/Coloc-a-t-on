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
  description: string;
  photos: string[];
    
};

export const MOCK_COLOCS: Coloc[] = [
  {
    id: "la-flash",
    name: "La Flash",
    address: "31 Boulevard de la Libération",
    buzzerInfo: "En bas à droite de l'interphone — Sonnette : Merval",
    roommates: "Jean, Michel, Gilbert",
    logoUrl: "/vite.svg",
    lat: 43.299745221592055, 
    lng: 5.386925472729479,
    rent: 520,
    area: 150,
    rooms: 5,
    ateuf: true,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    ],
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
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "la-ratz",
    name: "La Ratz",
    address: "5 Avenue des Ratz",
    buzzerInfo: "Sonnette : La Ratz",
    roommates: "Chloé Gervais, David Le Morse, Vincent Hiero Merval, Emmanuel 'Brigitte' Macron, Nathan de la Sainte Église, Timothée, Carole, Dominique",
    logoUrl: colocLogoPlaceholder,
    lat: 43.30123,
    lng: 5.37520,
    rent: 400,
    area: 200,
    rooms: 8,
    ateuf: true,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];


export const getColocById = (id: string): Coloc | null =>
  MOCK_COLOCS.find((c) => c.id === id) ?? null;
