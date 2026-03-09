export const AMBIANCE_VALUES = [
  "calme",
  "studieuse",
  "equilibree",
  "festive",
  "tres_festive",
] as const;

export type Ambiance = (typeof AMBIANCE_VALUES)[number];

export const AMBIANCE_LABELS: Record<Ambiance, string> = {
  calme: "Calme",
  studieuse: "Studieuse",
  equilibree: "Equilibree",
  festive: "Festive",
  tres_festive: "Tres festive",
};

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
  ambiance: Ambiance;
  description: string;
  photos: string[];
    
};