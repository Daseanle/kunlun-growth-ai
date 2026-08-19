"use client";
import { useState } from "react";
import { z } from "zod";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

const submitSchema = z.object({
  type: z.string(),
  name: z.string().min(1, "请填写名称"),
  author: z.string().min(1, "请填写作者或团队"),
  sourceUrl: z.string().optional(),
  description: z.string().min(10, "请至少描述 10 个字"),
  demoUrl: z.string().url("请填写有效链接"),
  agree: z.boolean().refine((v) => v === true, "请确认内容真实"),
});
type SubmitForm = z.infer<typeof submitSchema>;

export default function SubmitPage() {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SubmitForm, string>>>({});
  const [form, setForm] = useState<SubmitForm>({
    type: "work", name: "", author: "", sourceUrl: "", description: "", demoUrl: "", agree: false,
  });

  function update<K extends keyof SubmitForm>(key: K, value: SubmitForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result = submitSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SubmitForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof SubmitForm;
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
        <span className="eyebrow">SUBMIT A WORK OR PROJECT</span>
        <h1 className="page-title">先把真实成果拿出来。</h1>
        <p className="page-lead">作品默认公开。请勿提交客户隐私、商业秘密、无授权素材，或无法说明来源和效果的数据。</p>
        <form className="form-card wide" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>我提交的是
              <select value={form.type} onChange={(e) => update("type", e.target.value)}>
                <option value="work">教程完成作品</option>
                <option value="project">可试用 AI 项目</option>
                <option value="resource">寻求资源 / 机构联系</option>
              </select>
            </label>
            <label>名称
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="例如：一张商品图做 3D 广告" />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>
            <label>作者 / 团队
              <input value={form.author} onChange={(e) => update("author", e.target.value)} placeholder="公开展示的名称" />
              {errors.author && <small className="field-error">{errors.author}</small>}
            </label>
            <label>来源教程或项目链接
              <input value={form.sourceUrl} onChange={(e) => update("sourceUrl", e.target.value)} placeholder="https://" />
            </label>
          </div>
          <label>一句话说明
            <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="解决谁的什么问题？做出了什么？哪些地方仍有限制？" />
            {errors.description && <small className="field-error">{errors.description}</small>}
          </label>
          <label>可公开的体验、演示或作品链接
            <input type="url" value={form.demoUrl} onChange={(e) => update("demoUrl", e.target.value)} placeholder="https://" />
            {errors.demoUrl && <small className="field-error">{errors.demoUrl}</small>}
          </label>
          <label className="check">
            <input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} />
            我确认内容真实、拥有公开权利，并理解平台会先审核再公开。
            {errors.agree && <small className="field-error">{errors.agree}</small>}
          </label>
          <button className="button" type="submit" disabled={busy}>{busy ? "提交中…" : "提交审核"}</button>
          {done && <p className="form-message">已记录为演示提交。接入 Supabase 后会进入真实审核队列并邮件通知。</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}
