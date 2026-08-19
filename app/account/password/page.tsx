"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

export default function SetPasswordPage() {
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (password.length < 8) {
      setMessage("密码至少需要 8 个字符。");
      setMessageType("error");
      return;
    }

    if (password !== confirm) {
      setMessage("两次输入的密码不一致。");
      setMessageType("error");
      return;
    }

    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) {
        setMessage(error.message);
        setMessageType("error");
      } else {
        setMessage("密码设置成功！下次登录时可以使用邮箱 + 密码登录。");
        setMessageType("success");
        setPassword("");
        setConfirm("");
      }
    } catch {
      setMessage("设置密码时发生异常，请稍后重试。");
      setMessageType("error");
    }
  }

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
      <h1 className="page-title">设置登录密码</h1>
      <p className="page-lead">
        设置密码后，可以用邮箱 + 密码直接登录，速度更快。
      </p>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          新密码
          <input
            required
            type="password"
            placeholder="至少 8 个字符"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          确认密码
          <input
            required
            type="password"
            placeholder="再次输入密码"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>
        <button className="button" type="submit">
          设置密码
        </button>
        {message && (
          <p
            className="form-message"
            style={{ color: messageType === "success" ? "#2d8060" : "#d33" }}
          >
            {message}
          </p>
        )}
      </form>
    </>
  );
}
