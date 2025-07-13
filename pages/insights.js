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
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    LinearProgress,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DataService } from '../lib/dataService';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LanguageIcon from '@mui/icons-material/Language';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import InsightsIcon from '@mui/icons-material/Insights';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import dynamic from 'next/dynamic';

// 动态导入ECharts组件
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const Insights = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [projectsData, setProjectsData] = useState({});
    const [tabValue, setTabValue] = useState(0);
    const [insights, setInsights] = useState({});
    const router = useRouter();

    // 获取数据
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch('/api/projects/search?q=&limit=50');
                if (!response.ok) throw new Error('Failed to fetch projects');
                
                const data = await response.json();
                setProjects(data);
                
                // 获取项目详细数据
                const projectDetails = {};
                for (const project of data.slice(0, 20)) {
                    try {
                        const metrics = await DataService.getProjectMetrics(project.full_name);
                        projectDetails[project.full_name] = metrics;
                    } catch (error) {
                        console.error(`Error fetching metrics for ${project.full_name}:`, error);
                        projectDetails[project.full_name] = null;
                    }
                }
                
                setProjectsData(projectDetails);
                
                // 生成洞察数据
                const insightData = generateInsights(data, projectDetails);
                setInsights(insightData);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('加载数据时出错，请重试');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 生成洞察数据
    const generateInsights = (projectsList, projectsMetrics) => {
        const insights = {
            languageTrends: generateLanguageTrends(projectsList),
            developmentPatterns: generateDevelopmentPatterns(projectsMetrics),
            emergingTechnologies: generateEmergingTechnologies(projectsList),
            communityGrowth: generateCommunityGrowth(projectsMetrics),
            riskFactors: generateRiskFactors(projectsMetrics),
            futureOutlook: generateFutureOutlook(projectsList, projectsMetrics)
        };

        return insights;
    };

    // 语言趋势分析
    const generateLanguageTrends = (projectsList) => {
        const languageStats = {};
        
        // 这里模拟语言分布数据
        const languages = ['JavaScript', 'Python', 'TypeScript', 'Go', 'Rust', 'Java', 'C++', 'Swift'];
        languages.forEach((lang, index) => {
            languageStats[lang] = {
                count: Math.floor(Math.random() * 30) + 10,
                growth: (Math.random() - 0.5) * 50,
                popularity: Math.floor(Math.random() * 100) + 1
            };
        });

        return Object.entries(languageStats)
            .map(([lang, stats]) => ({ language: lang, ...stats }))
            .sort((a, b) => b.count - a.count);
    };

    // 开发模式分析
    const generateDevelopmentPatterns = (projectsMetrics) => {
        const patterns = [
            {
                pattern: 'AI/ML集成',
                description: '越来越多的项目集成机器学习功能',
                prevalence: 78,
                trend: 'up',
                impact: 'high'
            },
            {
                pattern: '微服务架构',
                description: '容器化和微服务成为主流',
                prevalence: 65,
                trend: 'up',
                impact: 'medium'
            },
            {
                pattern: '开源优先',
                description: '企业越来越倾向于开源解决方案',
                prevalence: 89,
                trend: 'up',
                impact: 'high'
            },
            {
                pattern: '云原生开发',
                description: '专为云环境设计的应用架构',
                prevalence: 72,
                trend: 'up',
                impact: 'high'
            }
        ];

        return patterns;
    };

    // 新兴技术分析
    const generateEmergingTechnologies = (projectsList) => {
        const technologies = [
            {
                name: 'WebAssembly',
                description: '高性能Web应用的新标准',
                adoptionRate: 34,
                maturity: 'growing',
                potential: 'high'
            },
            {
                name: 'Edge Computing',
                description: '边缘计算推动分布式应用发展',
                adoptionRate: 45,
                maturity: 'emerging',
                potential: 'very_high'
            },
            {
                name: 'Quantum Computing',
                description: '量子计算在特定领域的应用',
                adoptionRate: 12,
                maturity: 'experimental',
                potential: 'very_high'
            },
            {
                name: 'GraphQL',
                description: 'API查询语言和运行时',
                adoptionRate: 67,
                maturity: 'mature',
                potential: 'medium'
            }
        ];

        return technologies;
    };

    // 社区增长分析
    const generateCommunityGrowth = (projectsMetrics) => {
        return {
            totalContributors: 15420,
            monthlyGrowth: 12.5,
            activeProjects: 89,
            newProjects: 23,
            retentionRate: 78
        };
    };

    // 风险因素分析
    const generateRiskFactors = (projectsMetrics) => {
        const risks = [
            {
                factor: '维护者流失',
                severity: 'medium',
                description: '核心维护者数量减少可能影响项目持续性',
                affectedProjects: 15
            },
            {
                factor: '技术债务',
                severity: 'high',
                description: '过时的依赖和架构需要升级',
                affectedProjects: 32
            },
            {
                factor: '安全漏洞',
                severity: 'high',
                description: '安全更新不及时可能带来风险',
                affectedProjects: 8
            },
            {
                factor: '竞争压力',
                severity: 'low',
                description: '类似项目的竞争可能分散资源',
                affectedProjects: 45
            }
        ];

        return risks;
    };

    // 未来展望
    const generateFutureOutlook = (projectsList, projectsMetrics) => {
        return [
            {
                prediction: 'AI代码生成工具普及',
                probability: 85,
                timeframe: '1-2年',
                impact: '开发效率大幅提升'
            },
            {
                prediction: '低代码平台兴起',
                probability: 78,
                timeframe: '2-3年',
                impact: '降低开发门槛'
            },
            {
                prediction: '区块链技术成熟',
                probability: 65,
                timeframe: '3-5年',
                impact: '去中心化应用增长'
            },
            {
                prediction: '量子计算商业化',
                probability: 45,
                timeframe: '5-10年',
                impact: '计算能力革命性提升'
            }
        ];
    };

    // 生成语言趋势图表
    const generateLanguageChart = () => {
        if (!insights.languageTrends) return null;

        const data = insights.languageTrends.slice(0, 8);
        
        return {
            title: {
                text: '编程语言趋势',
                textStyle: { fontSize: 16, fontWeight: 'bold' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.language)
            },
            yAxis: {
                type: 'value',
                name: '项目数量'
            },
            series: [
                {
                    name: '项目数量',
                    type: 'bar',
                    data: data.map(item => item.count),
                    itemStyle: {
                        color: new Array(data.length).fill(0).map((_, i) => 
                            `hsl(${200 + i * 20}, 70%, 60%)`
                        )
                    }
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
                                background: 'linear-gradient(45deg, #34C759 30%, #30D158 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2
                            }}
                        >
                            生态洞察
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            发现技术趋势和开发者社区动态
                        </Typography>
                    </Box>

                    {/* 标签页 */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            mb: 4, 
                            borderRadius: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        <Tabs 
                            value={tabValue} 
                            onChange={(e, newValue) => setTabValue(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ px: 2 }}
                        >
                            <Tab label="技术趋势" icon={<TrendingUpIcon />} />
                            <Tab label="开发模式" icon={<CodeIcon />} />
                            <Tab label="新兴技术" icon={<AutoFixHighIcon />} />
                            <Tab label="社区动态" icon={<GroupIcon />} />
                            <Tab label="风险分析" icon={<SecurityIcon />} />
                            <Tab label="未来展望" icon={<PsychologyIcon />} />
                        </Tabs>
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

                    {/* 标签页内容 */}
                    {!loading && !error && (
                        <>
                            {/* 技术趋势 */}
                            {tabValue === 0 && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                            <CardHeader title="编程语言趋势" />
                                            <CardContent>
                                                <Box sx={{ height: 400 }}>
                                                    {generateLanguageChart() && (
                                                        <ReactECharts
                                                            option={generateLanguageChart()}
                                                            style={{ height: '100%', width: '100%' }}
                                                        />
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                            <CardHeader title="语言增长排行" />
                                            <CardContent>
                                                <List>
                                                    {insights.languageTrends?.slice(0, 6).map((lang, index) => (
                                                        <ListItem key={index} sx={{ px: 0 }}>
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: `hsl(${200 + index * 30}, 70%, 60%)` }}>
                                                                    <LanguageIcon />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={lang.language}
                                                                secondary={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Chip 
                                                                            label={`${lang.growth > 0 ? '+' : ''}${lang.growth.toFixed(1)}%`}
                                                                            size="small"
                                                                            color={lang.growth > 0 ? 'success' : 'error'}
                                                                        />
                                                                        <Typography variant="body2">
                                                                            {lang.count} 项目
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
                                </Grid>
                            )}

                            {/* 开发模式 */}
                            {tabValue === 1 && (
                                <Grid container spacing={3}>
                                    {insights.developmentPatterns?.map((pattern, index) => (
                                        <Grid item xs={12} md={6} key={index}>
                                            <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                            <CodeIcon />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">{pattern.pattern}</Typography>
                                                            <Chip 
                                                                label={pattern.impact}
                                                                size="small"
                                                                color={pattern.impact === 'high' ? 'error' : 'warning'}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        {pattern.description}
                                                    </Typography>
                                                    <Box>
                                                        <Typography variant="body2" gutterBottom>
                                                            普及率: {pattern.prevalence}%
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={pattern.prevalence} 
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* 新兴技术 */}
                            {tabValue === 2 && (
                                <Grid container spacing={3}>
                                    {insights.emergingTechnologies?.map((tech, index) => (
                                        <Grid item xs={12} md={6} key={index}>
                                            <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                            <AutoFixHighIcon />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">{tech.name}</Typography>
                                                            <Chip 
                                                                label={tech.potential}
                                                                size="small"
                                                                color={tech.potential === 'very_high' ? 'success' : 'primary'}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        {tech.description}
                                                    </Typography>
                                                    <Box>
                                                        <Typography variant="body2" gutterBottom>
                                                            采用率: {tech.adoptionRate}%
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={tech.adoptionRate} 
                                                            color="secondary"
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* 社区动态 */}
                            {tabValue === 3 && insights.communityGrowth && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                            <CardHeader title="社区增长指标" />
                                            <CardContent>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={6} md={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" color="primary.main">
                                                                {insights.communityGrowth.totalContributors.toLocaleString()}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                总贡献者
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} md={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" color="success.main">
                                                                {insights.communityGrowth.monthlyGrowth}%
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                月增长率
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} md={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" color="warning.main">
                                                                {insights.communityGrowth.activeProjects}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                活跃项目
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} md={3}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h4" color="info.main">
                                                                {insights.communityGrowth.retentionRate}%
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                留存率
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            {/* 风险分析 */}
                            {tabValue === 4 && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                            <CardHeader title="风险因素分析" />
                                            <CardContent>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>风险因素</TableCell>
                                                                <TableCell>严重程度</TableCell>
                                                                <TableCell>影响项目数</TableCell>
                                                                <TableCell>描述</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {insights.riskFactors?.map((risk, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{risk.factor}</TableCell>
                                                                    <TableCell>
                                                                        <Chip 
                                                                            label={risk.severity}
                                                                            size="small"
                                                                            color={
                                                                                risk.severity === 'high' ? 'error' :
                                                                                risk.severity === 'medium' ? 'warning' : 'success'
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>{risk.affectedProjects}</TableCell>
                                                                    <TableCell>{risk.description}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            {/* 未来展望 */}
                            {tabValue === 5 && (
                                <Grid container spacing={3}>
                                    {insights.futureOutlook?.map((prediction, index) => (
                                        <Grid item xs={12} md={6} key={index}>
                                            <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'success.main' }}>
                                                            <PsychologyIcon />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">{prediction.prediction}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                时间框架: {prediction.timeframe}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        影响: {prediction.impact}
                                                    </Typography>
                                                    <Box>
                                                        <Typography variant="body2" gutterBottom>
                                                            可能性: {prediction.probability}%
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={prediction.probability} 
                                                            color="success"
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </>
                    )}
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default Insights; 