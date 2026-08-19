# 昆仑增长AI实战

> 面向全球中文用户的 AI 实战、作品和真实应用验证平台。首个赛道：AI × 跨境电商。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

**在线 Demo**: [https://kunlun-growth-ai.vercel.app](https://kunlun-growth-ai.vercel.app)

## 功能特性

- **实战教程**：21 篇带明确目标、复制提示词、通关标准和风险提醒的 AI 实战教程，覆盖 Agent 自动化、数据与知识、跨境电商等方向
- **三种登录方式**：邮箱验证码（OTP）注册/登录、密码登录、验证码重置密码
- **个人中心**：昵称与头像编辑、学习进度追踪、登录安全记录
- **作品广场**：公开提交作品，作者可随时撤回
- **企业挑战**：真实企业问题对接（即将开放）
- **演示模式**：未配置 Supabase 时自动进入只读演示模式，所有公开内容正常展示
- **安全设计**：RLS 行级安全策略、安全响应头、开放重定向防护、OTP 防邮件预扫描

## 技术栈

| 层 | 技术 | 版本 |
|---|---|---|
| 前端框架 | Next.js (App Router) | 15.5 |
| UI 库 | React | 19 |
| 语言 | TypeScript (strict) | 5.9 |
| 后端服务 | Supabase (Auth + PostgreSQL + Storage) | - |
| 数据校验 | Zod | 3.x |
| 图标 | lucide-react | 0.468 |
| 部署 | Vercel | - |
| 样式 | 纯 CSS（无框架） | - |

## 快速开始

### 前置要求

- Node.js >= 18
- npm 或其他包管理器
- Supabase 账号（免费额度即可）

### 步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Daseanle/kunlun-growth-ai.git
cd kunlun-growth-ai

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 Supabase URL 和 anon public key

# 4. 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可。

> 没有 Supabase 环境变量时，网站以演示模式运行：公开内容正常展示，登录、投稿和联系表单会提示尚未接入云端。

### Supabase 配置

详细步骤见 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)，核心步骤：

1. 创建 Supabase 项目
2. 在 SQL Editor 依次执行 `supabase/migrations/` 下的 4 个迁移文件
3. 在 Authentication → Email Templates 中配置中文 OTP 邮件模板
4. 把 Project URL 和 anon public key 填入 `.env.local`

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── account/            # 个人中心（仪表盘/资料/密码/安全）
│   ├── auth/confirm/       # 认证回调路由
│   ├── tutorials/          # 教程列表 + 详情页
│   ├── login/              # 登录页
│   ├── submit/             # 作品提交
│   └── ...                 # 首页、关于、联系等
├── components/             # React 组件
├── data/tutorials.json     # 教程数据源
├── lib/                    # 工具库
│   ├── supabase/           # Supabase 客户端（client/server/middleware）
│   ├── login-event.ts      # 登录事件记录
│   ├── tutorials.ts        # 教程数据解析
│   └── ua-parser.ts        # User-Agent 解析
├── supabase/migrations/    # SQL 迁移文件（含 RLS 策略）
└── public/                 # 静态资源 + 安全头配置
```

## 部署

### Vercel 部署（推荐）

1. Fork 本仓库
2. 打开 [Vercel New Project](https://vercel.com/new)，连接你的 GitHub 仓库
3. Framework preset 选 **Next.js**
4. 在 Environment Variables 中配置：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. 部署完成后访问 Vercel 分配的域名

### 自托管

```bash
npm run build
npm run start
```

需要自行配置反向代理和 SSL。

## 数据库结构

| 表 | 用途 | RLS |
|---|---|---|
| `profiles` | 用户资料（昵称、头像、简介） | 公开读，本人可写 |
| `learning_progress` | 学习进度 | 本人 CRUD |
| `submissions` | 作品/项目投稿 | 公开投稿只读，本人 CRUD |
| `contact_requests` | 联系需求 | 本人读，本人创建 |
| `login_events` | 登录记录 | 本人只读 |

所有表的 RLS 策略已在迁移文件中定义。

## 贡献

欢迎提交 Issue 和 PR！请先阅读 [贡献指南](./CONTRIBUTING.md)。

## 开源协议

[MIT License](./LICENSE) - 可自由使用、修改、分发和商用。
