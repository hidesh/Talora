import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, PhoneCall, ScanSearch, Target } from "lucide-react";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = { title: "Sådan arbejder vi", description: "Se hvordan Talora repræsenterer jeres virksomhed og følger kundehenvendelser hele vejen til en aftale.", alternates: { canonical: "/saadan-arbejder-vi" } };

const phases = [
  { icon: ScanSearch, title: "Vi forstår forretningen", text: "Vi lærer jeres ydelser, priser, tone og typiske kunder at kende." },
  { icon: PhoneCall, title: "Vi reagerer hurtigt", text: "Når en ny henvendelse kommer ind, tager vi kontakt, mens interessen stadig er aktuel." },
  { icon: MessageCircle, title: "Vi repræsenterer jer", text: "Kunden møder en professionel og personlig dialog, der passer til jeres virksomhed." },
  { icon: Target, title: "Vi følger op", text: "Vi holder dialogen i gang og hjælper kunden frem til en tydelig aftale." },
];

export default function ProcessPage() {
  return <PageFrame eyebrow="Vores metode" title="Et salg starter med den rigtige samtale" intro="Talora fungerer som en forlængelse af jeres virksomhed. Vi tager ansvar for dialogen fra den første henvendelse, til kunden er klar til at vælge jer."><section className="content-section section-shell"><div className="feature-grid">{phases.map(({ icon: Icon, title, text }, index) => <article className="feature-card" key={title}><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /><h2>{title}</h2><p>{text}</p></article>)}</div></section><section className="split-section section-shell"><div><p className="eyebrow">Samarbejdet</p><h2>Vi taler på jeres vegne</h2></div><div><p>God opfølgning kræver mere end et hurtigt opkald. Derfor aftaler vi på forhånd, hvordan jeres virksomhed skal præsenteres, hvilke spørgsmål vi skal stille, og hvornår kunden er klar til næste skridt.</p><p>I får en samarbejdspartner, der fokuserer på salget, mens I fokuserer på at levere opgaven.</p><Link className="button button-navy" href="/book-moede">Book et møde <ArrowRight aria-hidden="true" size={18} /></Link></div></section></PageFrame>;
}
