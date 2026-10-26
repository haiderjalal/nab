import type { ReactElement } from "react";

import { Reveal } from "@/components/ui/Reveal";
import type { ProjectItem, SectionCopy } from "@/types/profile";

import { ProjectCard } from "./ProjectCard";

interface WorkProps {
  projects: readonly ProjectItem[];
  copy: SectionCopy["work"];
}

// The two-column grid needs an even number of single cells. The first card always spans the full row,
// and the last one does too when the count is even, so the grid has no gaps for any number of projects.
function spansFullRow(index: number, count: number): boolean {
  return index === 0 || (index === count - 1 && count % 2 === 0);
}

export function Work({ projects, copy }: WorkProps): ReactElement {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="mx-auto max-w-7xl px-6 py-28 md:py-36"
    >
      <Reveal>
        <h2
          id="work-heading"
          className="text-4xl font-semibold tracking-[-0.035em] md:text-5xl"
        >
          {copy.heading}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">{copy.intro}</p>
      </Reveal>

      {projects.length > 0 ? (
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => {
            const fullRow = spansFullRow(index, projects.length);

            return (
              <Reveal
                key={project.name}
                delay={index * 0.05}
                className={fullRow ? "md:col-span-2" : "h-full"}
              >
                <ProjectCard project={project} featured={fullRow} />
              </Reveal>
            );
          })}
        </div>
      ) : (
        <p className="mt-14 text-lg text-muted">{copy.emptyMessage}</p>
      )}
    </section>
  );
}
