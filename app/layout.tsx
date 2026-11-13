import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { DemoBanner } from "@/components/DemoBanner";
import { SITE_URL } from "@/lib/config";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });
const sans = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Sanaa: Learn African crafts, dance and beauty", template: "%s | Sanaa" },
  description: "Learn the craft. Earn from it. Video courses in sewing, braiding, makeup, dance and drumming, taught by African teachers.",
  appleWebApp: { capable: true, title: "Sanaa", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#C2502A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <DemoBanner />
        <Header />
        <main className="pb-safe">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
