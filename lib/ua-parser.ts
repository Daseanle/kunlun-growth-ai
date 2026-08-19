/**
 * 简易 User-Agent 解析器
 * 从 UA 字符串中提取设备类型、浏览器和操作系统信息
 */

export interface ParsedUA {
  deviceType: "mobile" | "tablet" | "desktop" | "unknown";
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string): ParsedUA {
  const lower = ua.toLowerCase();

  // 设备类型
  let deviceType: ParsedUA["deviceType"] = "desktop";
  if (/ipad|tablet|(?:android(?!.*mobile))/i.test(ua)) {
    deviceType = "tablet";
  } else if (/mobile|iphone|android.*mobile|windows phone/i.test(ua)) {
    deviceType = "mobile";
  }

  // 浏览器
  let browser = "Unknown";
  if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("chrome/") && !lower.includes("chromium")) browser = "Chrome";
  else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "Safari";
  else if (lower.includes("firefox/")) browser = "Firefox";
  else if (lower.includes("opr/") || lower.includes("opera")) browser = "Opera";

  // 操作系统
  let os = "Unknown";
  if (lower.includes("windows")) os = "Windows";
  else if (lower.includes("mac os") || lower.includes("macos")) os = "macOS";
  else if (lower.includes("iphone") || lower.includes("ipad")) os = "iOS";
  else if (lower.includes("android")) os = "Android";
  else if (lower.includes("linux")) os = "Linux";

  return { deviceType, browser, os };
}

/**
 * 从请求头中提取客户端 IP 地址
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP.trim();
  return "unknown";
}
