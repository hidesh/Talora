import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type LeadStatus = "new" | "in_progress" | "handled" | "archived";
export type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  services: string;
  message: string | null;
  status: LeadStatus;
  saved: boolean;
  created_at: string;
  deleted_at: string | null;
};

export async function getLeads() {
  const client = createSupabaseAdminClient();
  if (!client) return { leads: [] as Lead[], configured: false };
  const { data, error } = await client.from("leads").select("id,first_name,last_name,email,phone,company,services,message,status,saved,created_at,deleted_at").order("created_at", { ascending: false });
  if (error) throw new Error("Henvendelserne kunne ikke hentes.");
  return { leads: (data ?? []) as Lead[], configured: true };
}
