import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="page shell">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
          <span style={{ color: "var(--text-muted, #888)", fontSize: "0.95rem" }}>加载中…</span>
        </div>
      </main>
      <Footer />
    </>
  );
}
