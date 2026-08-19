import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "提交作品或项目",
  description:
    "先把真实成果拿出来。作品默认公开，请勿提交客户隐私、商业秘密、无授权素材，或无法说明来源和效果的数据。",
  alternates: { canonical: "/submit" },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
