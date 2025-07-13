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
    Divider,
    TextField,
    InputAdornment
} from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { DataService } from '../lib/dataService';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarIcon from '@mui/icons-material/Star';
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import useDebounce from '../hooks/useDebounce';

const Overview = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [projectsData, setProjectsData] = useState({});
    const [initialLoad, setInitialLoad] = useState(true);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const router = useRouter();

    // 获取项目数据（带缓存）
    const fetchProjectsWithCache = async (query = '', limit = 8) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/projects/search?q=${encodeURIComponent(query)}&limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const data = await response.json();
            
            // 如果是初始加载，随机选择8个项目
            let filteredProjects = data;
            if (initialLoad && query === '') {
                // 随机打乱数组并选择前8个
                filteredProjects = data.sort(() => Math.random() - 0.5).slice(0, 8);
            } else if (query) {
                // 搜索模式：按项目名称过滤
                filteredProjects = data.filter(project => {
                    const searchLower = query.toLowerCase();
                    return project.full_name.toLowerCase().includes(searchLower) ||
                           project.repo_name.toLowerCase().includes(searchLower) ||
                           project.org_name.toLowerCase().includes(searchLower);
                });
            }
            
            setProjects(filteredProjects);
            
            // 为每个项目获取缓存的GitHub数据
            const projectDetails = {};
            for (const project of filteredProjects.slice(0, 20)) {
                try {
                    const cachedData = await fetchCachedGitHubData(project.full_name);
                    projectDetails[project.full_name] = cachedData;
                } catch (error) {
                    console.error(`Error fetching cached data for ${project.full_name}:`, error);
                    projectDetails[project.full_name] = null;
                }
            }
            
            setProjectsData(projectDetails);
            if (initialLoad) {
                setInitialLoad(false);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('加载项目数据时出错，请重试');
        } finally {
            setLoading(false);
        }
    };

    // 获取缓存的GitHub数据
    const fetchCachedGitHubData = async (projectName) => {
        try {
            const response = await fetch(`/api/github-cache?project=${encodeURIComponent(projectName)}`);
            if (!response.ok) {
                // 如果没有缓存数据，从原始数据服务获取
                return await DataService.getProjectMetrics(projectName);
            }
            const cachedData = await response.json();
            
            // 检查数据是否过期（超过1天）
            const lastUpdated = new Date(cachedData.last_updated);
            const now = new Date();
            const oneDay = 24 * 60 * 60 * 1000;
            
            if (now - lastUpdated > oneDay) {
                // 数据过期，重新获取
                const freshData = await DataService.getProjectMetrics(projectName);
                
                // 更新缓存
                await fetch('/api/github-cache', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        project: projectName,
                        data: freshData
                    })
                });
                
                return freshData;
            }
            
            return cachedData.data;
        } catch (error) {
            console.error('Error fetching cached GitHub data:', error);
            // 回退到原始数据服务
            return await DataService.getProjectMetrics(projectName);
        }
    };

    // 初始加载
    useEffect(() => {
        fetchProjectsWithCache();
    }, []);

    // 搜索功能
    useEffect(() => {
        if (!initialLoad) {
            fetchProjectsWithCache(debouncedSearchTerm, debouncedSearchTerm ? 50 : 8);
        }
    }, [debouncedSearchTerm]);

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

    // 刷新数据
    const handleRefresh = () => {
        setSearchTerm('');
        setInitialLoad(true);
        fetchProjectsWithCache();
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
                            探索 GitHub 大模型生态系统中的精选项目
                        </Typography>
                    </Box>

                    {/* 搜索和刷新控件 */}
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
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                            <TextField
                                fullWidth
                                placeholder="搜索项目名称..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: '#f8f9fa'
                                    }
                                }}
                            />
                            <Button
                                variant="outlined"
                                onClick={handleRefresh}
                                startIcon={<RefreshIcon />}
                                disabled={loading}
                                sx={{
                                    minWidth: '120px',
                                    borderRadius: 2,
                                }}
                            >
                                刷新
                            </Button>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                            {searchTerm 
                                ? `搜索结果: ${projects.length} 个项目`
                                : `随机展示: ${projects.length} 个项目`
                            }
                        </Typography>
                    </Paper>

                    {/* 加载状态 */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

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
                                {searchTerm ? '未找到匹配的项目' : '暂无项目数据'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchTerm ? '请尝试其他搜索关键词' : '点击刷新按钮重新加载'}
                            </Typography>
                        </Paper>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default Overview; 