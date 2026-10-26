import { Fragment } from "react";
import type { CSSProperties, ReactElement } from "react";

import { Plus } from "@/components/ui/icons";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { contactCta, primaryCta } from "@/lib/site";
import type { Profile, ProjectItem } from "@/types/profile";

import { ProjectFan } from "./ProjectFan";
import type { FanItem } from "./ProjectFan";
import { RotatingRole } from "./RotatingRole";

// Each letter starts a little after the previous one, so the outline and fill cycle reads as a wave.
const LETTER_DELAY_S = 0.12;

interface HeroProps {
  profile: Profile;
}

function toFanItem(project: ProjectItem): FanItem {
  return {
    kind: "project",
    name: project.name,
    href: project.url,
    tags: project.tags,
    image: project.image,
  };
}

// The brand card sits in the middle of the fan, so the projects split evenly on either side.
function buildFanItems(profile: Profile): FanItem[] {
  const projects = profile.projects.map(toFanItem);
  const middle = Math.floor(projects.length / 2);
  const brand: FanItem = {
    kind: "brand",
    name: profile.agency.name,
    href: profile.agency.url,
    tagline: profile.agency.tagline,
  };
  return [...projects.slice(0, middle), brand, ...projects.slice(middle)];
}

// Sets the start time of a CSS entrance, so the hero content rises in sequence without any JavaScript.
function riseStyle(delaySeconds: number): CSSProperties {
  return { "--rise-delay": `${delaySeconds}s` } as CSSProperties;
}

function renderWord(word: string, firstLetterIndex: number): ReactElement {
  return (
    <span className="inline-flex">
      {Array.from(word).map((letter, index) => (
        <span
          key={index}
          className="outline-letter inline-block"
          style={{ animationDelay: `${(firstLetterIndex + index) * LETTER_DELAY_S}s` }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

export function Hero({ profile }: HeroProps): ReactElement {
  const words = profile.name.split(" ");
  const wordOffsets = words.map(
    (_, index) => words.slice(0, index).join("").length,
  );

  return (
    <section className="fan-stage relative isolate flex min-h-[100dvh] flex-col overflow-hidden pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_30%,var(--glow),transparent)]"
      />
      <div
        aria-hidden="true"
        className="dot-grid dot-fade pointer-events-none absolute inset-0 opacity-70"
      />
      <Plus
        aria-hidden="true"
        size={18}
        weight="bold"
        className="absolute left-6 top-28 hidden text-foreground/40 md:left-10 md:block"
      />
      <Plus
        aria-hidden="true"
        size={18}
        weight="bold"
        className="absolute right-6 top-28 hidden text-foreground/40 md:right-10 md:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="rise flex items-center justify-between gap-6" style={riseStyle(0)}>
          <RotatingRole roles={profile.roles} />
          <p className="font-mono text-sm text-muted">
            {profile.location.city}, {profile.location.country}
          </p>
        </div>

        <h1
          className="rise mt-10 text-center font-display text-[clamp(2.25rem,7vw,6rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] text-foreground"
          style={riseStyle(0.1)}
        >
          <span className="sr-only">{profile.name}</span>
          <span
            aria-hidden="true"
            className="inline-flex flex-wrap items-center justify-center gap-[0.14em]"
          >
            {words.map((word, index) => (
              <Fragment key={`${index}-${word}`}>
                {index === 1 ? (
                  <span className="hero-bar h-[0.9em] w-[0.14em] shrink-0 bg-accent" />
                ) : null}
                {renderWord(word, wordOffsets[index] ?? 0)}
              </Fragment>
            ))}
          </span>
        </h1>

        <div className="mt-8 flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <p
            className="rise max-w-sm text-base leading-relaxed text-muted md:max-w-[17rem] md:text-lg lg:max-w-sm"
            style={riseStyle(0.2)}
          >
            {profile.intro}
          </p>
          <div
            className="rise flex flex-wrap justify-center gap-3"
            style={riseStyle(0.3)}
          >
            <MagneticLink href={primaryCta.href} variant="primary">
              {primaryCta.label}
            </MagneticLink>
            <MagneticLink href={contactCta.href} variant="secondary">
              {contactCta.label}
            </MagneticLink>
          </div>
        </div>
      </div>

      <p className="sr-only">{profile.description}</p>
      <ProjectFan items={buildFanItems(profile)} />
    </section>
  );
}
