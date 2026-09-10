import Link from "next/link";
import { Network } from "lucide-react";
export function Brand({ href = "/" }: { href?: string }) {
  return <Link href={href} className="brand" aria-label="Graphite home"><span className="brand-symbol"><Network size={22} strokeWidth={1.8}/></span><span>graphite<span className="brand-dot">.</span></span></Link>;
}
