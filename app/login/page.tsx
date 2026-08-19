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

  const [mode, setMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    if (authError === "auth") {
      const tip = errorReason && errorReason !== "no_code"
        ? `（${decodeURIComponent(errorReason)}）`
        : "";
      setMessage(`登录失败${tip}，请改用密码登录或验证码登录。`);
      setMessageType("error");
      setMode("password");
    }
  }, [authError, errorReason]);

  async function sendOtp(event: React.FormEvent) {
    event.preventDefault();
    if (!hasSupabaseConfig) {
      setMessage("登录服务正在接入：尚未配置 Supabase 云端认证。");
      setMessageType("error");
      return;
    }
    const { error } = await createClient().auth.signInWithOtp({
      email,
    });
    if (error) {
      setMessage(`发送失败：${error.message}`);
      setMessageType("error");
    } else {
      setOtpSent(true);
      setMessage("验证码已发送，请查收邮箱并输入验证码。");
      setMessageType("success");
    }
  }

  async function verifyOtpCode(event: React.FormEvent) {
    event.preventDefault();
    if (!hasSupabaseConfig) {
      setMessage("登录服务正在接入：尚未配置 Supabase 云端认证。");
      setMessageType("error");
      return;
    }
    const { error } = await createClient().auth.verifyOtp({
      email,
      token: otpCode,
      type: "email",
    });
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("expired") || msg.includes("invalid")) {
        setMessage("验证码不正确或已过期，请重新发送验证码再试。");
      } else {
        setMessage(`验证失败：${error.message}`);
      }
      setMessageType("error");
    } else {
      try {
        await fetch("/api/log-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ loginMethod: "otp" }),
        });
      } catch {
        // 记录失败不影响登录
      }
      window.location.href = forgotPassword ? "/account/password?reset=1" : redirect;
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
      const msg = error.message.toLowerCase();
      if (msg.includes("invalid login")) {
        setMessage("邮箱或密码不正确，请重试。");
      } else {
        setMessage(`登录失败：${error.message}`);
      }
      setMessageType("error");
    } else {
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

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 16px",
    font: "inherit",
    fontWeight: 800,
    fontSize: "14px",
    background: "none",
    border: "none",
    borderBottom: active ? "2px solid var(--purple)" : "2px solid transparent",
    color: active ? "var(--purple)" : "var(--muted)",
    cursor: "pointer",
    marginBottom: "-1px",
  });

  return (
    <div className="form-card">
      <div className="login-tabs" style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid var(--line)" }}>
        <button
          type="button"
          onClick={() => { setMode("password"); setMessage(""); setMessageType(""); }}
          style={tabBtnStyle(mode === "password")}
        >
          密码登录
        </button>
        <button
          type="button"
          onClick={() => { setMode("otp"); setMessage(""); setMessageType(""); setOtpSent(false); setOtpCode(""); }}
          style={tabBtnStyle(mode === "otp")}
        >
          验证码登录
        </button>
      </div>

      {mode === "password" ? (
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
            还没有账号？点击上方「验证码登录」标签，用邮箱注册后即可设置密码。
          </p>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "8px" }}>
            忘记密码？
            <button
              type="button"
              onClick={() => { setMode("otp"); setForgotPassword(true); setMessage(""); setMessageType(""); }}
              style={{
                background: "none",
                border: "none",
                font: "inherit",
                fontWeight: 800,
                color: "var(--purple)",
                cursor: "pointer",
                padding: 0,
                marginLeft: 4,
              }}
            >
              用验证码登录后重置
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={otpSent ? verifyOtpCode : sendOtp}>
          <label>
            邮箱
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setOtpSent(false); }}
              disabled={otpSent}
            />
          </label>
          {otpSent && (
            <label style={{ marginTop: "14px", display: "block" }}>
              验证码
              <input
                required
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="输入 8 位验证码"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                autoFocus
                style={{ letterSpacing: "3px", fontSize: "20px", textAlign: "center" }}
              />
            </label>
          )}
          {otpSent ? (
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button className="button" type="submit" style={{ flex: 1 }}>
                验证登录
              </button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtpCode(""); setMessage(""); setMessageType(""); }}
                style={{
                  padding: "0 16px",
                  font: "inherit",
                  fontWeight: 700,
                  fontSize: "14px",
                  background: "none",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
              >
                重新发送
              </button>
            </div>
          ) : (
            <button className="button" type="submit" style={{ width: "100%", marginTop: "16px" }}>
              发送验证码
            </button>
          )}
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
          推荐使用密码登录，速度更快。首次使用请切换到「验证码登录」注册。
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
