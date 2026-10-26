import type { ReactElement } from "react";

import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Ticker } from "@/components/sections/Ticker";
import { Work } from "@/components/sections/Work";
import { profile } from "@/data/profile";

export default function HomePage(): ReactElement {
  const hasCareerHistory =
    profile.experience.length > 0 || profile.education.length > 0;

  return (
    <>
      <Hero profile={profile} />
      <Ticker items={profile.tickerItems} />
      <About about={profile.about} portrait={profile.portrait} />
      <Services items={profile.services} copy={profile.sections.services} />
      <Work projects={profile.projects} copy={profile.sections.work} />
      {hasCareerHistory ? (
        <Experience
          experience={profile.experience}
          education={profile.education}
          copy={profile.sections.experience}
        />
      ) : null}
      <Contact socials={profile.socials} copy={profile.sections.contact} />
    </>
  );
}
