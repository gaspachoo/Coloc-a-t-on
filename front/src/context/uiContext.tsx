import React, { createContext, useContext, useMemo, useState } from "react";
import type { Filters } from "../types/filters";
import { DEFAULT_FILTERS } from "../types/filters";

type UiContextValue = {
  resetToken: number;
  triggerResetUI: () => void;

  selectedColocId: string | null;
  setSelectedColocId: (id: string | null) => void;

  filters: Filters;
  setFilters: (f: Filters) => void;

  favoriteIds: string[];
toggleFavorite: (id: string) => void;
isFavorite: (id: string) => boolean;
};

const UiContext = createContext<UiContextValue | null>(null);

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [resetToken, setResetToken] = useState(0);
  const [selectedColocId, setSelectedColocId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const triggerResetUI = () => {
    setResetToken((t) => t + 1);
    setSelectedColocId(null);
    setFilters(DEFAULT_FILTERS);
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);


  const value = useMemo(
  () => ({
    resetToken,
    triggerResetUI,
    selectedColocId,
    setSelectedColocId,
    filters,
    setFilters,
    favoriteIds,
    toggleFavorite,
    isFavorite,
  }),
  [resetToken, selectedColocId, filters, favoriteIds]
);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUi = () => {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
};
