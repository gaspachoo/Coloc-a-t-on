import React, { createContext, useContext, useMemo, useState } from "react";

type UiContextValue = {
  resetToken: number;
  triggerResetUI: () => void;
};

const UiContext = createContext<UiContextValue | null>(null);

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [resetToken, setResetToken] = useState(0);

  const value = useMemo(
    () => ({
      resetToken,
      triggerResetUI: () => setResetToken((t) => t + 1),
    }),
    [resetToken]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUi = () => {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
};
