import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 需要登录才能访问的受保护路由前缀。
 * 未登录用户访问这些路径会被重定向到 /login。
 */
const PROTECTED_PATHS = ["/submit", "/contact", "/account"];

/**
 * 中间件核心逻辑：刷新会话 + 路由保护
 *
 * 1. 在每个请求前创建服务端客户端，调用 getUser() 触发 Token 刷新
 * 2. 将刷新后的 Cookie 写入响应，确保后续 Server Component 拿到有效会话
 * 3. 对受保护路由检查登录状态，未登录则重定向到登录页
 *
 * 参考: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
  // 如果 Supabase 未配置，直接放行（演示模式）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // 关键：调用 getUser() 会自动刷新过期的会话 Token
  // 不要在此调用与 supabase 之间插入其他逻辑
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 检查是否为受保护路由
  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
