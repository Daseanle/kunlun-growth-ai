import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "资源与机构联系",
  description:
    "留下需求，不公开敏感信息。第一阶段只做资源和机构联系，平台不公开具体融资条款，不构成投资建议或融资承诺。",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
