import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/admin", "/checkout", "/learn", "/my-learning", "/wishlist", "/teach/dashboard", "/teach/courses", "/teach/payouts", "/certificates"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
