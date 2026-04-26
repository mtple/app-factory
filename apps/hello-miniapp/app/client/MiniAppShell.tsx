"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { sendMiniAppReady } from "./ready";

type MiniAppShellProps = {
  children: ReactNode;
};

export function MiniAppShell({ children }: MiniAppShellProps) {
  const readySentRef = useRef(false);

  useEffect(() => {
    if (readySentRef.current) {
      return;
    }

    readySentRef.current = true;
    void sendMiniAppReady().catch(() => {
      readySentRef.current = false;
    });
  }, []);

  return <>{children}</>;
}
