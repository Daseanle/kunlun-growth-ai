# 昆仑增长AI实战

面向全球中文用户的 AI 实战、作品和真实应用验证平台。首个赛道为 **AI × 跨境电商**。

## Vercel 自动部署

1. 在 GitHub 创建仓库并推送本目录。
2. 打开 [Vercel New Project](https://vercel.com/new)，连接 GitHub 仓库。
3. Framework preset 选 **Next.js**；本项目已配置静态导出。
4. Build command：`npm run build`；Output directory：`.next`。
5. 在 Vercel 的 Project Settings → Environment Variables 配置：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
6. 生产分支设置为 `main`。之后每次 push 到 `main` 会自动部署；其他分支会生成 Preview Deployment。

## Supabase 启用步骤

1. 创建 Supabase 项目并启用 Email OTP。
2. 设置站点 URL 和 Cloudflare Preview / Production redirect URLs。
3. 在 SQL Editor 执行 `supabase/migrations/001_core.sql`。
4. 确认 `public` 表按 Data API 设置对需要的角色开放；所有 RLS 策略已在迁移中定义。
5. 把 URL 与 publishable key 放入 Vercel 的 Production、Preview 和 Development 环境变量。绝不把 service role 放入前端或 Vercel 公共变量。

## 本地运行

```bash
npm install
copy .env.example .env.local
npm run dev
```

没有 Supabase 环境变量时，网站以公开演示模式运行；登录、投稿与联系表单会提示尚未接入云端。
