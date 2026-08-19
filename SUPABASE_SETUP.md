# Supabase 认证配置指南

本指南帮助你完成 Supabase 后端配置，让登录功能正常工作。

## 前置条件

- 已注册 [Supabase](https://supabase.com) 账号
- 已创建一个 Supabase 项目

## 步骤 1：执行数据库迁移

在 Supabase Dashboard 的 SQL Editor 中，粘贴并运行 `supabase/migrations/001_core.sql` 的全部内容。

这会创建 4 张表（profiles、learning_progress、submissions、contact_requests）和对应的 RLS 策略。

## 步骤 2：获取 API 密钥

在 Supabase Dashboard → Settings → API 页面：

1. 复制 **Project URL**（形如 `https://xxxxx.supabase.co`）
2. 复制 **anon public key**（即 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`）

> 注意：不要使用 service_role key 作为 NEXT_PUBLIC 变量，它会在客户端暴露。

## 步骤 3：配置环境变量

### 本地开发

创建 `.env.local` 文件（已在 .gitignore 中）：

```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的anon公钥
```

### Vercel 部署

在 Vercel 项目设置 → Environment Variables 中添加上述两个变量。

## 步骤 4：配置认证设置

在 Supabase Dashboard → Authentication → Settings：

1. **Site URL**：填写你的域名（如 `https://your-domain.vercel.app`）
2. **Redirect URLs**：添加以下地址：
   - `https://你的域名/auth/confirm`
   - `http://localhost:3000/auth/confirm`（本地开发）

## 步骤 5：更新邮件模板

在 Supabase Dashboard → Authentication → Email Templates → Confirmation Mail：

将确认链接模板改为：

```
{{ .SiteURL }}/auth/confirm?next=/tutorials
```

> 默认模板使用 `{{ .ConfirmationURL }}`，它直接跳转到 Supabase 的回调地址。
> 改为上述格式后，链接会指向我们的 Route Handler 进行 Token 交换。

如果你使用 PKCE 流程（推荐），确认链接应为：

```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/tutorials
```

## 步骤 6：验证

1. 启动本地开发服务器：`npm run dev`
2. 访问 `http://localhost:3000/login`
3. 输入邮箱，点击"发送登录链接"
4. 检查邮箱，点击魔法链接
5. 应自动跳转到 `/tutorials`，Header 显示你的邮箱

## 常见问题

### 登录后未跳转

检查 Supabase Dashboard → Authentication → Settings 中的 Redirect URLs 是否包含你的域名 + `/auth/confirm`。

### 邮件未收到

- 检查垃圾邮件
- Supabase 免费版有发送频率限制
- 可在 Authentication → Users 中手动确认用户

### 本地开发 Cookie 问题

确保 `http://localhost:3000` 在 Redirect URLs 列表中。浏览器对 localhost 的 Cookie 处理与生产域名不同，确保使用 HTTP（非 HTTPS）进行本地开发。

## 架构说明

```
用户输入邮箱
    ↓
login/page.tsx → signInWithOtp(emailRedirectTo: /auth/confirm)
    ↓
Supabase 发送魔法链接邮件
    ↓
用户点击邮件链接 → /auth/confirm?code=xxx
    ↓
auth/confirm/route.ts → exchangeCodeForSession(code)
    ↓
设置会话 Cookie → 重定向到 /tutorials
    ↓
middleware.ts → 每个请求刷新过期 Token
    ↓
SiteHeader → useAuth() → 显示登录状态
```
