import Link from "next/link";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TutorialCard } from "@/components/tutorial-card";
import { categoryFor, tutorialEntries } from "@/lib/tutorials";

export default async function TutorialsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = [...new Set(tutorialEntries.map((item) => categoryFor(item.slug)))];
  const results = category ? tutorialEntries.filter((item) => categoryFor(item.slug) === category) : tutorialEntries;
  return <><SiteHeader /><main className="page shell"><span className="eyebrow">KUNLUN PRACTICE LIBRARY</span><h1 className="page-title">所有教程，都指向一个可验证的成果。</h1><p className="page-lead">来源作者、官方资料和最后核验时间会逐步补齐。先做，再留下你的作品。</p><div className="filters"><Link className={!category ? "active" : ""} href="/tutorials">全部 {tutorialEntries.length}</Link>{categories.map((item) => <Link key={item} className={category === item ? "active" : ""} href={`/tutorials?category=${encodeURIComponent(item)}`}>{item}</Link>)}</div><div className="card-grid">{results.map((tutorial) => <TutorialCard key={tutorial.slug} tutorial={tutorial} slug={tutorial.slug} />)}</div></main><Footer /></>;
}
