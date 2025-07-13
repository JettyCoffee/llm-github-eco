import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Chip,
    Card,
    CardContent,
    CardActions,
    Button,
    Avatar,
    LinearProgress,
    Tab,
    Tabs,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
    Tooltip,
    Badge,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Alert,
    AlertTitle
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Star,
    GitHub,
    Code,
    Group,
    Visibility,
    Schedule,
    Assessment,
    EmojiEvents,
    FilterList,
    ViewList,
    ViewModule,
    Language
} from '@mui/icons-material';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const Rankings = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [sortBy, setSortBy] = useState('overall');
    const [timeRange, setTimeRange] = useState('30d');
    const [viewMode, setViewMode] = useState('list');
    const [showHeaderSearch, setShowHeaderSearch] = useState(true);
    const router = useRouter();

    // 模拟数据
    const rankingData = [
        {
            id: 1,
            name: 'transformers',
            organization: 'huggingface',
            description: '🤗 Transformers: State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.',
            stars: 127000,
            forks: 25300,
            issues: 820,
            pullRequests: 156,
            contributors: 2400,
            score: 98.5,
            trend: 'up',
            language: 'Python',
            category: 'NLP',
            lastUpdate: '2 hours ago',
            weeklyDownloads: 5200000,
            avatar: '/hf-logo.svg'
        },
        {
            id: 2,
            name: 'langchain',
            organization: 'langchain-ai',
            description: '🦜🔗 Build context-aware reasoning applications',
            stars: 89000,
            forks: 14200,
            issues: 1200,
            pullRequests: 89,
            contributors: 1800,
            score: 95.2,
            trend: 'up',
            language: 'Python',
            category: 'Framework',
            lastUpdate: '4 hours ago',
            weeklyDownloads: 3100000,
            avatar: '/githubcopilot.svg'
        },
        {
            id: 3,
            name: 'llama',
            organization: 'meta-llama',
            description: 'Inference code for LLaMA models',
            stars: 54000,
            forks: 8900,
            issues: 456,
            pullRequests: 23,
            contributors: 980,
            score: 92.8,
            trend: 'stable',
            language: 'Python',
            category: 'Model',
            lastUpdate: '1 day ago',
            weeklyDownloads: 1800000,
            avatar: '/githubcopilot.svg'
        },
        {
            id: 4,
            name: 'ChatGLM-6B',
            organization: 'THUDM',
            description: 'ChatGLM-6B: An Open Bilingual Dialogue Language Model',
            stars: 39000,
            forks: 5200,
            issues: 234,
            pullRequests: 12,
            contributors: 450,
            score: 89.6,
            trend: 'down',
            language: 'Python',
            category: 'Model',
            lastUpdate: '3 days ago',
            weeklyDownloads: 950000,
            avatar: '/githubcopilot.svg'
        },
        {
            id: 5,
            name: 'stable-diffusion-webui',
            organization: 'AUTOMATIC1111',
            description: 'Stable Diffusion web UI',
            stars: 135000,
            forks: 25800,
            issues: 2100,
            pullRequests: 234,
            contributors: 1200,
            score: 94.3,
            trend: 'up',
            language: 'Python',
            category: 'Image Generation',
            lastUpdate: '6 hours ago',
            weeklyDownloads: 2800000,
            avatar: '/githubcopilot.svg'
        }
    ];

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return <TrendingUp sx={{ color: '#4CAF50', fontSize: 20 }} />;
            case 'down':
                return <TrendingDown sx={{ color: '#F44336', fontSize: 20 }} />;
            default:
                return <Box sx={{ width: 20, height: 20, bgcolor: '#FFC107', borderRadius: '50%' }} />;
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const ProjectCard = ({ project, rank }) => (
        <Card
            sx={{
                mb: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }
            }}
        >
            <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Badge
                        badgeContent={rank}
                        color="primary"
                        sx={{
                            mr: 2,
                            '& .MuiBadge-badge': {
                                backgroundColor: rank <= 3 ? '#FFD700' : '#007AFF',
                                color: rank <= 3 ? '#000' : '#fff',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }
                        }}
                    >
                        <Avatar src={project.avatar} sx={{ width: 48, height: 48 }} />
                    </Badge>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                                {project.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                by {project.organization}
                            </Typography>
                            {getTrendIcon(project.trend)}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {project.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={project.language}
                                size="small"
                                sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}
                            />
                            <Chip
                                label={project.category}
                                size="small"
                                sx={{ bgcolor: '#F3E5F5', color: '#7B1FA2' }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#007AFF' }}>
                            {project.score}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            综合评分
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star sx={{ color: '#FFD700', fontSize: 18 }} />
                            <Typography variant="body2">{formatNumber(project.stars)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Code sx={{ color: '#4CAF50', fontSize: 18 }} />
                            <Typography variant="body2">{formatNumber(project.forks)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Group sx={{ color: '#FF9800', fontSize: 18 }} />
                            <Typography variant="body2">{formatNumber(project.contributors)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Assessment sx={{ color: '#9C27B0', fontSize: 18 }} />
                            <Typography variant="body2">{formatNumber(project.weeklyDownloads)}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{ pt: 0 }}>
                <Button
                    size="small"
                    startIcon={<GitHub />}
                    href={`https://github.com/${project.organization}/${project.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mr: 1 }}
                >
                    查看项目
                </Button>
                <Button
                    size="small"
                    startIcon={<Assessment />}
                    onClick={() => router.push(`/dashboard?project=${project.name}`)}
                >
                    详细分析
                </Button>
                <Box sx={{ ml: 'auto' }}>
                    <Typography variant="caption" color="text.secondary">
                        {project.lastUpdate}
                    </Typography>
                </Box>
            </CardActions>
        </Card>
    );

    return (
        <>
            <Header showSearch={showHeaderSearch} />
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 8 }}>
                <Container maxWidth="xl">
                    {/* 页面标题 */}
                    <Box sx={{ py: 4 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #007AFF 30%, #5856D6 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2
                            }}
                        >
                            🏆 项目排行榜
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                            实时更新的大模型项目排行榜，多维度评估项目表现
                        </Typography>

                        <Alert severity="info" sx={{ mb: 3 }}>
                            <AlertTitle>排行榜更新</AlertTitle>
                            数据每小时更新一次，基于GitHub开源项目的多维度评价体系计算综合评分
                        </Alert>
                    </Box>

                    {/* 筛选和控制栏 */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>排序方式</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="排序方式"
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <MenuItem value="overall">综合评分</MenuItem>
                                    <MenuItem value="stars">Star数量</MenuItem>
                                    <MenuItem value="forks">Fork数量</MenuItem>
                                    <MenuItem value="contributors">贡献者数</MenuItem>
                                    <MenuItem value="activity">活跃度</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>时间范围</InputLabel>
                                <Select
                                    value={timeRange}
                                    label="时间范围"
                                    onChange={(e) => setTimeRange(e.target.value)}
                                >
                                    <MenuItem value="7d">7天</MenuItem>
                                    <MenuItem value="30d">30天</MenuItem>
                                    <MenuItem value="90d">90天</MenuItem>
                                    <MenuItem value="1y">1年</MenuItem>
                                </Select>
                            </FormControl>

                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                                size="small"
                            >
                                <ToggleButton value="list">
                                    <ViewList />
                                </ToggleButton>
                                <ToggleButton value="grid">
                                    <ViewModule />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Paper>

                    {/* 分类标签 */}
                    <Paper sx={{ mb: 3 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ px: 2 }}
                        >
                            <Tab label="全部项目" />
                            <Tab label="NLP模型" />
                            <Tab label="图像生成" />
                            <Tab label="多模态" />
                            <Tab label="框架工具" />
                            <Tab label="数据集" />
                        </Tabs>
                    </Paper>

                    {/* 排行榜内容 */}
                    <Box>
                        {rankingData.map((project, index) => (
                            <ProjectCard key={project.id} project={project} rank={index + 1} />
                        ))}
                    </Box>

                    {/* 统计摘要 */}
                    <Paper sx={{ p: 3, mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            📊 排行榜统计
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#007AFF' }}>
                                        {formatNumber(rankingData.length)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        项目总数
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                                        {formatNumber(rankingData.reduce((acc, p) => acc + p.stars, 0))}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        总Star数
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                                        {formatNumber(rankingData.reduce((acc, p) => acc + p.contributors, 0))}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        总贡献者
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#9C27B0' }}>
                                        {Math.round(rankingData.reduce((acc, p) => acc + p.score, 0) / rankingData.length)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        平均评分
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default Rankings; 