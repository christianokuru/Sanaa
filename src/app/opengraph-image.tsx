import { OG_SIZE, renderOgImage } from "@/lib/seo/og";

export const alt = "Sanaa: Learn the craft. Earn from it.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Africa's home for craft",
    title: "Learn the craft. Earn from it.",
    footer: "Sewing · Braiding · Makeup · Dance · Drums · Beadwork",
  });
}
