import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export default function NotFound() { return <><SiteHeader /><main className="page shell"><span className="eyebrow">404</span><h1 className="page-title">这条路径还没有被点亮。</h1><p className="page-lead">可能是链接已更新，或页面仍在建设。</p><Link className="button" href="/">回到首页</Link></main><Footer /></>; }
