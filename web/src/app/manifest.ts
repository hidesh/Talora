import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Talora", short_name: "Talora", description: "Talora repræsenterer virksomheder i kundedialogen og følger salget i mål.", start_url: "/", display: "standalone", background_color: "#F6F4EF", theme_color: "#0E1F38", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
