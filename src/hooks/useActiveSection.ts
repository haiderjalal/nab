"use client";

import { useEffect, useState } from "react";

// Reports the section that crosses the middle band of the viewport. The band keeps the highlight
// stable while a section is only partly on screen, so the nav does not flicker during scrolling.
const ACTIVE_BAND = "-45% 0px -50% 0px";

export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          // Clear the highlight only when the section that owns it leaves the band.
          setActiveId((current) => {
            if (entry.isIntersecting) return id;
            return current === id ? null : current;
          });
        }
      },
      { rootMargin: ACTIVE_BAND },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
