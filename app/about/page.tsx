import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "关于我们",
  description: `昆仑增长AI实战，服务"做出来"的人。我们相信 AI 的价值不在演示页，而在真实任务是否被完成、用户是否愿意继续使用。`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <><SiteHeader /><main className="page shell prose"><span className="eyebrow">ABOUT KUNLUN</span><h1>昆仑增长AI实战，服务“做出来”的人。</h1><h2>我们相信</h2><p>AI 的价值不在演示页，而在真实任务是否被完成、用户是否愿意继续使用、团队是否能持续交付。教程是入口，作品是身份，验证是信任，企业场景是增长。</p><h2>来源与作者</h2><p id="disclosure">每篇教程保留原始帖子、作者或机构、官方资料链接。我们会明确区分“原帖作者的主张”与“已核验事实”。赞助、联盟或付费推荐将显著披露。</p><h2>隐私与安全</h2><p id="privacy">作品默认公开；作者可编辑、隐藏或撤回。项目联系方式默认隐藏，资源与机构联系需要双方同意。企业数据应先脱敏，严禁提交无权分享的客户数据与商业秘密。</p><h2>边界</h2><p>平台不构成投资建议、融资承诺、收益承诺或项目质量担保。涉及医疗、金融、法律及其他高风险领域的内容会增加限制或审核。</p></main><Footer /></>;
}
