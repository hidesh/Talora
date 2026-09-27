import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = {
  title: "Privatlivspolitik under udarbejdelse",
  description: "Taloras privatlivspolitik er under udarbejdelse og bliver offentliggjort efter juridisk gennemgang.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <PageFrame eyebrow="Juridisk" title="Privatlivspolitik">
      <article className="legal-content section-shell">
        <p className="legal-note">Privatlivspolitikken er under udarbejdelse.</p>
        <h2>Siden er endnu ikke aktiv</h2>
        <p>Den endelige privatlivspolitik bliver gennemgået og offentliggjort, før hjemmesiden tages i brug.</p>
      </article>
    </PageFrame>
  );
}
