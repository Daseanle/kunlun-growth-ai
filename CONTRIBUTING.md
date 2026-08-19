# 贡献指南

感谢你有兴趣为昆仑增长AI实战贡献力量！

## 开发环境搭建

```bash
git clone https://github.com/Daseanle/kunlun-growth-ai.git
cd kunlun-growth-ai
npm install
cp .env.example .env.local
# 编辑 .env.local 填入 Supabase 配置
npm run dev
```

没有 Supabase 配置时项目以演示模式运行，可以正常浏览公开页面。

## 开发流程

1. Fork 仓库并创建分支：`git checkout -b feature/your-feature`
2. 编写代码，确保通过检查：
   ```bash
   npm run lint        # ESLint 检查
   npm run type-check  # TypeScript 类型检查
   npm run build       # 生产构建
   ```
3. 提交代码，遵循约定式提交格式：
   - `feat: 新功能描述`
   - `fix: 修复描述`
   - `docs: 文档变更`
   - `refactor: 重构描述`
   - `style: 样式调整`
   - `chore: 构建/工具变更`
4. 推送分支并提交 Pull Request

## 代码规范

- TypeScript strict 模式，不允许 `any` 类型
- 组件用函数式，优先 Server Components，需要交互的加 `"use client"`
- 样式用纯 CSS，不引入 Tailwind 或 CSS-in-JS
- 提交前确保 `npm run lint` 和 `npm run build` 无报错

## 提交教程

教程数据在 `data/tutorials.json`，每篇教程包含：

- `slug`：URL 路径标识
- `title`：标题
- `category`：分类（如"跨境电商"、"Agent 自动化"）
- `duration`：预计时长
- `source`：原始来源
- `prompt`：可复制的提示词
- `steps`：操作步骤
- `risks`：风险提醒

提交新教程时请确保内容可追溯、有明确目标和通关标准。

## 报告问题

- Bug 报告：使用 GitHub Issue 的 Bug Report 模板
- 功能建议：使用 Feature Request 模板
- 安全漏洞：请直接发邮件，不要公开 Issue

## 行为准则

参与本项目即表示你同意遵守 [行为准则](./CODE_OF_CONDUCT.md)。
