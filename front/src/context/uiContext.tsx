import React, { createContext, useContext, useMemo, useState } from "react";

type UiContextValue = {
  resetToken: number;
  triggerResetUI: () => void;

  selectedColocId: string | null;
  setSelectedColocId: (id: string | null) => void;
};

const UiContext = createContext<UiContextValue | null>(null);

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [resetToken, setResetToken] = useState(0);
  const [selectedColocId, setSelectedColocId] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      resetToken,
      triggerResetUI: () => {
        setResetToken((t) => t + 1);
        setSelectedColocId(null); 
      },
      selectedColocId,
      setSelectedColocId,
    }),
    [resetToken, selectedColocId]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUi = () => {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
};
