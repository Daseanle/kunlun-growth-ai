import type { Metadata } from "next";
import "./globals.css";
import "./forms.css";
import "./tutorial.css";
import { AuthProvider } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "昆仑增长AI实战｜从教程到真实应用",
  description:
    "面向全球中文用户的 AI 实战、作品与真实应用验证平台。首个赛道：AI × 跨境电商。",
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
