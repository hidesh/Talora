import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export function PageFrame({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: ReactNode }) {
  return <><Header /><main id="main-content"><section className="page-hero section-shell"><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1>{intro && <p>{intro}</p>}</section>{children}</main><Footer /></>;
}
