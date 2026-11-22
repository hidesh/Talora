import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) {
    console.warn("Recovery confirmation failed: origin mismatch");
    return NextResponse.redirect(new URL("/login?error=recovery-link", request.url), 303);
  }
  const formData = await request.formData();
  const tokenHash = formData.get("token_hash");
  const type = formData.get("type");
  const loginUrl = new URL("/login?error=recovery-link", request.url);

  if (typeof tokenHash !== "string" || tokenHash.length < 20 || tokenHash.length > 512 || /\s/.test(tokenHash) || type !== "recovery") {
    console.warn("Recovery confirmation failed: invalid form data");
    return NextResponse.redirect(loginUrl, 303);
  }

  const client = await createSupabaseServerClient();
  if (!client) {
    console.warn("Recovery confirmation failed: auth configuration unavailable");
    return NextResponse.redirect(loginUrl, 303);
  }
  const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
  if (error) {
    console.warn("Recovery confirmation failed: token verification", { code: error.code ?? "unknown", status: error.status });
    return NextResponse.redirect(loginUrl, 303);
  }

  console.info("Recovery confirmation: token verified");

  const cookieStore = await cookies();
  cookieStore.set("talora_recovery", "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });

  return NextResponse.redirect(new URL("/reset-adgangskode", request.url), 303);
}
