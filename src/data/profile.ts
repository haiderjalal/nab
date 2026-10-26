import type { Profile } from "@/types/profile";

// Single source of truth for visible copy. Edit content here, not inside components.
// Built from the owner's brief (a law practice) and her LinkedIn URL. The LinkedIn page could not be read
// automatically, so every TODO needs the owner's approved wording or a source that can be checked before launch.
const LINKEDIN_URL = "https://www.linkedin.com/in/nayabanjumbabar/";

export const profile: Profile = {
  name: "Nayab Anjum Babar",
  headline: "TODO: professional title she confirms",
  description:
    "TODO: one or two sentences for the meta description and screen readers, from her approved summary.",
  intro: "TODO: hero paragraph from her approved summary.",
  roles: [
    "TODO: title or court she confirms",
    "TODO: second title she confirms",
    "TODO: third title she confirms",
  ],
  location: { city: "TODO", country: "TODO", countryCode: "TODO" },
  agency: {
    // Brand card in the hero fan. Replace the name with her firm or chambers if she has one.
    name: "Nayab Anjum Babar",
    url: LINKEDIN_URL,
    tagline: "TODO: firm or chambers tagline, if she has one.",
  },
  portrait: {
    // Placeholder silhouette. Replace with an approved professional portrait, at least 1200px tall.
    src: "/images/portrait-placeholder.png",
    alt: "TODO: alt text describing the approved portrait",
  },
  about: {
    heading: "TODO: About heading",
    paragraphs: ["TODO: first About paragraph from her approved bio."],
    facts: [
      { label: "Based in", value: "TODO" },
      { label: "Admitted to", value: "TODO: courts and bar admission years" },
      { label: "Languages", value: "TODO" },
      { label: "Focus areas", value: "TODO" },
    ],
  },
  tickerItems: [
    "TODO: practice area label 1",
    "TODO: practice area label 2",
    "TODO: practice area label 3",
    "TODO: practice area label 4",
  ],
  services: [
    {
      title: "TODO: practice area 1",
      description: "TODO: one or two sentences on this practice area.",
      icon: "scales",
    },
    {
      title: "TODO: practice area 2",
      description: "TODO: one or two sentences on this practice area.",
      icon: "gavel",
    },
    {
      title: "TODO: practice area 3",
      description: "TODO: one or two sentences on this practice area.",
      icon: "document",
    },
    {
      title: "TODO: practice area 4",
      description: "TODO: one or two sentences on this practice area.",
      icon: "handshake",
    },
  ],
  // Publications, speaking, or awards, each with an image, a link, and tags. Case details only with written
  // client consent, and only where her regulator allows them. Empty until the owner supplies items.
  projects: [],
  // Career and appointments, newest first. Leave empty to hide the section.
  experience: [],
  // Degrees, bar admissions with years, and certifications. Leave empty to hide the section.
  education: [],
  // Only professional profiles the owner approves. Personal email, phone, and address stay out until she approves them.
  socials: [
    {
      label: "LinkedIn",
      handle: "in/nayabanjumbabar",
      href: LINKEDIN_URL,
      icon: "linkedin",
    },
  ],
  sections: {
    services: { heading: "Practice areas" },
    work: {
      heading: "Publications and recognition",
      intro: "TODO: a line about these publications, talks, and awards.",
      emptyMessage: "Publications, talks, and awards will appear here.",
    },
    experience: { heading: "Experience", educationHeading: "Education" },
    contact: {
      heading: "Start a conversation",
      paragraph:
        "TODO: how to get in touch and what to expect, in the wording the owner approves.",
    },
  },
};
