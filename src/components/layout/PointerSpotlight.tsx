"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ReactElement } from "react";
import { useEffect } from "react";

const SPOTLIGHT_SIZE = 640;

// A soft light that follows the cursor across the page. Only shown for fine pointers, and never for reduced motion.
export function PointerSpotlight(): ReactElement | null {
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(-SPOTLIGHT_SIZE);
  const pointerY = useMotionValue(-SPOTLIGHT_SIZE);
  const x = useSpring(pointerX, { stiffness: 120, damping: 26, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 120, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;

    function handlePointerMove(event: PointerEvent): void {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reduce, pointerX, pointerY]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 rounded-full"
      style={{
        x,
        y,
        width: SPOTLIGHT_SIZE,
        height: SPOTLIGHT_SIZE,
        marginLeft: -SPOTLIGHT_SIZE / 2,
        marginTop: -SPOTLIGHT_SIZE / 2,
        background: "radial-gradient(closest-side, var(--spotlight), transparent)",
      }}
    />
  );
}
