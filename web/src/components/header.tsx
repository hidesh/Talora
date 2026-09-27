"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

const links = [
  { href: "/saadan-arbejder-vi", label: "Sådan arbejder vi" },
  { href: "/samarbejdspartnere", label: "Samarbejdspartnere" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);
  return (
    <header className="site-header"><div className="header-inner section-shell">
      <Logo />
      <nav className="desktop-nav" aria-label="Primær navigation">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}<Link className="button button-navy compact" href="/book-moede">Book et møde</Link></nav>
      <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Luk menu" : "Åbn menu"} onClick={() => setOpen((value) => !value)}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      {open && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobil navigation">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}<Link href="/book-moede" onClick={() => setOpen(false)}>Book et møde</Link></nav>}
    </div></header>
  );
}
