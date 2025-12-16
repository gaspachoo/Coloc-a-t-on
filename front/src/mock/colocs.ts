import colocLogoPlaceholder from "../assets/react.svg"; // à remplacer plus tard par ton vrai logo

export type Coloc = {
  id: string;
  name: string;
  address: string;
  buzzerInfo: string;
  roommates: string;
  logoUrl: string;
};

export const MOCK_COLOCS: Coloc[] = [
  {
    id: "la-flash",
    name: "La Flash",
    address: "31 boulevard de la libération",
    buzzerInfo: "En bas à droite de l'interphone — Sonnette : Merval",
    roommates: "Jean, Michel, Gilbert",
    logoUrl: colocLogoPlaceholder,
  },
  {
    id: "les-rissons",
    name: "Les Rissons",
    address: "12 rue des Rissons",
    buzzerInfo: "Sonnette : Coloc Rissons",
    roommates: "Alice, Bob",
    logoUrl: colocLogoPlaceholder,
  },
  {
    id: "la-ratz",
    name: "La Ratz",
    address: "5 avenue des Ratz",
    buzzerInfo: "Sonnette : La Ratz",
    roommates: "Chloé, David",
    logoUrl: colocLogoPlaceholder,
  },
];

export const getColocById = (id: string): Coloc | null =>
  MOCK_COLOCS.find((c) => c.id === id) ?? null;
