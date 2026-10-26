"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type {
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactElement,
} from "react";

import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Waveform,
} from "@/components/ui/icons";
import { useMotionPause } from "@/hooks/useMotionPause";

import type { ImageAsset } from "@/types/profile";

export interface ProjectFanItem {
  kind: "project";
  name: string;
  href: string;
  tags: readonly string[];
  image: ImageAsset;
}

export interface BrandFanItem {
  kind: "brand";
  name: string;
  href: string;
  tagline: string;
}

export type FanItem = ProjectFanItem | BrandFanItem;

// Degrees between neighbouring cards. The fan is symmetric around the centre card.
const STEP_DEG = 16;
// Idle sway in degrees. It stays small so the front card never changes while the fan drifts.
const SWAY_DEG = 2;
const SWAY_PERIOD_MS = 1600;
// How far the fan turns for each pixel of horizontal drag.
const DRAG_DEG_PER_PX = 0.12;
const DRAG_THRESHOLD_PX = 6;
const SNAP_SPRING = {
  type: "spring",
  stiffness: 180,
  damping: 26,
  mass: 0.9,
} as const;
const ENTRANCE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface FanCardProps {
  item: FanItem;
  baseAngle: number;
  rotation: MotionValue<number>;
  spread: MotionValue<number>;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}

// One card on the arc. Its pose comes from motion values, so moving the fan never re-renders React.
function FanCard({
  item,
  baseAngle,
  rotation,
  spread,
  onClick,
}: FanCardProps): ReactElement {
  const angle = useTransform(
    [spread, rotation],
    ([amount, turn]: number[]) => baseAngle * amount + turn,
  );
  const transform = useTransform(angle, (value) => {
    // Cards further from the front shrink a little, which deepens the arc.
    const shrink = 1 - 0.06 * (Math.min(Math.abs(value), 40) / 40);
    return `rotate(${value}deg) translateY(calc(var(--fan-radius) * -1)) scale(${shrink})`;
  });
  const zIndex = useTransform(angle, (value) => 100 - Math.round(Math.abs(value)));

  return (
    <motion.div
      className="pointer-events-auto absolute bottom-0 left-1/2"
      style={{
        width: "var(--fan-card-w)",
        height: "var(--fan-card-h)",
        marginLeft: "calc(var(--fan-card-w) / -2)",
        transformOrigin: "50% 100%",
        transform,
        zIndex,
      }}
    >
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        onClick={onClick}
        className="group relative block h-full w-full overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] transition-transform duration-500 hover:-translate-y-3"
      >
        {item.kind === "project" ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width: 768px) 232px, 170px"
            draggable={false}
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col justify-between bg-accent p-5 text-accent-contrast">
            <Waveform aria-hidden="true" size={30} weight="bold" />
            <p className="font-display text-3xl font-bold uppercase leading-none">
              {item.name}
            </p>
            <p className="text-sm leading-snug">{item.tagline}</p>
          </div>
        )}
      </a>
    </motion.div>
  );
}

interface ProjectFanProps {
  items: readonly FanItem[];
}

// A fan of project cards that pivots below the viewport. The cards sway while idle, turn with a drag or the arrow keys, and snap to the centre card.
export function ProjectFan({ items }: ProjectFanProps): ReactElement {
  const reduce = useReducedMotion();
  const { paused } = useMotionPause();
  // The idle sway runs inside an animation frame, so it reads the latest pause state through a ref.
  const pausedRef = useRef(paused);
  const centerIndex = Math.floor(items.length / 2);
  const lastIndex = items.length - 1;

  const offset = useMotionValue(0); // turn from drag, arrows, or snapping
  const sway = useMotionValue(0); // gentle idle motion
  const spread = useMotionValue(0); // 0 = stacked, 1 = fully fanned
  const rotation = useTransform([offset, sway], ([turn, drift]: number[]) => turn + drift);

  // Only the active index is React state. It changes once per card, not once per frame.
  const [activeIndex, setActiveIndex] = useState(centerIndex);
  const activeRef = useRef(centerIndex);
  // The card the fan is heading to. Arrow keys use it, so repeated presses keep moving forward.
  const targetRef = useRef(centerIndex);
  const dragRef = useRef<{ startX: number; startOffset: number } | null>(null);
  const movedRef = useRef(false);

  useMotionValueEvent(rotation, "change", (value) => {
    const next = clamp(Math.round(centerIndex - value / STEP_DEG), 0, lastIndex);
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActiveIndex(next);
    }
  });

  useEffect(() => {
    if (reduce) {
      spread.set(1);
      return;
    }
    const controls = animate(spread, 1, {
      duration: 1.6,
      ease: ENTRANCE_EASE,
    });
    return () => controls.stop();
  }, [reduce, spread]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useAnimationFrame((time) => {
    if (reduce || pausedRef.current) return;
    sway.set(Math.sin(time / SWAY_PERIOD_MS) * SWAY_DEG);
  });

  function goTo(index: number): void {
    const target = clamp(index, 0, lastIndex);
    targetRef.current = target;
    const turn = -(target - centerIndex) * STEP_DEG;
    if (reduce) {
      offset.set(turn);
      return;
    }
    animate(offset, turn, SNAP_SPRING);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
    movedRef.current = false;
    dragRef.current = { startX: event.clientX, startOffset: offset.get() };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    const drag = dragRef.current;
    if (!drag) return;

    const distance = event.clientX - drag.startX;
    if (!movedRef.current) {
      if (Math.abs(distance) < DRAG_THRESHOLD_PX) return;
      movedRef.current = true;
      // Capture only after a real drag, so a plain tap still reaches the card link.
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    offset.set(drag.startOffset + distance * DRAG_DEG_PER_PX);
  }

  function handlePointerEnd(): void {
    const dragged = movedRef.current;
    dragRef.current = null;
    if (dragged) {
      goTo(Math.round(centerIndex - offset.get() / STEP_DEG));
    }
    // A click can follow the pointer-up, so the drag flag is cleared only after the click has been handled.
    window.setTimeout(() => {
      movedRef.current = false;
    }, 0);
  }

  function handleCardClick(
    event: MouseEvent<HTMLAnchorElement>,
    index: number,
  ): void {
    if (movedRef.current) {
      event.preventDefault();
      return;
    }
    // A card that is not at the front turns to the front first. The next click opens it.
    if (index !== activeRef.current) {
      event.preventDefault();
      goTo(index);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    goTo(targetRef.current + (event.key === "ArrowRight" ? 1 : -1));
  }

  const active = items[activeIndex];
  const caption = active.kind === "project" ? active.tags.join(", ") : active.tagline;
  const linkLabel = active.kind === "project" ? "View project" : `Visit ${active.name}`;

  return (
    <>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="absolute inset-x-0 bottom-[-25vh] top-[46%] z-10 md:bottom-[-35vh] touch-pan-y select-none rounded-[20px] outline-none focus-visible:outline-2 focus-visible:outline-accent"
      >
        {items.map((item, index) => (
          <FanCard
            key={item.name}
            item={item}
            baseAngle={(index - centerIndex) * STEP_DEG}
            rotation={rotation}
            spread={spread}
            onClick={(event) => handleCardClick(event, index)}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous project"
        onClick={() => goTo(targetRef.current - 1)}
        className="absolute left-4 top-[54%] z-20 -translate-y-1/2 rounded-full md:top-[70%] border border-border bg-surface p-3 text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background md:left-8"
      >
        <CaretLeft aria-hidden="true" size={20} weight="bold" />
      </button>
      <button
        type="button"
        aria-label="Next project"
        onClick={() => goTo(targetRef.current + 1)}
        className="absolute right-4 top-[54%] z-20 -translate-y-1/2 rounded-full md:top-[70%] border border-border bg-surface p-3 text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background md:right-8"
      >
        <CaretRight aria-hidden="true" size={20} weight="bold" />
      </button>

      <div className="pointer-events-none absolute inset-x-0 top-[52%] z-20 flex flex-col items-center gap-3 px-6 text-center md:top-auto md:bottom-0 md:flex-row md:items-end md:justify-between md:gap-6 md:px-10 md:pb-8 md:text-left">
        {/* Keyed by card, so the caption rises in again each time the front card changes. */}
        <div
          key={activeIndex}
          className="rise min-w-0 md:rounded-[20px] md:border md:border-border md:bg-surface/85 md:px-5 md:py-4 md:backdrop-blur-md"
        >
          <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-2xl">
            {active.name}
          </p>
          <p className="mt-1 max-w-[15rem] font-mono text-xs text-muted">{caption}</p>
        </div>
        <a
          href={active.href}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-contrast"
        >
          {linkLabel}
          <ArrowUpRight aria-hidden="true" size={16} weight="bold" />
        </a>
      </div>
    </>
  );
}
