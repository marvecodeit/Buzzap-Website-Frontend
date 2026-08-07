import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "../lib/auth-context";
import { LanguageProvider } from "../lib/language-context";
import PageViewTracker from "../components/PageViewTracker";
import SiteLayout from "../../components/SiteLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.buzzaphq.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Buzzap Innovations — Top AI Marketing, SEO & Growth Infrastructure Agency",
    template: "%s | Buzzap Innovations",
  },
  description: "Buzzap Innovations builds engineered AI growth infrastructure, AI marketing campaigns, AI SEO systems, WhatsApp AI voice agents, and CRM automations that scale enterprise revenue.",
  keywords: [
    "Buzzap",
    "Buzzap Agency",
    "Buzzap Innovations",
    "AI Marketing Agency",
    "AI SEO Agency",
    "AI Lead Generation",
    "AI Voice Agents",
    "WhatsApp AI Chatbots",
    "CRM Automation Agency",
    "Meta Ads Automation",
    "Google Ads AI",
    "Digital Growth Agency",
  ],
  authors: [{ name: "Buzzap Innovations" }],
  creator: "Buzzap Innovations",
  publisher: "Buzzap Innovations",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Buzzap Innovations — Engineered AI Solutions & Growth Pipelines",
    description: "Modular AI solutions engineered to capture leads, automate workflows, and accelerate pipeline velocity automatically.",
    siteName: "Buzzap Agency",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Buzzap Agency — AI Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buzzap Innovations — Top AI Marketing & Growth Infrastructure Agency",
    description: "Scale your revenue with automated AI pipelines, SEO domination, and intelligent voice/chat agents.",
    images: ["/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Buzzap Innovations",
      alternateName: ["Buzzap Agency", "Buzzap"],
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: [
        "https://linkedin.com/company/buzzap-agency",
        "https://twitter.com/buzzapagency",
        "https://instagram.com/buzzapagency",
      ],
      description: "Engineered AI growth infrastructure, AI marketing, SEO positioning, CRM automations, and intelligent AI agents.",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "Buzzap Agency",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      image: `${siteUrl}/logo.png`,
      priceRange: "$$$",
      telephone: "+1-800-BUZZAP",
      areaServed: "Global",
      serviceType: [
        "AI Marketing",
        "AI SEO & Brand Positioning",
        "CRM & Lead Automation",
        "AI Voice & Chatbot Agents",
        "Content & Creative Strategy",
        "Growth Consulting",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Buzzap Agency",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://buzzap-website-frontend.onrender.com" />
        <link rel="dns-prefetch" href="https://buzzap-website-frontend.onrender.com" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <SiteLayout>{children}</SiteLayout>
          </AuthProvider>
        </LanguageProvider>
        <PageViewTracker />
        <Analytics />
      </body>
    </html>
  );
}