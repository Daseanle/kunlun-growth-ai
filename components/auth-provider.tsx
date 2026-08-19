"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

/**
 * 认证状态 Provider
 *
 * 在根 Layout 中使用，为整个应用提供登录状态。
 * 接收服务端传入的 initialSession 避免客户端首次渲染闪烁。
 * 通过 onAuthStateChange 监听后续变化（登录、退出、Token 刷新）。
 */
export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [loading, setLoading] = useState(!initialSession);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // 同步当前会话（处理客户端登录、URL hash token 等场景）
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 监听后续认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!hasSupabaseConfig) return;
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
