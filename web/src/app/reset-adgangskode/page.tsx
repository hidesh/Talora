import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ny adgangskode", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("talora_recovery")?.value !== "active") redirect("/login?error=recovery-link");
  const client = await createSupabaseServerClient();
  const { data, error } = client ? await client.auth.getUser() : { data: { user: null }, error: new Error("setup") };
  if (error || !data.user) redirect("/login?error=recovery-link");

  return <main id="main-content" className="login-page"><section className="login-brand-panel"><Logo /><div><p className="eyebrow light">Talora administration</p><h2>Vælg en ny adgangskode.</h2><p>Brug en unik adgangskode, som ikke anvendes på andre tjenester.</p></div><Link href="/login">← Afbryd og gå til login</Link></section><section className="login-form-panel"><ResetPasswordForm /></section></main>;
}
