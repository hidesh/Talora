import { NextResponse } from "next/server";
import { generateAltchaChallenge } from "@/lib/altcha";

export async function GET() {
  try {
    return NextResponse.json(await generateAltchaChallenge(), { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    console.error("ALTCHA challenge error", error);
    return NextResponse.json({ error: "Verifikation kunne ikke indlæses." }, { status: 503 });
  }
}
