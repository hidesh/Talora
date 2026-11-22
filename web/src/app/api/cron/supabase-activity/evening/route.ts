import { handleSupabaseActivity } from "@/lib/supabase/activity";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleSupabaseActivity(request);
}
