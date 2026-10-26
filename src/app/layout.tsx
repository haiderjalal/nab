import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import type { ReactElement } from "react";

import { Footer } from "@/components/layout/Footer";
import { MotionPauseProvider } from "@/components/layout/MotionPauseProvider";
import { Navbar } from "@/components/layout/Navbar";
import { PointerSpotlight } from "@/components/layout/PointerSpotlight";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const pageTitle = `${profile.name} | ${profile.headline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    template: `%s | ${profile.name}`,
  },
  description: profile.description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title: pageTitle,
    description: profile.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: profile.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
    { media: "(prefers-color-scheme: light)", color: "#e7e7e4" },
  ],
};

// Structured data for search engines and AI systems. "<" is escaped so the JSON cannot close the script tag early.
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  description: profile.description,
  jobTitle: profile.roles,
  // Website entries describe a site or business rather than the person, so they stay out of sameAs.
  sameAs: profile.socials
    .filter((social) => social.icon !== "website")
    .map((social) => social.href),
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.location.city,
    addressCountry: profile.location.countryCode,
  },
}).replace(/</g, "\\u003c");

export default function RootLayout({
  children,
}: LayoutProps<"/">): ReactElement {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <MotionPauseProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-contrast"
          >
            Skip to content
          </a>
          <PointerSpotlight />
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionPauseProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd }}
        />
      </body>
    </html>
  );
}
