import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { StoreHydrator } from "@/components/layout/StoreHydrator";
import { LocaleProvider } from "@/components/locale/LocaleProvider";
import { Toaster } from "@/components/ui/Toaster";
import { ServiceWorker } from "@/components/pwa/ServiceWorker";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRates, getViewerLocale } from "@/lib/locale/locale.server";
import { pickRates } from "@/lib/locale/currency";
import { getAllCourses } from "@/lib/catalog/repository";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} · ${siteConfig.tagline}`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["African skills", "online courses Africa", "sewing course", "braiding course", "makeup course", "Amapiano dance", "djembe", "beadwork", "learn a trade"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} · ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: "en",
  },
  twitter: { card: "summary_large_image", site: siteConfig.twitter },
  appleWebApp: { capable: true, title: siteConfig.name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: { icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }], apple: "/icons/apple-touch-icon.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { country, currency } = getViewerLocale();
  const rates = await getRates();
  const needed = new Set([currency, "USD", ...getAllCourses().map((c) => c.currency)]);

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <LocaleProvider value={{ country, currency, rates: pickRates(rates, needed) }}>
          <SiteHeader />
          <main id="main" className="pb-tabbar">{children}</main>
          <SiteFooter />
          <MobileTabBar />
          <Toaster />
        </LocaleProvider>
        <StoreHydrator />
        <ServiceWorker />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
