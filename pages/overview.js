import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    CircularProgress,
    Alert,
    Chip,
    Card,
    CardContent,
    CardActions,
    Fade,
    Divider
} from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DataService } from '../lib/dataService';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarIcon from '@mui/icons-material/Star';
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Overview = () => {
    const [selectedLetter, setSelectedLetter] = useState('A');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [projectsData, setProjectsData] = useState({});
    const router = useRouter();

    // 字母按钮列表
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // 获取指定字母开头的项目
    const fetchProjectsByLetter = async (letter) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/projects/search?q=${letter}&limit=50`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const data = await response.json();
            
            // 过滤出以指定字母开头的项目
            const filteredProjects = data.filter(project => {
                const firstLetter = project.full_name.charAt(0).toUpperCase();
                return firstLetter === letter;
            });
            
            setProjects(filteredProjects);
            
            // 为每个项目获取详细数据
            const projectDetails = {};
            for (const project of filteredProjects.slice(0, 20)) { // 限制为前20个项目
                try {
                    const metrics = await DataService.getProjectMetrics(project.full_name);
                    projectDetails[project.full_name] = metrics;
                } catch (error) {
                    console.error(`Error fetching metrics for ${project.full_name}:`, error);
                    projectDetails[project.full_name] = null;
                }
            }
            
            setProjectsData(projectDetails);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('加载项目数据时出错，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 初始加载
    useEffect(() => {
        fetchProjectsByLetter(selectedLetter);
    }, [selectedLetter]);

    // 计算项目的简单评分
    const calculateSimpleScore = (metrics) => {
        if (!metrics) return 0;
        
        let score = 0;
        let count = 0;
        
        // Stars 评分
        if (metrics.stars?.length > 0) {
            const latestStars = metrics.stars[metrics.stars.length - 1]?.value || 0;
            score += Math.min(Math.log10(latestStars + 1) * 10, 50);
            count++;
        }
        
        // Forks 评分
        if (metrics.technical_fork?.length > 0) {
            const latestForks = metrics.technical_fork[metrics.technical_fork.length - 1]?.value || 0;
            score += Math.min(Math.log10(latestForks + 1) * 8, 30);
            count++;
        }
        
        // Attention 评分
        if (metrics.attention?.length > 0) {
            const latestAttention = metrics.attention[metrics.attention.length - 1]?.value || 0;
            score += Math.min(latestAttention * 2, 20);
            count++;
        }
        
        return count > 0 ? Math.round(score / count) : 0;
    };

    // 处理项目详情查看
    const handleProjectDetail = (projectName) => {
        router.push(`/dashboard?project=${encodeURIComponent(projectName)}`);
    };

    // 获取项目的基本统计信息
    const getProjectStats = (projectName, metrics) => {
        const stats = {
            stars: 0,
            forks: 0,
            attention: 0
        };
        
        if (metrics) {
            if (metrics.stars?.length > 0) {
                stats.stars = metrics.stars[metrics.stars.length - 1]?.value || 0;
            }
            if (metrics.technical_fork?.length > 0) {
                stats.forks = metrics.technical_fork[metrics.technical_fork.length - 1]?.value || 0;
            }
            if (metrics.attention?.length > 0) {
                stats.attention = metrics.attention[metrics.attention.length - 1]?.value || 0;
            }
        }
        
        return stats;
    };

    return (
        <>
            <Header />
            <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: '64px' }}>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    {/* 页面标题 */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography 
                            variant="h3" 
                            component="h1"
                            sx={{ 
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2
                            }}
                        >
                            项目总览
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            按字母顺序浏览 GitHub 大模型生态系统中的项目
                        </Typography>
                    </Box>

                    {/* 字母导航 */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            mb: 4, 
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                            按首字母筛选
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {alphabet.map((letter) => (
                                <Button
                                    key={letter}
                                    variant={selectedLetter === letter ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => setSelectedLetter(letter)}
                                    sx={{
                                        minWidth: '40px',
                                        height: '40px',
                                        borderRadius: 1,
                                        ...(selectedLetter === letter && {
                                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
                                            }
                                        })
                                    }}
                                >
                                    {letter}
                                </Button>
                            ))}
                        </Box>
                    </Paper>

                    {/* 项目统计信息 */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            "{selectedLetter}" 开头的项目 ({projects.length} 个)
                        </Typography>
                        {loading && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2" color="text.secondary">
                                    正在加载项目数据...
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* 错误提示 */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 4 }}>
                            {error}
                        </Alert>
                    )}

                    {/* 项目列表 */}
                    <Grid container spacing={3}>
                        {projects.map((project, index) => {
                            const metrics = projectsData[project.full_name];
                            const score = calculateSimpleScore(metrics);
                            const stats = getProjectStats(project.full_name, metrics);
                            
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={project.full_name}>
                                    <Fade in={true} timeout={300 + index * 100}>
                                        <Card 
                                            elevation={0}
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                borderRadius: 2,
                                                bgcolor: 'background.paper',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                                {/* 项目名称 */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <GitHubIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                    <Typography 
                                                        variant="h6" 
                                                        component="h3"
                                                        sx={{ 
                                                            fontSize: '1rem',
                                                            fontWeight: 600,
                                                            color: 'primary.main'
                                                        }}
                                                    >
                                                        {project.repo_name}
                                                    </Typography>
                                                </Box>
                                                
                                                {/* 完整项目名 */}
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary"
                                                    sx={{ mb: 2 }}
                                                >
                                                    {project.full_name}
                                                </Typography>

                                                {/* 评分 */}
                                                <Box sx={{ mb: 2 }}>
                                                    <Chip
                                                        label={`评分: ${score}`}
                                                        color={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'default'}
                                                        size="small"
                                                        sx={{ fontWeight: 600 }}
                                                    />
                                                </Box>

                                                {/* 统计信息 */}
                                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {stats.stars.toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <ForkLeftIcon sx={{ fontSize: 16, color: 'info.main' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {stats.forks.toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {stats.attention.toFixed(1)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                            
                                            <Divider />
                                            
                                            <CardActions sx={{ p: 2 }}>
                                                <Button 
                                                    size="small" 
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={() => handleProjectDetail(project.full_name)}
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
                                                        }
                                                    }}
                                                >
                                                    查看详情
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Fade>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* 空状态 */}
                    {!loading && projects.length === 0 && (
                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 6, 
                                textAlign: 'center',
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                暂无以 "{selectedLetter}" 开头的项目
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                请选择其他字母查看更多项目
                            </Typography>
                        </Paper>
                    )}
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default Overview; 