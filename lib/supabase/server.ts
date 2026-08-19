import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 服务端 Supabase 客户端
 *
 * 用于 Server Component、Route Handler 和 Middleware。
 * 通过 Next.js Cookie API 管理会话，自动刷新过期 Token。
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 在 Server Component 中调用 setAll 会抛错（只读 Cookie），
            // 这是因为 Server Component 无法写 Cookie。
            // 中间件会在请求级别处理 Cookie 刷新，这里安全忽略。
          }
        },
      },
    },
  );
}
