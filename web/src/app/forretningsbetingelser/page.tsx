import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = { title: "Forretningsbetingelser", description: "Taloras generelle forretningsbetingelser.", alternates: { canonical: "/forretningsbetingelser" } };

export default function TermsPage() {
  return <PageFrame eyebrow="Juridisk" title="Forretningsbetingelser"><article className="legal-content section-shell"><p className="legal-note">De endelige betingelser skal tilpasses Taloras aftalemodel og gennemgås juridisk inden lancering.</p><h2>Anvendelse</h2><p>Betingelserne gælder for erhvervsaftaler mellem Talora og den enkelte samarbejdspartner, medmindre andet aftales skriftligt.</p><h2>Samarbejdets omfang</h2><p>Ydelser, målgrupper, kontaktform, honorar og forventet opfølgning beskrives i den konkrete samarbejdsaftale.</p><h2>Partnerens oplysninger</h2><p>Samarbejdspartneren er ansvarlig for, at priser, tilbud, kundelister og øvrige oplysninger, som Talora skal arbejde ud fra, er korrekte og lovligt indsamlet.</p><h2>Fortrolighed og persondata</h2><p>Parterne behandler fortrolige oplysninger forsvarligt. Hvis Talora behandler personoplysninger på partnerens vegne, indgås en databehandleraftale.</p><h2>Ansvar</h2><p>Ansvar, opsigelse, betalingsvilkår og eventuelle begrænsninger fastlægges i den enkelte samarbejdsaftale.</p><h2>Lovvalg</h2><p>Aftalen følger dansk ret. Eventuelle tvister søges først løst gennem dialog mellem parterne.</p></article></PageFrame>;
}
