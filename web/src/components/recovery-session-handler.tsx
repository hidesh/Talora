"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function RecoverySessionHandler() {
  useEffect(() => {
    const parameters = new URLSearchParams(window.location.hash.slice(1));
    const isRecovery = parameters.get("type") === "recovery";
    const hasAuthError = Boolean(parameters.get("error") || parameters.get("error_code"));
    const recoveryAccessToken = parameters.get("access_token");

    if (!isRecovery && !hasAuthError) return;
    if (hasAuthError) {
      window.location.replace("/login?error=recovery-link");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    let active = true;
    let completing = false;
    const timeout = window.setTimeout(() => {
      if (active && !completing) window.location.replace("/login?error=recovery-link");
    }, 10000);

    const completeRecovery = async () => {
      if (!active || completing) return;
      completing = true;
      window.clearTimeout(timeout);
      try {
        const response = await fetch("/api/auth/recovery-session", { method: "POST" });
        window.location.replace(response.ok ? "/reset-adgangskode" : "/login?error=recovery-link");
      } catch {
        window.location.replace("/login?error=recovery-link");
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) window.setTimeout(() => void completeRecovery(), 0);
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (recoveryAccessToken && data.session?.access_token === recoveryAccessToken) void completeRecovery();
    }).catch(() => {
      // The timeout below will show the same safe invalid-link message.
    });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  return null;
}
