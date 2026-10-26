"use client";

import type { ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { MotionPauseContext, type MotionPauseState } from "@/hooks/useMotionPause";

interface MotionPauseProviderProps {
  children: ReactNode;
}

// Holds the page's pause switch. CSS loops read data-motion-paused on <html>, and script-driven loops read the context.
export function MotionPauseProvider({ children }: MotionPauseProviderProps): ReactElement {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.motionPaused = String(paused);
  }, [paused]);

  const togglePaused = useCallback((): void => {
    setPaused((current) => !current);
  }, []);

  const value = useMemo<MotionPauseState>(
    () => ({ paused, togglePaused }),
    [paused, togglePaused],
  );

  return <MotionPauseContext value={value}>{children}</MotionPauseContext>;
}
