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
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: '64px',
                    // 背景图片设置
                    backgroundImage: 'url(/back.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        // 高斯模糊和遮罩效果
                        backdropFilter: 'blur(30px) saturate(180%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 1
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
                        `,
                        zIndex: 2
                    }
                }}
            >
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 3 }}>
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
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #007AFF 30%, #5856D6 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 30px rgba(0, 122, 255, 0.3)',
                                mb: 2,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                letterSpacing: '-0.02em'
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
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/Data-OpenDigger-2097FF.svg"
                                    alt="Data OpenDigger"
                                    sx={{ 
                                        height: '24px',
                                        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                                    }}
                                />
                            </Link>
                            <Link
                                href="https://github.com/JettyCoffee/llm-github-eco"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: 'inline-block',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://img.shields.io/badge/Project-LLM_GitHub_Eco-blue"
                                    alt="Project LLM Eco Viz"
                                    sx={{ 
                                        height: '24px',
                                        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
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
                                color: 'rgba(0, 0, 0, 0.8)',
                                maxWidth: '800px',
                                mx: 'auto',
                                lineHeight: 1.8,
                                fontSize: '1.1rem',
                                fontWeight: 400,
                                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                            }}
                        >
                            本平台依托 GitHub 丰富的开源数据，打造业界领先的 AI 大模型生态系统分析与可视化工具。我们通过多维度、全方位的数据挖掘与智能可视化，助力开发者、研究者和企业洞察大模型生态的最新趋势与核心竞争力。无论是技术选型、生态评估还是创新决策，这里都能为您提供权威、直观、深入的分析支持，助力把握 AI 时代的每一次机遇！
                        </Typography>

                        {/* 搜索组件 */}
                        <Paper
                            elevation={0}
                            ref={searchRef}
                            sx={{
                                p: 4,
                                maxWidth: '800px',
                                mx: 'auto',
                                borderRadius: 4,
                                bgcolor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(40px) saturate(180%)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: `
                                    0 8px 32px rgba(0, 0, 0, 0.12),
                                    0 1px 0 rgba(255, 255, 255, 0.8) inset,
                                    0 -1px 0 rgba(0, 0, 0, 0.05) inset
                                `,
                                position: 'relative',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `
                                        0 16px 48px rgba(0, 0, 0, 0.15),
                                        0 1px 0 rgba(255, 255, 255, 0.8) inset,
                                        0 -1px 0 rgba(0, 0, 0, 0.05) inset
                                    `
                                }
                            }}
                        >
                            <SearchComponent 
                                compact={false}
                                showAnalyzeButton={true}
                                onProjectSelect={handleProjectSelect}
                                placeholder="输入 GitHub 项目名称（例如：langchain-chatchat）进行分析"
                                backgroundColor="rgba(0, 122, 255, 0.08)"
                            />
                        </Paper>
                    </Box>
                    
                    {/* 功能导航 */}
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 6,
                                fontWeight: 600,
                                color: 'rgba(0, 0, 0, 0.9)',
                                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
                                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.5rem' }
                            }}
                        >
                            探索功能
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            {/* 项目总览 */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    onClick={() => router.push('/overview')}
                                    sx={{
                                        p: 4,
                                        height: 220,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(40px) saturate(180%)',
                                        border: '1px solid rgba(0, 122, 255, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-12px) scale(1.03)',
                                            boxShadow: '0 25px 50px rgba(0, 122, 255, 0.25)',
                                            bgcolor: 'rgba(0, 122, 255, 0.03)',
                                            '&::before': {
                                                opacity: 1
                                            }
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.1) 100%)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 4,
                                            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            boxShadow: '0 12px 24px rgba(0, 122, 255, 0.35)',
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    >
                                        <GitHubIcon sx={{ fontSize: 32, color: 'white' }} />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, position: 'relative', zIndex: 1 }}>
                                        项目总览
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                        GitHub LLM生态系统中的精选项目
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/* 智能分析 */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    onClick={() => router.push('/analytics')}
                                    sx={{
                                        p: 4,
                                        height: 220,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(40px) saturate(180%)',
                                        border: '1px solid rgba(88, 86, 214, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-12px) scale(1.03)',
                                            boxShadow: '0 25px 50px rgba(88, 86, 214, 0.25)',
                                            bgcolor: 'rgba(88, 86, 214, 0.03)',
                                            '&::before': {
                                                opacity: 1
                                            }
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(135deg, rgba(88, 86, 214, 0.1) 0%, rgba(175, 82, 222, 0.1) 100%)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 4,
                                            background: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            boxShadow: '0 12px 24px rgba(88, 86, 214, 0.35)',
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 32, color: 'white' }}>📊</Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, position: 'relative', zIndex: 1 }}>
                                        智能分析
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                        深度洞察生态系统健康度和发展趋势
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/* 图表中心 */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    onClick={() => router.push('/charts')}
                                    sx={{
                                        p: 4,
                                        height: 220,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(40px) saturate(180%)',
                                        border: '1px solid rgba(255, 149, 0, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-12px) scale(1.03)',
                                            boxShadow: '0 25px 50px rgba(255, 149, 0, 0.25)',
                                            bgcolor: 'rgba(255, 149, 0, 0.03)',
                                            '&::before': {
                                                opacity: 1
                                            }
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 4,
                                            background: 'linear-gradient(135deg, #FF9500 0%, #FF6B35 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            boxShadow: '0 12px 24px rgba(255, 149, 0, 0.35)',
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 32, color: 'white' }}>📈</Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, position: 'relative', zIndex: 1 }}>
                                        图表中心
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                        可视化图表展示项目数据和指标
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/* 生态洞察 */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    onClick={() => router.push('/insights')}
                                    sx={{
                                        p: 4,
                                        height: 220,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(40px) saturate(180%)',
                                        border: '1px solid rgba(52, 199, 89, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-12px) scale(1.03)',
                                            boxShadow: '0 25px 50px rgba(52, 199, 89, 0.25)',
                                            bgcolor: 'rgba(52, 199, 89, 0.03)',
                                            '&::before': {
                                                opacity: 1
                                            }
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.1) 0%, rgba(48, 209, 88, 0.1) 100%)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 4,
                                            background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            boxShadow: '0 12px 24px rgba(52, 199, 89, 0.35)',
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 32, color: 'white' }}>🔍</Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, position: 'relative', zIndex: 1 }}>
                                        生态洞察
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                        发现技术趋势和开发者社区动态
                                    </Typography>
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