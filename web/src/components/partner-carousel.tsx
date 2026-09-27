"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const partners = [
  { name: "Grøn Flyt", category: "Flyttebranchen", description: "Grøn Flyt hjælper private og virksomheder sikkert videre til deres næste adresse. Talora repræsenterer virksomheden i kundedialogen og hjælper med at omdanne konkrete henvendelser til bookede flytteopgaver.", focus: "Fokus på hurtig respons, tydelig forventningsafstemning og professionel overlevering.", initials: "GF", logo: "/partners/gron-flyt-logo.png" },
  { name: "Næste partner", category: "Ny branche", description: "Nye samarbejdspartnere kan tilføjes med navn, billede og en kort beskrivelse uden at gøre forsiden længere eller mere rodet.", focus: "Hver partner får sin egen præsentation, mens Taloras overordnede budskab står tydeligt.", initials: "02", logo: null },
  { name: "Næste partner", category: "Ny branche", description: "Partnerfeltet er klar til at vokse med Talora og kan rumme virksomheder på tværs af flytning, rengøring og andre servicebrancher.", focus: "Besøgende kan selv skifte partner, og feltet roterer roligt automatisk.", initials: "03", logo: null },
];

export function PartnerCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % partners.length), 7000);
    return () => window.clearInterval(timer);
  }, []);
  const current = partners[index];
  const go = (direction: number) => setIndex((value) => (value + direction + partners.length) % partners.length);

  return (
    <section className="partner-section" aria-labelledby="partner-title"><div className="section-shell">
      <div className="partner-heading"><div><p className="eyebrow">Dem vi repræsenterer</p><h2 id="partner-title">Vores samarbejdspartnere</h2></div><div className="carousel-controls"><button type="button" onClick={() => go(-1)} aria-label="Forrige samarbejdspartner"><ArrowLeft aria-hidden="true" /></button><button type="button" onClick={() => go(1)} aria-label="Næste samarbejdspartner"><ArrowRight aria-hidden="true" /></button></div></div>
      <article className="partner-card" aria-live="polite"><div className={`partner-visual partner-${index}`}>{current.logo ? <Image src={current.logo} alt={`${current.name} logo`} fill sizes="(max-width: 820px) 100vw, 42vw" className="partner-carousel-logo" /> : <span>{current.initials}</span>}</div><div className="partner-copy"><p className="partner-status">{index === 0 ? "Aktiv samarbejdspartner" : "Plads til ny partner"}</p><p className="eyebrow">{current.category}</p><h3>{current.name}</h3><p>{current.description}</p><p className="partner-focus">{current.focus}</p></div></article>
      <div className="carousel-dots" aria-label="Vælg samarbejdspartner">{partners.map((partner, dotIndex) => <button key={`${partner.initials}-${dotIndex}`} type="button" aria-label={`Vis partner ${dotIndex + 1}`} aria-current={dotIndex === index} onClick={() => setIndex(dotIndex)} />)}</div>
    </div></section>
  );
}
