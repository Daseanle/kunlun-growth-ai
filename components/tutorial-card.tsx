import Link from "next/link";
import type { Tutorial } from "@/lib/tutorials";
import { categoryFor, sourceAuthor } from "@/lib/tutorials";

export function TutorialCard({ tutorial, slug }: { tutorial: Tutorial; slug: string }) {
  const source = tutorial.sources?.[0];
  return <Link className="tutorial-card" href={`/tutorials/${slug}`}><span className="pill">{categoryFor(slug)}</span><h3>{tutorial.short}</h3><p>{tutorial.sub.replace(/<[^>]+>/g, "")}</p><div className="card-meta"><span>{tutorial.chips?.[0]?.replace(/<[^>]+>/g, "") || `${tutorial.steps.length} 步`}</span><span>{source ? `来源：${sourceAuthor(source[1])}` : "来源待补充"}</span></div><span className="card-cta">开始实战 <b>→</b></span></Link>;
}
