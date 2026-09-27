import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { AdminLeads } from "@/components/admin-leads";
import { Logo } from "@/components/logo";
import { SecurityOverview } from "@/components/security-overview";
import { requireAdmin } from "@/lib/auth";
import { getLeads } from "@/lib/leads";
import { getSecurityOverview } from "@/lib/security-events";
import { signOut } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdmin();
  const [{ leads, configured }, security] = await Promise.all([getLeads(), getSecurityOverview()]);
  const active = leads.filter((lead) => !lead.deleted_at && lead.status !== "archived");
  const emailRecipient = process.env.CONTACT_EMAIL?.trim() || "info@talora.dk";
  const emailConfigured = Boolean(process.env.RESEND_API_KEY);
  return <main id="main-content" className="admin-page"><aside className="admin-sidebar"><Logo /><div><p className="eyebrow light">Administration</p><h1>Henvendelser</h1><p>{user.email}</p></div><form action={signOut}><button type="submit"><LogOut aria-hidden="true" size={18} />Log ud</button></form></aside><section className="admin-main"><header><div><p className="eyebrow">Talora leads</p><h2>Overblik og opfølgning</h2></div><div className="admin-stats"><span><b>{leads.length}</b> indsendt</span><span><b>{active.length}</b> aktive</span><span><b>{active.filter((lead) => lead.status === "new").length}</b> nye</span><span><b>{security.overview.bot_total}</b> bots</span></div></header>{!emailConfigured && <div className="admin-config-warning"><strong>E-mailnotifikationer er ikke aktive.</strong><span>Henvendelser gemmes, men der sendes ingen mail til {emailRecipient}, før RESEND_API_KEY er tilføjet.</span></div>}{configured ? <AdminLeads leads={leads} /> : <div className="empty-state"><h2>Supabase mangler</h2><p>Tilføj miljøvariablerne og kør databasemigreringen for at aktivere adminpanelet.</p></div>}<SecurityOverview overview={security.overview} configured={security.configured} /></section></main>;
}
