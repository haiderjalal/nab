import type { ReactElement } from "react";

import { Sparkle } from "@/components/ui/icons";

interface TickerProps {
  items: readonly string[];
}

// The only marquee on the page. It stops with the site-wide motion control (see MotionToggle). The list is
// repeated so the loop restarts without a visible seam.
export function Ticker({ items }: TickerProps): ReactElement {
  return (
    <div className="bg-foreground py-6">
      <div className="edge-fade overflow-hidden">
        <div className="marquee-track flex w-max">
          <TickerGroup items={items} />
          <TickerGroup items={items} duplicate />
        </div>
      </div>
    </div>
  );
}

interface TickerGroupProps {
  items: readonly string[];
  duplicate?: boolean;
}

function TickerGroup({ items, duplicate = false }: TickerGroupProps): ReactElement {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={`flex shrink-0 ${duplicate ? "marquee-duplicate" : ""}`}
    >
      {items.map((item) => (
        <li key={item} className="flex shrink-0 items-center gap-10 pr-10">
          <span className="font-display text-2xl font-bold uppercase tracking-tight text-background md:text-3xl">
            {item}
          </span>
          <Sparkle aria-hidden="true" size={22} weight="fill" className="shrink-0 text-accent" />
        </li>
      ))}
    </ul>
  );
}
