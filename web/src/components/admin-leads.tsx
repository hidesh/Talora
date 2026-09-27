"use client";

import { Bookmark, CheckCircle2, Clock3, Mail, Phone, RotateCcw, Search, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { setLeadDeleted, setLeadSaved, setLeadStatus } from "@/app/admin/actions";
import type { Lead, LeadStatus } from "@/lib/leads";

const labels: Record<LeadStatus, string> = { new: "Ny", in_progress: "I gang", handled: "Behandlet", archived: "Arkiveret" };

export function AdminLeads({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"active" | LeadStatus | "saved" | "trash">("active");
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const filtered = useMemo(() => leads.filter((lead) => {
    const text = `${lead.first_name} ${lead.last_name} ${lead.email} ${lead.company} ${lead.services}`.toLowerCase();
    const matchesSearch = text.includes(query.toLowerCase());
    const matchesFilter = filter === "trash" ? !!lead.deleted_at : !lead.deleted_at && (filter === "active" ? lead.status !== "archived" : filter === "saved" ? lead.saved : lead.status === filter);
    return matchesSearch && matchesFilter;
  }), [leads, query, filter]);

  const run = (operation: () => Promise<void>) => {
    setError("");
    startTransition(async () => {
      try { await operation(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Handlingen mislykkedes."); }
    });
  };

  return <div className="admin-content">
    <div className="admin-toolbar"><label className="admin-search"><Search aria-hidden="true" size={18} /><span className="sr-only">Søg</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Søg efter navn, virksomhed eller e-mail" /></label><div className="filter-row">{(["active", "new", "in_progress", "handled", "saved", "archived", "trash"] as const).map((value) => <button key={value} className={filter === value ? "active" : ""} type="button" onClick={() => setFilter(value)}>{value === "active" ? "Aktive" : value === "saved" ? "Gemte" : value === "trash" ? "Papirkurv" : labels[value]}</button>)}</div></div>
    {error && <p className="form-message error" role="alert">{error}</p>}
    {filtered.length === 0 ? <div className="empty-state"><Mail aria-hidden="true" /><h2>Ingen henvendelser her</h2><p>Prøv et andet filter eller en anden søgning.</p></div> : <div className="lead-list">{filtered.map((lead) => {
      const isOpen = selected === lead.id;
      return <article className={`lead-card ${isOpen ? "open" : ""}`} key={lead.id}>
        <button className="lead-summary" type="button" onClick={() => setSelected(isOpen ? null : lead.id)} aria-expanded={isOpen}>
          <span className="lead-company"><b>{lead.company}</b><small>{lead.first_name} {lead.last_name}</small></span>
          <span className={`status status-${lead.status}`}>{lead.status === "handled" ? <CheckCircle2 aria-hidden="true" size={15} /> : <Clock3 aria-hidden="true" size={15} />}{labels[lead.status]}</span>
          <span>{new Intl.DateTimeFormat("da-DK", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.created_at))}</span>
        </button>
        {isOpen && <div className="lead-details"><div className="lead-contact"><a href={`mailto:${lead.email}`}><Mail aria-hidden="true" size={17} />{lead.email}</a><a href={`tel:${lead.phone}`}><Phone aria-hidden="true" size={17} />{lead.phone}</a></div><section><h3>Opgaver</h3><p>{lead.services}</p></section>{lead.message && <section><h3>Bemærkning</h3><p>{lead.message}</p></section>}<div className="lead-actions"><select value={lead.status} onChange={(event) => run(() => setLeadStatus(lead.id, event.target.value))} disabled={pending} aria-label="Skift status"><option value="new">Ny</option><option value="in_progress">I gang</option><option value="handled">Behandlet</option><option value="archived">Arkiveret</option></select><button type="button" onClick={() => run(() => setLeadSaved(lead.id, !lead.saved))} disabled={pending}><Bookmark aria-hidden="true" size={17} fill={lead.saved ? "currentColor" : "none"} />{lead.saved ? "Fjern fra gemte" : "Gem"}</button>{lead.deleted_at ? <button type="button" onClick={() => run(() => setLeadDeleted(lead.id, false))} disabled={pending}><RotateCcw aria-hidden="true" size={17} />Gendan</button> : <button className="danger" type="button" onClick={() => { if (window.confirm("Flyt henvendelsen til papirkurven?")) run(() => setLeadDeleted(lead.id, true)); }} disabled={pending}><Trash2 aria-hidden="true" size={17} />Slet</button>}</div></div>}
      </article>;
    })}</div>}
  </div>;
}
