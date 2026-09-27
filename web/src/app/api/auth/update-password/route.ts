import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({ password: z.string().min(12).max(128) });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 1000) return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 413 });
  const cookieStore = await cookies();
  if (cookieStore.get("talora_recovery")?.value !== "active") return NextResponse.json({ error: "Nulstillingslinket er udløbet." }, { status: 401 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 400 });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Adgangskoden skal være mellem 12 og 128 tegn." }, { status: 400 });

  const client = await createSupabaseServerClient();
  if (!client) return NextResponse.json({ error: "Login er ikke konfigureret." }, { status: 503 });
  const { data, error: userError } = await client.auth.getUser();
  if (userError || !data.user) return NextResponse.json({ error: "Nulstillingslinket er ugyldigt." }, { status: 401 });

  const { error } = await client.auth.updateUser({ password: parsed.data.password });
  if (error) return NextResponse.json({ error: "Adgangskoden kunne ikke ændres. Linket kan være udløbet." }, { status: 400 });

  await client.auth.signOut({ scope: "global" });
  const response = NextResponse.json({ success: true });
  response.cookies.set("talora_recovery", "", { path: "/", maxAge: 0 });
  return response;
}
