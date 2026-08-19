import { createClient } from "@/lib/supabase/server";
import { parseUserAgent, getClientIP, type ParsedUA } from "@/lib/ua-parser";

/**
 * 记录登录事件到 login_events 表
 * 在服务端调用，从请求头中提取 IP 和 User-Agent
 */
export async function logLoginEvent(
  request: Request,
  loginMethod: "magic_link" | "password"
): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const ua = request.headers.get("user-agent") ?? "unknown";
    const ip = getClientIP(request);
    const parsed: ParsedUA = parseUserAgent(ua);

    await supabase.from("login_events").insert({
      user_id: user.id,
      ip_address: ip,
      user_agent: ua,
      device_type: parsed.deviceType,
      browser: parsed.browser,
      os: parsed.os,
      login_method: loginMethod,
    });
  } catch (error) {
    // 登录记录失败不应影响登录流程
    console.error("Failed to log login event:", error);
  }
}
