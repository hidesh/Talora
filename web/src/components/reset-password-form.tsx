"use client";

import { Eye, EyeOff, KeyRound, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password.length < 12) return setError("Adgangskoden skal være mindst 12 tegn.");
    if (password !== confirmation) return setError("Adgangskoderne er ikke ens.");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Adgangskoden kunne ikke ændres.");
      router.replace("/login?password=updated");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Adgangskoden kunne ikke ændres.");
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={submit}>
      <div className="login-icon"><KeyRound aria-hidden="true" /></div>
      <h1>Ny adgangskode</h1>
      <p>Linket udløber efter kort tid. Adgangskoden skal være mindst 12 tegn.</p>
      {error && <p className="form-message error" role="alert">{error}</p>}
      <label><span>Ny adgangskode</span><span className="password-field"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} maxLength={128} autoComplete="new-password" /><button type="button" aria-label={showPassword ? "Skjul adgangskode" : "Vis adgangskode"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></span></label>
      <label><span>Gentag adgangskode</span><input type={showPassword ? "text" : "password"} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required minLength={12} maxLength={128} autoComplete="new-password" /></label>
      <button className="button button-bronze submit-button" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" aria-hidden="true" /> Gemmer…</> : "Gem ny adgangskode"}</button>
    </form>
  );
}
