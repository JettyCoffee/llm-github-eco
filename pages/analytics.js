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
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tab,
    Tabs,
    Switch,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton,
    TablePagination,
    TextField,
    InputAdornment,
    Fade,
    Slide,
    Zoom
} from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { DataService } from '../lib/dataService';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import BugReportIcon from '@mui/icons-material/BugReport';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import RefreshIcon from '@mui/icons-material/Refresh';
import InsightsIcon from '@mui/icons-material/Insights';
import TimelineIcon from '@mui/icons-material/Timeline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import PublicIcon from '@mui/icons-material/Public';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
    const [selectedTab, setSelectedTab] = useState(0);
    const [timeRange, setTimeRange] = useState('6months');
    const [selectedMetric, setSelectedMetric] = useState('all');
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(300000); // 5分钟
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectDetailOpen, setProjectDetailOpen] = useState(false);
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();

    // 获取项目数据
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
                for (const project of data.slice(0, 30)) {
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
                
                // 生成通知
                generateNotifications(analytics);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('加载数据时出错，请重试');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 自动刷新
    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchData();
            }, refreshInterval);
        }
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval]);

    // 生成通知
    const generateNotifications = (analytics) => {
        const newNotifications = [];
        
        if (analytics.ecosystemHealth < 70) {
            newNotifications.push({
                id: 1,
                type: 'warning',
                title: '生态系统健康度告警',
                message: '当前生态系统健康度低于70%，需要关注',
                timestamp: new Date()
            });
        }
        
        if (analytics.riskProjects && analytics.riskProjects.length > 5) {
            newNotifications.push({
                id: 2,
                type: 'error',
                title: '高风险项目过多',
                message: `发现 ${analytics.riskProjects.length} 个高风险项目`,
                timestamp: new Date()
            });
        }
        
        if (analytics.communityMetrics?.monthlyGrowth > 20) {
            newNotifications.push({
                id: 3,
                type: 'success',
                title: '社区增长突出',
                message: `月增长率达到 ${analytics.communityMetrics.monthlyGrowth}%`,
                timestamp: new Date()
            });
        }
        
        setNotifications(newNotifications);
    };

    // 计算分析数据
    const calculateAnalytics = (projectsList, projectsMetrics) => {
        const validProjects = projectsList.filter(p => projectsMetrics[p.full_name]);
        const totalProjects = validProjects.length;
        
        // 计算生态系统健康度
        let totalHealthScore = 0;
        let healthCount = 0;
        
        // 社区指标
        let totalStars = 0;
        let totalForks = 0;
        let totalContributors = 0;
        let totalIssues = 0;
        let totalPullRequests = 0;
        
        // 活跃度指标
        let activeProjects = 0;
        let projectAnalytics = [];
        
        // 语言分布
        const languageDistribution = {};
        
        // 组织分布
        const organizationDistribution = {};
        
        // 风险项目
        const riskProjects = [];
        
        // 增长项目
        const growthProjects = [];
        
        // 处理每个项目
        validProjects.forEach(project => {
            const metrics = projectsMetrics[project.full_name];
            if (!metrics) return;
            
            // 计算项目健康度
            const healthScore = calculateProjectHealth(metrics);
            totalHealthScore += healthScore;
            healthCount++;
            
            // 统计基本指标
            const latestStats = getLatestStats(metrics);
            if (latestStats) {
                totalStars += latestStats.stars || 0;
                totalForks += latestStats.forks || 0;
                totalContributors += latestStats.contributors || 0;
                totalIssues += latestStats.issues || 0;
                totalPullRequests += latestStats.pull_requests || 0;
                
                // 判断项目活跃度
                if (latestStats.stars > 100 || latestStats.forks > 50) {
                    activeProjects++;
                }
                
                // 语言分布
                if (project.language) {
                    languageDistribution[project.language] = (languageDistribution[project.language] || 0) + 1;
                }
                
                // 组织分布
                if (project.org_name) {
                    organizationDistribution[project.org_name] = (organizationDistribution[project.org_name] || 0) + 1;
                }
                
                // 计算增长率
                const growthRate = calculateGrowthRate(metrics);
                
                // 项目分析数据
                const projectAnalysis = {
                    name: project.full_name,
                    repoName: project.repo_name,
                    orgName: project.org_name,
                    language: project.language,
                    stars: latestStats.stars,
                    forks: latestStats.forks,
                    contributors: latestStats.contributors,
                    issues: latestStats.issues,
                    pullRequests: latestStats.pull_requests,
                    healthScore: healthScore,
                    growthRate: growthRate,
                    trend: growthRate > 5 ? 'up' : growthRate < -5 ? 'down' : 'stable',
                    category: categorizeProject(project),
                    riskLevel: assessRiskLevel(latestStats, healthScore),
                    lastActivity: new Date(latestStats.last_activity || Date.now()),
                    momentum: calculateMomentum(metrics)
                };
                
                projectAnalytics.push(projectAnalysis);
                
                // 识别风险项目
                if (healthScore < 50 || growthRate < -10) {
                    riskProjects.push(projectAnalysis);
                }
                
                // 识别增长项目
                if (growthRate > 15 && healthScore > 70) {
                    growthProjects.push(projectAnalysis);
                }
            }
        });
        
        // 计算平均值
        const averageStars = totalStars / totalProjects;
        const averageForks = totalForks / totalProjects;
        const averageContributors = totalContributors / totalProjects;
        const ecosystemHealth = healthCount > 0 ? totalHealthScore / healthCount : 0;
        
        // 社区增长指标
        const communityMetrics = calculateCommunityMetrics(projectsMetrics);
        
        // 趋势预测
        const trendPredictions = generateTrendPredictions(projectAnalytics);
        
        // 竞争分析
        const competitiveAnalysis = generateCompetitiveAnalysis(projectAnalytics);
        
        // 创新指标
        const innovationMetrics = calculateInnovationMetrics(projectAnalytics);
        
        // 质量指标
        const qualityMetrics = calculateQualityMetrics(projectAnalytics);
        
        // 协作网络分析
        const collaborationNetwork = analyzeCollaborationNetwork(projectAnalytics);
        
        return {
            ecosystemHealth: Math.round(ecosystemHealth),
            totalProjects,
            activeProjects,
            averageStars: Math.round(averageStars),
            averageForks: Math.round(averageForks),
            averageContributors: Math.round(averageContributors),
            totalStars,
            totalForks,
            totalContributors,
            totalIssues,
            totalPullRequests,
            languageDistribution,
            organizationDistribution,
            projectAnalytics,
            riskProjects: riskProjects.slice(0, 20),
            growthProjects: growthProjects.slice(0, 20),
            communityMetrics,
            trendPredictions,
            competitiveAnalysis,
            innovationMetrics,
            qualityMetrics,
            collaborationNetwork,
            marketSegmentation: analyzeMarketSegmentation(projectAnalytics),
            performanceMetrics: calculatePerformanceMetrics(projectAnalytics),
            sustainabilityScore: calculateSustainabilityScore(projectAnalytics),
            diversityIndex: calculateDiversityIndex(projectAnalytics),
            adoptionRate: calculateAdoptionRate(projectAnalytics),
            maturityDistribution: analyzeMaturityDistribution(projectAnalytics)
        };
    };

    // 项目分类
    const categorizeProject = (project) => {
        const name = project.full_name.toLowerCase();
        const repoName = project.repo_name.toLowerCase();
        
        if (name.includes('llm') || name.includes('gpt') || name.includes('bert') || name.includes('transformer')) {
            return 'LLM';
        } else if (name.includes('stable-diffusion') || name.includes('dalle') || name.includes('image')) {
            return 'Image Generation';
        } else if (name.includes('langchain') || name.includes('framework') || name.includes('tool')) {
            return 'Framework';
        } else if (name.includes('dataset') || name.includes('data')) {
            return 'Dataset';
        } else if (name.includes('model') || name.includes('checkpoint')) {
            return 'Model';
        } else {
            return 'Other';
        }
    };

    // 风险评估
    const assessRiskLevel = (stats, healthScore) => {
        let riskScore = 0;
        
        // 健康度风险
        if (healthScore < 30) riskScore += 3;
        else if (healthScore < 50) riskScore += 2;
        else if (healthScore < 70) riskScore += 1;
        
        // 活跃度风险
        if (stats.issues > stats.pull_requests * 5) riskScore += 2;
        
        // 社区风险
        if (stats.contributors < 5) riskScore += 2;
        
        // 维护风险
        const lastActivity = new Date(stats.last_activity || Date.now());
        const daysSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
        if (daysSinceActivity > 90) riskScore += 3;
        else if (daysSinceActivity > 30) riskScore += 1;
        
        if (riskScore >= 6) return 'high';
        else if (riskScore >= 3) return 'medium';
        else return 'low';
    };

    // 计算项目动量
    const calculateMomentum = (metrics) => {
        // 简化的动量计算
        const latestStats = getLatestStats(metrics);
        if (!latestStats) return 0;
        
        const baseScore = Math.log(latestStats.stars + 1) * 10;
        const contributorBonus = latestStats.contributors * 5;
        const activityBonus = latestStats.pull_requests * 2;
        
        return Math.min(100, baseScore + contributorBonus + activityBonus);
    };

    // 创新指标
    const calculateInnovationMetrics = (projectAnalytics) => {
        const recentProjects = projectAnalytics.filter(p => {
            const monthsOld = (Date.now() - p.lastActivity) / (1000 * 60 * 60 * 24 * 30);
            return monthsOld < 12;
        });
        
        const emergingTechnologies = {};
        projectAnalytics.forEach(project => {
            if (project.momentum > 70) {
                emergingTechnologies[project.language] = (emergingTechnologies[project.language] || 0) + 1;
            }
        });
        
        return {
            newProjectsRate: (recentProjects.length / projectAnalytics.length) * 100,
            emergingTechnologies,
            innovationScore: recentProjects.reduce((sum, p) => sum + p.momentum, 0) / recentProjects.length || 0,
            disruptiveProjects: projectAnalytics.filter(p => p.growthRate > 50).length
        };
    };

    // 质量指标
    const calculateQualityMetrics = (projectAnalytics) => {
        const highQualityProjects = projectAnalytics.filter(p => p.healthScore > 80);
        const averageQuality = projectAnalytics.reduce((sum, p) => sum + p.healthScore, 0) / projectAnalytics.length;
        
        return {
            highQualityCount: highQualityProjects.length,
            averageQuality,
            qualityDistribution: {
                excellent: projectAnalytics.filter(p => p.healthScore > 90).length,
                good: projectAnalytics.filter(p => p.healthScore > 70 && p.healthScore <= 90).length,
                average: projectAnalytics.filter(p => p.healthScore > 50 && p.healthScore <= 70).length,
                poor: projectAnalytics.filter(p => p.healthScore <= 50).length
            }
        };
    };

    // 协作网络分析
    const analyzeCollaborationNetwork = (projectAnalytics) => {
        const orgCollaborations = {};
        const languageCollaborations = {};
        
        projectAnalytics.forEach(project => {
            if (project.orgName) {
                orgCollaborations[project.orgName] = (orgCollaborations[project.orgName] || 0) + 1;
            }
            if (project.language) {
                languageCollaborations[project.language] = (languageCollaborations[project.language] || 0) + 1;
            }
        });
        
        return {
            topOrganizations: Object.entries(orgCollaborations)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([org, count]) => ({ org, count })),
            languageEcosystem: Object.entries(languageCollaborations)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([language, count]) => ({ language, count })),
            networkDensity: calculateNetworkDensity(projectAnalytics),
            crossPlatformProjects: projectAnalytics.filter(p => p.contributors > 50).length
        };
    };

    // 网络密度计算
    const calculateNetworkDensity = (projectAnalytics) => {
        const totalPossibleConnections = projectAnalytics.length * (projectAnalytics.length - 1) / 2;
        const actualConnections = projectAnalytics.reduce((sum, p) => sum + p.contributors, 0);
        return Math.min(100, (actualConnections / totalPossibleConnections) * 100);
    };

    // 市场细分分析
    const analyzeMarketSegmentation = (projectAnalytics) => {
        const segments = {};
        
        projectAnalytics.forEach(project => {
            const segment = project.category;
            if (!segments[segment]) {
                segments[segment] = {
                    count: 0,
                    totalStars: 0,
                    totalContributors: 0,
                    avgHealthScore: 0,
                    growthRate: 0
                };
            }
            
            segments[segment].count++;
            segments[segment].totalStars += project.stars;
            segments[segment].totalContributors += project.contributors;
            segments[segment].avgHealthScore += project.healthScore;
            segments[segment].growthRate += project.growthRate;
        });
        
        // 计算平均值
        Object.keys(segments).forEach(segment => {
            const seg = segments[segment];
            seg.avgStars = seg.totalStars / seg.count;
            seg.avgContributors = seg.totalContributors / seg.count;
            seg.avgHealthScore = seg.avgHealthScore / seg.count;
            seg.avgGrowthRate = seg.growthRate / seg.count;
        });
        
        return segments;
    };

    // 性能指标
    const calculatePerformanceMetrics = (projectAnalytics) => {
        const totalProjects = projectAnalytics.length;
        const topPerformers = projectAnalytics.filter(p => p.momentum > 80);
        
        return {
            topPerformerRate: (topPerformers.length / totalProjects) * 100,
            averageMomentum: projectAnalytics.reduce((sum, p) => sum + p.momentum, 0) / totalProjects,
            performanceDistribution: {
                high: projectAnalytics.filter(p => p.momentum > 80).length,
                medium: projectAnalytics.filter(p => p.momentum > 50 && p.momentum <= 80).length,
                low: projectAnalytics.filter(p => p.momentum <= 50).length
            },
            efficiencyScore: calculateEfficiencyScore(projectAnalytics)
        };
    };

    // 效率评分
    const calculateEfficiencyScore = (projectAnalytics) => {
        const scores = projectAnalytics.map(p => {
            const contributorEfficiency = p.stars / Math.max(p.contributors, 1);
            const activityEfficiency = p.pullRequests / Math.max(p.issues, 1);
            return (contributorEfficiency + activityEfficiency) / 2;
        });
        
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    };

    // 可持续性评分
    const calculateSustainabilityScore = (projectAnalytics) => {
        const sustainableProjects = projectAnalytics.filter(p => {
            return p.healthScore > 60 && p.contributors > 5 && p.riskLevel !== 'high';
        });
        
        return {
            sustainabilityRate: (sustainableProjects.length / projectAnalytics.length) * 100,
            averageSustainability: sustainableProjects.reduce((sum, p) => sum + p.healthScore, 0) / sustainableProjects.length || 0,
            sustainabilityFactors: {
                governance: calculateGovernanceScore(projectAnalytics),
                community: calculateCommunityScore(projectAnalytics),
                technical: calculateTechnicalScore(projectAnalytics)
            }
        };
    };

    // 治理评分
    const calculateGovernanceScore = (projectAnalytics) => {
        const governedProjects = projectAnalytics.filter(p => p.contributors > 10);
        return (governedProjects.length / projectAnalytics.length) * 100;
    };

    // 社区评分
    const calculateCommunityScore = (projectAnalytics) => {
        const communityProjects = projectAnalytics.filter(p => p.contributors > 5 && p.issues < p.pullRequests * 3);
        return (communityProjects.length / projectAnalytics.length) * 100;
    };

    // 技术评分
    const calculateTechnicalScore = (projectAnalytics) => {
        const technicalProjects = projectAnalytics.filter(p => p.healthScore > 70);
        return (technicalProjects.length / projectAnalytics.length) * 100;
    };

    // 多样性指数
    const calculateDiversityIndex = (projectAnalytics) => {
        const languages = {};
        const organizations = {};
        
        projectAnalytics.forEach(project => {
            languages[project.language] = (languages[project.language] || 0) + 1;
            organizations[project.orgName] = (organizations[project.orgName] || 0) + 1;
        });
        
        const languageDiversity = Object.keys(languages).length;
        const organizationDiversity = Object.keys(organizations).length;
        
        return {
            languageDiversity,
            organizationDiversity,
            overallDiversity: (languageDiversity + organizationDiversity) / 2,
            herfindahlIndex: calculateHerfindahlIndex(languages)
        };
    };

    // 赫芬达尔指数
    const calculateHerfindahlIndex = (distribution) => {
        const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
        const hhi = Object.values(distribution).reduce((sum, count) => {
            const share = count / total;
            return sum + (share * share);
        }, 0);
        return Math.round((1 - hhi) * 100); // 转换为多样性指数
    };

    // 采用率计算
    const calculateAdoptionRate = (projectAnalytics) => {
        const totalStars = projectAnalytics.reduce((sum, p) => sum + p.stars, 0);
        const averageStars = totalStars / projectAnalytics.length;
        
        const adoptedProjects = projectAnalytics.filter(p => p.stars > averageStars);
        
        return {
            adoptionRate: (adoptedProjects.length / projectAnalytics.length) * 100,
            averageAdoption: averageStars,
            adoptionTrend: calculateAdoptionTrend(projectAnalytics),
            viralityIndex: calculateViralityIndex(projectAnalytics)
        };
    };

    // 采用趋势
    const calculateAdoptionTrend = (projectAnalytics) => {
        const recentProjects = projectAnalytics.filter(p => {
            const monthsOld = (Date.now() - p.lastActivity) / (1000 * 60 * 60 * 24 * 30);
            return monthsOld < 6;
        });
        
        const recentAverage = recentProjects.reduce((sum, p) => sum + p.stars, 0) / recentProjects.length;
        const overallAverage = projectAnalytics.reduce((sum, p) => sum + p.stars, 0) / projectAnalytics.length;
        
        return ((recentAverage - overallAverage) / overallAverage) * 100;
    };

    // 病毒传播指数
    const calculateViralityIndex = (projectAnalytics) => {
        const viralProjects = projectAnalytics.filter(p => p.growthRate > 30);
        return (viralProjects.length / projectAnalytics.length) * 100;
    };

    // 成熟度分析
    const analyzeMaturityDistribution = (projectAnalytics) => {
        const maturityLevels = {
            experimental: 0,
            beta: 0,
            stable: 0,
            mature: 0
        };
        
        projectAnalytics.forEach(project => {
            if (project.stars < 100) {
                maturityLevels.experimental++;
            } else if (project.stars < 1000) {
                maturityLevels.beta++;
            } else if (project.stars < 10000) {
                maturityLevels.stable++;
            } else {
                maturityLevels.mature++;
            }
        });
        
        return maturityLevels;
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

    // 处理标签页切换
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    // 处理时间范围切换
    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    // 处理指标切换
    const handleMetricChange = (event) => {
        setSelectedMetric(event.target.value);
    };

    // 处理分页
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // 处理项目详情
    const handleProjectDetail = (project) => {
        setSelectedProject(project);
        setProjectDetailOpen(true);
    };

    // 处理项目比较
    const handleCompareProjects = (project) => {
        if (selectedProjects.includes(project)) {
            setSelectedProjects(selectedProjects.filter(p => p !== project));
        } else if (selectedProjects.length < 3) {
            setSelectedProjects([...selectedProjects, project]);
        }
    };

    // 导出报告
    const handleExportReport = () => {
        const report = {
            timestamp: new Date().toISOString(),
            timeRange,
            selectedMetric,
            analyticsData,
            projects: projects.length,
            summary: {
                ecosystemHealth: analyticsData.ecosystemHealth,
                totalProjects: analyticsData.totalProjects,
                activeProjects: analyticsData.activeProjects,
                riskProjects: analyticsData.riskProjects?.length || 0
            }
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecosystem-analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // 分享报告
    const handleShareReport = () => {
        if (navigator.share) {
            navigator.share({
                title: 'GitHub 大模型生态系统分析报告',
                text: `生态系统健康度: ${analyticsData.ecosystemHealth}%, 总项目数: ${analyticsData.totalProjects}`,
                url: window.location.href
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href);
            alert('链接已复制到剪贴板');
        }
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
                    {/* 页面标题和控制栏 */}
                    <Paper elevation={0} sx={{ 
                        p: 3, 
                        mb: 4, 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AnalyticsIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                                        生态系统深度分析
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        实时监控 · 趋势预测 · 风险评估 · 竞争分析
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Badge badgeContent={notifications.length} color="error">
                                    <IconButton 
                                        sx={{ color: 'white' }}
                                        onClick={() => setAlertsEnabled(!alertsEnabled)}
                                    >
                                        <NotificationsIcon />
                                    </IconButton>
                                </Badge>
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={autoRefresh}
                                            onChange={(e) => setAutoRefresh(e.target.checked)}
                                            sx={{ 
                                                '& .MuiSwitch-switchBase.Mui-checked': { color: 'white' },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'rgba(255,255,255,0.3)' }
                                            }}
                                        />
                                    }
                                    label="自动刷新"
                                    sx={{ color: 'white' }}
                                />
                                
                                <Button
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => window.location.reload()}
                                    sx={{ 
                                        borderColor: 'white', 
                                        color: 'white',
                                        '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    刷新
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleExportReport}
                                    sx={{ 
                                        borderColor: 'white', 
                                        color: 'white',
                                        '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    导出报告
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    startIcon={<ShareIcon />}
                                    onClick={handleShareReport}
                                    sx={{ 
                                        borderColor: 'white', 
                                        color: 'white',
                                        '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    分享
                                </Button>
                            </Box>
                        </Box>
                        
                        {/* 控制面板 */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ color: 'white' }}>时间范围</InputLabel>
                                <Select
                                    value={timeRange}
                                    onChange={handleTimeRangeChange}
                                    sx={{ 
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                                        '& .MuiSvgIcon-root': { color: 'white' }
                                    }}
                                >
                                    <MenuItem value="1month">1个月</MenuItem>
                                    <MenuItem value="3months">3个月</MenuItem>
                                    <MenuItem value="6months">6个月</MenuItem>
                                    <MenuItem value="1year">1年</MenuItem>
                                    <MenuItem value="all">全部</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ color: 'white' }}>分析指标</InputLabel>
                                <Select
                                    value={selectedMetric}
                                    onChange={handleMetricChange}
                                    sx={{ 
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                                        '& .MuiSvgIcon-root': { color: 'white' }
                                    }}
                                >
                                    <MenuItem value="all">全部指标</MenuItem>
                                    <MenuItem value="health">健康度</MenuItem>
                                    <MenuItem value="growth">增长率</MenuItem>
                                    <MenuItem value="community">社区活跃度</MenuItem>
                                    <MenuItem value="innovation">创新性</MenuItem>
                                    <MenuItem value="sustainability">可持续性</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <TextField
                                size="small"
                                placeholder="搜索项目..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'white' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: 'white' }
                                    },
                                    '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)' }
                                }}
                            />
                            
                            <Button
                                variant="outlined"
                                startIcon={<FilterListIcon />}
                                onClick={() => setFilterDialogOpen(true)}
                                sx={{ 
                                    borderColor: 'white', 
                                    color: 'white',
                                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                高级筛选
                            </Button>
                        </Box>
                        
                        {/* 更新时间 */}
                        <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                            最后更新: {lastUpdated.toLocaleString()}
                            {autoRefresh && ` · 自动刷新: 每${refreshInterval/60000}分钟`}
                        </Typography>
                    </Paper>

                    {/* 通知栏 */}
                    {notifications.length > 0 && alertsEnabled && (
                        <Fade in={true}>
                            <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'warning.light' }}>
                                <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <NotificationsIcon />
                                    系统通知
                                </Typography>
                                <List dense>
                                    {notifications.map((notification) => (
                                        <ListItem key={notification.id} sx={{ py: 0.5 }}>
                                            <ListItemText
                                                primary={notification.title}
                                                secondary={notification.message}
                                            />
                                            <Chip 
                                                label={notification.type} 
                                                size="small"
                                                color={notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'warning' : 'success'}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Fade>
                    )}

                    {/* 标签页导航 */}
                    <Paper elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
                        <Tabs 
                            value={selectedTab} 
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ 
                                '& .MuiTab-root': { 
                                    minWidth: 120,
                                    fontWeight: 500
                                }
                            }}
                        >
                            <Tab icon={<AssessmentIcon />} label="概览仪表板" />
                            <Tab icon={<TrendingUpIcon />} label="趋势分析" />
                            <Tab icon={<SecurityIcon />} label="风险监控" />
                            <Tab icon={<EmojiEventsIcon />} label="竞争分析" />
                            <Tab icon={<InsightsIcon />} label="创新指标" />
                            <Tab icon={<WorkspacesIcon />} label="协作网络" />
                            <Tab icon={<PublicIcon />} label="市场洞察" />
                            <Tab icon={<TimelineIcon />} label="详细数据" />
                        </Tabs>
                    </Paper>

                    {/* 加载状态 */}
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress size={60} />
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
                        <Box>
                            {/* 概览仪表板 */}
                            {selectedTab === 0 && (
                                <Fade in={true}>
                                    <Box>
                                        {/* 核心指标卡片 */}
                                        <Grid container spacing={3} sx={{ mb: 4 }}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card elevation={0} sx={{ 
                                                    borderRadius: 2, 
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    color: 'white',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'translateY(-4px)' }
                                                }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                                                <HealthAndSafetyIcon />
                                                            </Avatar>
                                                            <Typography variant="h6">生态健康度</Typography>
                                                        </Box>
                                                        <Typography variant="h4" gutterBottom>
                                                            {analyticsData.ecosystemHealth}%
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={analyticsData.ecosystemHealth} 
                                                            sx={{ 
                                                                height: 8, 
                                                                borderRadius: 4,
                                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                                '& .MuiLinearProgress-bar': { backgroundColor: 'white' }
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card elevation={0} sx={{ 
                                                    borderRadius: 2, 
                                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                    color: 'white',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'translateY(-4px)' }
                                                }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                                                <SpeedIcon />
                                                            </Avatar>
                                                            <Typography variant="h6">活跃项目</Typography>
                                                        </Box>
                                                        <Typography variant="h4" gutterBottom>
                                                            {analyticsData.activeProjects}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                            共 {analyticsData.totalProjects} 个项目
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card elevation={0} sx={{ 
                                                    borderRadius: 2, 
                                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                    color: 'white',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'translateY(-4px)' }
                                                }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                                                <StarIcon />
                                                            </Avatar>
                                                            <Typography variant="h6">总Stars</Typography>
                                                        </Box>
                                                        <Typography variant="h4" gutterBottom>
                                                            {(analyticsData.totalStars / 1000000).toFixed(1)}M
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                            平均 {analyticsData.averageStars?.toLocaleString()} Stars
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card elevation={0} sx={{ 
                                                    borderRadius: 2, 
                                                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                                    color: 'white',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'translateY(-4px)' }
                                                }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                                                <GroupIcon />
                                                            </Avatar>
                                                            <Typography variant="h6">社区贡献者</Typography>
                                                        </Box>
                                                        <Typography variant="h4" gutterBottom>
                                                            {(analyticsData.totalContributors / 1000).toFixed(1)}K
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                            平均 {analyticsData.averageContributors?.toFixed(0)} 人/项目
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        {/* 扩展指标卡片 */}
                                        <Grid container spacing={3} sx={{ mb: 4 }}>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'success.main' }}>
                                                                <TrendingUpIcon />
                                                            </Avatar>
                                                            <Typography variant="h6">创新指标</Typography>
                                                        </Box>
                                                        <Typography variant="h4" color="success.main" gutterBottom>
                                                            {analyticsData.innovationMetrics?.innovationScore?.toFixed(1) || 0}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            新项目率: {analyticsData.innovationMetrics?.newProjectsRate?.toFixed(1) || 0}%
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            颠覆性项目: {analyticsData.innovationMetrics?.disruptiveProjects || 0}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4}>
                                                <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'warning.main' }}>
                                                                <SecurityIcon />
                                                            </Avatar>
                                                            <Typography variant="h6">风险监控</Typography>
                                                        </Box>
                                                        <Typography variant="h4" color="warning.main" gutterBottom>
                                                            {analyticsData.riskProjects?.length || 0}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            高风险项目数量
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            风险率: {((analyticsData.riskProjects?.length || 0) / analyticsData.totalProjects * 100).toFixed(1)}%
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4}>
                                                <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'info.main' }}>
                                                                <AssessmentIcon />
                                                            </Avatar>
                                                            <Typography variant="h6">可持续性</Typography>
                                                        </Box>
                                                        <Typography variant="h4" color="info.main" gutterBottom>
                                                            {analyticsData.sustainabilityScore?.sustainabilityRate?.toFixed(1) || 0}%
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            可持续项目比例
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            平均可持续性: {analyticsData.sustainabilityScore?.averageSustainability?.toFixed(1) || 0}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        {/* 生态系统健康度雷达图 */}
                                        <Grid container spacing={3} sx={{ mb: 4 }}>
                                            <Grid item xs={12} md={8}>
                                                <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                    <CardHeader 
                                                        title={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <PsychologyIcon />
                                                                <Typography variant="h6">生态系统健康度分析</Typography>
                                                            </Box>
                                                        }
                                                        action={
                                                            <IconButton onClick={() => setFullscreenChart('health')}>
                                                                <FullscreenIcon />
                                                            </IconButton>
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

                                            <Grid item xs={12} md={4}>
                                                <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                    <CardHeader 
                                                        title={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <InsightsIcon />
                                                                <Typography variant="h6">质量分布</Typography>
                                                            </Box>
                                                        }
                                                    />
                                                    <CardContent>
                                                        <List>
                                                            <ListItem sx={{ px: 0 }}>
                                                                <ListItemText
                                                                    primary="优秀项目"
                                                                    secondary={`${analyticsData.qualityMetrics?.qualityDistribution?.excellent || 0} 个`}
                                                                />
                                                                <Chip 
                                                                    label="90%+" 
                                                                    color="success" 
                                                                    size="small"
                                                                />
                                                            </ListItem>
                                                            <ListItem sx={{ px: 0 }}>
                                                                <ListItemText
                                                                    primary="良好项目"
                                                                    secondary={`${analyticsData.qualityMetrics?.qualityDistribution?.good || 0} 个`}
                                                                />
                                                                <Chip 
                                                                    label="70-90%" 
                                                                    color="primary" 
                                                                    size="small"
                                                                />
                                                            </ListItem>
                                                            <ListItem sx={{ px: 0 }}>
                                                                <ListItemText
                                                                    primary="一般项目"
                                                                    secondary={`${analyticsData.qualityMetrics?.qualityDistribution?.average || 0} 个`}
                                                                />
                                                                <Chip 
                                                                    label="50-70%" 
                                                                    color="warning" 
                                                                    size="small"
                                                                />
                                                            </ListItem>
                                                            <ListItem sx={{ px: 0 }}>
                                                                <ListItemText
                                                                    primary="待改进项目"
                                                                    secondary={`${analyticsData.qualityMetrics?.qualityDistribution?.poor || 0} 个`}
                                                                />
                                                                <Chip 
                                                                    label="<50%" 
                                                                    color="error" 
                                                                    size="small"
                                                                />
                                                            </ListItem>
                                                        </List>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Fade>
                            )}

                            {/* 其他标签页内容占位 */}
                            {selectedTab !== 0 && (
                                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        {selectedTab === 1 && "趋势分析"}
                                        {selectedTab === 2 && "风险监控"}
                                        {selectedTab === 3 && "竞争分析"}
                                        {selectedTab === 4 && "创新指标"}
                                        {selectedTab === 5 && "协作网络"}
                                        {selectedTab === 6 && "市场洞察"}
                                        {selectedTab === 7 && "详细数据"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                        正在开发中...
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default Analytics; 