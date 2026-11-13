import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sanaa",
    short_name: "Sanaa",
    description: "Learn the craft. Earn from it.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF5EA",
    theme_color: "#C2502A",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
