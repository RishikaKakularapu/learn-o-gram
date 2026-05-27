import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Learn-o-gram",
    short_name: "Learn-o-gram",
    description: "Scroll your notes like a feed. Learn one card at a time.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b10",
    theme_color: "#0b0b10",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
