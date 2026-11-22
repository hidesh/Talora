"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const partners = [
  { name: "Grøn Flyt", category: "Flyttebranchen", description: "Grøn Flyt hjælper private og virksomheder sikkert videre til deres næste adresse. Talora repræsenterer virksomheden i kundedialogen og hjælper med at omdanne konkrete henvendelser til bookede flytteopgaver.", focus: "Fokus på hurtig respons, tydelig forventningsafstemning og professionel overlevering.", initials: "GF", logo: "/partners/gron-flyt-logo.png" },
  { name: "Næste partner", category: "Ny branche", description: "Nye samarbejdspartnere kan tilføjes med navn, billede og en kort beskrivelse uden at gøre forsiden længere eller mere rodet.", focus: "Hver partner får sin egen præsentation, mens Taloras overordnede budskab står tydeligt.", initials: "02", logo: null },
  { name: "Næste partner", category: "Ny branche", description: "Partnerfeltet er klar til at vokse med Talora og kan rumme virksomheder på tværs af flytning, rengøring og andre servicebrancher.", focus: "Besøgende kan selv skifte partner, og feltet roterer roligt automatisk.", initials: "03", logo: null },
];

export function PartnerCarousel() {
  const [index, setIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [inView, setInView] = useState(false);
  const indexRef = useRef(0);
  const transitionRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const showPartner = useCallback((nextIndex: number) => {
    const previousIndex = indexRef.current;
    if (previousIndex === nextIndex) return;
    indexRef.current = nextIndex;
    setOutgoingIndex(previousIndex);
    setIndex(nextIndex);
    if (transitionRef.current !== null) window.clearTimeout(transitionRef.current);
    transitionRef.current = window.setTimeout(() => setOutgoingIndex(null), 800);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setHasEntered(true);
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => showPartner((indexRef.current + 1) % partners.length), 7000);
    return () => window.clearInterval(timer);
  }, [inView, paused, showPartner]);
  useEffect(() => () => {
    if (transitionRef.current !== null) window.clearTimeout(transitionRef.current);
  }, []);

  const go = (direction: number) => showPartner((indexRef.current + direction + partners.length) % partners.length);
  const slide = (slideIndex: number, leaving = false) => {
    const partner = partners[slideIndex];
    return <article key={`${slideIndex}-${leaving ? "leaving" : "active"}`} className={`partner-card partner-card-${leaving ? "leaving" : hasEntered ? "entering" : "static"}`} aria-hidden={leaving}>
      <div className={`partner-visual partner-${slideIndex}`}>{partner.logo ? <Image src={partner.logo} alt={`${partner.name} logo`} fill sizes="(max-width: 820px) 100vw, 42vw" className="partner-carousel-logo" /> : <span>{partner.initials}</span>}</div>
      <div className="partner-copy"><p className="partner-status">{slideIndex === 0 ? "Aktiv samarbejdspartner" : "Plads til ny partner"}</p><p className="eyebrow">{partner.category}</p><h3>{partner.name}</h3><p>{partner.description}</p><p className="partner-focus">{partner.focus}</p></div>
    </article>;
  };

  return (
    <section ref={sectionRef} className="partner-section" aria-labelledby="partner-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}><div className="section-shell">
      <div className="partner-heading"><div><p className="eyebrow">Dem vi repræsenterer</p><h2 id="partner-title">Vores samarbejdspartnere</h2></div><div className="carousel-controls"><button type="button" onClick={() => go(-1)} aria-label="Forrige samarbejdspartner"><ArrowLeft aria-hidden="true" /></button><button type="button" onClick={() => go(1)} aria-label="Næste samarbejdspartner"><ArrowRight aria-hidden="true" /></button></div></div>
      <div className="partner-stage" aria-live="polite">{outgoingIndex !== null && slide(outgoingIndex, true)}{slide(index)}</div>
      <div className="carousel-dots" aria-label="Vælg samarbejdspartner">{partners.map((partner, dotIndex) => <button key={`${partner.initials}-${dotIndex}`} type="button" aria-label={`Vis partner ${dotIndex + 1}`} aria-current={dotIndex === index} onClick={() => showPartner(dotIndex)} />)}</div>
    </div></section>
  );
}
