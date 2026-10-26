"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { MotionToggle } from "@/components/layout/MotionToggle";
import { List, Waveform, X } from "@/components/ui/icons";
import { profile } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { contactCta, navigationLinks } from "@/lib/site";

const SECTION_IDS = navigationLinks.map((link) => link.href.slice(1));
const MENU_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Fixed header. The glass backdrop fades in once the hero scrolls away, and a thin line tracks reading progress.
// The current section is underlined, and phones get a menu for the section links. Scroll effects run on motion
// values, so scrolling never re-renders React.
export function Navbar(): ReactElement {
  const { scrollY, scrollYProgress } = useScroll();
  const backdropOpacity = useTransform(scrollY, [0, 96], [0, 1]);
  const activeId = useActiveSection(SECTION_IDS);
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        aria-hidden="true"
        className="glass absolute inset-0 border-b border-border"
        style={{ opacity: backdropOpacity }}
      />

      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <Waveform aria-hidden="true" size={22} weight="bold" className="shrink-0 text-accent" />
          <span className="truncate">{profile.name}</span>
        </Link>

        <div className="flex shrink-0 items-center gap-3 md:gap-7">
          <ul className="hidden items-center gap-7 md:flex">
            {navigationLinks.map((link) => {
              const isActive = link.href === `#${activeId}`;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative text-sm transition-colors duration-300 hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-accent after:content-[''] after:transition-transform after:duration-500 ${
                      isActive
                        ? "text-foreground after:scale-x-100"
                        : "text-muted after:origin-left after:scale-x-0"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <MotionToggle />

          <Link
            href={contactCta.href}
            className="whitespace-nowrap rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            {contactCta.label}
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "mobile-menu" : undefined}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background md:hidden"
          >
            {menuOpen ? (
              <X aria-hidden="true" size={18} weight="bold" />
            ) : (
              <List aria-hidden="true" size={18} weight="bold" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            className="absolute inset-x-0 top-16 border-b border-border bg-background shadow-[0_24px_40px_-28px_rgb(0_0_0/0.4)] md:hidden"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: MENU_EASE }}
          >
            <ul className="mx-auto flex max-w-7xl flex-col px-6 py-3">
              {navigationLinks.map((link) => (
                <li key={link.href} className="border-b border-border last:border-b-0">
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-2xl font-bold uppercase tracking-tight transition-colors duration-300 hover:text-accent-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
