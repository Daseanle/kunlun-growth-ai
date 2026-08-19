import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TutorialCard } from "@/components/tutorial-card";
import { TutorialSearch } from "@/components/tutorial-search";
import { categoryFor, tutorialEntries } from "@/lib/tutorials";

export const metadata: Metadata = {
  title: "实战教程库",
  description:
    "所有教程都指向一个可验证的成果。涵盖跨境电商、Agent 自动化、创作、数据与知识等方向，每篇含提示词、通关标准和风险提醒。",
  alternates: { canonical: "/tutorials" },
  openGraph: {
    title: "实战教程库 | 昆仑增长AI实战",
    description: "所有教程都指向一个可验证的成果。涵盖跨境电商、Agent 自动化、创作、数据与知识等方向。",
  },
};

function matchesQuery(tutorial: { short: string; sub: string; chips: string[]; slug: string }, q: string): boolean {
  const ql = q.toLowerCase();
  if (tutorial.short.toLowerCase().includes(ql)) return true;
  if (tutorial.sub.replace(/<[^>]+>/g, "").toLowerCase().includes(ql)) return true;
  if (tutorial.slug.toLowerCase().includes(ql)) return true;
  if (tutorial.chips?.some((c) => c.replace(/<[^>]+>/g, "").toLowerCase().includes(ql))) return true;
  return false;
}

export default async function TutorialsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const categories = [...new Set(tutorialEntries.map((item) => categoryFor(item.slug)))];

  let results = tutorialEntries;
  if (category) results = results.filter((item) => categoryFor(item.slug) === category);
  if (q?.trim()) results = results.filter((item) => matchesQuery(item, q.trim()));

  return (
    <>
      <SiteHeader />
      <main className="page shell">
        <span className="eyebrow">KUNLUN PRACTICE LIBRARY</span>
        <h1 className="page-title">所有教程，都指向一个可验证的成果。</h1>
        <p className="page-lead">来源作者、官方资料和最后核验时间会逐步补齐。先做，再留下你的作品。</p>
        <Suspense fallback={<div className="tutorial-search" style={{ opacity: 0.5 }}>搜索加载中…</div>}>
          <TutorialSearch />
        </Suspense>
        <div className="filters">
          <Link className={!category ? "active" : ""} href={q?.trim() ? `/tutorials?q=${encodeURIComponent(q.trim())}` : "/tutorials"}>全部 {tutorialEntries.length}</Link>
          {categories.map((item) => (
            <Link
              key={item}
              className={category === item ? "active" : ""}
              href={`/tutorials?category=${encodeURIComponent(item)}${q?.trim() ? `&q=${encodeURIComponent(q.trim())}` : ""}`}
            >
              {item}
            </Link>
          ))}
        </div>
        {results.length > 0 ? (
          <div className="card-grid">
            {results.map((tutorial) => (
              <TutorialCard key={tutorial.slug} tutorial={tutorial} slug={tutorial.slug} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>没有找到匹配「{q}」的教程。</p>
            <p style={{ fontSize: "13px", color: "var(--muted)" }}>试试其他关键词，或浏览全部 {tutorialEntries.length} 篇教程。</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
