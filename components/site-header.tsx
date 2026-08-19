"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { Brand } from "./brand";

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAvatarUrl(data.avatar_url);
          setDisplayName(data.display_name || "");
        }
      });
  }, [user]);

  const initial = (displayName || user?.email || "U")[0].toUpperCase();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <nav aria-label="主导航">
          <Link href="/tutorials">实战教程</Link>
          <Link href="/works">作品广场</Link>
          <Link href="/projects">AI 项目</Link>
          <Link href="/challenges">企业挑战</Link>
        </nav>
        <div className="header-actions">
          {!loading && user ? (
            <>
              <Link
                href="/account/dashboard"
                title="个人中心"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="头像"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid var(--line)",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "14px",
                      fontWeight: "900",
                      color: "#fff",
                      background: "linear-gradient(145deg,#8d6eff,#4f2dc9)",
                    }}
                  >
                    {initial}
                  </span>
                )}
                <span className="text-link" style={{ fontSize: "13px" }}>
                  {displayName || user.email?.split("@")[0]}
                </span>
              </Link>
              <button
                className="text-link"
                onClick={() => signOut()}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  font: "inherit",
                  padding: 0,
                }}
              >
                退出
              </button>
            </>
          ) : (
            <Link className="text-link" href="/login">
              登录
            </Link>
          )}
          <Link className="button small" href="/submit">
            提交作品
          </Link>
        </div>
      </div>
    </header>
  );
}
