"use client";
import { useState } from "react";
import { z } from "zod";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

const contactSchema = z.object({
  role: z.string(),
  name: z.string().min(1, "请填写机构或姓名"),
  email: z.string().email("请填写有效邮箱"),
  region: z.string().optional(),
  need: z.string().min(10, "请至少描述 10 个字"),
  agree: z.boolean().refine((v) => v === true, "请同意隐私条款"),
});
type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [form, setForm] = useState<ContactForm>({
    role: "企业需求方", name: "", email: "", region: "", need: "", agree: false,
  });

  function update<K extends keyof ContactForm>(key: K, value: ContactForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setBusy(false);
      return;
    }
    setDone(true);
    setBusy(false);
  }

  return (
    <>
      <SiteHeader />
      <main className="page shell">
        <span className="eyebrow">RESOURCE &amp; INSTITUTION CONNECTION</span>
        <h1 className="page-title">留下需求，不公开敏感信息。</h1>
        <p className="page-lead">第一阶段只做资源和机构联系。平台不公开具体融资条款，不构成投资建议或融资承诺。</p>
        <form className="form-card wide" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>我是
              <select value={form.role} onChange={(e) => update("role", e.target.value)}>
                <option>企业需求方</option>
                <option>项目团队</option>
                <option>产业园区 / 服务机构</option>
                <option>投资机构 / 个人投资者</option>
                <option>AI 工具厂商</option>
              </select>
            </label>
            <label>机构或姓名
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="公开或审核使用的名称" />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>
            <label>邮箱
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
              {errors.email && <small className="field-error">{errors.email}</small>}
            </label>
            <label>所在地区
              <input value={form.region} onChange={(e) => update("region", e.target.value)} placeholder="中国 / 海外中文市场" />
            </label>
          </div>
          <label>希望连接什么资源
            <textarea rows={5} value={form.need} onChange={(e) => update("need", e.target.value)} placeholder="请描述行业、阶段、目标和限制。不要填写募资金额、股权条件或客户机密。" />
            {errors.need && <small className="field-error">{errors.need}</small>}
          </label>
          <label className="check">
            <input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} />
            我同意平台仅在匹配需要时联系我，不默认公开我的联系信息。
            {errors.agree && <small className="field-error">{errors.agree}</small>}
          </label>
          <button className="button" type="submit" disabled={busy}>{busy ? "提交中…" : "提交联系意向"}</button>
          {done && <p className="form-message">已记录为演示提交。接入数据库后会进入人工匹配队列。</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}
