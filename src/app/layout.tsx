/* eslint-disable @next/next/no-page-custom-font -- The provided reference loads its fonts globally. */
import type { Metadata } from "next";
import { ScrollMotion } from "@/components/scroll-motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company, siteUrl } from "@/config/company";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Infinite Wires & Components | Copper Winding Wire",
    template: "%s | Infinite Wires",
  },
  description: company.description,
  openGraph: {
    type: "website",
    siteName: company.name,
    title: "Infinite Wires & Components | Copper Winding Wire",
    description: company.description,
    url: siteUrl,
  },
};

const themeInitialization = `try{var p=localStorage.getItem('iw-palette');if(['charcoal','beige','lemon'].includes(p))document.documentElement.setAttribute('data-palette',p)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    foundingDate: String(company.established),
    url: siteUrl,
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..800&family=Instrument+Sans:wght@400..700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitialization }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <ScrollMotion />
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
