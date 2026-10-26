import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

// Single-page site. lastModified is omitted on purpose: a build-time Date would conflict with Cache Components.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
