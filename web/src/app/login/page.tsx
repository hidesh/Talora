import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Login", robots: { index: false, follow: false }, alternates: { canonical: "/login" } };

export default function LoginPage() {
  return <main id="main-content" className="login-page"><section className="login-brand-panel"><Logo /><div><p className="eyebrow light">Talora administration</p><h2>Overblik over hver ny mulighed.</h2><p>Henvendelser, status og opfølgning samlet ét sikkert sted.</p></div><Link href="/">← Tilbage til hjemmesiden</Link></section><section className="login-form-panel"><Suspense fallback={<p>Indlæser…</p>}><LoginForm /></Suspense></section></main>;
}
