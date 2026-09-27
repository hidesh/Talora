import { requestFingerprint } from "@/lib/contact-security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type SecurityEventType =
  | "honeypot"
  | "altcha_failed"
  | "origin_rejected"
  | "oversized"
  | "duplicate"
  | "replayed"
  | "rate_limited";

export type SecurityEvent = {
  event_type: SecurityEventType;
  visitor_hash: string;
  is_bot: boolean;
  attempts: number;
  first_seen: string;
  last_seen: string;
};

export type SecurityOverview = {
  blocked_total: number;
  blocked_24h: number;
  bot_total: number;
  unique_visitors: number;
  recent: SecurityEvent[];
};

const emptyOverview: SecurityOverview = {
  blocked_total: 0,
  blocked_24h: 0,
  bot_total: 0,
  unique_visitors: 0,
  recent: [],
};

export async function recordSecurityEvent(request: Request, eventType: SecurityEventType, isBot: boolean) {
  try {
    const client = createSupabaseAdminClient();
    if (!client) return;
    const { error } = await client.rpc("record_contact_security_event", {
      p_event_type: eventType,
      p_visitor_hash: requestFingerprint(request),
      p_is_bot: isBot,
    });
    if (error) console.error("Security event log error", error);
  } catch (error) {
    console.error("Security event log error", error);
  }
}

export async function getSecurityOverview() {
  const client = createSupabaseAdminClient();
  if (!client) return { overview: emptyOverview, configured: false };
  const { data, error } = await client.rpc("get_contact_security_overview");
  if (error || !data || typeof data !== "object" || Array.isArray(data)) {
    if (error) console.warn(`Security overview unavailable (${error.code ?? "unknown"}): ${error.message}`);
    return { overview: emptyOverview, configured: false };
  }
  const value = data as unknown as Partial<SecurityOverview>;
  return {
    configured: true,
    overview: {
      blocked_total: Number(value.blocked_total ?? 0),
      blocked_24h: Number(value.blocked_24h ?? 0),
      bot_total: Number(value.bot_total ?? 0),
      unique_visitors: Number(value.unique_visitors ?? 0),
      recent: Array.isArray(value.recent) ? value.recent : [],
    },
  };
}
