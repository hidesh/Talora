"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function RecoverySessionHandler() {
  useEffect(() => {
    const parameters = new URLSearchParams(window.location.hash.slice(1));
    const isRecovery = parameters.get("type") === "recovery";
    const hasAuthError = Boolean(parameters.get("error") || parameters.get("error_code"));

    if (!isRecovery && !hasAuthError) return;
    if (hasAuthError) {
      window.location.replace("/login?error=recovery-link");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    let active = true;
    let completing = false;

    const completeRecovery = async () => {
      if (!active || completing) return;
      completing = true;
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        window.location.replace("/login?error=recovery-link");
        return;
      }

      const response = await fetch("/api/auth/recovery-session", { method: "POST" });
      window.location.replace(response.ok ? "/reset-adgangskode" : "/login?error=recovery-link");
    };

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) window.setTimeout(() => void completeRecovery(), 0);
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void completeRecovery();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return null;
}
