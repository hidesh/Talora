"use client";

import { KeyRound, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = new URL("/auth/recovery", process.env.NEXT_PUBLIC_SITE_URL || "https://talora.dk").toString();
      const result = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (result.error) throw result.error;
      setSent(true);
    } catch {
      setError("Linket kunne ikke sendes lige nu. Prøv igen senere, eller kontakt din IT-administrator.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="login-form" onSubmit={submit}>
      <div className="login-icon"><KeyRound aria-hidden="true" /></div>
      <h1>Glemt adgangskode?</h1>
      {sent ? (
        <p className="form-message success" role="status">Hvis adressen har en Talora-bruger, er der sendt et nulstillingslink. Tjek også spam-mappen.</p>
      ) : (
        <>
          <p>Indtast din e-mailadresse, så sender vi et engangslink til at vælge en ny adgangskode.</p>
          {error && <p className="form-message error" role="alert">{error}</p>}
          <label><span>E-mail</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
          <button className="button button-bronze submit-button" type="submit" disabled={sending}>{sending ? <><LoaderCircle className="spin" aria-hidden="true" /> Sender…</> : "Send nulstillingslink"}</button>
        </>
      )}
    </form>
  );
}
