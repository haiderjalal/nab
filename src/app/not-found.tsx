import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";

import { ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Page not found",
};

// Shown for unknown routes. It keeps the site's look and gives the visitor a way back to the home page.
export default function NotFound(): ReactElement {
  return (
    <section className="mx-auto flex min-h-[70dvh] max-w-7xl flex-col justify-center px-6 py-28">
      <p className="font-mono text-sm text-accent-text">Error 404</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.035em] md:text-6xl">
        This page could not be found.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        The link may be out of date. Head back to the home page to see the full profile.
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast transition duration-300 hover:brightness-110 active:scale-[0.98]"
        >
          Back to home
          <ArrowUpRight aria-hidden="true" size={16} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
