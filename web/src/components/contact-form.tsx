"use client";

import { CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";
type AltchaElement = HTMLElement & { reset?: () => void };

const initialForm = { firstName: "", lastName: "", email: "", phone: "", company: "", services: "", message: "", website: "", consent: false };

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [invalidField, setInvalidField] = useState<string | null>(null);
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const widgetRef = useRef<AltchaElement | null>(null);

  useEffect(() => {
    void import("altcha").then(() => customElements.whenDefined("altcha-widget")).then(() => setWidgetReady(true)).catch(() => {
      setStatus("error");
      setError("Sikkerhedsverifikationen kunne ikke indlæses.");
    });
  }, []);

  useEffect(() => {
    if (!widgetReady) return;
    const widget = widgetRef.current;
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ state: string; payload: string }>).detail;
      setAltchaPayload(detail.state === "verified" ? detail.payload : null);
    };
    widget?.addEventListener("statechange", onState);
    return () => widget?.removeEventListener("statechange", onState);
  }, [widgetReady]);

  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target;
    if (invalidField === target.name) setInvalidField(null);
    setForm((current) => ({ ...current, [target.name]: target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");
    setInvalidField(null);
    if (!formElement.reportValidity()) return;
    if (!altchaPayload) {
      setStatus("error");
      setError("Gennemfør sikkerhedsverifikationen først.");
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, altchaPayload }) });
      const result = (await response.json()) as { error?: string; field?: string; resetAltcha?: boolean };
      if (!response.ok) {
        setStatus("error");
        setError(result.error ?? "Henvendelsen kunne ikke sendes.");
        setInvalidField(result.field ?? null);
        if (result.field) window.requestAnimationFrame(() => (formElement.elements.namedItem(result.field!) as HTMLElement | null)?.focus());
        if (result.resetAltcha) {
          setAltchaPayload(null);
          widgetRef.current?.reset?.();
        }
        return;
      }
      setForm(initialForm);
      setAltchaPayload(null);
      widgetRef.current?.reset?.();
      setStatus("success");
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "Der opstod en fejl.");
    }
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Hjemmeside</label><input id="website" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" /></div>
      <div className="form-grid">
        <label><span>Fornavn</span><input name="firstName" value={form.firstName} onChange={update} required maxLength={80} autoComplete="given-name" aria-invalid={invalidField === "firstName"} /></label>
        <label><span>Efternavn</span><input name="lastName" value={form.lastName} onChange={update} required maxLength={80} autoComplete="family-name" aria-invalid={invalidField === "lastName"} /></label>
        <label><span>E-mail</span><input name="email" type="email" value={form.email} onChange={update} required maxLength={254} autoComplete="email" aria-invalid={invalidField === "email"} /></label>
        <label><span>Telefonnummer</span><input name="phone" type="tel" value={form.phone} onChange={update} required maxLength={30} autoComplete="tel" aria-invalid={invalidField === "phone"} /></label>
        <label className="full"><span>Virksomhedsnavn</span><input name="company" value={form.company} onChange={update} required maxLength={120} autoComplete="organization" aria-invalid={invalidField === "company"} /></label>
        <label className="full"><span>Hvilke opgaver tilbyder I?</span><textarea name="services" value={form.services} onChange={update} required maxLength={1200} rows={5} placeholder="Fortæl kort om jeres ydelser og de leads, I ønsker hjælp til." aria-invalid={invalidField === "services"} /></label>
        <label className="full"><span>Bemærkning <small>(valgfrit)</small></span><textarea name="message" value={form.message} onChange={update} maxLength={2000} rows={4} /></label>
      </div>
      <div className="security-box">
        <div><ShieldCheck aria-hidden="true" size={20} /><strong>Sikkerhedsverifikation</strong></div>
        {widgetReady ? <altcha-widget ref={widgetRef} challenge="/api/altcha/challenge" hidelogo hidefooter /> : <p>Indlæser verifikation…</p>}
      </div>
      <label className="consent"><input name="consent" type="checkbox" checked={form.consent} onChange={update} required aria-invalid={invalidField === "consent"} /><span>Jeg accepterer, at Talora behandler oplysningerne for at kontakte mig om et muligt samarbejde. Se <a href="/privatliv">privatlivspolitikken</a>.</span></label>
      {status === "error" && <p className="form-message error" role="alert">{error}</p>}
      {status === "success" && <div className="form-message success" role="status"><CheckCircle2 aria-hidden="true" /><div><strong>Tak for din henvendelse.</strong><span>Talora vender tilbage hurtigst muligt.</span></div></div>}
      <button className="button button-navy submit-button" type="submit" disabled={status === "loading"}>{status === "loading" ? <><LoaderCircle className="spin" aria-hidden="true" /> Sender…</> : "Book et møde"}</button>
    </form>
  );
}
