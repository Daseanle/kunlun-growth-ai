import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "项目验证",
  description:
    "让真实应用证据替项目说话。项目库采用四级验证：Demo、Tested、Used、Deployed。不是项目背书，更不构成投资建议。",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <><SiteHeader /><main className="page shell"><span className="eyebrow">VERIFIED AI PROJECTS</span><h1 className="page-title">让真实应用证据，替项目说话。</h1><p className="page-lead">项目库将采用四级验证：Demo、Tested、Used、Deployed。它不是项目背书，更不构成投资建议。</p><div className="verification-grid"><article><b>01</b><h2>Demo</h2><p>平台可以打开，并完成基础演示。</p></article><article><b>02</b><h2>Tested</h2><p>核心任务通过约定测试。</p></article><article><b>03</b><h2>Used</h2><p>有可核验的外部用户使用。</p></article><article><b>04</b><h2>Deployed</h2><p>已经在真实业务中持续运行。</p></article></div><div className="submit-banner"><div><span className="kicker">FOUNDERS & BUILDERS</span><h2>先提交作品，成熟后升级为项目。</h2><p>现阶段可申请“寻求资源 / 机构联系”，具体联系方式仅在双方同意后交换。</p></div><Link className="button" href="/submit?type=project">提交项目意向</Link></div></main><Footer /></>;
}
