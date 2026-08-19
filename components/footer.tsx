import Link from "next/link";
import { Brand } from "./brand";

export function Footer() {
  return <footer className="footer"><div className="shell footer-grid"><div><Brand /><p>让更多 AI 项目从 Demo 走向真实应用。</p></div><div><strong>探索</strong><Link href="/tutorials">实战教程</Link><Link href="/works">作品广场</Link><Link href="/projects">AI 项目</Link></div><div><strong>连接</strong><Link href="/challenges">企业挑战</Link><Link href="/submit">提交作品</Link><Link href="/contact">资源与机构联系</Link></div><div><strong>规则</strong><Link href="/about">验证标准</Link><Link href="/about#disclosure">来源与赞助披露</Link><Link href="/about#privacy">隐私与安全</Link></div></div><div className="shell footer-bottom">© 2026 昆仑增长AI实战 · 不构成投资建议或收益承诺</div></footer>;
}
