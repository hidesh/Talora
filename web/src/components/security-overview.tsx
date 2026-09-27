import { Bot, Fingerprint, ShieldCheck, TimerReset } from "lucide-react";
import type { SecurityEvent, SecurityEventType, SecurityOverview as SecurityOverviewData } from "@/lib/security-events";

const labels: Record<SecurityEventType, string> = {
  honeypot: "Skjult botfelt udfyldt",
  altcha_failed: "ALTCHA kunne ikke godkendes",
  origin_rejected: "Forkert formularoprindelse",
  oversized: "Usædvanligt stor formular",
  duplicate: "Gentaget henvendelse",
  replayed: "Genbrugt ALTCHA-bevis",
  rate_limited: "For mange forsøg",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("da-DK", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Copenhagen",
  }).format(new Date(value));
}

function EventRow({ event }: { event: SecurityEvent }) {
  return (
    <tr>
      <td><span className={`security-kind ${event.is_bot ? "bot" : "suspicious"}`}>{event.is_bot ? "Bot" : "Afvist"}</span></td>
      <td>{labels[event.event_type]}</td>
      <td><code>{event.visitor_hash.slice(0, 10)}</code></td>
      <td>{event.attempts}</td>
      <td>{formatDate(event.last_seen)}</td>
    </tr>
  );
}

export function SecurityOverview({ overview, configured }: { overview: SecurityOverviewData; configured: boolean }) {
  return (
    <section className="security-overview" aria-labelledby="security-heading">
      <div className="security-heading">
        <div>
          <p className="eyebrow">ALTCHA · gratis og selvhostet</p>
          <h2 id="security-heading">Sikkerhedsoverblik</h2>
          <p>Besøgende vises med et anonymiseret id. Talora gemmer ikke deres rå IP-adresse.</p>
        </div>
        <span className="security-live"><ShieldCheck aria-hidden="true" size={18} /> Beskyttelse aktiv</span>
      </div>
      <div className="security-metrics">
        <article><Bot aria-hidden="true" /><span><b>{overview.bot_total}</b>Sandsynlige botforsøg</span></article>
        <article><TimerReset aria-hidden="true" /><span><b>{overview.blocked_24h}</b>Blokeret seneste 24 timer</span></article>
        <article><ShieldCheck aria-hidden="true" /><span><b>{overview.blocked_total}</b>Blokerede forsøg i alt</span></article>
        <article><Fingerprint aria-hidden="true" /><span><b>{overview.unique_visitors}</b>Anonyme besøgs-id’er</span></article>
      </div>
      {!configured ? (
        <div className="security-note">Kør sikkerhedsmigrationen i Supabase for at aktivere statistikken.</div>
      ) : overview.recent.length === 0 ? (
        <div className="security-note">Ingen blokerede formularforsøg endnu.</div>
      ) : (
        <div className="security-table-wrap">
          <table className="security-table">
            <thead><tr><th>Vurdering</th><th>Årsag</th><th>Besøgs-id</th><th>Forsøg</th><th>Senest set</th></tr></thead>
            <tbody>{overview.recent.map((event) => <EventRow key={`${event.event_type}-${event.visitor_hash}-${event.last_seen}`} event={event} />)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
