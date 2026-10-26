"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactElement, ReactNode } from "react";

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Fades and tilts content into place as it enters the viewport.
// Reduced-motion users get the content immediately.
export function Reveal({ children, delay = 0, className }: RevealProps): ReactElement {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1200 }}
      initial={reduce ? false : { opacity: 0, y: 32, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: REVEAL_EASE }}
    >
      {children}
    </motion.div>
  );
}
