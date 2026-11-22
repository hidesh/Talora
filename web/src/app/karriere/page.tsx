import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = { title: "Karriere", description: "Bliv en del af Talora. Læs om vores kultur og send en uopfordret ansøgning.", alternates: { canonical: "/karriere" } };

const values = [
  { number: "01", title: "Personlig udvikling", text: "Vi tror på kontinuerlig læring, konstruktiv feedback og muligheden for at blive dygtigere hver dag." },
  { number: "02", title: "Ambitioner og resultater", text: "Vi værdsætter initiativ, ansvarlighed og mennesker, der motiveres af at sætte mål og arbejde for at nå dem." },
  { number: "03", title: "Et stærkt fællesskab", text: "Vi ønsker at skabe en kultur, hvor vi støtter hinanden, deler vores erfaringer og fejrer fælles succeser." },
];

export default function CareerPage() {
  return <PageFrame eyebrow="Bliv en del af Talora" title="Din ambition. Dit potentiale. Din fremtid." intro="Et sted for mennesker, der vil udvikle sig og skabe stærke resultater sammen.">
    <section className="editorial-section section-shell" aria-labelledby="career-intro"><div><p className="eyebrow">Karriere hos Talora</p><h2 id="career-intro">Mere end bare et arbejde.</h2></div><div className="editorial-copy"><p>Hos Talora tror vi på, at de bedste resultater skabes af mennesker med ambitioner, engagement og viljen til at udvikle sig.</p><p>Vi ønsker at skabe et arbejdsmiljø, hvor personlig udvikling, stærkt sammenhold og resultater går hånd i hånd.</p><p>Uanset om du allerede har erfaring med salg eller ønsker at udvikle dine kompetencer inden for branchen, er vi altid interesserede i at høre fra mennesker med det rette mindset.</p></div></section>
    <section className="career-values section-shell" aria-labelledby="career-values-title"><p className="eyebrow">Mere end bare et arbejde</p><h2 id="career-values-title">Det, vi bygger sammen</h2><div className="step-grid">{values.map(({ number, title, text }) => <article className="step-card" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="career-apply section-shell" aria-labelledby="career-apply-title"><p className="eyebrow light">Ser du dig selv hos Talora?</p><h2 id="career-apply-title">Vi vil gerne høre fra dig.</h2><p>Vi er altid åbne for at lære nye talenter at kende. Har du ambitioner, gåpåmod og lyst til at arbejde med salg og kundekontakt? Send os en uopfordret ansøgning, og fortæl lidt om dig selv, din erfaring og dine ambitioner.</p><a className="button button-bronze" href="mailto:info@talora.dk?subject=Uopfordret%20ans%C3%B8gning%20til%20Talora">Send en uopfordret ansøgning <ArrowRight aria-hidden="true" size={18} /></a><small>Vi gennemgår løbende indkomne ansøgninger og kontakter relevante kandidater, når der opstår muligheder.</small></section>
  </PageFrame>;
}
