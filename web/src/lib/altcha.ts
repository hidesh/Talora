import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

function getKey() {
  const key = process.env.ALTCHA_HMAC_KEY;
  if (!key || key.length < 32) throw new Error("ALTCHA_HMAC_KEY skal være mindst 32 tegn.");
  return key;
}

export async function generateAltchaChallenge() {
  const salt = `${randomBytes(16).toString("hex")}?expires=${Math.floor(Date.now() / 1000) + 300}`;
  const maxnumber = 50000;
  const challenge = createHash("sha256").update(salt + randomInt(maxnumber + 1)).digest("hex");
  return { algorithm: "SHA-256", challenge, maxnumber, salt, signature: createHmac("sha256", getKey()).update(challenge).digest("hex") };
}

export async function verifyAltchaSolution(payload: string) {
  try {
    if (payload.length > 4096) return false;
    const parsed = JSON.parse(Buffer.from(payload, "base64").toString("utf8")) as Record<string, unknown>;
    const { algorithm, challenge, number, salt, signature } = parsed;
    if (algorithm !== "SHA-256" || !Number.isInteger(number) || Number(number) < 0 || Number(number) > 50000) return false;
    if (typeof salt !== "string" || !/^[a-f0-9]{32}\?expires=\d{10}$/.test(salt)) return false;
    if (typeof challenge !== "string" || typeof signature !== "string" || !/^[a-f0-9]{64}$/.test(challenge) || !/^[a-f0-9]{64}$/.test(signature)) return false;
    const expires = Number(salt.split("=")[1]);
    const now = Math.floor(Date.now() / 1000);
    if (expires <= now || expires > now + 300) return false;
    const expectedSignature = createHmac("sha256", getKey()).update(challenge).digest();
    return timingSafeEqual(Buffer.from(signature, "hex"), expectedSignature) && createHash("sha256").update(salt + number).digest("hex") === challenge;
  } catch {
    return false;
  }
}
