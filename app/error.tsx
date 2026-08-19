"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main className="page shell">
        <span className="eyebrow">ERROR</span>
        <h1 className="page-title">页面出了点问题。</h1>
        <p className="page-lead">可能是临时故障，重试一次通常就能恢复。如果问题持续，请刷新页面或回到首页。</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button className="button" onClick={reset}>重试</button>
          <Link className="button ghost" href="/">回到首页</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
