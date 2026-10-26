"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactElement } from "react";

const RAIL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// The vertical line that connects timeline entries. It draws downward once the list enters the viewport.
// Reduced-motion users get the finished line straight away.
export function TimelineRail(): ReactElement {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-foreground/20"
      initial={reduce ? false : { scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.8, ease: RAIL_EASE }}
    />
  );
}
