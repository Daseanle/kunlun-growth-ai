import Link from "next/link";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export default function ChallengesPage() {
  return <><SiteHeader /><main className="page shell"><span className="eyebrow">REAL BUSINESS CHALLENGES</span><h1 className="page-title">真实问题，才是最好的 AI 路演。</h1><p className="page-lead">企业挑战将优先面向跨境电商：商品内容、营销素材、客服、数据分析和运营自动化。预算区间不公开展示，由平台在双方匹配后沟通。</p><div className="challenge-steps"><div><b>1</b><h2>企业提交问题</h2><p>先脱敏，写清现有流程、目标和验收标准。</p></div><div><b>2</b><h2>团队提出方案</h2><p>用可运行成果而不是口头承诺报名。</p></div><div><b>3</b><h2>真实场景测试</h2><p>以约定指标验证结果，并保留边界与失败记录。</p></div></div><div className="submit-banner"><div><span className="kicker">OPENING SOON</span><h2>发布你的跨境电商 AI 问题。</h2><p>现阶段收集第一批挑战意向；提交不代表公开发布。</p></div><Link className="button" href="/contact?type=challenge">提交企业挑战意向</Link></div></main><Footer /></>;
}
