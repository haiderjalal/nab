"use client";

import Link from "next/link";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactElement, ReactNode } from "react";
import { useRef } from "react";

const PULL_STRENGTH = 0.25;

const variantClasses = {
  primary: "bg-accent text-accent-contrast hover:brightness-110",
  secondary: "border border-border text-foreground hover:bg-surface",
} as const;

interface MagneticLinkProps {
  href: string;
  children: ReactNode;
  variant: keyof typeof variantClasses;
}

// A call-to-action that leans toward the pointer. Motion values keep the pull off React's render path.
export function MagneticLink({ href, children, variant }: MagneticLinkProps): ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 300, damping: 22, mass: 0.5 });
  const y = useSpring(0, { stiffness: 300, damping: 22, mass: 0.5 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    const element = wrapperRef.current;
    if (reduce || event.pointerType !== "mouse" || !element) return;

    const rect = element.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * PULL_STRENGTH);
    y.set((event.clientY - (rect.top + rect.height / 2)) * PULL_STRENGTH);
  }

  function resetPosition(): void {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={wrapperRef}
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
    >
      <Link
        href={href}
        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition duration-300 active:scale-[0.98] ${variantClasses[variant]}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
