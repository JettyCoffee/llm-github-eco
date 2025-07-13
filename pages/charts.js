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
    ButtonGroup,
    Button,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tab,
    Tabs,
    IconButton,
    Tooltip,
    Badge,
    LinearProgress,
    Switch,
    FormControlLabel,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    AvatarGroup
} from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { DataService } from '../lib/dataService';
import dynamic from 'next/dynamic';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import RadarIcon from '@mui/icons-material/Radar';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';

// 动态导入ECharts组件
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const Charts = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [projectsData, setProjectsData] = useState({});
    const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
    const [selectedMetric, setSelectedMetric] = useState('stars');
    const [activeTab, setActiveTab] = useState(0);
    const [showHeaderSearch, setShowHeaderSearch] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [animationEnabled, setAnimationEnabled] = useState(true);
    const [fullscreenChart, setFullscreenChart] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const router = useRouter();

    // 时间范围选项
    const timeRanges = [
        { value: '3months', label: '3个月' },
        { value: '6months', label: '6个月' },
        { value: '1year', label: '1年' },
        { value: 'all', label: '全部' }
    ];

    // 指标选项
    const metrics = [
        { value: 'stars', label: 'Stars数量', icon: <TrendingUpIcon /> },
        { value: 'attention', label: '技术关注度', icon: <ShowChartIcon /> },
        { value: 'technical_fork', label: 'Fork数量', icon: <BarChartIcon /> },
        { value: 'new_contributors', label: '新贡献者', icon: <LeaderboardIcon /> }
    ];

    // 获取项目数据
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch('/api/projects/search?q=&limit=20');
                if (!response.ok) throw new Error('Failed to fetch projects');
                
                const data = await response.json();
                const topProjects = data.slice(0, 10);
                setProjects(topProjects);
                
                // 获取项目详细数据
                const projectDetails = {};
                for (const project of topProjects) {
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
                console.error('Error fetching data:', error);
                setError('加载数据时出错，请重试');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 处理时间范围数据
    const filterDataByTimeRange = (data, timeRange) => {
        if (!data || !data.length) return [];
        
        const now = new Date();
        let cutoffDate;
        
        switch (timeRange) {
            case '3months':
                cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case '6months':
                cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
            case '1year':
                cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                return data;
        }
        
        return data.filter(item => new Date(item.time) >= cutoffDate);
    };

    // 生成趋势图表配置
    const generateTrendChart = () => {
        if (!projects.length || !Object.keys(projectsData).length) return null;
        
        const series = [];
        const xAxisData = [];
        
        projects.slice(0, 5).forEach(project => {
            const data = projectsData[project.full_name];
            if (data && data[selectedMetric]) {
                const filteredData = filterDataByTimeRange(data[selectedMetric], selectedTimeRange);
                
                if (filteredData.length > 0) {
                    // 收集所有时间点
                    filteredData.forEach(item => {
                        const timeStr = item.time.split('T')[0];
                        if (!xAxisData.includes(timeStr)) {
                            xAxisData.push(timeStr);
                        }
                    });
                    
                    series.push({
                        name: project.repo_name,
                        type: 'line',
                        data: filteredData.map(item => item.value),
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 6,
                        lineStyle: {
                            width: 2
                        }
                    });
                }
            }
        });
        
        // 排序时间轴
        xAxisData.sort();
        
        return {
            title: {
                text: `${metrics.find(m => m.value === selectedMetric)?.label || selectedMetric} 趋势`,
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: series.map(s => s.name),
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                name: metrics.find(m => m.value === selectedMetric)?.label || selectedMetric
            },
            series: series
        };
    };

    // 生成排行榜图表配置
    const generateRankingChart = () => {
        if (!projects.length || !Object.keys(projectsData).length) return null;
        
        const data = [];
        
        projects.forEach(project => {
            const metrics = projectsData[project.full_name];
            if (metrics && metrics[selectedMetric] && metrics[selectedMetric].length > 0) {
                const latestValue = metrics[selectedMetric][metrics[selectedMetric].length - 1].value;
                data.push({
                    name: project.repo_name,
                    value: latestValue
                });
            }
        });
        
        data.sort((a, b) => b.value - a.value);
        
        return {
            title: {
                text: `${metrics.find(m => m.value === selectedMetric)?.label || selectedMetric} 排行榜`,
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: data.map(item => item.name)
            },
            series: [
                {
                    name: metrics.find(m => m.value === selectedMetric)?.label || selectedMetric,
                    type: 'bar',
                    data: data.map(item => item.value),
                    itemStyle: {
                        color: '#2196F3'
                    },
                    label: {
                        show: true,
                        position: 'right'
                    }
                }
            ]
        };
    };

    // 生成分布饼图配置
    const generateDistributionChart = () => {
        if (!projects.length || !Object.keys(projectsData).length) return null;
        
        const data = [];
        
        projects.forEach(project => {
            const metrics = projectsData[project.full_name];
            if (metrics && metrics[selectedMetric] && metrics[selectedMetric].length > 0) {
                const latestValue = metrics[selectedMetric][metrics[selectedMetric].length - 1].value;
                data.push({
                    name: project.repo_name,
                    value: latestValue
                });
            }
        });
        
        return {
            title: {
                text: `${metrics.find(m => m.value === selectedMetric)?.label || selectedMetric} 分布`,
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: metrics.find(m => m.value === selectedMetric)?.label || selectedMetric,
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '16',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: data
                }
            ]
        };
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
                            图表中心
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            通过可视化图表深入了解大模型生态系统
                        </Typography>
                    </Box>

                    {/* 控制面板 */}
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
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>选择指标</InputLabel>
                                    <Select
                                        value={selectedMetric}
                                        onChange={(e) => setSelectedMetric(e.target.value)}
                                        label="选择指标"
                                    >
                                        {metrics.map(metric => (
                                            <MenuItem key={metric.value} value={metric.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {metric.icon}
                                                    {metric.label}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>时间范围</InputLabel>
                                    <Select
                                        value={selectedTimeRange}
                                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                                        label="时间范围"
                                    >
                                        {timeRanges.map(range => (
                                            <MenuItem key={range.value} value={range.value}>
                                                {range.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Chip 
                                    label={`展示前 ${projects.length} 个项目`}
                                    color="primary"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
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

                    {/* 图表展示 */}
                    {!loading && !error && (
                        <Grid container spacing={3}>
                            {/* 趋势图表 */}
                            <Grid item xs={12} lg={8}>
                                <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <CardHeader 
                                        title={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <TimelineIcon />
                                                <Typography variant="h6">趋势分析</Typography>
                                            </Box>
                                        }
                                    />
                                    <CardContent>
                                        <Box sx={{ height: 400 }}>
                                            {generateTrendChart() && (
                                                <ReactECharts
                                                    option={generateTrendChart()}
                                                    style={{ height: '100%', width: '100%' }}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* 分布图表 */}
                            <Grid item xs={12} lg={4}>
                                <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <CardHeader 
                                        title={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PieChartIcon />
                                                <Typography variant="h6">分布分析</Typography>
                                            </Box>
                                        }
                                    />
                                    <CardContent>
                                        <Box sx={{ height: 400 }}>
                                            {generateDistributionChart() && (
                                                <ReactECharts
                                                    option={generateDistributionChart()}
                                                    style={{ height: '100%', width: '100%' }}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* 排行榜图表 */}
                            <Grid item xs={12}>
                                <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <CardHeader 
                                        title={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <BarChartIcon />
                                                <Typography variant="h6">排行榜</Typography>
                                            </Box>
                                        }
                                    />
                                    <CardContent>
                                        <Box sx={{ height: 400 }}>
                                            {generateRankingChart() && (
                                                <ReactECharts
                                                    option={generateRankingChart()}
                                                    style={{ height: '100%', width: '100%' }}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default Charts; 