import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const client = await createSupabaseServerClient();
  if (!client) redirect("/login?error=setup");
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) redirect("/login?redirectedFrom=/admin");
  return data.user;
}
