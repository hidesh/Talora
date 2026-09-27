import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 403 });
  }

  const client = await createSupabaseServerClient();
  if (!client) return NextResponse.json({ error: "Login er ikke konfigureret." }, { status: 503 });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return NextResponse.json({ error: "Nulstillingslinket er ugyldigt eller udløbet." }, { status: 401 });

  const cookieStore = await cookies();
  cookieStore.set("talora_recovery", "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });

  return NextResponse.json({ success: true });
}
