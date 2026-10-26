"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactElement } from "react";

import { useMotionPause } from "@/hooks/useMotionPause";
import { useRotatingText } from "@/hooks/useRotatingText";

const ROLE_INTERVAL_MS = 2800;
const SWAP_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface RotatingRoleProps {
  roles: readonly string[];
}

// Cycles through the roles as a visual cue. The hero's screen-reader summary carries the full description.
export function RotatingRole({ roles }: RotatingRoleProps): ReactElement {
  const reduce = useReducedMotion();
  const { paused } = useMotionPause();
  const activeRole = useRotatingText(roles, ROLE_INTERVAL_MS, Boolean(reduce) || paused);

  return (
    <p aria-hidden="true" className="flex h-6 items-center font-mono text-sm text-accent-text">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={activeRole}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: SWAP_EASE }}
        >
          {activeRole}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
