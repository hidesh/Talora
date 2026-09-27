import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Leaf, MessageCircleMore } from "lucide-react";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = {
  title: "Samarbejdspartnere",
  description: "Mød Grøn Flyt og de virksomheder, Talora repræsenterer i dialogen med potentielle kunder.",
  alternates: { canonical: "/samarbejdspartnere" },
};

export default function PartnersPage() {
  return (
    <PageFrame eyebrow="Samarbejdspartnere" title="Virksomheder vi repræsenterer" intro="Taloras kunder er vores samarbejdspartnere. Vi lærer deres forretning at kende og repræsenterer dem professionelt over for både private og virksomheder.">
      <section className="content-section section-shell">
        <article className="partner-detail">
          <div className="partner-brand-panel">
            <Image src="/partners/gron-flyt-logo.png" alt="Grøn Flyt – vi flytter bæredygtigt" fill sizes="(max-width: 900px) 100vw, 40vw" className="partner-brand-logo" priority />
          </div>
          <div>
            <p className="eyebrow">Aktiv samarbejdspartner · Flyttebranchen</p>
            <h2>Grøn Flyt</h2>
            <p>Grøn Flyt hjælper private og virksomheder med at komme trygt videre til deres næste adresse. Virksomheden har fokus på en overskuelig flytteproces, professionel håndtering og en mere bæredygtig tilgang til opgaven.</p>
            <p>Talora varetager den indledende kundedialog, afdækker opgavens omfang og følger systematisk op, så Grøn Flyts team kan koncentrere sig om selve flytningen.</p>
            <ul className="partner-values" aria-label="Fokusområder">
              <li><Building2 aria-hidden="true" /> Flytning for private og virksomheder</li>
              <li><MessageCircleMore aria-hidden="true" /> Tydelig og personlig kundekontakt</li>
              <li><Leaf aria-hidden="true" /> Fokus på ansvarlige løsninger</li>
            </ul>
          </div>
        </article>

        <div className="partner-gallery" aria-label="Grøn Flyt i arbejdet">
          <figure className="partner-photo partner-photo-tall"><Image src="/partners/gron-flyt-loading.png" alt="Grøn Flyts medarbejdere læsser flyttekasser i en varevogn" fill sizes="(max-width: 760px) 100vw, 42vw" /></figure>
          <figure className="partner-photo"><Image src="/partners/gron-flyt-team.png" alt="Grøn Flyts team foran en flyttevogn" fill sizes="(max-width: 760px) 100vw, 50vw" /></figure>
        </div>

        <div className="partner-growth"><p className="eyebrow">Et format der kan vokse</p><h2>Nye partnere får deres egen profil</h2><p>Når Talora udvider med flere virksomheder og brancher, får hver samarbejdspartner sit eget område med navn, billeder og en kort præsentation af samarbejdet.</p><Link className="button button-navy" href="/book-moede">Bliv samarbejdspartner <ArrowRight aria-hidden="true" size={18} /></Link></div>
      </section>
    </PageFrame>
  );
}
