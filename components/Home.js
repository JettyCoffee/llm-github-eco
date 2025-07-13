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
            {/* 顶部背景区域 */}
            <Box 
                sx={{ 
                    position: 'relative',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        // 减少高斯模糊，让图片更清晰
                        backdropFilter: 'blur(1.5px)',
                        backgroundColor: 'rgba(255, 255, 255, 0)',
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
                            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0) 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0) 0%, transparent 50%)
                        `,
                        zIndex: 2
                    }
                }}
            >
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 3 }}>
                    <Box 
                        sx={{ 
                            textAlign: 'center',
                            py: 4
                        }}
                    >
                        {/* 标题 */}
                        <Typography 
                            variant="h2" 
                            component="h1"
                            sx={{ 
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #007AFF 30%,rgb(136, 67, 234) 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 30px rgba(0, 123, 255, 0.89)',
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
                                textShadow: '0 2px 4px rgba(255, 255, 255, 1)'
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
                                maxWidth: '900px',
                                mx: 'auto',
                                borderRadius: 5,
                                bgcolor: 'rgba(255, 255, 255, 0.66)',
                                backdropFilter: 'blur(40px) saturate(180%)',
                                border: '1px solid rgba(255, 255, 255, 0.88)',
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
                </Container>
            </Box>
            
            {/* 白色底色的内容区域 */}
            <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
                <Container maxWidth="xl" sx={{ py: 8 }}>
                    {/* 功能导航 */}
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 6,
                                fontWeight: 600,
                                color: 'rgba(0, 0, 0, 0.9)',
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
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0, 122, 255, 0.15)',
                                            bgcolor: 'rgba(0, 122, 255, 0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Box
                                            component="img"
                                            src="/window.svg"
                                            alt="Projects"
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                mx: 'auto',
                                                mb: 2,
                                                filter: 'drop-shadow(0px 4px 8px rgba(0, 122, 255, 0.3))'
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#007AFF', mb: 1 }}>
                                            项目总览
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                            浏览最新的大模型项目，查看实时数据统计与趋势分析
                                        </Typography>
                                    </Box>
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
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(88, 86, 214, 0.15)',
                                            bgcolor: 'rgba(88, 86, 214, 0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Box
                                            component="img"
                                            src="/next.svg"
                                            alt="Analytics"
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                mx: 'auto',
                                                mb: 2,
                                                filter: 'drop-shadow(0px 4px 8px rgba(88, 86, 214, 0.3))'
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#5856D6', mb: 1 }}>
                                            智能分析
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                            AI 驱动的深度项目分析，提供专业的技术评估与预测
                                        </Typography>
                                    </Box>
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
                                        border: '1px solid rgba(34, 197, 94, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(34, 197, 94, 0.15)',
                                            bgcolor: 'rgba(34, 197, 94, 0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Box
                                            component="img"
                                            src="/file.svg"
                                            alt="Charts"
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                mx: 'auto',
                                                mb: 2,
                                                filter: 'drop-shadow(0px 4px 8px rgba(34, 197, 94, 0.3))'
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#22C55E', mb: 1 }}>
                                            图表中心
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                            丰富的可视化图表，多维度展示数据洞察与趋势
                                        </Typography>
                                    </Box>
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
                                        border: '1px solid rgba(239, 68, 68, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(239, 68, 68, 0.15)',
                                            bgcolor: 'rgba(239, 68, 68, 0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Box
                                            component="img"
                                            src="/globe.svg"
                                            alt="Insights"
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                mx: 'auto',
                                                mb: 2,
                                                filter: 'drop-shadow(0px 4px 8px rgba(239, 68, 68, 0.3))'
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#EF4444', mb: 1 }}>
                                            生态洞察
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                            深入分析大模型生态系统，发现技术发展规律
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            
                            {/* 项目排行榜 */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    onClick={() => router.push('/rankings')}
                                    sx={{
                                        p: 4,
                                        height: 220,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(40px) saturate(180%)',
                                        border: '1px solid rgba(251, 191, 36, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(251, 191, 36, 0.15)',
                                            bgcolor: 'rgba(251, 191, 36, 0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography sx={{ fontSize: 48, mb: 2 }}>🏆</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#F59E0B', mb: 1 }}>
                                            项目排行榜
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                            实时更新的大模型项目排行榜，多维度评估项目表现
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* 趋势分析 */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    onClick={() => router.push('/trends')}
                                    sx={{
                                        p: 4,
                                        height: 220,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(40px) saturate(180%)',
                                        border: '1px solid rgba(139, 69, 19, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
                                            bgcolor: 'rgba(139, 69, 19, 0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography sx={{ fontSize: 48, mb: 2 }}>📈</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#8B4513', mb: 1 }}>
                                            趋势分析
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                            分析大模型技术发展趋势，预测未来发展方向
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* 开发者洞察 */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    onClick={() => router.push('/developers')}
                                    sx={{
                                        p: 4,
                                        height: 220,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(40px) saturate(180%)',
                                        border: '1px solid rgba(168, 85, 247, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(168, 85, 247, 0.15)',
                                            bgcolor: 'rgba(168, 85, 247, 0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography sx={{ fontSize: 48, mb: 2 }}>👥</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#A855F7', mb: 1 }}>
                                            开发者洞察
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                            分析开发者贡献模式，识别技术社区关键人物
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* 技术栈分析 */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    onClick={() => router.push('/tech-stack')}
                                    sx={{
                                        p: 4,
                                        height: 220,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(40px) saturate(180%)',
                                        border: '1px solid rgba(59, 130, 246, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
                                            bgcolor: 'rgba(59, 130, 246, 0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography sx={{ fontSize: 48, mb: 2 }}>⚙️</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#3B82F6', mb: 1 }}>
                                            技术栈分析
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                            深入分析项目技术栈选择，发现技术偏好和趋势
                                        </Typography>
                                    </Box>
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