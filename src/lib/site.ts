const LOCAL_SITE_URL = "http://localhost:3000";

// Accepts a bare domain ("example.com"), a full address ("https://example.com/"), or localhost.
// Returns only the origin, so canonical and Open Graph URLs never end in a slash.
function resolveSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return LOCAL_SITE_URL;

  const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(value);
  const candidate = /^https?:\/\//i.test(value)
    ? value
    : `${isLocal ? "http" : "https"}://${value}`;

  try {
    const { hostname, origin } = new URL(candidate);
    if (hostname === "localhost" || hostname.includes(".")) return origin;
  } catch {
    // Not a parseable address. The error below explains what to set instead.
  }

  throw new Error(
    `NEXT_PUBLIC_SITE_URL must be the site address, for example https://example.com. Received "${value}".`,
  );
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export interface NavigationLink {
  label: string;
  href: string;
}

export interface CallToAction {
  label: string;
  href: string;
}

// Listed in page order, so the navbar reads the same way the page scrolls.
export const navigationLinks: readonly NavigationLink[] = [
  { label: "About", href: "#about" },
  { label: "Practice areas", href: "#services" },
  { label: "Publications", href: "#work" },
];

// One label per intent, reused across nav, hero and footer, so the same action always reads the same.
export const primaryCta: CallToAction = { label: "View practice areas", href: "#services" };
export const contactCta: CallToAction = { label: "Get in touch", href: "#contact" };
