import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = { title: "Om Talora", description: "Lær Taloras tilgang til kundekontakt, leadhåndtering og resultatorienteret salg at kende.", alternates: { canonical: "/om-talora" } };

export default function AboutPage() {
  return <PageFrame eyebrow="Om Talora" title="Stærke resultater starter med den rigtige samtale" intro="Professionel kundekontakt, stærkere relationer og konkrete resultater.">
    <section className="editorial-section section-shell" aria-labelledby="about-approach"><div><p className="eyebrow">Vores tilgang</p><h2 id="about-approach">Salg handler om mennesker.</h2></div><div className="editorial-copy"><p>Vi tror på, at stærke resultater starter med den rigtige samtale.</p><p>Hos Talora arbejder vi med professionel kundekontakt, leadhåndtering og resultatorienteret salg.</p><p>Vi hjælper virksomheder med at skabe stærkere kunderelationer, udnytte deres salgspotentiale og omsætte muligheder til konkrete resultater.</p><p>For os handler salg om mere end tal. Det handler om mennesker, tillid og evnen til at skabe værdi gennem den rigtige dialog.</p><p>Vi tror på kvalitet frem for kvantitet, langsigtede relationer og en professionel tilgang til hver eneste kundekontakt.</p></div></section>
    <section className="editorial-band section-shell" aria-labelledby="about-ambition"><p className="eyebrow">Vores ambition</p><h2 id="about-ambition">Kvalitet, udvikling og resultater går hånd i hånd.</h2><p>Vores ambition er at opbygge et salgshus, hvor kvalitet, udvikling og resultater går hånd i hånd.</p><p>Vi ønsker at være en samarbejdspartner, virksomheder kan stole på, og en arbejdsplads, hvor ambitiøse mennesker får mulighed for at udvikle deres kompetencer og nå nye mål.</p><strong>Talora – stærke relationer. Større ambitioner.</strong></section>
    <section className="editorial-next section-shell"><h2>Skal vi tale om mulighederne?</h2><Link className="button button-navy" href="/book-moede">Book et møde <ArrowRight aria-hidden="true" size={18} /></Link></section>
  </PageFrame>;
}
