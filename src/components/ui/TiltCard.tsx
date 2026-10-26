"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent, ReactElement, ReactNode } from "react";

const MAX_TILT_DEGREES = 7;

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

// Tilts toward the pointer and shows a soft glare. Pointer position lives in motion values,
// so moving the mouse never re-renders React. Touch input and reduced motion stay flat.
export function TiltCard({ children, className = "" }: TiltCardProps): ReactElement {
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, { stiffness: 160, damping: 20, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 160, damping: 20, mass: 0.6 });

  const rotateY = useTransform(smoothX, [0, 1], [-MAX_TILT_DEGREES, MAX_TILT_DEGREES]);
  const rotateX = useTransform(smoothY, [0, 1], [MAX_TILT_DEGREES, -MAX_TILT_DEGREES]);
  const glareX = useTransform(smoothX, (value) => `${value * 100}%`);
  const glareY = useTransform(smoothY, (value) => `${value * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.16), transparent 55%)`;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    if (reduce || event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  }

  function resetTilt(): void {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }

  return (
    <motion.div
      className={`group relative ${className}`}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 1000,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glare }}
      />
    </motion.div>
  );
}
