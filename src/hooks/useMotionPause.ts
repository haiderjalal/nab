import { createContext, useContext } from "react";

export interface MotionPauseState {
  paused: boolean;
  togglePaused: () => void;
}

export const MotionPauseContext = createContext<MotionPauseState | null>(null);

// One pause switch for every loop on the page. A single control stops the ticker, the hero, and the contact glow together.
export function useMotionPause(): MotionPauseState {
  const state = useContext(MotionPauseContext);
  if (!state) {
    throw new Error("useMotionPause must be used inside MotionPauseProvider.");
  }
  return state;
}
