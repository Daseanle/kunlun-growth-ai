import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TutorialCard } from "@/components/tutorial-card";
import { tutorialEntries } from "@/lib/tutorials";

export const metadata: Metadata = {
  description:
    "面向全球中文用户的 AI 实战、作品与真实应用验证平台。首个赛道：AI × 跨境电商。带提示词、通关标准和风险提醒的实战教程。",
  alternates: { canonical: "/" },
};

const ecommerce = tutorialEntries.filter((item) => ["ecom-3d-ad", "shopify-agentic", "ugc-variants", "amazon-ai-listing", "ugc-factory", "human-loop-store"].includes(item.slug));
const latest = tutorialEntries.slice(0, 6);

export default function HomePage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "昆仑增长AI实战",
    url: "https://kunlun-growth-ai.vercel.app",
    description: "面向全球中文用户的 AI 实战、作品与真实应用验证平台",
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} /><SiteHeader /><main>
    <section className="hero-section"><div className="shell hero-grid"><div><span className="eyebrow">AI APPLICATIONS · GLOBAL CHINESE COMMUNITY</span><h1>从教程到真实应用，<em>让增长发生。</em></h1><p className="hero-copy">昆仑增长AI实战，帮助全球中文用户做出可用作品；帮助 AI 项目找到真实用户；帮助企业发现能落地的解决方案。</p><div className="hero-actions"><Link className="button" href="/tutorials">开始一篇实战教程</Link><Link className="button ghost" href="/submit">提交我的作品</Link></div><div className="hero-trust"><span>✦ 首发赛道：AI × 跨境电商</span><span>✦ 来源与作者可追溯</span><span>✦ 不只展示 Demo</span></div></div><div className="hero-panel"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="proof-card top"><span>01</span><strong>做出作品</strong><small>跟着教程，完成可展示成果</small></div><div className="proof-card middle"><span>02</span><strong>获得试用</strong><small>面向真实用户与企业场景</small></div><div className="proof-card bottom"><span>03</span><strong>形成验证</strong><small>Demo → Tested → Used</small></div></div></div></section>
    <section className="signal-strip"><div className="shell signal-grid"><div><b>{tutorialEntries.length}</b><span>已核验实战教程</span></div><div><b>AI × 跨境</b><span>首个垂直增长赛道</span></div><div><b>公开作品</b><span>默认公开，作者可随时撤回</span></div><div><b>真实挑战</b><span>企业问题即将开放</span></div></div></section>
    <section className="section shell"><div className="section-head"><div><span className="kicker">START WITH ACTION</span><h2>先做出来，再谈增长</h2><p>每篇教程都有明确目标、复制提示词、通关标准、风险提醒和原始来源。</p></div><Link className="arrow-link" href="/tutorials">查看全部教程 →</Link></div><div className="card-grid">{latest.map((tutorial) => <TutorialCard key={tutorial.slug} tutorial={tutorial} slug={tutorial.slug} />)}</div></section>
    <section className="section tint"><div className="shell"><div className="section-head"><div><span className="kicker">AI × CROSS-BORDER E-COMMERCE</span><h2>从“会用 AI”到“能带来业务结果”</h2><p>图片、短视频、Listing、UGC、商品目录与人机协作，先从最接近业务的一公里开始。</p></div><Link className="arrow-link" href="/tutorials?category=跨境电商">进入专题 →</Link></div><div className="card-grid three">{ecommerce.slice(0, 3).map((tutorial) => <TutorialCard key={tutorial.slug} tutorial={tutorial} slug={tutorial.slug} />)}</div></div></section>
    <section className="section shell"><div className="path"><div><span className="kicker">THE KUNLUN PATH</span><h2>一条更适合 AI 项目的成长路径</h2><p>不是堆一份 Demo，而是逐步留下可验证的应用证据。</p></div><ol><li><b>01</b><strong>实战教程</strong><span>做出一个完整成果</span></li><li><b>02</b><strong>作品广场</strong><span>公开展示、获得反馈</span></li><li><b>03</b><strong>项目验证</strong><span>测试、试用、更新记录</span></li><li><b>04</b><strong>企业挑战</strong><span>在真实问题中落地</span></li></ol></div></section>
    <section className="section shell"><div className="callout"><div><span className="kicker">FOR BUILDERS · TEAMS · BUSINESSES</span><h2>你带着问题来，带着下一步离开。</h2><p>作品默认公开，资源与机构联系采用双方同意机制。平台展示验证证据，不承诺融资、不替任何项目背书。</p></div><div className="callout-actions"><Link className="button" href="/submit">发布作品或项目</Link><Link className="button ghost dark" href="/contact">提交资源需求</Link></div></div></section>
  </main><Footer /></>;
}
