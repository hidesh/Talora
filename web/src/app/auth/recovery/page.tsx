import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Bekræft nulstilling", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type RecoveryPageProps = {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
};

export default async function RecoveryPage({ searchParams }: RecoveryPageProps) {
  const params = await searchParams;
  const tokenHash = params.token_hash;
  const valid = typeof tokenHash === "string" && tokenHash.length >= 20 && tokenHash.length <= 512 && !/\s/.test(tokenHash) && params.type === "recovery";

  return (
    <main id="main-content" className="login-page">
      <section className="login-brand-panel"><Logo /><div><p className="eyebrow light">Talora administration</p><h2>Sikker nulstilling af adgangskode.</h2><p>Linket er midlertidigt og kan kun bruges én gang.</p></div><Link href="/login">← Tilbage til login</Link></section>
      <section className="login-form-panel">
        <div className="login-form recovery-card">
          <div className="login-icon"><KeyRound aria-hidden="true" /></div>
          <h1>Bekræft nulstilling</h1>
          {valid ? <><p>Klik videre for at åbne den sikre formular til en ny adgangskode.</p><form action="/auth/confirm" method="post"><input type="hidden" name="token_hash" value={tokenHash} /><input type="hidden" name="type" value="recovery" /><button className="button button-bronze submit-button" type="submit"><ShieldCheck aria-hidden="true" size={18} /> Fortsæt sikkert</button></form></> : <><p className="form-message error">Linket er ugyldigt eller mangler oplysninger.</p><Link className="text-link" href="/login">Tilbage til login</Link></>}
        </div>
      </section>
    </main>
  );
}
