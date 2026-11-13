import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${siteConfig.name}: ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    categories: ["education", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "My learning", url: "/my-learning", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Browse courses", url: "/courses", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
