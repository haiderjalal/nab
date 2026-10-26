export type ServiceIconName = "scales" | "gavel" | "document" | "handshake";

export type SocialIconName = "linkedin" | "website";

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface SiteLocation {
  city: string;
  country: string;
  countryCode: string;
}

export interface Agency {
  name: string;
  url: string;
  tagline: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface AboutContent {
  heading: string;
  paragraphs: readonly string[];
  facts: readonly Fact[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: ServiceIconName;
  image?: ImageAsset;
}

export interface ProjectItem {
  name: string;
  summary: string;
  url: string;
  image: ImageAsset;
  tags: readonly string[];
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  summary?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
}

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
  icon: SocialIconName;
}

// Headings and short paragraphs for the sections, so no visible section copy is hardcoded in components.
export interface SectionCopy {
  services: { heading: string };
  work: { heading: string; intro: string; emptyMessage: string };
  experience: { heading: string; educationHeading: string };
  contact: { heading: string; paragraph: string };
}

export interface Profile {
  name: string;
  headline: string;
  description: string;
  intro: string;
  roles: readonly string[];
  location: SiteLocation;
  agency: Agency;
  portrait: ImageAsset;
  about: AboutContent;
  tickerItems: readonly string[];
  services: readonly ServiceItem[];
  projects: readonly ProjectItem[];
  experience: readonly ExperienceItem[];
  education: readonly EducationItem[];
  socials: readonly SocialLink[];
  sections: SectionCopy;
}
