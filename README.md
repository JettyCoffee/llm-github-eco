# GitHub LLM 生态系统可视化平台

## 项目简介

本项目是一个基于现代前端技术构建的 GitHub 大语言模型（LLM）生态系统可视化分析平台。依托 GitHub 丰富的开源数据，通过多维度数据挖掘和智能可视化技术，为开发者、研究者和企业提供全面的 AI 大模型生态系统分析工具。

### 🎯 设计目标与意义

- **生态洞察**：全面分析 GitHub 上大模型项目的发展趋势、技术特点和生态关系
- **决策支持**：为技术选型、投资决策和研发规划提供数据驱动的分析支持
- **知识发现**：挖掘开源社区中的技术创新模式和协作网络
- **产业引导**：推动 AI 开源生态健康发展，促进技术创新和知识共享

### 🔧 关键技术

- **前端架构**：Next.js 15.1.3 + React 19 全栈应用框架
- **数据可视化**：ECharts + Chart.js 专业图表库
- **UI 框架**：Material-UI (MUI) + Tailwind CSS 现代化界面
- **数据管理**：Supabase 实时数据库 + PostgreSQL
- **性能优化**：Emotion 样式缓存 + Turbopack 构建优化
- **数据分析**：自研多维度评分算法 + 趋势预测模型

### ✨ 作品特色

1. **智能评分系统**：创新的多维度评分算法，从代码质量、社区活跃度、项目影响力、维护状况四个维度全面评估项目
2. **实时数据分析**：基于 GitHub API 的实时数据采集和分析，提供最新的项目动态
3. **交互式可视化**：丰富的图表组件和交互式界面，支持多项目对比分析
4. **智能洞察引擎**：AI 驱动的趋势分析和风险评估，自动生成项目洞察报告
5. **响应式设计**：完全响应式界面，支持桌面和移动设备访问

## 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 15.1.3 | 全栈框架，SSR/SSG 支持 |
| React | 19.0.0 | 用户界面框架 |
| Material-UI | 6.3.0 | UI 组件库 |
| ECharts | 5.6.0 | 专业数据可视化 |
| Chart.js | 4.4.7 | 图表库 |
| Tailwind CSS | 3.4.1 | 原子化 CSS 框架 |
| Emotion | 11.14.0 | CSS-in-JS 样式解决方案 |
| Supabase | 2.47.10 | 实时数据库客户端 |

### 后端服务

- **数据存储**：Supabase（PostgreSQL）
- **API 服务**：Next.js API Routes
- **数据源**：GitHub API + OpenDigger
- **缓存策略**：浏览器缓存 + 服务端缓存

### 项目结构

```
frontend-of-llm-eco-viz-with-vercel/
├── components/          # React 组件
│   ├── ChartCard.js    # 图表卡片组件
│   ├── Dashboard.js    # 仪表盘主组件
│   ├── Header.js       # 页面头部
│   ├── Home.js         # 首页组件
│   ├── SearchComponent.js # 搜索组件
│   └── ...
├── pages/              # Next.js 页面路由
│   ├── api/           # API 路由
│   ├── analytics.js   # 分析页面
│   ├── insights.js    # 洞察页面
│   ├── dashboard.js   # 仪表盘页面
│   └── ...
├── lib/               # 核心库文件
│   ├── dataService.js # 数据服务
│   └── supabase.js    # Supabase 配置
├── utils/             # 工具函数
│   ├── ChartService.js # 图表服务
│   └── helpers.js     # 辅助函数
├── contexts/          # React Context
│   └── ProjectContext.js # 项目状态管理
├── hooks/             # 自定义 Hooks
│   └── useDebounce.js # 防抖 Hook
└── styles/            # 样式文件
    └── globals.css    # 全局样式
```

## 核心功能

### 1. 项目搜索与发现
- **智能搜索**：支持项目名称、组织、关键词的模糊搜索
- **实时建议**：搜索过程中提供智能建议和自动补全
- **项目筛选**：按照语言、主题、活跃度等维度筛选项目

### 2. 多维度项目分析
- **代码质量评分**：基于 PR 质量、代码审查效率、Issue 解决质量的综合评分
- **社区活跃度**：贡献者多样性、新贡献者增长、社区响应活跃度分析
- **项目影响力**：Stars 增长、技术影响力、Fork 应用趋势评估
- **维护状况**：发版频率、文档质量、Issue 处理效率评估

### 3. 数据可视化
- **趋势图表**：项目各项指标的时间序列分析
- **对比分析**：多项目间的横向对比可视化
- **关系网络**：项目间的依赖关系和影响力网络
- **排行榜**：各维度的项目排名展示

### 4. 智能洞察
- **趋势预测**：基于历史数据的项目发展趋势预测
- **风险评估**：项目潜在风险和机会分析
- **市场分析**：技术生态市场分布和竞争格局
- **创新发现**：新兴技术和创新模式识别

## 环境要求

- **Node.js**：18.0.0 或更高版本
- **npm**：9.0.0 或更高版本
- **现代浏览器**：Chrome 90+、Firefox 88+、Safari 14+

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-repo/llm-eco-viz.git
cd llm-eco-viz
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
在项目根目录创建 `.env.local` 文件：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 5. 构建生产版本
```bash
npm run build
npm start
```

## 部署指南

### Vercel 部署（推荐）
1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量
4. 自动部署完成

### 其他平台部署
项目支持任何支持 Node.js 的平台，包括：
- Netlify
- AWS Amplify
- Railway
- Render

## 开发指南

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 React 最佳实践
- 使用 TypeScript 类型注释（可选）

### 开发工具
```bash
# 代码检查
npm run lint

# 构建应用
npm run build

# 启动生产服务器
npm start
```

### 贡献指南
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 数据源

- **OpenDigger**：开源项目数据分析平台
- **GitHub API**：实时项目数据获取
- **自建数据库**：项目历史数据存储

## 性能优化

- **代码分割**：按需加载减少初始包大小
- **图片优化**：Next.js 图片优化和懒加载
- **缓存策略**：多层缓存提高数据访问速度
- **CDN 加速**：静态资源 CDN 分发

## 项目亮点

1. **创新算法**：独创的多维度项目评分算法
2. **实时性**：基于实时数据的动态分析
3. **可扩展性**：模块化架构支持功能扩展
4. **用户体验**：直观的界面和丰富的交互功能
5. **开源生态**：完全开源，支持社区贡献

## 技术债务与改进

- [ ] 添加 TypeScript 支持
- [ ] 实现离线缓存功能
- [ ] 优化移动端体验
- [ ] 添加单元测试
- [ ] 实现国际化支持

## 版本历史

- **v1.0.0**：基础功能实现
- **v1.1.0**：增加智能洞察功能
- **v1.2.0**：优化性能和用户体验
- **v1.3.0**：添加多项目对比功能

## 许可证

MIT License

## 致谢

感谢以下项目和团队的支持：
- [OpenDigger](https://github.com/X-lab2017/open-digger) - 数据源支持
- [Next.js](https://nextjs.org/) - 应用框架
- [Material-UI](https://mui.com/) - UI 组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化

---