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
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Slider,
    Checkbox,
    FormControlLabel,
    FormGroup,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Tooltip,
    Badge,
    Avatar,
    AvatarGroup,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Switch,
    LinearProgress,
    Skeleton,
    Zoom
} from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { DataService } from '../lib/dataService';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarIcon from '@mui/icons-material/Star';
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import CompareIcon from '@mui/icons-material/Compare';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import SortIcon from '@mui/icons-material/Sort';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GroupIcon from '@mui/icons-material/Group';
import BugReportIcon from '@mui/icons-material/BugReport';
import CodeIcon from '@mui/icons-material/Code';
import UpdateIcon from '@mui/icons-material/Update';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import useDebounce from '../hooks/useDebounce';

const Overview = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [projectsData, setProjectsData] = useState({});
    const [initialLoad, setInitialLoad] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('stars');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [compareMode, setCompareMode] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [compareDialogOpen, setCompareDialogOpen] = useState(false);
    const [projectDetailDialog, setProjectDetailDialog] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [starRange, setStarRange] = useState([0, 200000]);
    const [forkRange, setForkRange] = useState([0, 50000]);
    const [contributorRange, setContributorRange] = useState([0, 1000]);
    const [showOnlyActive, setShowOnlyActive] = useState(false);
    const [showOnlyTrending, setShowOnlyTrending] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [projectStatistics, setProjectStatistics] = useState({});
    const [trendingProjects, setTrendingProjects] = useState([]);
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const router = useRouter();

    // 分类和语言选项
    const categories = [
        { value: 'all', label: '全部分类' },
        { value: 'llm', label: 'LLM大模型' },
        { value: 'image', label: '图像生成' },
        { value: 'nlp', label: '自然语言处理' },
        { value: 'cv', label: '计算机视觉' },
        { value: 'framework', label: '框架工具' },
        { value: 'dataset', label: '数据集' },
        { value: 'training', label: '训练优化' },
        { value: 'deployment', label: '部署推理' },
        { value: 'multimodal', label: '多模态' },
        { value: 'agent', label: '智能体' }
    ];

    const languages = [
        { value: 'all', label: '全部语言' },
        { value: 'Python', label: 'Python' },
        { value: 'JavaScript', label: 'JavaScript' },
        { value: 'TypeScript', label: 'TypeScript' },
        { value: 'C++', label: 'C++' },
        { value: 'Rust', label: 'Rust' },
        { value: 'Go', label: 'Go' },
        { value: 'Java', label: 'Java' },
        { value: 'Swift', label: 'Swift' },
        { value: 'Kotlin', label: 'Kotlin' },
        { value: 'Dart', label: 'Dart' }
    ];

    const sortOptions = [
        { value: 'stars', label: 'Stars数量' },
        { value: 'forks', label: 'Forks数量' },
        { value: 'contributors', label: '贡献者数量' },
        { value: 'issues', label: 'Issues数量' },
        { value: 'updated', label: '最近更新' },
        { value: 'created', label: '创建时间' },
        { value: 'score', label: '综合评分' },
        { value: 'trend', label: '趋势热度' }
    ];

    // 获取项目数据（带缓存）
    const fetchProjectsWithCache = async (query = '', limit = 50) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/projects/search?q=${encodeURIComponent(query)}&limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const data = await response.json();
            
            // 项目分类和过滤
            let filteredProjects = data;
            
            // 按查询条件过滤
            if (query) {
                filteredProjects = data.filter(project => {
                    const searchLower = query.toLowerCase();
                    return project.full_name.toLowerCase().includes(searchLower) ||
                           project.repo_name.toLowerCase().includes(searchLower) ||
                           project.org_name.toLowerCase().includes(searchLower) ||
                           (project.description && project.description.toLowerCase().includes(searchLower));
                });
            }
            
            // 按分类过滤
            if (selectedCategory !== 'all') {
                filteredProjects = filteredProjects.filter(project => 
                    categorizeProject(project) === selectedCategory
                );
            }
            
            // 按语言过滤
            if (selectedLanguage !== 'all') {
                filteredProjects = filteredProjects.filter(project => 
                    project.language === selectedLanguage
                );
            }
            
            setProjects(filteredProjects);
            
            // 为每个项目获取详细数据
            const projectDetails = {};
            const statistics = {};
            
            for (const project of filteredProjects.slice(0, Math.min(30, filteredProjects.length))) {
                try {
                    const cachedData = await fetchCachedGitHubData(project.full_name);
                    projectDetails[project.full_name] = cachedData;
                    
                    // 计算统计数据
                    const stats = getProjectStats(project.full_name, cachedData);
                    statistics[project.full_name] = stats;
                    
                } catch (error) {
                    console.error(`Error fetching cached data for ${project.full_name}:`, error);
                    projectDetails[project.full_name] = null;
                }
            }
            
            setProjectsData(projectDetails);
            setProjectStatistics(statistics);
            
            // 分析项目特点
            analyzeProjectFeatures(filteredProjects, projectDetails);
            
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

    // 分析项目特点
    const analyzeProjectFeatures = (projectsList, projectsMetrics) => {
        const trending = [];
        const featured = [];
        const recent = [];
        
        projectsList.forEach(project => {
            const metrics = projectsMetrics[project.full_name];
            if (!metrics) return;
            
            const stats = getProjectStats(project.full_name, metrics);
            
            // 识别趋势项目
            if (stats.trend === 'up' && stats.stars > 1000) {
                trending.push({ ...project, ...stats });
            }
            
            // 识别特色项目
            if (stats.score > 80 && stats.stars > 5000) {
                featured.push({ ...project, ...stats });
            }
            
            // 识别最近项目
            const monthsOld = (Date.now() - new Date(stats.created || Date.now())) / (1000 * 60 * 60 * 24 * 30);
            if (monthsOld < 12) {
                recent.push({ ...project, ...stats });
            }
        });
        
        setTrendingProjects(trending.slice(0, 6));
        setFeaturedProjects(featured.slice(0, 6));
        setRecentProjects(recent.slice(0, 6));
    };

    // 项目分类
    const categorizeProject = (project) => {
        const name = project.full_name.toLowerCase();
        const repoName = project.repo_name.toLowerCase();
        const description = (project.description || '').toLowerCase();
        
        if (name.includes('llm') || name.includes('gpt') || name.includes('bert') || 
            name.includes('transformer') || name.includes('llama') || name.includes('chatglm')) {
            return 'llm';
        } else if (name.includes('stable-diffusion') || name.includes('dalle') || 
                   name.includes('midjourney') || description.includes('image generation')) {
            return 'image';
        } else if (name.includes('nlp') || name.includes('text') || name.includes('language')) {
            return 'nlp';
        } else if (name.includes('cv') || name.includes('vision') || name.includes('object-detection')) {
            return 'cv';
        } else if (name.includes('framework') || name.includes('tool') || name.includes('library')) {
            return 'framework';
        } else if (name.includes('dataset') || name.includes('data') || name.includes('corpus')) {
            return 'dataset';
        } else if (name.includes('training') || name.includes('optimizer') || name.includes('fine-tune')) {
            return 'training';
        } else if (name.includes('deploy') || name.includes('inference') || name.includes('serving')) {
            return 'deployment';
        } else if (name.includes('multimodal') || name.includes('multi-modal') || name.includes('vision-language')) {
            return 'multimodal';
        } else if (name.includes('agent') || name.includes('bot') || name.includes('assistant')) {
            return 'agent';
        } else {
            return 'all';
        }
    };

    // 获取缓存的GitHub数据
    const fetchCachedGitHubData = async (projectName) => {
        try {
            const response = await fetch(`/api/github-cache?project=${encodeURIComponent(projectName)}`);
            if (!response.ok) {
                return await DataService.getProjectMetrics(projectName);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching cached data for ${projectName}:`, error);
            return null;
        }
    };

    // 计算项目评分
    const calculateSimpleScore = (metrics) => {
        if (!metrics || !metrics.length) return 0;
        
        const latest = metrics[metrics.length - 1];
        if (!latest) return 0;
        
        const stars = latest.stars || 0;
        const forks = latest.forks || 0;
        const contributors = latest.contributors || 0;
        const issues = latest.issues || 0;
        const pullRequests = latest.pull_requests || 0;
        
        // 基础分数
        let score = Math.log(stars + 1) * 10;
        
        // 社区活跃度加分
        if (contributors > 0) {
            score += Math.log(contributors + 1) * 5;
        }
        
        // Fork比例加分
        if (stars > 0) {
            const forkRatio = forks / stars;
            score += forkRatio * 20;
        }
        
        // 问题处理效率加分
        if (issues > 0 && pullRequests > 0) {
            const resolutionRatio = pullRequests / issues;
            score += resolutionRatio * 15;
        }
        
        return Math.min(100, Math.max(0, score));
    };

    // 获取项目统计数据
    const getProjectStats = (projectName, metrics) => {
        const stats = {
            stars: 0,
            forks: 0,
            contributors: 0,
            issues: 0,
            pullRequests: 0,
            attention: 0,
            score: 0,
            trend: 'stable',
            healthScore: 0,
            lastActivity: null,
            created: null,
            language: null,
            license: null,
            topics: []
        };
        
        if (metrics && metrics.length > 0) {
            const latest = metrics[metrics.length - 1];
            stats.stars = latest.stars || 0;
            stats.forks = latest.forks || 0;
            stats.contributors = latest.contributors || 0;
            stats.issues = latest.issues || 0;
            stats.pullRequests = latest.pull_requests || 0;
            stats.attention = latest.attention || 0;
            stats.lastActivity = latest.updated_at || latest.pushed_at;
            stats.created = latest.created_at;
            stats.language = latest.language;
            stats.license = latest.license;
            stats.topics = latest.topics || [];
            
            // 计算评分
            stats.score = calculateSimpleScore(metrics);
            
            // 计算健康度
            stats.healthScore = calculateHealthScore(latest);
            
            // 计算趋势
            if (metrics.length >= 2) {
                const previous = metrics[metrics.length - 2];
                const current = latest;
                const growthRate = ((current.stars - previous.stars) / Math.max(previous.stars, 1)) * 100;
                
                if (growthRate > 5) stats.trend = 'up';
                else if (growthRate < -5) stats.trend = 'down';
                else stats.trend = 'stable';
            }
        }
        
        return stats;
    };

    // 计算健康度
    const calculateHealthScore = (latest) => {
        let score = 0;
        const total = 100;
        
        // 活跃度指标 (40%)
        if (latest.stars > 100) score += 10;
        if (latest.contributors > 5) score += 10;
        if (latest.forks > 20) score += 10;
        if (latest.issues > 0 && latest.pull_requests > 0) {
            const ratio = latest.pull_requests / latest.issues;
            score += Math.min(10, ratio * 10);
        }
        
        // 社区指标 (30%)
        if (latest.contributors > 10) score += 15;
        if (latest.stars / Math.max(latest.contributors, 1) < 100) score += 15;
        
        // 维护指标 (30%)
        const daysSinceUpdate = (Date.now() - new Date(latest.updated_at || Date.now())) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 30) score += 15;
        else if (daysSinceUpdate < 90) score += 10;
        else if (daysSinceUpdate < 180) score += 5;
        
        if (latest.license) score += 15;
        
        return Math.min(100, score);
    };

    // 处理项目详情
    const handleProjectDetail = (projectName) => {
        setProjectDetailDialog(projectName);
    };

    // 处理项目比较
    const handleCompareProjects = (project) => {
        if (selectedProjects.find(p => p.full_name === project.full_name)) {
            setSelectedProjects(selectedProjects.filter(p => p.full_name !== project.full_name));
        } else if (selectedProjects.length < 3) {
            setSelectedProjects([...selectedProjects, project]);
        }
    };

    // 处理排序
    const handleSort = (projects) => {
        const sorted = [...projects].sort((a, b) => {
            const aStats = projectStatistics[a.full_name] || {};
            const bStats = projectStatistics[b.full_name] || {};
            
            let aValue = aStats[sortBy] || 0;
            let bValue = bStats[sortBy] || 0;
            
            if (sortBy === 'updated') {
                aValue = new Date(aStats.lastActivity || 0).getTime();
                bValue = new Date(bStats.lastActivity || 0).getTime();
            } else if (sortBy === 'created') {
                aValue = new Date(aStats.created || 0).getTime();
                bValue = new Date(bStats.created || 0).getTime();
            }
            
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        });
        
        return sorted;
    };

    // 应用过滤器
    const applyFilters = (projects) => {
        return projects.filter(project => {
            const stats = projectStatistics[project.full_name] || {};
            
            // 范围过滤
            if (stats.stars < starRange[0] || stats.stars > starRange[1]) return false;
            if (stats.forks < forkRange[0] || stats.forks > forkRange[1]) return false;
            if (stats.contributors < contributorRange[0] || stats.contributors > contributorRange[1]) return false;
            
            // 状态过滤
            if (showOnlyActive) {
                const daysSinceUpdate = (Date.now() - new Date(stats.lastActivity || Date.now())) / (1000 * 60 * 60 * 24);
                if (daysSinceUpdate > 30) return false;
            }
            
            if (showOnlyTrending && stats.trend !== 'up') return false;
            
            return true;
        });
    };

    // 刷新数据
    const handleRefresh = () => {
        setSearchTerm('');
        setInitialLoad(true);
        fetchProjectsWithCache();
    };

    // 书签功能
    const handleBookmark = (project) => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedProjects') || '[]');
        const isBookmarked = bookmarks.find(p => p.full_name === project.full_name);
        
        if (isBookmarked) {
            const updated = bookmarks.filter(p => p.full_name !== project.full_name);
            localStorage.setItem('bookmarkedProjects', JSON.stringify(updated));
            setBookmarkedProjects(updated);
        } else {
            const updated = [...bookmarks, project];
            localStorage.setItem('bookmarkedProjects', JSON.stringify(updated));
            setBookmarkedProjects(updated);
        }
    };

    // 导出数据
    const handleExport = () => {
        const exportData = {
            timestamp: new Date().toISOString(),
            projects: projects.map(project => ({
                ...project,
                statistics: projectStatistics[project.full_name]
            })),
            filters: {
                searchTerm,
                selectedCategory,
                selectedLanguage,
                sortBy,
                sortOrder
            }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-overview-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // 组件加载时获取数据
    useEffect(() => {
        fetchProjectsWithCache();
    }, [debouncedSearchTerm, selectedCategory, selectedLanguage]);

    // 从localStorage加载书签
    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedProjects') || '[]');
        setBookmarkedProjects(bookmarks);
    }, []);

    // 处理标签页切换
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // 获取当前显示的项目
    const getCurrentProjects = () => {
        let currentProjects = [];
        
        switch (activeTab) {
            case 0:
                currentProjects = projects;
                break;
            case 1:
                currentProjects = trendingProjects;
                break;
            case 2:
                currentProjects = featuredProjects;
                break;
            case 3:
                currentProjects = recentProjects;
                break;
            case 4:
                currentProjects = bookmarkedProjects;
                break;
            default:
                currentProjects = projects;
        }
        
        // 应用过滤器和排序
        const filtered = applyFilters(currentProjects);
        const sorted = handleSort(filtered);
        
        return sorted;
    };

    const displayProjects = getCurrentProjects();
    const paginatedProjects = displayProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

                    {/* 标签页导航 */}
                    <Paper elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
                        <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{ 
                                '& .MuiTab-root': { 
                                    fontWeight: 500,
                                    textTransform: 'none'
                                }
                            }}
                        >
                            <Tab 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <GitHubIcon />
                                        <span>全部项目</span>
                                        <Badge badgeContent={projects.length} color="primary" />
                                    </Box>
                                } 
                            />
                            <Tab 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TrendingUpIcon />
                                        <span>热门趋势</span>
                                        <Badge badgeContent={trendingProjects.length} color="error" />
                                    </Box>
                                } 
                            />
                            <Tab 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EmojiEventsIcon />
                                        <span>特色项目</span>
                                        <Badge badgeContent={featuredProjects.length} color="warning" />
                                    </Box>
                                } 
                            />
                            <Tab 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <UpdateIcon />
                                        <span>最新项目</span>
                                        <Badge badgeContent={recentProjects.length} color="success" />
                                    </Box>
                                } 
                            />
                            <Tab 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BookmarkIcon />
                                        <span>收藏项目</span>
                                        <Badge badgeContent={bookmarkedProjects.length} color="info" />
                                    </Box>
                                } 
                            />
                        </Tabs>
                    </Paper>

                    {/* 搜索和控制面板 */}
                    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                        <Grid container spacing={3} alignItems="center">
                            {/* 搜索栏 */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="搜索项目名称、描述..."
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
                            </Grid>

                            {/* 分类过滤 */}
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>分类</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {categories.map(cat => (
                                            <MenuItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* 语言过滤 */}
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>语言</InputLabel>
                                    <Select
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {languages.map(lang => (
                                            <MenuItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* 排序 */}
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>排序</InputLabel>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {sortOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* 控制按钮 */}
                            <Grid item xs={12} md={2}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <ToggleButtonGroup
                                        value={viewMode}
                                        exclusive
                                        onChange={(e, newMode) => newMode && setViewMode(newMode)}
                                        size="small"
                                    >
                                        <ToggleButton value="grid">
                                            <ViewModuleIcon />
                                        </ToggleButton>
                                        <ToggleButton value="list">
                                            <ViewListIcon />
                                        </ToggleButton>
                                        <ToggleButton value="compact">
                                            <ViewComfyIcon />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setFilterDialogOpen(true)}
                                        startIcon={<FilterListIcon />}
                                    >
                                        筛选
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* 快速筛选选项 */}
                        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showOnlyActive}
                                        onChange={(e) => setShowOnlyActive(e.target.checked)}
                                        size="small"
                                    />
                                }
                                label="仅显示活跃项目"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showOnlyTrending}
                                        onChange={(e) => setShowOnlyTrending(e.target.checked)}
                                        size="small"
                                    />
                                }
                                label="仅显示趋势项目"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={compareMode}
                                        onChange={(e) => setCompareMode(e.target.checked)}
                                        size="small"
                                    />
                                }
                                label="比较模式"
                            />
                        </Box>

                        {/* 统计信息 */}
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                找到 {displayProjects.length} 个项目
                                {searchTerm && ` · 搜索: "${searchTerm}"`}
                                {selectedCategory !== 'all' && ` · 分类: ${categories.find(c => c.value === selectedCategory)?.label}`}
                                {selectedLanguage !== 'all' && ` · 语言: ${selectedLanguage}`}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleRefresh}
                                    startIcon={<RefreshIcon />}
                                    disabled={loading}
                                >
                                    刷新
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleExport}
                                    startIcon={<DownloadIcon />}
                                >
                                    导出
                                </Button>
                                {compareMode && selectedProjects.length > 1 && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => setCompareDialogOpen(true)}
                                        startIcon={<CompareIcon />}
                                    >
                                        比较 ({selectedProjects.length})
                                    </Button>
                                )}
                            </Box>
                        </Box>
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
                    {!loading && !error && (
                        <>
                            {viewMode === 'grid' && (
                                <Grid container spacing={3}>
                                    {paginatedProjects.map((project, index) => {
                                        const metrics = projectsData[project.full_name];
                                        const stats = projectStatistics[project.full_name] || {};
                                        const isBookmarked = bookmarkedProjects.find(p => p.full_name === project.full_name);
                                        const isSelected = selectedProjects.find(p => p.full_name === project.full_name);
                                        
                                        return (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={project.full_name}>
                                                <Zoom in={true} timeout={300 + index * 50}>
                                                    <Card 
                                                        elevation={0}
                                                        sx={{
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            borderRadius: 2,
                                                            border: isSelected ? '2px solid #2196F3' : '1px solid #e0e0e0',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-4px)',
                                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                                            }
                                                        }}
                                                    >
                                                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                                            {/* 项目头部 */}
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                                                    <Avatar 
                                                                        sx={{ 
                                                                            width: 24, 
                                                                            height: 24,
                                                                            bgcolor: 'primary.main'
                                                                        }}
                                                                    >
                                                                        {project.repo_name.charAt(0).toUpperCase()}
                                                                    </Avatar>
                                                                    <Typography 
                                                                        variant="h6" 
                                                                        component="h3"
                                                                        sx={{ 
                                                                            fontSize: '1rem',
                                                                            fontWeight: 600,
                                                                            color: 'primary.main',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}
                                                                    >
                                                                        {project.repo_name}
                                                                    </Typography>
                                                                </Box>
                                                                
                                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                    <IconButton 
                                                                        size="small"
                                                                        onClick={() => handleBookmark(project)}
                                                                        color={isBookmarked ? 'warning' : 'default'}
                                                                    >
                                                                        <BookmarkIcon fontSize="small" />
                                                                    </IconButton>
                                                                    
                                                                    {compareMode && (
                                                                        <IconButton 
                                                                            size="small"
                                                                            onClick={() => handleCompareProjects(project)}
                                                                            color={isSelected ? 'primary' : 'default'}
                                                                        >
                                                                            <CompareIcon fontSize="small" />
                                                                        </IconButton>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                            
                                                            {/* 组织名称 */}
                                                            <Typography 
                                                                variant="body2" 
                                                                color="text.secondary"
                                                                sx={{ mb: 1 }}
                                                            >
                                                                {project.org_name}
                                                            </Typography>

                                                            {/* 项目描述 */}
                                                            {project.description && (
                                                                <Typography 
                                                                    variant="body2" 
                                                                    color="text.secondary"
                                                                    sx={{ 
                                                                        mb: 2,
                                                                        height: '3em',
                                                                        overflow: 'hidden',
                                                                        display: '-webkit-box',
                                                                        WebkitBoxOrient: 'vertical',
                                                                        WebkitLineClamp: 2
                                                                    }}
                                                                >
                                                                    {project.description}
                                                                </Typography>
                                                            )}

                                                            {/* 分类和语言 */}
                                                            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                                                <Chip
                                                                    label={categories.find(c => c.value === categorizeProject(project))?.label || '其他'}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="primary"
                                                                />
                                                                {project.language && (
                                                                    <Chip
                                                                        label={project.language}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        color="secondary"
                                                                    />
                                                                )}
                                                            </Box>

                                                            {/* 评分 */}
                                                            <Box sx={{ mb: 2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        综合评分:
                                                                    </Typography>
                                                                    <Chip
                                                                        label={`${stats.score?.toFixed(1) || 0}`}
                                                                        color={stats.score >= 70 ? 'success' : stats.score >= 50 ? 'warning' : 'default'}
                                                                        size="small"
                                                                        sx={{ fontWeight: 600 }}
                                                                    />
                                                                </Box>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={stats.score || 0}
                                                                    sx={{ height: 6, borderRadius: 3 }}
                                                                />
                                                            </Box>

                                                            {/* 统计信息 */}
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {(stats.stars || 0).toLocaleString()}
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <ForkLeftIcon sx={{ fontSize: 16, color: 'info.main' }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {(stats.forks || 0).toLocaleString()}
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <GroupIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {(stats.contributors || 0).toLocaleString()}
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    {stats.trend === 'up' && <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                                                                    {stats.trend === 'down' && <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />}
                                                                    {stats.trend === 'stable' && <TrendingFlatIcon sx={{ fontSize: 16, color: 'info.main' }} />}
                                                                </Box>
                                                            </Box>

                                                            {/* 健康度 */}
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    健康度:
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={stats.healthScore || 0}
                                                                        sx={{ width: 60, height: 4, borderRadius: 2 }}
                                                                        color={stats.healthScore >= 70 ? 'success' : stats.healthScore >= 50 ? 'warning' : 'error'}
                                                                    />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {stats.healthScore?.toFixed(0) || 0}%
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </CardContent>
                                                        
                                                        <Divider />
                                                        
                                                        <CardActions sx={{ p: 2 }}>
                                                            <Button 
                                                                size="small" 
                                                                variant="contained"
                                                                onClick={() => handleProjectDetail(project.full_name)}
                                                                sx={{
                                                                    flex: 1,
                                                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                                    '&:hover': {
                                                                        background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
                                                                    }
                                                                }}
                                                            >
                                                                查看详情
                                                            </Button>
                                                            
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => window.open(`https://github.com/${project.full_name}`, '_blank')}
                                                                sx={{ ml: 1 }}
                                                            >
                                                                <LaunchIcon fontSize="small" />
                                                            </IconButton>
                                                        </CardActions>
                                                    </Card>
                                                </Zoom>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}

                            {/* 分页 */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <TablePagination
                                    component="div"
                                    count={displayProjects.length}
                                    page={page}
                                    onPageChange={(event, newPage) => setPage(newPage)}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={(event) => {
                                        setRowsPerPage(parseInt(event.target.value, 10));
                                        setPage(0);
                                    }}
                                    rowsPerPageOptions={[12, 24, 48, 96]}
                                    labelRowsPerPage="每页显示:"
                                />
                            </Box>
                        </>
                    )}

                    {/* 空状态 */}
                    {!loading && displayProjects.length === 0 && (
                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 6, 
                                textAlign: 'center',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                {searchTerm ? '未找到匹配的项目' : '暂无项目数据'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchTerm ? '请尝试其他搜索关键词或调整筛选条件' : '点击刷新按钮重新加载'}
                            </Typography>
                        </Paper>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default Overview; 