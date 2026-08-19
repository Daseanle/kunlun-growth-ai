"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

type Mode = "change" | "reset" | "set";

function checkPasswordStrength(password: string): { valid: boolean; feedback: string } {
  if (password.length < 8) return { valid: false, feedback: "密码至少需要 8 个字符" };
  const missing: string[] = [];
  if (!/[A-Z]/.test(password)) missing.push("大写字母");
  if (!/[a-z]/.test(password)) missing.push("小写字母");
  if (!/[0-9]/.test(password)) missing.push("数字");
  if (missing.length) return { valid: false, feedback: `密码需要包含：${missing.join("、")}` };
  return { valid: true, feedback: "" };
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasLength = password.length >= 8;
  const score = [hasLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;
  const colors = ["#dc2626", "#f59e0b", "#22c55e", "#22c55e"];
  const color = colors[Math.max(0, score - 1)];
  const missing = [
    ...(!hasLength ? ["至少8位"] : []),
    ...(!hasUpper ? ["大写字母"] : []),
    ...(!hasLower ? ["小写字母"] : []),
    ...(!hasNumber ? ["数字"] : []),
  ];
  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={{ height: "3px", flex: 1, borderRadius: "2px", background: n <= score ? color : "var(--line)", transition: "0.3s" }} />
        ))}
      </div>
      <small style={{ color: score === 4 ? "#22c55e" : "var(--muted)", fontSize: "12px" }}>
        {score === 4 ? "密码强度：强" : `还需要：${missing.join("、")}`}
      </small>
    </div>
  );
}

function PasswordPageInner() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("change");

  // 从 URL 参数自动切换到重置模式
  useEffect(() => {
    if (searchParams.get("reset") === "1") {
      setMode("reset");
    }
  }, [searchParams]);

  // change mode
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // reset mode
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [busy, setBusy] = useState(false);

  function resetForm() {
    setOldPassword("");
    setNewPassword("");
    setConfirm("");
    setOtpCode("");
    setOtpSent(false);
    setOtpVerified(false);
    setMessage("");
    setMessageType("");
  }

  function switchMode(next: Mode) {
    setMode(next);
    resetForm();
  }

  /** 修改密码：先验证旧密码，再设置新密码 */
  async function handleChangePassword(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    const strength = checkPasswordStrength(newPassword);
    if (!strength.valid) {
      setMessage(strength.feedback);
      setMessageType("error");
      return;
    }
    if (newPassword !== confirm) {
      setMessage("两次输入的新密码不一致。");
      setMessageType("error");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();

      // 1. 验证旧密码
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user!.email!,
        password: oldPassword,
      });
      if (signInError) {
        setMessage("旧密码不正确，请重新输入。");
        setMessageType("error");
        setBusy(false);
        return;
      }

      // 2. 设置新密码
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        setMessage(updateError.message);
        setMessageType("error");
      } else {
        setMessage("密码修改成功！下次登录请使用新密码。");
        setMessageType("success");
        resetForm();
      }
    } catch {
      setMessage("修改密码时发生异常，请稍后重试。");
      setMessageType("error");
    }
    setBusy(false);
  }

  /** 重置密码：发送验证码 */
  async function sendResetOtp(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    setBusy(true);
    try {
      const { error } = await createClient().auth.signInWithOtp({
        email: user!.email!,
      });
      if (error) {
        setMessage(`发送失败：${error.message}`);
        setMessageType("error");
      } else {
        setOtpSent(true);
        setMessage("验证码已发送，请查收邮箱并输入验证码。");
        setMessageType("success");
      }
    } catch {
      setMessage("发送验证码时发生异常，请稍后重试。");
      setMessageType("error");
    }
    setBusy(false);
  }

  /** 重置密码：验证验证码 */
  async function verifyResetOtp(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    setBusy(true);
    try {
      const { error } = await createClient().auth.verifyOtp({
        email: user!.email!,
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
        setOtpVerified(true);
        setMessage("验证码验证成功，请设置新密码。");
        setMessageType("success");
      }
    } catch {
      setMessage("验证时发生异常，请稍后重试。");
      setMessageType("error");
    }
    setBusy(false);
  }

  /** 重置密码：设置新密码 */
  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (newPassword.length < 8) {
      setMessage("新密码至少需要 8 个字符。");
      setMessageType("error");
      return;
    }
    if (newPassword !== confirm) {
      setMessage("两次输入的新密码不一致。");
      setMessageType("error");
      return;
    }

    setBusy(true);
    try {
      const { error } = await createClient().auth.updateUser({
        password: newPassword,
      });
      if (error) {
        setMessage(error.message);
        setMessageType("error");
      } else {
        setMessage("密码重置成功！下次登录请使用新密码。");
        setMessageType("success");
        resetForm();
      }
    } catch {
      setMessage("重置密码时发生异常，请稍后重试。");
      setMessageType("error");
    }
    setBusy(false);
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

  if (loading) {
    return <p className="form-message">加载中…</p>;
  }

  if (!user) {
    return (
      <>
        <span className="eyebrow">ACCOUNT</span>
        <h1 className="page-title">请先登录</h1>
        <p className="page-lead">
          设置密码需要先登录。<Link href="/login">前往登录</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <span className="eyebrow">ACCOUNT</span>
      <h1 className="page-title">登录密码</h1>
      <p className="page-lead">
        设置密码后，可以用邮箱 + 密码直接登录，速度更快。
      </p>

      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <button
          type="button"
          onClick={() => switchMode("change")}
          style={tabBtnStyle(mode === "change")}
        >
          修改密码
        </button>
        <button
          type="button"
          onClick={() => switchMode("reset")}
          style={tabBtnStyle(mode === "reset")}
        >
          重置密码
        </button>
      </div>

      {mode === "change" && (
        <form className="form-card" onSubmit={handleChangePassword}>
          <label>
            旧密码
            <input
              required
              type="password"
              placeholder="输入当前密码"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </label>
          <label>
            新密码
            <input
              required
              type="password"
              placeholder="至少 8 个字符"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <label>
            确认新密码
            <input
              required
              type="password"
              placeholder="再次输入新密码"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
          <button className="button" type="submit" disabled={busy}>
            {busy ? "保存中…" : "修改密码"}
          </button>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted)",
              marginTop: "12px",
            }}
          >
            忘记旧密码？
            <button
              type="button"
              onClick={() => switchMode("reset")}
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
              通过验证码重置
            </button>
          </p>
          {message && (
            <p
              className="form-message"
              style={{
                color: messageType === "success" ? "#2d8060" : "#d33",
              }}
            >
              {message}
            </p>
          )}
        </form>
      )}

      {mode === "reset" && (
        <form
          className="form-card"
          onSubmit={
            otpVerified
              ? handleResetPassword
              : otpSent
              ? verifyResetOtp
              : sendResetOtp
          }
        >
          {!otpVerified && (
            <>
              <label>
                邮箱
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  style={{
                    background: "var(--soft)",
                    cursor: "not-allowed",
                  }}
                />
              </label>
              {otpSent && (
                <label>
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
                    style={{
                      letterSpacing: "3px",
                      fontSize: "20px",
                      textAlign: "center",
                    }}
                  />
                </label>
              )}
              {otpSent ? (
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  <button
                    className="button"
                    type="submit"
                    disabled={busy}
                    style={{ flex: 1 }}
                  >
                    {busy ? "验证中…" : "验证验证码"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode("");
                      setOtpSent(false);
                      setMessage("");
                      setMessageType("");
                    }}
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
                <button
                  className="button"
                  type="submit"
                  disabled={busy}
                  style={{ width: "100%", marginTop: "16px" }}
                >
                  {busy ? "发送中…" : "发送验证码"}
                </button>
              )}
            </>
          )}

          {otpVerified && (
            <>
              <label>
                新密码
                <input
                  required
                  type="password"
                  placeholder="至少 8 位，含大小写和数字"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoFocus
                />
                <PasswordStrength password={newPassword} />
              </label>
              <label>
                确认新密码
                <input
                  required
                  type="password"
                  placeholder="再次输入新密码"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
              <button className="button" type="submit" disabled={busy}>
                {busy ? "保存中…" : "设置新密码"}
              </button>
            </>
          )}

          {message && (
            <p
              className="form-message"
              style={{
                color: messageType === "success" ? "#2d8060" : "#d33",
              }}
            >
              {message}
            </p>
          )}
        </form>
      )}

    </>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<p className="form-message">加载中…</p>}>
      <PasswordPageInner />
    </Suspense>
  );
}
