import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Glemt adgangskode", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <main id="main-content" className="login-page"><section className="login-brand-panel"><Logo whiteBackground /><div><p className="eyebrow light">Talora administration</p><h2>Få adgang til din konto igen.</h2><p>Brug linket i din e-mail til at vælge en ny adgangskode.</p></div><Link href="/login">← Tilbage til login</Link></section><section className="login-form-panel"><ForgotPasswordForm /></section></main>;
}
