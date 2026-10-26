"use client";

import type { ReactElement } from "react";

import { Pause, Play } from "@/components/ui/icons";
import { useMotionPause } from "@/hooks/useMotionPause";

// The one control for all looping motion (WCAG 2.2.2). The label stays fixed, and aria-pressed reports the paused state.
export function MotionToggle(): ReactElement {
  const { paused, togglePaused } = useMotionPause();

  return (
    <button
      type="button"
      onClick={togglePaused}
      aria-pressed={paused}
      aria-label="Pause background motion"
      title="Pause background motion"
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background"
    >
      {paused ? (
        <Play aria-hidden="true" size={16} weight="fill" />
      ) : (
        <Pause aria-hidden="true" size={16} weight="fill" />
      )}
    </button>
  );
}
