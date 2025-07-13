import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Paper,
    Grid,
    Link,
    Chip
} from '@mui/material';
import { useRouter } from 'next/router';
import { ProjectContext } from '../contexts/ProjectContext';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchComponent from './SearchComponent';
import Header from './Header';

const Home = () => {
    const { setSelectedProjects } = useContext(ProjectContext);
    const [showHeaderSearch, setShowHeaderSearch] = useState(false);
    const router = useRouter();
    const searchRef = useRef(null);

    // 滚动监听，检测搜索控件是否被Header遮盖
    useEffect(() => {
        const handleScroll = () => {
            if (searchRef.current) {
                const searchRect = searchRef.current.getBoundingClientRect();
                const headerHeight = 64; // Header的高度
                
                // 当搜索控件被Header遮盖时，显示Header中的搜索控件
                const isSearchHidden = searchRect.top < headerHeight;
                setShowHeaderSearch(isSearchHidden);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleProjectSelect = (project) => {
        setSelectedProjects([project]);
        router.push('/dashboard');
    };

    return (
        <>
            <Header showSearch={showHeaderSearch} />
            <Box 
                sx={{ 
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: '64px',
                    bgcolor: '#f8f9fa'
                }}
            >
                <Container maxWidth="md">
                    <Box 
                        sx={{ 
                            textAlign: 'center',
                            py: 8
                        }}
                    >
                        {/* 标题 */}
                        <Typography 
                            variant="h2" 
                            component="h1"
                            sx={{ 
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 20px rgba(33, 150, 243, 0.1)',
                                mb: 2
                            }}
                        >
                            GitHub 大模型生态系统可视化
                        </Typography>

                        {/* 副标题 */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
                            <Link
                                href="https://github.com/X-lab2017/open-digger"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: 'inline-block',
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/Data-OpenDigger-2097FF.svg"
                                    alt="Data OpenDigger"
                                    sx={{ 
                                        height: '20px'
                                    }}
                                />
                            </Link>
                            <Link
                                href="https://github.com/JettyCoffee/llm-github-eco"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: 'inline-block',
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://img.shields.io/badge/Project-LLM_GitHub_Eco-blue"
                                    alt="Project LLM Eco Viz"
                                    sx={{ 
                                        height: '20px',
                                        filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.1))'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </Link>
                        </Box>

                        {/* 项目介绍 */}
                        <Typography 
                            variant="body1"
                            sx={{ 
                                mb: 6,
                                color: 'text.secondary',
                                maxWidth: '800px',
                                mx: 'auto',
                                lineHeight: 1.8,
                                fontSize: '1.1rem'
                            }}
                        >
                            本平台依托 GitHub 丰富的开源数据，打造业界领先的 AI 大模型生态系统分析与可视化工具。我们通过多维度、全方位的数据挖掘与智能可视化，助力开发者、研究者和企业洞察大模型生态的最新趋势与核心竞争力。无论是技术选型、生态评估还是创新决策，这里都能为您提供权威、直观、深入的分析支持，助力把握 AI 时代的每一次机遇！
                        </Typography>

                        {/* 搜索组件 */}
                        <Paper
                            elevation={0}
                            ref={searchRef}
                            sx={{
                                p: 3,
                                maxWidth: '800px',
                                mx: 'auto',
                                borderRadius: 5,
                                bgcolor: 'background.paper',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                position: 'relative'
                            }}
                        >
                            <SearchComponent 
                                compact={false}
                                showAnalyzeButton={true}
                                onProjectSelect={handleProjectSelect}
                                placeholder="输入 GitHub 项目名称（例如：langchain-chatchat）进行分析"
                                backgroundColor="#f8f9fa"
                            />
                        </Paper>
                    </Box>
                    
                    {/* 使用指南 */}
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 6,
                                fontWeight: 600,
                                color: 'text.primary'
                            }}
                        >
                            使用指南
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            {/* GitHub项目分析 */}
                            <Grid item xs={12} md={12}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <GitHubIcon sx={{ fontSize: 28, mr: 2, color: 'text.primary' }} />
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                            项目分析功能
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                            1. 项目搜索与选择
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, pl: 2 }}>
                                            • 智能搜索：在搜索框输入GitHub项目名称，系统支持模糊匹配<br/>
                                            • 快速选择：从下拉列表选择目标项目，支持键盘导航<br/>
                                            • 一键分析：点击"分析"按钮即可开始深度分析
                                        </Typography>

                                        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                            2. 多维度评分分析
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, pl: 2 }}>
                                            • 代码质量评分：基于PR质量、代码审查效率、Issue解决效果<br/>
                                            • 社区活跃度：评估贡献者多样性、新贡献者增长、响应速度<br/>
                                            • 项目影响力：分析Stars增长、技术关注度、Fork应用情况<br/>
                                            • 维护指数：综合评估项目的长期维护能力
                                        </Typography>

                                        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                            3. 可视化数据展示
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, pl: 2 }}>
                                            • 时序图表：展示项目各项指标的历史变化趋势<br/>
                                            • 交互式探索：支持缩放、筛选、导出等功能<br/>
                                            • 对比分析：多项目数据对比，洞察竞争优势
                                        </Typography>

                                        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                            4. 项目详情信息
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                                            • 基础信息：项目简介、开发语言、许可证信息<br/>
                                            • 团队信息：核心贡献者、组织背景、社区规模<br/>
                                            • 技术栈：依赖关系、架构分析、技术选型<br/>
                                            • 生态影响：衍生项目、应用场景、行业应用
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 技术实现 */}
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 4,
                                fontWeight: 600,
                                color: 'text.primary'
                            }}
                        >
                            技术实现
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>数据获取与处理</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • OpenDigger 数据集<br/>
                                        • Hugging Face API<br/>
                                        • 网页爬虫<br/>
                                        • Easy Graph 图计算<br/>
                                        • 数据预处理流水线<br/>
                                        • 增量数据更新<br/>
                                        • GitHub API 集成<br/>
                                        • 实时数据同步
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>前端开发</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Next.js 15 + React 19<br/>
                                        • Material-UI 组件库<br/>
                                        • ECharts 数据可视化<br/>
                                        • 响应式图表设计<br/>
                                        • Tailwind CSS<br/>
                                        • 现代化UI设计
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>后端服务</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Node.js 服务端<br/>
                                        • RESTful API 设计<br/>
                                        • 数据库优化<br/>
                                        • 性能监控<br/>
                                        • 缓存策略<br/>
                                        • 服务器部署
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 评分算法 */}
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 4,
                                fontWeight: 600,
                                color: 'text.primary'
                            }}
                        >
                            评分算法
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>评分算法</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                        基于GitHub开源项目的多维度评价体系：<br/>
                                        • 代码质量指标（PR接受率、审查效率）<br/>
                                        • 社区活跃度（贡献者增长、响应时间）<br/>
                                        • 项目影响力（Stars、Fork、关注度）<br/>
                                        • 维护稳定性（更新频率、Issue处理）<br/><br/>
                                        算法特点：<br/>
                                        • 动态权重调整<br/>
                                        • 时间序列分析<br/>
                                        • 趋势预测能力
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>技术架构</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                        现代化的全栈技术方案：<br/>
                                        • 前端：React + Next.js + Material-UI<br/>
                                        • 后端：Node.js + Express + RESTful API<br/>
                                        • 数据库：PostgreSQL + Supabase<br/>
                                        • 可视化：ECharts + 自定义图表<br/><br/>
                                        性能优化：<br/>
                                        • 服务端渲染（SSR）<br/>
                                        • 数据缓存策略<br/>
                                        • 组件懒加载<br/>
                                        • CDN加速部署
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 项目架构 */}
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 4,
                                fontWeight: 600,
                                color: 'text.primary'
                            }}
                        >
                            项目架构
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>数据获取模块</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                        • 模型元数据获取<br/>
                                        &nbsp;&nbsp;- 基础信息采集<br/>
                                        &nbsp;&nbsp;- 下载量统计<br/>
                                        &nbsp;&nbsp;- 点赞数追踪<br/>
                                        • 作者信息采集<br/>
                                        &nbsp;&nbsp;- 个人/组织识别<br/>
                                        &nbsp;&nbsp;- 影响力评估<br/>
                                        • 衍生关系分析<br/>
                                        &nbsp;&nbsp;- Model Tree 构建<br/>
                                        &nbsp;&nbsp;- 关系类型识别
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>数据处理模块</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                        • 图数据处理<br/>
                                        &nbsp;&nbsp;- 节点属性定义<br/>
                                        &nbsp;&nbsp;- 边关系构建<br/>
                                        &nbsp;&nbsp;- 图计算优化<br/>
                                        • 影响力计算<br/>
                                        &nbsp;&nbsp;- 自身影响力<br/>
                                        &nbsp;&nbsp;- 关系传播<br/>
                                        • 数据预处理<br/>
                                        &nbsp;&nbsp;- 清洗与过滤<br/>
                                        &nbsp;&nbsp;- 格式标准化
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>可视化模块</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                        • 排行榜系统<br/>
                                        &nbsp;&nbsp;- 多维度排序<br/>
                                        &nbsp;&nbsp;- 实时更新<br/>
                                        &nbsp;&nbsp;- 筛选功能<br/>
                                        • 网络关系图<br/>
                                        &nbsp;&nbsp;- 多视图切换<br/>
                                        &nbsp;&nbsp;- 交互式探索<br/>
                                        • 数据大屏<br/>
                                        &nbsp;&nbsp;- 实时统计<br/>
                                        &nbsp;&nbsp;- 趋势分析
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 未来规划 */}
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 4,
                                fontWeight: 600,
                                color: 'text.primary'
                            }}
                        >
                            未来规划
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>数据扩展</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                        • 扩大GitHub项目覆盖范围<br/>
                                        • 增加历史数据深度分析<br/>
                                        • 引入更多评估维度<br/>
                                        • 优化数据更新机制<br/>
                                        • 支持私有仓库分析
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>功能优化</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                        • 完善评分算法准确性<br/>
                                        • 增强可视化效果<br/>
                                        • 提升用户交互体验<br/>
                                        • 添加更多分析维度<br/>
                                        • 支持自定义仪表板
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>生态拓展</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                        • 支持更多开源平台<br/>
                                        • 深化GitHub生态分析<br/>
                                        • 开放数据接口API<br/>
                                        • 建立开发者社区<br/>
                                        • 提供企业级解决方案
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Home;