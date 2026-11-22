import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return <footer className="site-footer"><div className="footer-inner section-shell"><div className="footer-brand"><Logo /><p>Stærke relationer. Større ambitioner.</p></div><div className="footer-contact"><h2>Kontakt</h2><address>Søtorvet 5, 2. sal<br />1371 København K</address><a href="tel:+4522207089">+ 45 22 20 70 89</a><a href="mailto:info@talora.dk">info@talora.dk</a></div><div className="footer-hours"><h2>Åbningstider</h2><dl><div><dt>Mandag–torsdag</dt><dd>09.00–17.00</dd></div><div><dt>Fredag</dt><dd>09.00–16.00</dd></div><div><dt>Weekend</dt><dd>Lukket</dd></div></dl></div><nav aria-label="Footer navigation"><Link href="/om-talora">Om Talora</Link><Link href="/karriere">Karriere</Link><Link href="/book-moede">Kontakt</Link><Link href="/privatliv">Privatlivspolitik</Link><Link href="/forretningsbetingelser">Forretningsbetingelser</Link><Link href="/login">Login</Link></nav></div><div className="copyright section-shell">© {new Date().getFullYear()} Talora ApS · CVR 46 68 66 16</div></footer>;
}
