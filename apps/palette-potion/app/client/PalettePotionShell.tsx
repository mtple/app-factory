"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { sendMiniAppReady } from "./ready";

export type ReadyStatus = "pending" | "ok" | "error";

const PalettePotionContext = createContext<{ readyStatus: ReadyStatus }>({ readyStatus: "pending" });

export function usePalettePotion() {
  return useContext(PalettePotionContext);
}

export function PalettePotionShell({ children }: { children: ReactNode }) {
  const [readyStatus, setReadyStatus] = useState<ReadyStatus>("pending");
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    sendMiniAppReady()
      .then(() => setReadyStatus("ok"))
      .catch(() => setReadyStatus("error"));
  }, []);

  return <PalettePotionContext.Provider value={{ readyStatus }}>{children}</PalettePotionContext.Provider>;
}
