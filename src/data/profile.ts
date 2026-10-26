import type { Profile } from "@/types/profile";

// Single source of truth for visible copy. Edit content here, not inside components.
// Sources: her LinkedIn profile (exported as a PDF, which has no photo, publications, or contact details that
// are approved for publishing) and the owner's brief (a law practice). Items marked TODO need the owner's
// approved wording or a source that can be checked before launch. Her personal email and phone stay out.
const LINKEDIN_URL = "https://www.linkedin.com/in/nayabanjumbabar/";

export const profile: Profile = {
  name: "Nayab Anjum Babar",
  headline: "Advocate",
  description:
    "Practicing Advocate in Islamabad, Pakistan, with interests in legal research, drafting, litigation support, and client advisory.",
  intro:
    "A practicing Advocate in Islamabad, focused on legal research, drafting, and client representation.",
  roles: [
    "Advocate",
    "Legal Research & Drafting",
    "Litigation Support",
    "Client Advisory",
  ],
  location: { city: "Islamabad", country: "Pakistan", countryCode: "PK" },
  agency: {
    // Brand card in the hero fan. Her current firm is not listed in the profile, so the card shows her name.
    name: "Nayab Anjum Babar",
    url: LINKEDIN_URL,
    tagline: "Legal research, drafting, and client advisory.",
  },
  portrait: {
    // Placeholder silhouette. Replace with an approved professional portrait, at least 1200px tall.
    src: "/images/portrait-placeholder.png",
    alt: "TODO: alt text describing the approved portrait",
  },
  about: {
    heading: "Building a career in law.",
    paragraphs: [
      "I am a practicing Advocate in Islamabad, Pakistan. I want to build a legal career grounded in professionalism, integrity, research, and effective client representation.",
      "Having recently completed my legal education and moved into practice, I am building hands-on experience in legal research, drafting, case preparation, client communication, and the practical application of law.",
      "What interests me most is the combination of analytical thinking and real-world problem-solving. Every matter requires understanding the law, and also the circumstances, objectives, and challenges of the people involved.",
    ],
    facts: [
      { label: "Based in", value: "Islamabad, Pakistan" },
      {
        label: "Focus areas",
        value: "Legal research, drafting, litigation support, client advisory",
      },
      { label: "Admitted to", value: "TODO: courts and bar admission" },
      { label: "Languages", value: "TODO" },
    ],
  },
  tickerItems: [
    "Legal research",
    "Legal drafting",
    "Litigation support",
    "Client advisory",
    "Dispute resolution",
  ],
  services: [
    {
      title: "Legal research",
      description:
        "Research and case analysis to support matters in litigation.",
      icon: "scales",
    },
    {
      title: "Litigation support",
      description:
        "Case preparation for civil and criminal matters, with exposure to court proceedings.",
      icon: "gavel",
    },
    {
      title: "Drafting and documentation",
      description: "Legal documents, pleadings, and case briefs.",
      icon: "document",
    },
    {
      title: "Client advisory",
      description:
        "Client consultation and advisory, focused on each person's circumstances and objectives.",
      icon: "handshake",
    },
  ],
  // Publications, speaking, or awards, each with an image, a link, and tags. Case details only with written
  // client consent, and only where her regulator allows them. Empty until the owner supplies items.
  projects: [],
  // Career and appointments, newest first. Leave empty to hide the section.
  experience: [
    {
      role: "Summer Legal Intern",
      organization: "HSU Advocates Law Firm",
      period: "Jul 2025 - Aug 2025",
      summary:
        "Legal research, case law analysis, and drafting under senior criminal and civil practitioners, with court proceedings observed.",
    },
  ],
  // Degrees, bar admissions with years, and certifications. Leave empty to hide the section.
  education: [
    {
      school: "University of Malakand",
      degree: "Bachelor of Laws (LLB)",
      period: "2021 - 2026",
    },
  ],
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
        "Always open to meaningful professional conversations, collaborations, and opportunities to learn.",
    },
  },
};
