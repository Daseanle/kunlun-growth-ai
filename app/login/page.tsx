"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/tutorials";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authError === "auth") {
      setMessage("登录失败，魔法链接可能已过期，请重新发送。");
    }
  }, [authError]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!hasSupabaseConfig) {
      setMessage(
        "登录服务正在接入：尚未配置 Supabase 云端认证。其他教程内容仍可公开浏览。",
      );
      return;
    }
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/confirm?next=${encodeURIComponent(redirect)}`,
      },
    });
    setMessage(error ? error.message : "登录链接已发送，请查收邮箱。");
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <label>
        邮箱
        <input
          required
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button className="button" type="submit">
        发送登录链接
      </button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="page shell auth">
        <span className="eyebrow">ACCOUNT</span>
        <h1 className="page-title">登录后，把实战进度带到每一台设备。</h1>
        <p className="page-lead">
          使用邮箱登录；不需要设置密码。配置完成前，网站仍可以公开浏览。
        </p>
        <Suspense fallback={<p className="form-message">加载中…</p>}>
          <LoginForm />
        </Suspense>
        <p className="form-note">
          登录即表示同意作品默认公开的规则。
          <Link href="/about">查看规则</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
