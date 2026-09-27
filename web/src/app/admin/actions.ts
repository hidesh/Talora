"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const idSchema = z.uuid();
const statusSchema = z.enum(["new", "in_progress", "handled", "archived"]);

async function adminClient() {
  await requireAdmin();
  const client = createSupabaseAdminClient();
  if (!client) throw new Error("Supabase er ikke konfigureret.");
  return client;
}

export async function setLeadStatus(id: string, status: string) {
  const leadId = idSchema.parse(id);
  const nextStatus = statusSchema.parse(status);
  const client = await adminClient();
  const { error } = await client.from("leads").update({ status: nextStatus, handled_at: nextStatus === "handled" ? new Date().toISOString() : null }).eq("id", leadId);
  if (error) throw new Error("Status kunne ikke opdateres.");
  revalidatePath("/admin");
}

export async function setLeadSaved(id: string, saved: boolean) {
  const client = await adminClient();
  const { error } = await client.from("leads").update({ saved }).eq("id", idSchema.parse(id));
  if (error) throw new Error("Henvendelsen kunne ikke gemmes.");
  revalidatePath("/admin");
}

export async function setLeadDeleted(id: string, deleted: boolean) {
  const client = await adminClient();
  const { error } = await client.from("leads").update({ deleted_at: deleted ? new Date().toISOString() : null }).eq("id", idSchema.parse(id));
  if (error) throw new Error("Henvendelsen kunne ikke flyttes.");
  revalidatePath("/admin");
}

export async function signOut() {
  const client = await createSupabaseServerClientForSignOut();
  await client?.auth.signOut();
  redirect("/login");
}

async function createSupabaseServerClientForSignOut() {
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  return createSupabaseServerClient();
}
