import Image from "next/image";
import type { ReactElement } from "react";

import { ArrowUpRight } from "@/components/ui/icons";
import { TiltCard } from "@/components/ui/TiltCard";
import type { ProjectItem } from "@/types/profile";

interface ProjectCardProps {
  project: ProjectItem;
  featured?: boolean;
}

// Links out to the live site. The featured card spans both columns with a wider screenshot.
export function ProjectCard({ project, featured = false }: ProjectCardProps): ReactElement {
  return (
    <TiltCard className="h-full rounded-[20px]">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-surface transition-colors duration-300 hover:border-accent"
      >
        <div
          className={`relative w-full overflow-hidden ${featured ? "aspect-[21/9]" : "aspect-[16/10]"}`}
        >
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes={featured ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight">{project.name}</h3>
            <ArrowUpRight
              aria-hidden="true"
              size={20}
              className="mt-1 shrink-0 text-muted transition-colors duration-300 group-hover:text-accent-text"
            />
          </div>
          <p className="leading-relaxed text-muted">{project.summary}</p>
          <ul className="mt-auto flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </a>
    </TiltCard>
  );
}
