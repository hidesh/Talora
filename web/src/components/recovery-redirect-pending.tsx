"use client";

import { useEffect } from "react";

export function RecoveryRedirectPending() {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.location.replace("/login?error=recovery-link");
    }, 15000);
    return () => window.clearTimeout(timeout);
  }, []);

  return <p role="status">Nulstillingslinket bekræftes…</p>;
}
