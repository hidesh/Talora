import Link from "next/link";

export function Logo() {
  return <Link className="brand" href="/" aria-label="Talora forside"><span className="brand-mark" aria-hidden="true">A</span><span>TALORA</span></Link>;
}
