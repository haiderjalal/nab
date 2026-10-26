import Image from "next/image";
import type { ReactElement } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { FileText, Gavel, Handshake, Scales, type Icon } from "@/components/ui/icons";
import type { SectionCopy, ServiceIconName, ServiceItem } from "@/types/profile";

const serviceIcons: Record<ServiceIconName, Icon> = {
  scales: Scales,
  gavel: Gavel,
  document: FileText,
  handshake: Handshake,
};

interface CardVariant {
  span: string;
  surface: string;
  title: string;
  body: string;
  icon: string;
}

// Black, white, and red cards keep the grid in the same palette as the hero.
const cardVariants: Record<ServiceIconName, CardVariant> = {
  scales: {
    span: "md:col-span-2",
    surface: "bg-foreground",
    title: "text-background",
    body: "text-background/75",
    icon: "text-accent",
  },
  gavel: {
    span: "",
    surface: "dot-grid bg-surface",
    title: "text-foreground",
    body: "text-muted",
    icon: "text-accent-text",
  },
  document: {
    span: "",
    surface: "bg-accent",
    title: "text-accent-contrast",
    body: "text-accent-contrast",
    icon: "text-accent-contrast",
  },
  handshake: {
    span: "md:col-span-2",
    surface: "bg-surface md:grid md:grid-cols-2 md:gap-8",
    title: "text-foreground",
    body: "text-muted",
    icon: "text-accent-text",
  },
};

interface ServicesProps {
  items: readonly ServiceItem[];
  copy: SectionCopy["services"];
}

export function Services({ items, copy }: ServicesProps): ReactElement {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto max-w-7xl px-6 py-28 md:py-36"
    >
      <Reveal>
        <h2
          id="services-heading"
          className="text-4xl font-semibold tracking-[-0.035em] md:text-5xl"
        >
          {copy.heading}
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {items.map((service, index) => {
          const ServiceIcon = serviceIcons[service.icon];
          const variant = cardVariants[service.icon];

          return (
            <Reveal
              key={service.title}
              delay={index * 0.06}
              className={`h-full ${variant.span}`}
            >
              <article
                className={`flex h-full flex-col justify-between gap-10 rounded-[20px] border border-border p-7 transition-[transform,box-shadow] duration-500 hover:shadow-[0_28px_50px_-32px_rgb(0_0_0/0.45)] motion-safe:hover:-translate-y-1 md:min-h-72 md:p-8 ${variant.surface}`}
              >
                <div>
                  <ServiceIcon
                    aria-hidden="true"
                    size={32}
                    weight="duotone"
                    className={variant.icon}
                  />
                  <h3
                    className={`mt-6 text-2xl font-semibold tracking-tight ${variant.title}`}
                  >
                    {service.title}
                  </h3>
                  <p className={`mt-3 max-w-md leading-relaxed ${variant.body}`}>
                    {service.description}
                  </p>
                </div>

                {service.image ? (
                  <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[16px] border border-border md:mt-0 md:aspect-auto md:min-h-64">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                ) : null}
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
