import Link from "next/link";
import type { ReactElement } from "react";

import { profile } from "@/data/profile";
import { navigationLinks } from "@/lib/site";

export function Footer(): ReactElement {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            {profile.headline}, based in {profile.location.city}, {profile.location.country}.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {navigationLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors duration-300 hover:text-foreground">
              {link.label}
            </Link>
          ))}
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-foreground"
            >
              {social.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
