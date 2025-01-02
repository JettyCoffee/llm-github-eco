# LLM 生态系统可视化前端

这是一个基于 Next.js 开发的 LLM（大语言模型）生态系统可视化项目的前端部分。本项目使用现代化的前端技术栈，提供直观的数据可视化界面。

## 技术栈

- **框架**: Next.js 15.1.3 + React 19
- **UI 组件**: Material-UI (MUI)
- **样式**: Tailwind CSS + Emotion
- **数据可视化**: ECharts + Chart.js
- **后端服务**: Supabase
- **开发工具**: ESLint + Turbopack

## 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

## 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```

2. **环境变量配置**
   在项目根目录创建 `.env.local` 文件并配置以下环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
   NEXT_PUBLIC_GITHUB_TOKEN=你的_GITHUB_TOKEN
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   访问 http://localhost:3000 查看应用

## 项目结构

```
frontend/
├── components/     # React 组件
├── pages/         # 页面路由
├── public/        # 静态资源
├── styles/        # 全局样式
├── utils/         # 工具函数
├── lib/           # 核心库文件
├── hooks/         # React hooks
├── contexts/      # React contexts
└── data/          # 静态数据
```

## 主要功能

- LLM 项目数据可视化
- 生态系统关系图谱
- 项目活跃度分析
- 代码变更统计
- 贡献者网络

## 开发指南

- 使用 `npm run lint` 进行代码检查
- 使用 `npm run build` 构建生产版本
- 使用 `npm start` 启动生产服务器

## 部署

项目可以部署到任何支持 Node.js 的平台，推荐使用 Vercel：

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署完成

## 注意事项

- 确保所有环境变量都已正确配置
- 开发时请遵循项目的代码规范
- 提交代码前请运行 lint 检查

## 贡献指南

欢迎提交 Pull Request 或提出 Issue。在贡献代码时，请确保：

1. 遵循现有的代码风格
2. 添加必要的测试
3. 更新相关文档
4. 提交有意义的 commit 信息
