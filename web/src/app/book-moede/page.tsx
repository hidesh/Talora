import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageFrame } from "@/components/page-frame";

export const metadata: Metadata = { title: "Book et møde", description: "Fortæl Talora om jeres virksomhed og de leads, I ønsker hjælp til at følge op på.", alternates: { canonical: "/book-moede" } };

export default function BookMeetingPage() {
  return <PageFrame eyebrow="Bliv samarbejdspartner" title="Lad os tale om jeres næste salg" intro="Fortæl kort om jeres virksomhed og de opgaver, I tilbyder. Vi vender tilbage til en uforpligtende samtale om mulighederne."><section className="form-section section-shell"><div className="form-aside"><p className="eyebrow">Det sker bagefter</p><h2>En enkel og konkret samtale</h2><ol><li><b>01</b><span>Vi læser jeres henvendelse og sætter os ind i jeres ydelse.</span></li><li><b>02</b><span>Vi kontakter jer for at forstå jeres leads og salgsproces.</span></li><li><b>03</b><span>I får et konkret forslag til, hvordan samarbejdet kan fungere.</span></li></ol></div><ContactForm /></section></PageFrame>;
}
