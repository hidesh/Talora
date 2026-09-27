import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = {
  title: "Udkast til privatlivspolitik",
  description: "Internt udkast til Taloras privatlivspolitik.",
  robots: { index: false, follow: false },
};

export default function PrivacyDraftPage() {
  return (
    <PageFrame eyebrow="Internt udkast" title="Privatlivspolitik">
      <article className="legal-content section-shell">
        <p className="legal-note">Denne tekst skal gennemgås og færdiggøres med Taloras CVR-nummer, adresse og kontaktoplysninger inden lancering.</p>
        <h2>Dataansvarlig</h2>
        <p>Talora er dataansvarlig for de personoplysninger, der indsamles gennem hjemmesidens mødeformular.</p>
        <h2>Oplysninger vi behandler</h2>
        <p>Vi behandler navn, e-mailadresse, telefonnummer, virksomhedsnavn samt de oplysninger, du selv skriver om virksomhedens opgaver og behov.</p>
        <h2>Formål og retsgrundlag</h2>
        <p>Oplysningerne bruges til at besvare din henvendelse og vurdere et muligt samarbejde. Behandlingen sker på baggrund af dit samtykke og Taloras legitime interesse i at besvare erhvervsmæssige henvendelser.</p>
        <h2>Opbevaring</h2>
        <p>Henvendelser opbevares kun, så længe det er nødvendigt for dialogen, dokumentation og eventuelle lovkrav. Oplysninger slettes eller anonymiseres derefter.</p>
        <h2>Databehandlere</h2>
        <p>Talora bruger Vercel til hosting, Supabase til sikker lagring og login samt Resend til e-mailnotifikationer. Der indgås relevante databehandleraftaler før lancering.</p>
        <h2>Dine rettigheder</h2>
        <p>Du kan anmode om indsigt, rettelse eller sletning og kan trække dit samtykke tilbage. Du har også ret til at klage til Datatilsynet.</p>
        <h2>Kontakt</h2>
        <p>Kontaktoplysninger indsættes her, før hjemmesiden offentliggøres.</p>
      </article>
    </PageFrame>
  );
}
