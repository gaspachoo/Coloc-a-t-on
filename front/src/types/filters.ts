import type { Ambiance } from "./coloc";

export type SearchField = "name" | "address";

export type Filters = {
  priceMin: number | null;
  priceMax: number | null;
  areaMin: number | null;
  areaMax: number | null;
  rooms: number[];     // 1,2,3,4,5
  rooms6Plus: boolean; // 6+
  ambiances: Ambiance[];

  searchField: SearchField;
  query: string;
};

export const DEFAULT_FILTERS: Filters = {
  priceMin: null,
  priceMax: null,
  areaMin: null,
  areaMax: null,
  rooms: [],
  rooms6Plus: false,
  ambiances: [],

  searchField: "name",
  query: "",
};
