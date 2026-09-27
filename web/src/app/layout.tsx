import type { Metadata, Viewport } from "next";
import { RecoverySessionHandler } from "@/components/recovery-session-handler";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://talora.dk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Talora | Salgspartner for virksomheder", template: "%s | Talora" },
  description: "Talora repræsenterer jeres virksomhed, følger op på kundehenvendelser og hjælper med at lukke flere salg.",
  applicationName: "Talora",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "da_DK", siteName: "Talora", title: "Talora | Salgspartner for virksomheder", description: "Vi tager dialogen med jeres potentielle kunder og følger salget i mål.", url: "/" },
  twitter: { card: "summary", title: "Talora | Salgspartner for virksomheder", description: "Vi tager dialogen med jeres potentielle kunder og følger salget i mål." },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0E1F38" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="da" data-scroll-behavior="smooth"><body><RecoverySessionHandler /><a className="skip-link" href="#main-content">Spring til indhold</a>{children}</body></html>;
}
