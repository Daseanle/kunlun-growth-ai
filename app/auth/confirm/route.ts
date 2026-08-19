import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logLoginEvent } from "@/lib/login-event";

/**
 * 授权码交换路由
 *
 * 用户点击邮件中的魔法链接后，Supabase 会重定向到此路由。
 * 服务端调用 exchangeCodeForSession 将授权码换取会话，
 * 会话 Cookie 在此设置，之后重定向到目标页面。
 *
 * 参考: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/tutorials";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // 记录魔法链接登录事件
      await logLoginEvent(request, "magic_link");
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("Auth code exchange failed:", error.message);
    return NextResponse.redirect(`${origin}/login?error=auth&reason=${encodeURIComponent(error.message)}`);
  }

  // 交换失败或没有 code 参数，重定向到登录页并带错误标记
  return NextResponse.redirect(`${origin}/login?error=auth&reason=no_code`);
}
