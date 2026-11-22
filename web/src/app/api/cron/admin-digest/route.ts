import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type DigestClaim = { id: string; period_start: string };
type DigestLead = { id: string; first_name: string; last_name: string; company: string; created_at: string; status: string; updated_at?: string };

function leadLine(lead: DigestLead, showLastActivity = false) {
  const company = lead.company.replace(/[\r\n]+/g, " ");
  const name = `${lead.first_name} ${lead.last_name}`.replace(/[\r\n]+/g, " ");
  const dateValue = showLastActivity && lead.status === "in_progress" ? lead.updated_at ?? lead.created_at : lead.created_at;
  const date = new Intl.DateTimeFormat("da-DK", { dateStyle: "short", timeZone: "Europe/Copenhagen" }).format(new Date(dateValue));
  const note = showLastActivity && lead.status === "in_progress" ? "sidst opdateret" : "modtaget";
  return `- ${name}, ${company} (${note} ${date})`;
}

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!supabase || !apiKey || !sender) {
    return NextResponse.json({ ok: false, reason: "configuration" }, { status: 503 });
  }

  const { data: rawClaim, error: claimError } = await supabase.rpc("claim_admin_digest");
  if (claimError) {
    console.error("Admin digest claim failed", claimError);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  if (!rawClaim) {
    return NextResponse.json({ ok: true, sent: false }, { headers: { "Cache-Control": "no-store" } });
  }

  const claim = rawClaim as DigestClaim;
  const now = new Date();
  const oldNew = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const staleProgress = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString();
  let emailAccepted = false;
  let stage = "database_query";

  try {
    const [recent, open, unattended, stalled] = await Promise.all([
      supabase.from("leads").select("id,first_name,last_name,company,created_at,status", { count: "exact" }).is("deleted_at", null).gte("created_at", claim.period_start).order("created_at", { ascending: false }).limit(8),
      supabase.from("leads").select("id", { count: "exact", head: true }).is("deleted_at", null).in("status", ["new", "in_progress"]),
      supabase.from("leads").select("id,first_name,last_name,company,created_at,status", { count: "exact" }).is("deleted_at", null).eq("status", "new").lt("created_at", oldNew).order("created_at", { ascending: true }).limit(8),
      supabase.from("leads").select("id,first_name,last_name,company,created_at,status,updated_at", { count: "exact" }).is("deleted_at", null).eq("status", "in_progress").lt("updated_at", staleProgress).order("updated_at", { ascending: true }).limit(8),
    ]);
    const queryError = [recent.error, open.error, unattended.error, stalled.error].find(Boolean);
    if (queryError) throw queryError;

    const recentCount = recent.count ?? 0;
    const openCount = open.count ?? 0;
    const overdueCount = (unattended.count ?? 0) + (stalled.count ?? 0);
    const overdue = [...(unattended.data ?? []), ...(stalled.data ?? [])] as DigestLead[];
    const recipient = "info@talora.dk";
    const adminUrl = new URL("/admin", process.env.NEXT_PUBLIC_SITE_URL || "https://talora.dk").toString();
    const report = [
      "Talora – status på henvendelser",
      "",
      `Nye henvendelser siden sidste rapport: ${recentCount}`,
      `Åbne sager i alt: ${openCount}`,
      `Sager, der bør følges op på: ${overdueCount}`,
      "",
      "Seneste henvendelser:",
      ...(recent.data?.length ? (recent.data as DigestLead[]).map((lead) => leadLine(lead)) : ["- Ingen nye henvendelser"]),
      "",
      "Sager til opfølgning (højst 16 vist):",
      ...(overdue.length ? overdue.map((lead) => leadLine(lead, true)) : ["- Ingen overskredne sager"]),
      "",
      "En ny sag markeres til opfølgning efter 24 timer. En sag i gang markeres efter 72 timer uden opdatering.",
      `Se og håndter sager: ${adminUrl}`,
    ].join("\n");

    stage = "log_update";
    const { error: contentError } = await supabase.from("admin_digest_logs").update({
      new_inquiries: recentCount,
      open_inquiries: openCount,
      overdue_inquiries: overdueCount,
      report_text: report,
    }).eq("id", claim.id);
    if (contentError) throw contentError;

    stage = "email_send";
    const resend = new Resend(apiKey);
    const { data: email, error: emailError } = await resend.emails.send({
      from: sender,
      to: recipient,
      subject: `Talora status: ${recentCount} nye · ${overdueCount} til opfølgning`,
      text: report,
    }, { idempotencyKey: `talora-admin-digest/${claim.id}` });
    if (emailError || !email?.id) throw emailError ?? new Error("Mailen blev ikke accepteret.");
    emailAccepted = true;

    stage = "log_update";
    const { error: logError } = await supabase.from("admin_digest_logs").update({
      status: "sent",
      sent_at: now.toISOString(),
      resend_email_id: email.id,
    }).eq("id", claim.id);
    if (logError) throw logError;

    return NextResponse.json({ ok: true, sent: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(`Admin digest failed at ${stage}`, error);
    if (!emailAccepted) {
      const { error: logError } = await supabase.from("admin_digest_logs").update({ status: "failed", error_message: stage }).eq("id", claim.id);
      if (logError) console.error("Admin digest failure could not be logged", logError);
    }
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
