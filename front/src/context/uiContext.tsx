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
};

const UiContext = createContext<UiContextValue | null>(null);

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [resetToken, setResetToken] = useState(0);
  const [selectedColocId, setSelectedColocId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const triggerResetUI = () => {
    setResetToken((t) => t + 1);
    setSelectedColocId(null);
    setFilters(DEFAULT_FILTERS);
  };

  const value = useMemo(
    () => ({
      resetToken,
      triggerResetUI,
      selectedColocId,
      setSelectedColocId,
      filters,
      setFilters,
    }),
    [resetToken, selectedColocId, filters]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUi = () => {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
};
