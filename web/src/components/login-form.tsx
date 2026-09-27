"use client";

import { Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      const requested = searchParams.get("redirectedFrom");
      router.replace(requested?.startsWith("/admin") ? requested : "/admin");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login mislykkedes.");
    } finally {
      setLoading(false);
    }
  };

  return <form className="login-form" onSubmit={submit}><div className="login-icon"><LockKeyhole aria-hidden="true" /></div><h1>Log ind</h1><p>Adgang til Taloras henvendelser.</p>{searchParams.get("error") === "unauthorized" && <p className="form-message error">Brugeren har ikke administratoradgang.</p>}{searchParams.get("error") === "setup" && <p className="form-message error">Login er ikke konfigureret endnu.</p>}{searchParams.get("error") === "recovery-link" && <p className="form-message error">Nulstillingslinket er ugyldigt eller udløbet. Send et nyt link fra Supabase.</p>}{searchParams.get("password") === "updated" && <p className="form-message success">Adgangskoden er ændret. Du kan nu logge ind.</p>}{error && <p className="form-message error" role="alert">{error}</p>}<label><span>E-mail</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></label><label><span>Adgangskode</span><span className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /><button type="button" aria-label={showPassword ? "Skjul adgangskode" : "Vis adgangskode"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></span></label><p className="password-recovery-note">Glemt adgangskoden? Et midlertidigt nulstillingslink kan kun sendes fra Supabase-portalen.</p><button className="button button-bronze submit-button" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" aria-hidden="true" /> Logger ind…</> : "Log ind"}</button></form>;
}
