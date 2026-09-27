import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { z } from "zod";

export const leadSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.email().max(254),
  phone: z.string().trim().min(6).max(30).regex(/^[+\d\s().-]+$/),
  company: z.string().trim().min(1).max(120),
  services: z.string().trim().min(3).max(1200),
  message: z.string().trim().max(2000).optional().default(""),
  consent: z.literal(true),
  altchaPayload: z.string().min(1).max(4096),
  website: z.string().max(120).optional().default(""),
});

function digest(namespace: string, value: string) {
  const secret = process.env.CONTACT_FINGERPRINT_SECRET ?? process.env.ALTCHA_HMAC_KEY;
  if (!secret || secret.length < 32) throw new Error("Kontaktformularens sikkerhed er ikke konfigureret.");
  return createHmac("sha256", secret).update(`${namespace}:${value}`).digest("hex");
}

export function requestFingerprint(request: Request) {
  if (process.env.VERCEL !== "1") return digest("ip", "local-development");
  const forwarded = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",", 1)[0]?.trim();
  if (!ip || !isIP(ip)) throw new Error("Betroet klientadresse mangler.");
  return digest("ip", ip);
}

export function leadFingerprints(request: Request, email: string, message: string) {
  return {
    ip: requestFingerprint(request),
    sender: digest("sender", email.toLowerCase()),
    message: digest("message", message.normalize("NFKC").replace(/\s+/gu, " ").trim().toLowerCase()),
  };
}
