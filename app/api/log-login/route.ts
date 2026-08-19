import { NextResponse } from "next/server";
import { logLoginEvent } from "@/lib/login-event";

/**
 * 客户端密码登录成功后调用此 API 记录登录事件
 * 服务端从请求头中提取 IP 和 User-Agent
 */
export async function POST(request: Request) {
  const { loginMethod } = await request.json().catch(() => ({}));

  if (loginMethod !== "password" && loginMethod !== "magic_link" && loginMethod !== "otp") {
    return NextResponse.json({ error: "Invalid login method" }, { status: 400 });
  }

  await logLoginEvent(request, loginMethod);

  return NextResponse.json({ success: true });
}
