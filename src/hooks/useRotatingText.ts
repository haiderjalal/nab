import { useEffect, useState } from "react";

// Cycles through items on an interval. Paused callers keep the first item, which suits reduced-motion users.
export function useRotatingText(
  items: readonly string[],
  intervalMs: number,
  paused: boolean,
): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || items.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [items.length, intervalMs, paused]);

  return items[index % items.length] ?? "";
}
