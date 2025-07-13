import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Alert,
    Chip,
    Button,
    Divider,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Badge,
    IconButton,
    Tooltip
} from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DataService } from '../lib/dataService';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import ForkLeftIcon from '@mui/icons-material/ForkLeft';
import BugReportIcon from '@mui/icons-material/BugReport';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import RefreshIcon from '@mui/icons-material/Refresh';
import InsightsIcon from '@mui/icons-material/Insights';
import dynamic from 'next/dynamic';

// 动态导入ECharts组件
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [projectsData, setProjectsData] = useState({});
    const [analyticsData, setAnalyticsData] = useState({});
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const router = useRouter();

    // 获取项目数据
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch('/api/projects/search?q=&limit=30');
                if (!response.ok) throw new Error('Failed to fetch projects');
                
                const data = await response.json();
                setProjects(data);
                
                // 获取项目详细数据
                const projectDetails = {};
                for (const project of data.slice(0, 15)) {
                    try {
                        const metrics = await DataService.getProjectMetrics(project.full_name);
                        projectDetails[project.full_name] = metrics;
                    } catch (error) {
                        console.error(`Error fetching metrics for ${project.full_name}:`, error);
                        projectDetails[project.full_name] = null;
                    }
                }
                
                setProjectsData(projectDetails);
                
                // 计算分析数据
                const analytics = calculateAnalytics(data, projectDetails);
                setAnalyticsData(analytics);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('加载数据时出错，请重试');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 计算综合分析数据
    const calculateAnalytics = (projectsList, projectsMetrics) => {
        const analytics = {
            ecosystemHealth: 0,
            totalProjects: projectsList.length,
            activeProjects: 0,
            averageStars: 0,
            topGrowthProjects: [],
            riskProjects: [],
            communityMetrics: {
                totalContributors: 0,
                averageResponseTime: 0,
                issueResolutionRate: 0
            },
            trendPredictions: [],
            competitiveAnalysis: []
        };

        let totalStars = 0;
        let totalHealthScore = 0;
        let validProjects = 0;

        const projectAnalytics = [];

        Object.entries(projectsMetrics).forEach(([projectName, metrics]) => {
            if (!metrics) return;

            const projectData = projectsList.find(p => p.full_name === projectName);
            if (!projectData) return;

            // 计算项目健康度
            const healthScore = calculateProjectHealth(metrics);
            totalHealthScore += healthScore;

            // 计算增长率
            const growthRate = calculateGrowthRate(metrics);

            // 获取最新统计数据
            const latestStats = getLatestStats(metrics);
            totalStars += latestStats.stars;

            if (healthScore > 60) {
                analytics.activeProjects++;
            }

            projectAnalytics.push({
                name: projectName,
                repoName: projectData.repo_name,
                healthScore,
                growthRate,
                ...latestStats,
                risk: healthScore < 40 ? 'high' : healthScore < 60 ? 'medium' : 'low'
            });

            validProjects++;
        });

        if (validProjects > 0) {
            analytics.ecosystemHealth = Math.round(totalHealthScore / validProjects);
            analytics.averageStars = Math.round(totalStars / validProjects);
        }

        // 排序并提取顶级增长项目
        projectAnalytics.sort((a, b) => b.growthRate - a.growthRate);
        analytics.topGrowthProjects = projectAnalytics.slice(0, 5);

        // 提取风险项目
        analytics.riskProjects = projectAnalytics.filter(p => p.risk === 'high').slice(0, 3);

        // 计算社区指标
        analytics.communityMetrics = calculateCommunityMetrics(projectsMetrics);

        // 生成趋势预测
        analytics.trendPredictions = generateTrendPredictions(projectAnalytics);

        // 竞争分析
        analytics.competitiveAnalysis = generateCompetitiveAnalysis(projectAnalytics);

        return analytics;
    };

    // 计算项目健康度
    const calculateProjectHealth = (metrics) => {
        let score = 0;
        let factors = 0;

        // Stars 增长 (25%)
        if (metrics.stars && metrics.stars.length >= 2) {
            const growth = calculateMetricGrowth(metrics.stars);
            score += Math.min(growth * 25, 25);
            factors++;
        }

        // 贡献者活跃度 (20%)
        if (metrics.new_contributors && metrics.new_contributors.length > 0) {
            const avgContributors = metrics.new_contributors.reduce((sum, item) => sum + item.value, 0) / metrics.new_contributors.length;
            score += Math.min(avgContributors * 2, 20);
            factors++;
        }

        // Issue 响应时间 (15%)
        if (metrics.issue_response_time && metrics.issue_response_time.length > 0) {
            const avgResponseTime = metrics.issue_response_time.reduce((sum, item) => sum + item.value, 0) / metrics.issue_response_time.length;
            const responseScore = Math.max(15 - (avgResponseTime / 3600), 0); // 转换为小时
            score += Math.min(responseScore, 15);
            factors++;
        }

        // 技术关注度 (15%)
        if (metrics.attention && metrics.attention.length > 0) {
            const avgAttention = metrics.attention.reduce((sum, item) => sum + item.value, 0) / metrics.attention.length;
            score += Math.min(avgAttention * 15, 15);
            factors++;
        }

        // Fork 活跃度 (10%)
        if (metrics.technical_fork && metrics.technical_fork.length > 0) {
            const avgForks = metrics.technical_fork.reduce((sum, item) => sum + item.value, 0) / metrics.technical_fork.length;
            score += Math.min(avgForks * 10, 10);
            factors++;
        }

        // 更新频率 (15%)
        if (metrics.stars && metrics.stars.length > 0) {
            const daysSinceUpdate = (new Date() - new Date(metrics.stars[metrics.stars.length - 1].time)) / (1000 * 60 * 60 * 24);
            const updateScore = Math.max(15 - (daysSinceUpdate / 7), 0);
            score += Math.min(updateScore, 15);
            factors++;
        }

        return factors > 0 ? Math.round(score / factors * 100 / 100) : 0;
    };

    // 计算增长率
    const calculateGrowthRate = (metrics) => {
        if (!metrics.stars || metrics.stars.length < 2) return 0;
        
        const recent = metrics.stars.slice(-3);
        const growth = (recent[recent.length - 1].value - recent[0].value) / recent[0].value * 100;
        return Math.round(growth * 10) / 10;
    };

    // 计算指标增长
    const calculateMetricGrowth = (metricData) => {
        if (!metricData || metricData.length < 2) return 0;
        const recent = metricData.slice(-2);
        return (recent[1].value - recent[0].value) / recent[0].value;
    };

    // 获取最新统计数据
    const getLatestStats = (metrics) => {
        return {
            stars: metrics.stars?.length > 0 ? metrics.stars[metrics.stars.length - 1].value : 0,
            forks: metrics.technical_fork?.length > 0 ? metrics.technical_fork[metrics.technical_fork.length - 1].value : 0,
            attention: metrics.attention?.length > 0 ? metrics.attention[metrics.attention.length - 1].value : 0,
            contributors: metrics.new_contributors?.length > 0 ? metrics.new_contributors[metrics.new_contributors.length - 1].value : 0
        };
    };

    // 计算社区指标
    const calculateCommunityMetrics = (projectsMetrics) => {
        let totalContributors = 0;
        let totalResponseTime = 0;
        let totalIssues = 0;
        let resolvedIssues = 0;
        let validProjects = 0;

        Object.values(projectsMetrics).forEach(metrics => {
            if (!metrics) return;

            if (metrics.new_contributors && metrics.new_contributors.length > 0) {
                totalContributors += metrics.new_contributors.reduce((sum, item) => sum + item.value, 0);
                validProjects++;
            }

            if (metrics.issue_response_time && metrics.issue_response_time.length > 0) {
                totalResponseTime += metrics.issue_response_time.reduce((sum, item) => sum + item.value, 0);
            }
        });

        return {
            totalContributors: Math.round(totalContributors),
            averageResponseTime: validProjects > 0 ? Math.round(totalResponseTime / validProjects / 3600) : 0, // 转换为小时
            issueResolutionRate: totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0
        };
    };

    // 生成趋势预测
    const generateTrendPredictions = (projectAnalytics) => {
        return projectAnalytics.slice(0, 5).map(project => ({
            name: project.repoName,
            currentTrend: project.growthRate > 0 ? 'up' : 'down',
            prediction: project.growthRate > 5 ? 'strong_growth' : project.growthRate > 0 ? 'moderate_growth' : 'decline',
            confidence: Math.min(Math.abs(project.growthRate) * 10, 95)
        }));
    };

    // 生成竞争分析
    const generateCompetitiveAnalysis = (projectAnalytics) => {
        const sorted = projectAnalytics.slice().sort((a, b) => b.stars - a.stars);
        
        return sorted.slice(0, 5).map((project, index) => ({
            rank: index + 1,
            name: project.repoName,
            stars: project.stars,
            marketShare: Math.round((project.stars / sorted[0].stars) * 100),
            competitiveAdvantage: project.healthScore > 70 ? 'strong' : project.healthScore > 50 ? 'moderate' : 'weak'
        }));
    };

    // 刷新数据
    const handleRefresh = () => {
        setLastUpdated(new Date());
        // 重新加载数据的逻辑
        window.location.reload();
    };

    // 生成生态系统健康度雷达图
    const generateHealthRadarChart = () => {
        if (!analyticsData.topGrowthProjects || analyticsData.topGrowthProjects.length === 0) return null;

        const indicators = [
            { name: '项目活跃度', max: 100 },
            { name: '社区参与度', max: 100 },
            { name: '技术创新度', max: 100 },
            { name: '稳定性', max: 100 },
            { name: '增长潜力', max: 100 }
        ];

        const seriesData = analyticsData.topGrowthProjects.slice(0, 3).map(project => ({
            value: [
                project.healthScore,
                Math.min(project.contributors * 10, 100),
                Math.min(project.attention * 50, 100),
                Math.min(100 - (project.risk === 'high' ? 30 : project.risk === 'medium' ? 15 : 0), 100),
                Math.min(project.growthRate * 10, 100)
            ],
            name: project.repoName
        }));

        return {
            title: {
                text: '生态系统健康度分析',
                textStyle: { fontSize: 16, fontWeight: 'bold' }
            },
            tooltip: {},
            legend: {
                data: seriesData.map(item => item.name),
                bottom: 0
            },
            radar: {
                indicator: indicators,
                name: {
                    textStyle: { color: '#666' }
                }
            },
            series: [{
                type: 'radar',
                data: seriesData
            }]
        };
    };

    return (
        <>
            <Header />
            <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', pt: '64px' }}>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    {/* 页面标题 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box>
                            <Typography 
                                variant="h3" 
                                component="h1"
                                sx={{ 
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                智能数据分析
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                深度洞察大模型生态系统的发展态势和竞争格局
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                最后更新: {lastUpdated.toLocaleString()}
                            </Typography>
                            <IconButton onClick={handleRefresh} disabled={loading}>
                                <RefreshIcon />
                            </IconButton>
                        </Box>
                    </Box>

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

                    {/* 主要指标卡片 */}
                    {!loading && !error && (
                        <>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {/* 生态系统健康度 */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                                    <HealthAndSafetyIcon />
                                                </Avatar>
                                                <Typography variant="h6">生态健康度</Typography>
                                            </Box>
                                            <Typography variant="h4" color="success.main" gutterBottom>
                                                {analyticsData.ecosystemHealth}%
                                            </Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={analyticsData.ecosystemHealth} 
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* 活跃项目数 */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <SpeedIcon />
                                                </Avatar>
                                                <Typography variant="h6">活跃项目</Typography>
                                            </Box>
                                            <Typography variant="h4" color="primary.main" gutterBottom>
                                                {analyticsData.activeProjects}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                共 {analyticsData.totalProjects} 个项目
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* 平均Stars */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                                    <StarIcon />
                                                </Avatar>
                                                <Typography variant="h6">平均Stars</Typography>
                                            </Box>
                                            <Typography variant="h4" color="warning.main" gutterBottom>
                                                {analyticsData.averageStars?.toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                市场认可度
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* 社区贡献者 */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                                    <GroupIcon />
                                                </Avatar>
                                                <Typography variant="h6">社区贡献者</Typography>
                                            </Box>
                                            <Typography variant="h4" color="info.main" gutterBottom>
                                                {analyticsData.communityMetrics?.totalContributors?.toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                平均响应时间: {analyticsData.communityMetrics?.averageResponseTime}h
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* 详细分析 */}
                            <Grid container spacing={3}>
                                {/* 生态系统健康度雷达图 */}
                                <Grid item xs={12} md={6}>
                                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <CardHeader 
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PsychologyIcon />
                                                    <Typography variant="h6">生态系统健康度分析</Typography>
                                                </Box>
                                            }
                                        />
                                        <CardContent>
                                            <Box sx={{ height: 400 }}>
                                                {generateHealthRadarChart() && (
                                                    <ReactECharts
                                                        option={generateHealthRadarChart()}
                                                        style={{ height: '100%', width: '100%' }}
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* 增长趋势预测 */}
                                <Grid item xs={12} md={6}>
                                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <CardHeader 
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AutoGraphIcon />
                                                    <Typography variant="h6">增长趋势预测</Typography>
                                                </Box>
                                            }
                                        />
                                        <CardContent>
                                            <List>
                                                {analyticsData.trendPredictions?.map((prediction, index) => (
                                                    <ListItem key={index} sx={{ px: 0 }}>
                                                        <ListItemAvatar>
                                                            <Avatar sx={{ 
                                                                bgcolor: prediction.currentTrend === 'up' ? 'success.main' : 'error.main',
                                                                width: 32, height: 32
                                                            }}>
                                                                {prediction.currentTrend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={prediction.name}
                                                            secondary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                                    <Chip 
                                                                        label={prediction.prediction.replace('_', ' ')}
                                                                        size="small"
                                                                        color={prediction.prediction.includes('growth') ? 'success' : 'warning'}
                                                                    />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        置信度: {prediction.confidence}%
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* 竞争格局分析 */}
                                <Grid item xs={12} md={6}>
                                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <CardHeader 
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <InsightsIcon />
                                                    <Typography variant="h6">竞争格局分析</Typography>
                                                </Box>
                                            }
                                        />
                                        <CardContent>
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>排名</TableCell>
                                                            <TableCell>项目</TableCell>
                                                            <TableCell>Stars</TableCell>
                                                            <TableCell>市场份额</TableCell>
                                                            <TableCell>竞争优势</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {analyticsData.competitiveAnalysis?.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>#{item.rank}</TableCell>
                                                                <TableCell>{item.name}</TableCell>
                                                                <TableCell>{item.stars.toLocaleString()}</TableCell>
                                                                <TableCell>{item.marketShare}%</TableCell>
                                                                <TableCell>
                                                                    <Chip 
                                                                        label={item.competitiveAdvantage}
                                                                        size="small"
                                                                        color={
                                                                            item.competitiveAdvantage === 'strong' ? 'success' :
                                                                            item.competitiveAdvantage === 'moderate' ? 'warning' : 'error'
                                                                        }
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* 风险项目监控 */}
                                <Grid item xs={12} md={6}>
                                    <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <CardHeader 
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <SecurityIcon />
                                                    <Typography variant="h6">风险项目监控</Typography>
                                                </Box>
                                            }
                                        />
                                        <CardContent>
                                            {analyticsData.riskProjects?.length > 0 ? (
                                                <List>
                                                    {analyticsData.riskProjects.map((project, index) => (
                                                        <ListItem key={index} sx={{ px: 0 }}>
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: 'error.main', width: 32, height: 32 }}>
                                                                    <BugReportIcon />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={project.repoName}
                                                                secondary={
                                                                    <Box sx={{ mt: 1 }}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            健康度: {project.healthScore}%
                                                                        </Typography>
                                                                        <LinearProgress 
                                                                            variant="determinate" 
                                                                            value={project.healthScore} 
                                                                            color="error"
                                                                            sx={{ mt: 1, height: 4, borderRadius: 2 }}
                                                                        />
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                                    暂无高风险项目
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default Analytics; 