import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return <footer className="site-footer"><div className="footer-inner section-shell"><div><Logo /><p>Personlig salgsopfølgning på vegne af jeres virksomhed.</p></div><nav aria-label="Footer navigation"><Link href="/book-moede">Kontakt</Link><Link href="/privatliv">Privatlivspolitik</Link><Link href="/forretningsbetingelser">Forretningsbetingelser</Link><Link href="/login">Login</Link></nav></div><div className="copyright section-shell">© {new Date().getFullYear()} Talora</div></footer>;
}
