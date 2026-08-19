"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

interface LoginEvent {
  id: string;
  ip_address: string;
  device_type: string;
  browser: string;
  os: string;
  login_method: string;
  created_at: string;
}

function deviceIcon(type: string): string {
  switch (type) {
    case "mobile": return "📱";
    case "tablet": return "📲";
    case "desktop": return "💻";
    default: return "🖥";
  }
}

function methodLabel(method: string): string {
  return method === "magic_link" ? "魔法链接" : "密码登录";
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SecurityPage() {
  const { user, loading } = useAuth();
  const [events, setEvents] = useState<LoginEvent[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error } = await createClient()
          .from("login_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);
        if (!error && data) setEvents(data as LoginEvent[]);
      } catch {
        // 静默处理
      }
      setFetching(false);
    })();
  }, [user]);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="page shell auth">
          <p className="form-message">加载中…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SiteHeader />
        <main className="page shell auth">
          <span className="eyebrow">ACCOUNT</span>
          <h1 className="page-title">请先登录</h1>
          <p className="page-lead">
            查看登录记录需要先登录。<Link href="/login">前往登录</Link>
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="page shell auth">
        <span className="eyebrow">ACCOUNT</span>
        <h1 className="page-title">登录记录与安全</h1>
        <p className="page-lead">
          查看你最近的登录活动。如果发现异常登录，请及时修改密码。
        </p>

        <div className="security-actions" style={{ display: "flex", gap: "12px", margin: "28px 0" }}>
          <Link className="button small ghost" href="/account/password">
            设置登录密码
          </Link>
        </div>

        {fetching ? (
          <p className="form-message">正在加载登录记录…</p>
        ) : events.length === 0 ? (
          <p className="form-message">暂无登录记录。</p>
        ) : (
          <div className="login-history" style={{ marginTop: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)", textAlign: "left" }}>
                  <th style={{ padding: "10px 8px" }}>时间</th>
                  <th style={{ padding: "10px 8px" }}>设备</th>
                  <th style={{ padding: "10px 8px" }}>浏览器</th>
                  <th style={{ padding: "10px 8px" }}>系统</th>
                  <th style={{ padding: "10px 8px" }}>IP 地址</th>
                  <th style={{ padding: "10px 8px" }}>方式</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "10px 8px", color: "var(--muted)" }}>{formatTime(e.created_at)}</td>
                    <td style={{ padding: "10px 8px" }}>{deviceIcon(e.device_type)} {e.device_type || "unknown"}</td>
                    <td style={{ padding: "10px 8px" }}>{e.browser || "—"}</td>
                    <td style={{ padding: "10px 8px" }}>{e.os || "—"}</td>
                    <td style={{ padding: "10px 8px", fontFamily: "monospace", fontSize: "13px" }}>{e.ip_address || "—"}</td>
                    <td style={{ padding: "10px 8px" }}>{methodLabel(e.login_method)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="form-note" style={{ marginTop: "28px" }}>
          最多显示最近 50 条记录。如有疑问请<Link href="/contact">联系管理员</Link>。
        </p>
      </main>
      <Footer />
    </>
  );
}
