import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="brand" aria-label="昆仑增长AI实战首页"><span className="brand-mark">昆</span>{!compact && <span>昆仑增长<small>AI 实战</small></span>}</Link>;
}
