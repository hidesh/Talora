import Link from "next/link";
import Image from "next/image";

export function Logo({ whiteBackground = false }: { whiteBackground?: boolean }) {
  return <Link className="brand" href="/" aria-label="Talora forside"><Image className="brand-symbol" src={whiteBackground ? "/talora-logo.png" : "/talora-logo-transparent.png"} alt="" width={42} height={38} priority /><span>TALORA</span></Link>;
}
