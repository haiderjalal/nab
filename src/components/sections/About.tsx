import Image from "next/image";
import type { ReactElement } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import type { AboutContent, ImageAsset } from "@/types/profile";

interface AboutProps {
  about: AboutContent;
  portrait: ImageAsset;
}

export function About({ about, portrait }: AboutProps): ReactElement {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-28 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:py-36"
    >
      <Reveal>
        <div className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-[20px] bg-accent"
          />
          <TiltCard className="relative rounded-[20px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-border bg-surface">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                sizes="(min-width: 768px) 32vw, 90vw"
                className="object-cover object-top"
              />
            </div>
          </TiltCard>
        </div>
      </Reveal>

      <div>
        <Reveal>
          <h2
            id="about-heading"
            className="text-4xl font-semibold tracking-[-0.035em] md:text-5xl"
          >
            {about.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            {about.facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-[20px] border border-border bg-surface p-5"
              >
                <dt className="font-mono text-xs text-muted">{fact.label}</dt>
                <dd className="mt-2 font-medium text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
