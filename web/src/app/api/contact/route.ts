import { NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyAltchaSolution } from "@/lib/altcha";
import { leadFingerprints, leadSchema } from "@/lib/contact-security";
import { recordSecurityEvent } from "@/lib/security-events";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]!);
}

const fieldMessages: Record<string, string> = {
  firstName: "Indtast et fornavn.",
  lastName: "Indtast et efternavn.",
  email: "Indtast en gyldig e-mailadresse.",
  phone: "Indtast et gyldigt telefonnummer.",
  company: "Indtast virksomhedens navn.",
  services: "Beskriv kort, hvilke opgaver I tilbyder.",
  consent: "Du skal acceptere privatlivspolitikken.",
};

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) {
      await recordSecurityEvent(request, "origin_rejected", true);
      return NextResponse.json({ error: "Ugyldig formularoprindelse." }, { status: 403 });
    }
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 20000) {
      await recordSecurityEvent(request, "oversized", true);
      return NextResponse.json({ error: "Formularen er for stor." }, { status: 413 });
    }

    const raw = (await request.json()) as Record<string, unknown>;
    if (typeof raw.website === "string" && raw.website.length > 0) {
      await recordSecurityEvent(request, "honeypot", true);
      return NextResponse.json({ success: true });
    }
    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) {
      const path = parsed.error.issues[0]?.path[0];
      const field = typeof path === "string" ? path : undefined;
      return NextResponse.json({ error: fieldMessages[field ?? ""] ?? "Kontrollér venligst de markerede oplysninger.", field }, { status: 400 });
    }
    const data = parsed.data;
    if (!(await verifyAltchaSolution(data.altchaPayload))) {
      await recordSecurityEvent(request, "altcha_failed", false);
      return NextResponse.json({ error: "Sikkerhedsverifikationen er udløbet. Prøv igen.", resetAltcha: true }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ error: "Formularen er ikke konfigureret endnu." }, { status: 503 });
    const fingerprints = leadFingerprints(request, data.email, `${data.services} ${data.message}`);
    const challenge = (JSON.parse(Buffer.from(data.altchaPayload, "base64").toString("utf8")) as { challenge: string }).challenge;
    const { data: result, error } = await supabase.rpc("submit_talora_lead", {
      p_challenge: challenge,
      p_sender_hash: fingerprints.sender,
      p_ip_hash: fingerprints.ip,
      p_message_hash: fingerprints.message,
      p_first_name: data.firstName,
      p_last_name: data.lastName,
      p_email: data.email,
      p_phone: data.phone,
      p_company: data.company,
      p_services: data.services,
      p_message: data.message,
    });
    if (error || !result) {
      console.error("Lead insert error", error);
      return NextResponse.json({ error: "Henvendelsen kunne ikke gemmes. Prøv igen senere." }, { status: 503 });
    }
    const response = result as { status?: string; id?: string; retry_after?: number };
    if (response.status === "duplicate") {
      await recordSecurityEvent(request, "duplicate", false);
      return NextResponse.json({ error: "Denne henvendelse er allerede modtaget." }, { status: 409 });
    }
    if (response.status === "replayed") {
      await recordSecurityEvent(request, "replayed", true);
      return NextResponse.json({ error: "Verifikationen er allerede brugt. Prøv igen.", resetAltcha: true }, { status: 400 });
    }
    if (response.status === "rate_limited") {
      await recordSecurityEvent(request, "rate_limited", true);
      return NextResponse.json({ error: "For mange henvendelser. Prøv igen senere." }, { status: 429, headers: { "Retry-After": String(response.retry_after ?? 900) } });
    }
    if (response.status !== "accepted" || !response.id) return NextResponse.json({ error: "Henvendelsen kunne ikke modtages." }, { status: 503 });

    const recipient = process.env.CONTACT_EMAIL?.trim() || "info@talora.dk";
    let notificationSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error: emailError } = await resend.emails.send({
          from: process.env.CONTACT_FROM_EMAIL ?? "Talora <onboarding@resend.dev>",
          to: recipient,
          replyTo: data.email,
          subject: `Ny mødeforespørgsel fra ${data.company}`,
          html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto"><h2>Ny mødeforespørgsel</h2><p><strong>Navn:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p><p><strong>Virksomhed:</strong> ${escapeHtml(data.company)}</p><p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p><p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p><h3>Opgaver</h3><p style="white-space:pre-wrap">${escapeHtml(data.services)}</p>${data.message ? `<h3>Bemærkning</h3><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>` : ""}<p><a href="${escapeHtml(process.env.NEXT_PUBLIC_SITE_URL ?? "https://talora.dk")}/admin">Åbn Taloras adminpanel</a></p></div>`,
        });
        if (emailError) throw new Error(`${emailError.name}: ${emailError.message}`);
        notificationSent = true;
      } catch (emailError) {
        console.error("Lead email error", emailError);
      }
    } else {
      console.warn(`Lead notification not sent: RESEND_API_KEY is missing. Recipient: ${recipient}`);
    }

    return NextResponse.json({ success: true, id: response.id, notificationSent });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json({ error: "Der opstod en fejl. Prøv igen senere." }, { status: 500 });
  }
}
