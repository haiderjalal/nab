import type { ReactElement } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight, Globe, LinkedinLogo, type Icon } from "@/components/ui/icons";
import type { SectionCopy, SocialIconName, SocialLink } from "@/types/profile";

const socialIcons: Record<SocialIconName, Icon> = {
  linkedin: LinkedinLogo,
  website: Globe,
};

interface ContactProps {
  socials: readonly SocialLink[];
  copy: SectionCopy["contact"];
}

export function Contact({ socials, copy }: ContactProps): ReactElement {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-7xl px-6 pb-28 md:pb-36"
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-[20px] bg-foreground p-8 text-background md:p-14">
          <div
            aria-hidden="true"
            className="aurora pointer-events-none absolute -right-28 -top-28 size-[28rem] rounded-full bg-[radial-gradient(closest-side,var(--accent),transparent)] opacity-40"
          />

          <h2
            id="contact-heading"
            className="relative max-w-3xl text-4xl font-semibold tracking-[-0.035em] md:text-6xl"
          >
            {copy.heading}
          </h2>
          <p className="relative mt-6 max-w-2xl text-lg text-background/75">{copy.paragraph}</p>

          <ul className="relative mt-12 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {socials.map((social) => {
              const SocialIcon = socialIcons[social.icon];

              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full min-h-36 flex-col justify-between gap-8 rounded-[20px] border border-background/20 bg-background/5 p-4 transition-colors duration-300 hover:border-accent md:min-h-44 md:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <SocialIcon
                        aria-hidden="true"
                        size={30}
                        weight="duotone"
                        className="text-accent"
                      />
                      <ArrowUpRight
                        aria-hidden="true"
                        size={20}
                        className="shrink-0 text-background/70 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{social.label}</span>
                      <span className="break-all text-sm text-background/70">{social.handle}</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
