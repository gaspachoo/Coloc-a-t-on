import type { Coloc } from "../mock/colocs";
import type { Filters } from "../types/filters";

export function applyFilters(colocs: Coloc[], f: Filters): Coloc[] {
  const q = f.query.trim().toLowerCase();

  return colocs.filter((c) => {
    // Recherche texte
    if (q) {
      const hay = (f.searchField === "name" ? c.name : c.address).toLowerCase();
      if (!hay.includes(q)) return false;
    }

    // Prix
    if (f.priceMin !== null && c.rent < f.priceMin) return false;
    if (f.priceMax !== null && c.rent > f.priceMax) return false;

    // Surface
    if (f.areaMin !== null && c.area < f.areaMin) return false;
    if (f.areaMax !== null && c.area > f.areaMax) return false;

    // Chambres (min)
    // Chambres (exact multi + option 6+)
    if (f.rooms.length > 0 || f.rooms6Plus) {
        const matchExact = f.rooms.length > 0 && f.rooms.includes(c.rooms);
        const match6Plus = f.rooms6Plus && c.rooms >= 6;
        if (!matchExact && !match6Plus) return false;
    }


    // Ateuf
    if (f.ateufOnly && !c.ateuf) return false;

    return true;
  });
}
