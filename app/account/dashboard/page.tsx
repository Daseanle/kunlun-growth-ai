"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { tutorialEntries } from "@/lib/tutorials";

interface Profile {
  display_name: string;
  avatar_url: string | null;
}

interface ProgressItem {
  tutorial_slug: string;
  completed_steps: unknown[];
  updated_at: string;
}

interface Submission {
  id: string;
  kind: string;
  title: string;
  status: string;
  visibility: string;
  created_at: string;
}

interface LoginEvent {
  id: string;
  login_method: string;
  device_type: string;
  created_at: string;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function methodLabel(method: string): string {
  switch (method) {
    case "magic_link": return "魔法链接";
    case "password": return "密码";
    case "otp": return "验证码";
    default: return method;
  }
}

function statusLabel(status: string): { text: string; color: string } {
  switch (status) {
    case "approved": return { text: "已通过", color: "#2d8060" };
    case "pending": return { text: "待审核", color: "#d97706" };
    case "changes_requested": return { text: "需修改", color: "#dc2626" };
    case "hidden": return { text: "已隐藏", color: "#6b7280" };
    default: return { text: status, color: "var(--muted)" };
  }
}

function kindLabel(kind: string): string {
  switch (kind) {
    case "work": return "作品";
    case "project": return "项目";
    case "resource": return "资源";
    default: return kind;
  }
}

function getTutorialShort(slug: string): string {
  const t = tutorialEntries.find((e) => e.slug === slug);
  return t?.short || slug;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [recentLogins, setRecentLogins] = useState<LoginEvent[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    (async () => {
      // 并行拉取所有数据
      const [profileRes, progressRes, submissionsRes, loginsRes] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("id", user.id)
            .maybeSingle(),
          supabase
            .from("learning_progress")
            .select("tutorial_slug, completed_steps, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false }),
          supabase
            .from("submissions")
            .select("id, kind, title, status, visibility, created_at")
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10),
          supabase
            .from("login_events")
            .select("id, login_method, device_type, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (progressRes.data) setProgress(progressRes.data as ProgressItem[]);
      if (submissionsRes.data) setSubmissions(submissionsRes.data as Submission[]);
      if (loginsRes.data) setRecentLogins(loginsRes.data as LoginEvent[]);
      setFetching(false);
    })();
  }, [user?.id]);

  if (loading || fetching) {
    return <p className="form-message">加载中…</p>;
  }

  if (!user) {
    return (
      <>
        <span className="eyebrow">ACCOUNT</span>
        <h1 className="page-title">请先登录</h1>
        <p className="page-lead">
          查看实战记录需要先登录。<Link href="/login">前往登录</Link>
        </p>
      </>
    );
  }

  const displayName = profile?.display_name || user.email?.split("@")[0] || "用户";
  const initial = displayName[0].toUpperCase();
  const totalTutorials = tutorialEntries.length;
  const startedTutorials = progress.length;
  const completedSteps = progress.reduce(
    (sum, p) => sum + (Array.isArray(p.completed_steps) ? p.completed_steps.length : 0),
    0
  );

  return (
    <>
      {/* 个人信息卡片 */}
      <div className="dashboard-profile" style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "28px",
        border: "1px solid var(--line)",
        borderRadius: "22px",
        background: "linear-gradient(135deg, #f8f6ff, #fff)",
        margin: "10px 0 30px",
      }}>
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt="头像"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid var(--line)",
            }}
          />
        ) : (
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontSize: "30px",
            fontWeight: "900",
            color: "#fff",
            background: "linear-gradient(145deg,#8d6eff,#4f2dc9)",
          }}>
            {initial}
          </div>
        )}
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "28px", letterSpacing: "-.04em" }}>
            {displayName}
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "14px" }}>
            {user.email}
          </p>
        </div>
        <Link
          href="/account/profile"
          className="button small ghost"
          style={{ marginLeft: "auto" }}
        >
          编辑资料
        </Link>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "14px",
        marginBottom: "36px",
      }}>
        <div style={{
          padding: "22px",
          border: "1px solid var(--line)",
          borderRadius: "17px",
          background: "#fff",
        }}>
          <b style={{ fontSize: "32px", color: "var(--purple)" }}>{startedTutorials}</b>
          <span style={{ display: "block", fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
            学习中的教程（共 {totalTutorials} 篇）
          </span>
        </div>
        <div style={{
          padding: "22px",
          border: "1px solid var(--line)",
          borderRadius: "17px",
          background: "#fff",
        }}>
          <b style={{ fontSize: "32px", color: "var(--purple)" }}>{completedSteps}</b>
          <span style={{ display: "block", fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
            已完成步骤数
          </span>
        </div>
        <div style={{
          padding: "22px",
          border: "1px solid var(--line)",
          borderRadius: "17px",
          background: "#fff",
        }}>
          <b style={{ fontSize: "32px", color: "var(--purple)" }}>{submissions.length}</b>
          <span style={{ display: "block", fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
            提交的作品 / 项目
          </span>
        </div>
      </div>

      {/* 学习进度 */}
      <div style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "20px", letterSpacing: "-.03em", marginBottom: "14px" }}>
          📚 学习进度
        </h2>
        {progress.length === 0 ? (
          <div style={{
            padding: "24px",
            border: "1px dashed var(--line)",
            borderRadius: "14px",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "14px",
          }}>
            还没有开始学习教程。
            <Link href="/tutorials" style={{ color: "var(--purple)", fontWeight: 800, marginLeft: "6px" }}>
              浏览教程 →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {progress.map((p) => {
              const tutorial = tutorialEntries.find((e) => e.slug === p.tutorial_slug);
              const totalSteps = tutorial?.steps?.length || 0;
              const done = Array.isArray(p.completed_steps) ? p.completed_steps.length : 0;
              const pct = totalSteps > 0 ? Math.round((done / totalSteps) * 100) : 0;
              return (
                <Link
                  key={p.tutorial_slug}
                  href={`/tutorials/${p.tutorial_slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    border: "1px solid var(--line)",
                    borderRadius: "14px",
                    background: "#fff",
                    transition: ".2s",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "15px" }}>
                      {getTutorialShort(p.tutorial_slug)}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                      {done} / {totalSteps} 步 · 更新于 {formatTime(p.updated_at)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "80px",
                      height: "6px",
                      borderRadius: "3px",
                      background: "var(--line)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: "var(--purple)",
                        borderRadius: "3px",
                      }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: pct === 100 ? "#2d8060" : "var(--purple)" }}>
                      {pct}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* 我的作品 */}
      <div style={{ marginBottom: "36px" }}>
        <h2 style={{ fontSize: "20px", letterSpacing: "-.03em", marginBottom: "14px" }}>
          🎨 我的作品
        </h2>
        {submissions.length === 0 ? (
          <div style={{
            padding: "24px",
            border: "1px dashed var(--line)",
            borderRadius: "14px",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "14px",
          }}>
            还没有提交过作品。
            <Link href="/submit" style={{ color: "var(--purple)", fontWeight: 800, marginLeft: "6px" }}>
              提交作品 →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {submissions.map((s) => {
              const st = statusLabel(s.status);
              return (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    border: "1px solid var(--line)",
                    borderRadius: "14px",
                    background: "#fff",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "15px" }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                      {kindLabel(s.kind)} · {formatTime(s.created_at)}
                    </div>
                  </div>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "99px",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: st.color,
                    background: `${st.color}15`,
                  }}>
                    {st.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 最近登录 */}
      <div>
        <h2 style={{ fontSize: "20px", letterSpacing: "-.03em", marginBottom: "14px" }}>
          🔐 最近登录
        </h2>
        {recentLogins.length === 0 ? (
          <p className="form-message">暂无登录记录。</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentLogins.map((e) => (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  background: "#fff",
                  fontSize: "13px",
                }}
              >
                <span>
                  {methodLabel(e.login_method)} · {e.device_type || "unknown"}
                </span>
                <span style={{ color: "var(--muted)" }}>{formatTime(e.created_at)}</span>
              </div>
            ))}
          </div>
        )}
        <Link
          href="/account/security"
          style={{
            display: "inline-block",
            marginTop: "12px",
            fontSize: "13px",
            fontWeight: 800,
            color: "var(--purple)",
          }}
        >
          查看全部登录记录 →
        </Link>
      </div>
    </>
  );
}
