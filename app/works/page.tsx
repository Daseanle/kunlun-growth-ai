import Link from "next/link";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

const examples = [
  ["商品图到 3D 广告", "AI × 跨境电商", "待首批作品开放"],
  ["Shopify 商品可读目录", "独立站增长", "待首批作品开放"],
  ["跨境 UGC 测试台", "内容增长", "待首批作品开放"],
];

export default function WorksPage() {
  return <><SiteHeader /><main className="page shell"><span className="eyebrow">PUBLIC WORKS</span><h1 className="page-title">不是作业展示，是下一次应用的起点。</h1><p className="page-lead">首批作品正在招募。提交后先经过来源、链接、公开范围与风险审核，默认公开但作者随时可撤回。</p><div className="empty-grid">{examples.map(([title, tag, state]) => <article key={title} className="work-placeholder"><span className="pill">{tag}</span><div className="work-visual">昆</div><h2>{title}</h2><p>{state}</p><small>将展示：成果链接、制作说明、来源教程、已知限制。</small></article>)}</div><div className="submit-banner"><div><span className="kicker">BE THE FIRST BUILDERS</span><h2>成为作品广场的第一批作者。</h2><p>不需要完美，但必须真实、可说明、可验证。</p></div><Link className="button" href="/submit">提交作品</Link></div></main><Footer /></>;
}
