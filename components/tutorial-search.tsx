"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function TutorialSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  // 从 URL 初始化搜索词
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // 防抖：输入停止 300ms 后更新 URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      router.replace(qs ? `/tutorials?${qs}` : "/tutorials", { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="tutorial-search">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, color: "var(--muted)" }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        placeholder="搜索教程标题、标签或关键词…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="搜索教程"
        style={{
          flex: 1,
          border: "none",
          background: "none",
          font: "inherit",
          fontSize: "14px",
          outline: "none",
          color: "inherit",
        }}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="清除搜索"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 4px",
            color: "var(--muted)",
            fontSize: "16px",
            lineHeight: 1,
            font: "inherit",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
