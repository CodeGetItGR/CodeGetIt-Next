import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { en } from "@/i18n/locales/en";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = "https://codegetit.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: en.landing.seo.title,
    template: "%s | CodeGetIt",
  },
  description: en.landing.seo.description,
  applicationName: "CodeGetIt",
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CodeGetIt",
    title: en.landing.seo.title,
    description: en.landing.seo.description,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: en.landing.seo.title,
    description: en.landing.seo.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CodeGetIt",
  url: siteUrl,
  logo: `${siteUrl}/logo.svg`,
  description: en.landing.seo.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Thessaloniki",
    addressRegion: "Thessaloniki",
    addressCountry: "GR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+30 6945386254",
    contactType: "Customer Service",
    email: "info@codegetit.com",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: en.landing.faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AppProviders>
      <html
        lang="en"
        className={`${outfit.variable} ${syne.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#fafafa] text-slate-900">
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        </body>
      </html>
    </AppProviders>
  );
}
