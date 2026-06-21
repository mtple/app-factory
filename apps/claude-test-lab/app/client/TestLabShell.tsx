"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { sendMiniAppReady } from "./ready";

export type ReadyStatus = "pending" | "ok" | "error";

const TestLabContext = createContext<{ readyStatus: ReadyStatus }>({ readyStatus: "pending" });

export function useTestLab() {
  return useContext(TestLabContext);
}

export function TestLabShell({ children }: { children: ReactNode }) {
  const [readyStatus, setReadyStatus] = useState<ReadyStatus>("pending");
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    sendMiniAppReady()
      .then(() => setReadyStatus("ok"))
      .catch(() => setReadyStatus("error"));
  }, []);

  return <TestLabContext.Provider value={{ readyStatus }}>{children}</TestLabContext.Provider>;
}
