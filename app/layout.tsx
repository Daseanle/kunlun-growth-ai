import type { Metadata } from "next";
import "./globals.css";
import "./forms.css";
import "./tutorial.css";
import { AuthProvider } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/server";

const siteUrl = "https://kunlun-growth-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "昆仑增长AI实战｜从教程到真实应用",
    template: "%s | 昆仑增长AI实战",
  },
  description:
    "面向全球中文用户的 AI 实战、作品与真实应用验证平台。首个赛道：AI × 跨境电商。21 篇带提示词、通关标准和风险提醒的实战教程。",
  keywords: [
    "AI实战", "AI教程", "跨境电商AI", "Agent自动化",
    "Next.js", "Supabase", "开源", "中文AI社区",
  ],
  authors: [{ name: "昆仑增长AI实战" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "昆仑增长AI实战",
    locale: "zh_CN",
    title: "昆仑增长AI实战｜从教程到真实应用",
    description:
      "面向全球中文用户的 AI 实战、作品与真实应用验证平台。首个赛道：AI × 跨境电商。",
  },
  twitter: {
    card: "summary_large_image",
    title: "昆仑增长AI实战",
    description:
      "面向全球中文用户的 AI 实战、作品与真实应用验证平台。",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let initialSession = null;

  const hasConfig =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (hasConfig) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getSession();
      initialSession = data.session;
    } catch {
      // Supabase 未配置或出错，以未登录状态渲染
    }
  }

  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider initialSession={initialSession}>{children}</AuthProvider>
      </body>
    </html>
  );
}
