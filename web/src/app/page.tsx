import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Handshake, PhoneCall } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PartnerCarousel } from "@/components/partner-carousel";

const steps = [
  { number: "01", title: "Vi lærer jer at kende", text: "Vi sætter os ind i jeres ydelser, priser og den måde, I ønsker at blive repræsenteret på.", icon: BriefcaseBusiness },
  { number: "02", title: "Vi tager dialogen", text: "Vi kontakter interesserede kunder hurtigt og taler med både privat- og erhvervskunder på jeres vegne.", icon: PhoneCall },
  { number: "03", title: "Vi følger salget i mål", text: "Vi afdækker behov, følger op og hjælper kunden frem til en klar aftale med jeres virksomhed.", icon: Handshake },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Talora",
    url: "https://talora.dk",
    description: "Talora følger op på kundehenvendelser og lukker salg på vegne af danske virksomheder.",
    areaServed: "DK",
  };

  return (
    <>
      <Header />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow light">Jeres eksterne salgspartner</p>
            <h1 id="hero-title">Fra et varmt lead til et <em>lukket salg.</em></h1>
            <p className="hero-lead">Vi tager dialogen med jeres potentielle kunder, følger struktureret op og repræsenterer jeres virksomhed hele vejen frem til aftalen.</p>
            <div className="hero-actions">
              <Link className="button button-bronze" href="/book-moede">Bliv samarbejdspartner <ArrowRight aria-hidden="true" size={18} /></Link>
              <Link className="text-link light-link" href="/saadan-arbejder-vi">Se hvordan det fungerer</Link>
            </div>
          </div>
          <div className="hero-image-wrap">
            <Image src="/talora-sales-conversation.png" alt="En salgsrådgiver følger personligt op på en kundehenvendelse" fill priority sizes="(max-width: 820px) 100vw, 46vw" className="hero-image" />
            <div className="image-note"><strong>Personlig kontakt</strong><span>Vi taler med kunden, som var vi en del af jeres team.</span></div>
          </div>
        </section>
        <section className="industry-strip section-shell" aria-label="Brancher">
          <p>Skabt til virksomheder med løbende kundehenvendelser</p><span><b>01</b> Flytning</span><span><b>02</b> Rengøring</span><span><b>03</b> Service</span>
        </section>
        <section className="content-section section-shell" aria-labelledby="process-title">
          <div className="section-intro">
            <div><p className="eyebrow">Sådan arbejder vi</p><h2 id="process-title">I leverer opgaven.<br />Vi lukker salget.</h2></div>
            <p className="section-copy">Talora bliver en forlængelse af jeres virksomhed. Vi lærer jeres tilbud, tone og kunder at kende, så hver samtale føles troværdig og professionel. Målet er enkelt: Flere af de henvendelser, I allerede får, skal ende som betalende kunder.</p>
          </div>
          <div className="step-grid">
            {steps.map(({ number, title, text, icon: Icon }) => (
              <article className="step-card" key={number}><span className="step-number">{number}</span><span className="step-icon"><Icon aria-hidden="true" size={23} /></span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </section>
        <PartnerCarousel />
        <section className="cta-section section-shell" aria-labelledby="cta-title">
          <div><p className="eyebrow light">Klar til flere lukkede salg?</p><h2 id="cta-title">Lad os tage en snak om jeres leads og muligheder.</h2></div>
          <Link className="button button-bronze" href="/book-moede">Book et møde <ArrowRight aria-hidden="true" size={18} /></Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
