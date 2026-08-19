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
  const errorReason = searchParams.get("reason");

  const [mode, setMode] = useState<"magic" | "password">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    if (authError === "auth") {
      const tip = errorReason && errorReason !== "no_code"
        ? `（${decodeURIComponent(errorReason)}）`
        : "";
      setMessage(`登录失败，魔法链接可能已过期${tip}，请改用密码登录，或重新发送。`);
      setMessageType("error");
      setMode("password");
    }
  }, [authError, errorReason]);

  async function sendMagicLink(event: React.FormEvent) {
    event.preventDefault();
    if (!hasSupabaseConfig) {
      setMessage("登录服务正在接入：尚未配置 Supabase 云端认证。其他教程内容仍可公开浏览。");
      setMessageType("error");
      return;
    }
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/confirm?next=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      setMessage(error.message);
      setMessageType("error");
    } else {
      setMessage("登录链接已发送，请查收邮箱。");
      setMessageType("success");
    }
  }

  async function signInWithPassword(event: React.FormEvent) {
    event.preventDefault();
    if (!hasSupabaseConfig) {
      setMessage("登录服务正在接入：尚未配置 Supabase 云端认证。");
      setMessageType("error");
      return;
    }
    const { error } = await createClient().auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
      setMessageType("error");
    } else {
      // 记录密码登录事件
      try {
        await fetch("/api/log-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ loginMethod: "password" }),
        });
      } catch {
        // 记录失败不影响登录
      }
      window.location.href = redirect;
    }
  }

  return (
    <div className="form-card">
      <div className="login-tabs" style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid var(--line)" }}>
        <button
          type="button"
          onClick={() => { setMode("magic"); setMessage(""); setMessageType(""); }}
          style={{
            padding: "10px 16px",
            font: "inherit",
            fontWeight: 800,
            fontSize: "14px",
            background: "none",
            border: "none",
            borderBottom: mode === "magic" ? "2px solid var(--purple)" : "2px solid transparent",
            color: mode === "magic" ? "var(--purple)" : "var(--muted)",
            cursor: "pointer",
            marginBottom: "-1px",
          }}
        >
          魔法链接
        </button>
        <button
          type="button"
          onClick={() => { setMode("password"); setMessage(""); setMessageType(""); }}
          style={{
            padding: "10px 16px",
            font: "inherit",
            fontWeight: 800,
            fontSize: "14px",
            background: "none",
            border: "none",
            borderBottom: mode === "password" ? "2px solid var(--purple)" : "2px solid transparent",
            color: mode === "password" ? "var(--purple)" : "var(--muted)",
            cursor: "pointer",
            marginBottom: "-1px",
          }}
        >
          密码登录
        </button>
      </div>

      {mode === "magic" ? (
        <form onSubmit={sendMagicLink}>
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
          <button className="button" type="submit" style={{ width: "100%", marginTop: "16px" }}>
            发送登录链接
          </button>
        </form>
      ) : (
        <form onSubmit={signInWithPassword}>
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
          <label style={{ marginTop: "14px", display: "block" }}>
            密码
            <input
              required
              type="password"
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="button" type="submit" style={{ width: "100%", marginTop: "16px" }}>
            登录
          </button>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "12px" }}>
            还没有账号？点击上方「魔法链接」标签，用邮箱注册后即可设置密码。
          </p>
        </form>
      )}

      {message && (
        <p
          className="form-message"
          style={{ color: messageType === "success" ? "#2d8060" : "#d33" }}
        >
          {message}
        </p>
      )}
    </div>
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
          推荐使用密码登录，速度更快。首次使用请切换到「魔法链接」注册。
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
