"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Brand } from "./brand";

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();

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
              <span className="text-link">{user.email}</span>
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
