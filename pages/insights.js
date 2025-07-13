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
    TableRow,
    IconButton,
    Tooltip,
    Badge,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    TextField,
    InputAdornment,
    Fade,
    Zoom,
    Skeleton
} from '@mui/material';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { DataService } from '../lib/dataService';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
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
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
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
    const [timeRange, setTimeRange] = useState('6months');
    const [selectedMetric, setSelectedMetric] = useState('all');
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [showAdvancedInsights, setShowAdvancedInsights] = useState(false);
    const router = useRouter();

    // 获取数据
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // 获取更多项目数据
                const response = await fetch('/api/projects/search?q=&limit=100');
                if (!response.ok) throw new Error('Failed to fetch projects');
                
                const data = await response.json();
                setProjects(data);
                
                // 获取项目详细数据
                const projectDetails = {};
                const selectedProjects = data.slice(0, 50); // 增加数据量
                
                for (const project of selectedProjects) {
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
                
                setLastUpdated(new Date());
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('加载数据时出错，请重试');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange, selectedMetric]);

    // 自动刷新
    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchData();
            }, 5 * 60 * 1000); // 5分钟刷新一次
        }
        return () => clearInterval(interval);
    }, [autoRefresh]);

    // 生成洞察数据
    const generateInsights = (projectsList, projectsMetrics) => {
        const validProjects = projectsList.filter(p => projectsMetrics[p.full_name]);
        
        return {
            languageTrends: generateLanguageTrends(validProjects, projectsMetrics),
            developmentPatterns: generateDevelopmentPatterns(projectsMetrics),
            emergingTechnologies: generateEmergingTechnologies(validProjects, projectsMetrics),
            communityGrowth: generateCommunityGrowth(projectsMetrics),
            riskFactors: generateRiskFactors(projectsMetrics),
            futureOutlook: generateFutureOutlook(validProjects, projectsMetrics),
            marketTrends: generateMarketTrends(projectsList, projectsMetrics),
            technicalDebt: analyzeTechnicalDebt(projectsMetrics),
            securityAnalysis: analyzeSecurityTrends(projectsMetrics),
            performanceMetrics: analyzePerformanceMetrics(projectsMetrics),
            collaborationPatterns: analyzeCollaborationPatterns(projectsMetrics),
            innovationIndex: calculateInnovationIndex(validProjects, projectsMetrics)
        };
    };

    // 生成语言趋势
    const generateLanguageTrends = (projectsList, projectsMetrics) => {
        const languageStats = {};
        
        projectsList.forEach(project => {
            const lang = project.language || 'Unknown';
            const metrics = projectsMetrics[project.full_name];
            
            if (!languageStats[lang]) {
                languageStats[lang] = {
                    language: lang,
                    count: 0,
                    totalStars: 0,
                    totalForks: 0,
                    totalContributors: 0,
                    averageHealth: 0,
                    projects: []
                };
            }
            
            languageStats[lang].count++;
            languageStats[lang].projects.push(project);
            
            if (metrics && metrics.length > 0) {
                const latest = metrics[metrics.length - 1];
                languageStats[lang].totalStars += latest.stars || 0;
                languageStats[lang].totalForks += latest.forks || 0;
                languageStats[lang].totalContributors += latest.contributors || 0;
                languageStats[lang].averageHealth += calculateProjectHealth(latest);
            }
        });
        
        // 计算平均值和增长率
        const trends = Object.values(languageStats).map(stat => {
            const avgHealth = stat.averageHealth / stat.count;
            const avgStars = stat.totalStars / stat.count;
            const growthRate = calculateLanguageGrowth(stat.language, projectsMetrics);
            
            return {
                ...stat,
                averageHealth: avgHealth,
                averageStars: avgStars,
                growth: growthRate,
                momentum: calculateLanguageMomentum(stat, projectsMetrics)
            };
        });
        
        return trends.sort((a, b) => b.totalStars - a.totalStars).slice(0, 15);
    };

    // 计算语言增长率
    const calculateLanguageGrowth = (language, projectsMetrics) => {
        const languageProjects = Object.entries(projectsMetrics)
            .filter(([name, metrics]) => {
                const project = projects.find(p => p.full_name === name);
                return project && project.language === language;
            });
        
        if (languageProjects.length === 0) return 0;
        
        let totalGrowth = 0;
        let validProjects = 0;
        
        languageProjects.forEach(([name, metrics]) => {
            if (metrics && metrics.length >= 2) {
                const current = metrics[metrics.length - 1];
                const previous = metrics[metrics.length - 2];
                
                if (previous.stars > 0) {
                    const growth = ((current.stars - previous.stars) / previous.stars) * 100;
                    totalGrowth += growth;
                    validProjects++;
                }
            }
        });
        
        return validProjects > 0 ? totalGrowth / validProjects : 0;
    };

    // 计算语言动量
    const calculateLanguageMomentum = (languageStat, projectsMetrics) => {
        const recentActivity = languageStat.projects.reduce((total, project) => {
            const metrics = projectsMetrics[project.full_name];
            if (metrics && metrics.length > 0) {
                const latest = metrics[metrics.length - 1];
                const daysSinceUpdate = (Date.now() - new Date(latest.updated_at || Date.now())) / (1000 * 60 * 60 * 24);
                return total + (daysSinceUpdate < 30 ? 1 : 0);
            }
            return total;
        }, 0);
        
        return (recentActivity / languageStat.count) * 100;
    };

    // 计算项目健康度
    const calculateProjectHealth = (metrics) => {
        if (!metrics) return 0;
        
        let health = 0;
        const stars = metrics.stars || 0;
        const forks = metrics.forks || 0;
        const contributors = metrics.contributors || 0;
        const issues = metrics.issues || 0;
        const pullRequests = metrics.pull_requests || 0;
        
        // 基础活跃度 (40%)
        if (stars > 100) health += 10;
        if (stars > 1000) health += 10;
        if (contributors > 5) health += 10;
        if (contributors > 20) health += 10;
        
        // 社区健康度 (30%)
        if (forks > 50) health += 10;
        if (issues > 0 && pullRequests > 0) {
            const ratio = pullRequests / issues;
            health += Math.min(15, ratio * 15);
        }
        
        // 维护状态 (30%)
        const daysSinceUpdate = (Date.now() - new Date(metrics.updated_at || Date.now())) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) health += 15;
        else if (daysSinceUpdate < 30) health += 10;
        else if (daysSinceUpdate < 90) health += 5;
        
        if (metrics.license) health += 15;
        
        return Math.min(100, health);
    };

    // 生成开发模式
    const generateDevelopmentPatterns = (projectsMetrics) => {
        const patterns = [];
        let totalProjects = 0;
        let microserviceCount = 0;
        let monolithCount = 0;
        let containerizedCount = 0;
        let cicdCount = 0;
        let testCoverageCount = 0;
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            if (!metrics || metrics.length === 0) return;
            
            totalProjects++;
            const project = projects.find(p => p.full_name === name);
            const latest = metrics[metrics.length - 1];
            
            // 分析架构模式
            if (project && project.topics) {
                const topics = project.topics.join(' ').toLowerCase();
                if (topics.includes('microservice') || topics.includes('microservices')) {
                    microserviceCount++;
                }
                if (topics.includes('monolith') || topics.includes('monolithic')) {
                    monolithCount++;
                }
                if (topics.includes('docker') || topics.includes('container')) {
                    containerizedCount++;
                }
                if (topics.includes('ci') || topics.includes('cd') || topics.includes('github-actions')) {
                    cicdCount++;
                }
                if (topics.includes('test') || topics.includes('testing')) {
                    testCoverageCount++;
                }
            }
        });
        
        if (totalProjects > 0) {
            patterns.push({
                pattern: '微服务架构',
                prevalence: (microserviceCount / totalProjects) * 100,
                impact: microserviceCount > totalProjects * 0.3 ? 'high' : 'medium',
                description: '采用微服务架构的项目比例',
                trend: 'increasing'
            });
            
            patterns.push({
                pattern: '容器化部署',
                prevalence: (containerizedCount / totalProjects) * 100,
                impact: containerizedCount > totalProjects * 0.5 ? 'high' : 'medium',
                description: '使用容器化技术的项目比例',
                trend: 'increasing'
            });
            
            patterns.push({
                pattern: 'CI/CD实践',
                prevalence: (cicdCount / totalProjects) * 100,
                impact: cicdCount > totalProjects * 0.4 ? 'high' : 'medium',
                description: '实施持续集成/持续部署的项目比例',
                trend: 'stable'
            });
            
            patterns.push({
                pattern: '测试覆盖',
                prevalence: (testCoverageCount / totalProjects) * 100,
                impact: testCoverageCount > totalProjects * 0.6 ? 'high' : 'low',
                description: '注重测试覆盖率的项目比例',
                trend: 'increasing'
            });
        }
        
        return patterns;
    };

    // 生成新兴技术
    const generateEmergingTechnologies = (projectsList, projectsMetrics) => {
        const techKeywords = [
            { keyword: 'transformer', name: 'Transformer架构', potential: 'very_high' },
            { keyword: 'diffusion', name: 'Diffusion模型', potential: 'very_high' },
            { keyword: 'rag', name: 'RAG检索增强', potential: 'high' },
            { keyword: 'lora', name: 'LoRA微调', potential: 'high' },
            { keyword: 'rlhf', name: 'RLHF训练', potential: 'high' },
            { keyword: 'multimodal', name: '多模态AI', potential: 'very_high' },
            { keyword: 'edge', name: '边缘计算', potential: 'medium' },
            { keyword: 'quantization', name: '模型量化', potential: 'high' },
            { keyword: 'federated', name: '联邦学习', potential: 'medium' },
            { keyword: 'neuromorphic', name: '神经形态计算', potential: 'low' }
        ];
        
        const technologies = techKeywords.map(tech => {
            let adoptionCount = 0;
            let totalStars = 0;
            let recentProjects = 0;
            
            projectsList.forEach(project => {
                const searchText = `${project.full_name} ${project.description || ''}`.toLowerCase();
                if (searchText.includes(tech.keyword)) {
                    adoptionCount++;
                    
                    const metrics = projectsMetrics[project.full_name];
                    if (metrics && metrics.length > 0) {
                        const latest = metrics[metrics.length - 1];
                        totalStars += latest.stars || 0;
                        
                        // 检查是否是最近的项目
                        const createdDate = new Date(latest.created_at || Date.now());
                        const monthsOld = (Date.now() - createdDate) / (1000 * 60 * 60 * 24 * 30);
                        if (monthsOld < 12) {
                            recentProjects++;
                        }
                    }
                }
            });
            
            return {
                ...tech,
                adoptionRate: (adoptionCount / projectsList.length) * 100,
                totalStars,
                recentProjects,
                growth: calculateTechGrowth(tech.keyword, projectsList, projectsMetrics),
                description: getTechDescription(tech.keyword)
            };
        });
        
        return technologies
            .filter(tech => tech.adoptionCount > 0)
            .sort((a, b) => b.adoptionRate - a.adoptionRate)
            .slice(0, 8);
    };

    // 计算技术增长率
    const calculateTechGrowth = (keyword, projectsList, projectsMetrics) => {
        const techProjects = projectsList.filter(project => {
            const searchText = `${project.full_name} ${project.description || ''}`.toLowerCase();
            return searchText.includes(keyword);
        });
        
        if (techProjects.length === 0) return 0;
        
        let totalGrowth = 0;
        let validProjects = 0;
        
        techProjects.forEach(project => {
            const metrics = projectsMetrics[project.full_name];
            if (metrics && metrics.length >= 2) {
                const current = metrics[metrics.length - 1];
                const previous = metrics[metrics.length - 2];
                
                if (previous.stars > 0) {
                    const growth = ((current.stars - previous.stars) / previous.stars) * 100;
                    totalGrowth += growth;
                    validProjects++;
                }
            }
        });
        
        return validProjects > 0 ? totalGrowth / validProjects : 0;
    };

    // 获取技术描述
    const getTechDescription = (keyword) => {
        const descriptions = {
            'transformer': 'Transformer架构在自然语言处理中的应用',
            'diffusion': 'Diffusion模型在图像生成领域的突破',
            'rag': 'RAG检索增强生成技术',
            'lora': 'LoRA低秩适应微调技术',
            'rlhf': 'RLHF人类反馈强化学习',
            'multimodal': '多模态AI技术发展',
            'edge': '边缘计算在AI部署中的应用',
            'quantization': '模型量化技术优化',
            'federated': '联邦学习保护隐私',
            'neuromorphic': '神经形态计算新范式'
        };
        
        return descriptions[keyword] || `${keyword}技术发展趋势`;
    };

    // 生成社区增长
    const generateCommunityGrowth = (projectsMetrics) => {
        let totalContributors = 0;
        let activeProjects = 0;
        let totalStars = 0;
        let totalForks = 0;
        let recentActivity = 0;
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            if (!metrics || metrics.length === 0) return;
            
            const latest = metrics[metrics.length - 1];
            totalContributors += latest.contributors || 0;
            totalStars += latest.stars || 0;
            totalForks += latest.forks || 0;
            
            // 检查活跃度
            const daysSinceUpdate = (Date.now() - new Date(latest.updated_at || Date.now())) / (1000 * 60 * 60 * 24);
            if (daysSinceUpdate < 30) {
                activeProjects++;
                recentActivity++;
            }
        });
        
        const totalProjects = Object.keys(projectsMetrics).length;
        const monthlyGrowth = calculateMonthlyGrowth(projectsMetrics);
        
        return {
            totalContributors,
            activeProjects,
            totalStars,
            totalForks,
            monthlyGrowth,
            retentionRate: (recentActivity / totalProjects) * 100,
            engagementScore: calculateEngagementScore(projectsMetrics),
            diversityIndex: calculateCommunityDiversity(projectsMetrics)
        };
    };

    // 计算月增长率
    const calculateMonthlyGrowth = (projectsMetrics) => {
        let totalGrowth = 0;
        let validProjects = 0;
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            if (!metrics || metrics.length < 2) return;
            
            const current = metrics[metrics.length - 1];
            const previous = metrics[metrics.length - 2];
            
            if (previous.stars > 0) {
                const growth = ((current.stars - previous.stars) / previous.stars) * 100;
                totalGrowth += growth;
                validProjects++;
            }
        });
        
        return validProjects > 0 ? totalGrowth / validProjects : 0;
    };

    // 计算参与度评分
    const calculateEngagementScore = (projectsMetrics) => {
        let totalScore = 0;
        let validProjects = 0;
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            if (!metrics || metrics.length === 0) return;
            
            const latest = metrics[metrics.length - 1];
            const stars = latest.stars || 0;
            const forks = latest.forks || 0;
            const contributors = latest.contributors || 0;
            const issues = latest.issues || 0;
            const pullRequests = latest.pull_requests || 0;
            
            // 计算参与度评分
            let score = 0;
            if (stars > 0) score += Math.log(stars) * 10;
            if (contributors > 0) score += Math.log(contributors) * 15;
            if (issues > 0 && pullRequests > 0) score += (pullRequests / issues) * 20;
            
            totalScore += score;
            validProjects++;
        });
        
        return validProjects > 0 ? totalScore / validProjects : 0;
    };

    // 计算社区多样性
    const calculateCommunityDiversity = (projectsMetrics) => {
        const languages = {};
        const organizations = {};
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            const project = projects.find(p => p.full_name === name);
            if (project) {
                languages[project.language || 'Unknown'] = (languages[project.language || 'Unknown'] || 0) + 1;
                organizations[project.org_name || 'Unknown'] = (organizations[project.org_name || 'Unknown'] || 0) + 1;
            }
        });
        
        const languageCount = Object.keys(languages).length;
        const orgCount = Object.keys(organizations).length;
        
        return (languageCount + orgCount) / 2;
    };

    // 生成风险因素
    const generateRiskFactors = (projectsMetrics) => {
        const risks = [];
        let abandonedProjects = 0;
        let lowMaintenanceProjects = 0;
        let highIssueProjects = 0;
        let singleMaintainerProjects = 0;
        let noLicenseProjects = 0;
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            if (!metrics || metrics.length === 0) return;
            
            const latest = metrics[metrics.length - 1];
            const daysSinceUpdate = (Date.now() - new Date(latest.updated_at || Date.now())) / (1000 * 60 * 60 * 24);
            
            // 废弃项目
            if (daysSinceUpdate > 365) {
                abandonedProjects++;
            }
            
            // 低维护项目
            if (daysSinceUpdate > 90) {
                lowMaintenanceProjects++;
            }
            
            // 高问题项目
            if (latest.issues > 0 && latest.pull_requests > 0) {
                const ratio = latest.issues / latest.pull_requests;
                if (ratio > 5) {
                    highIssueProjects++;
                }
            }
            
            // 单维护者项目
            if (latest.contributors <= 1) {
                singleMaintainerProjects++;
            }
            
            // 无许可证项目
            if (!latest.license) {
                noLicenseProjects++;
            }
        });
        
        const totalProjects = Object.keys(projectsMetrics).length;
        
        if (totalProjects > 0) {
            risks.push({
                factor: '项目废弃',
                severity: abandonedProjects > totalProjects * 0.2 ? 'high' : abandonedProjects > totalProjects * 0.1 ? 'medium' : 'low',
                affectedProjects: abandonedProjects,
                description: '长期未更新的项目数量'
            });
            
            risks.push({
                factor: '维护不足',
                severity: lowMaintenanceProjects > totalProjects * 0.3 ? 'high' : lowMaintenanceProjects > totalProjects * 0.2 ? 'medium' : 'low',
                affectedProjects: lowMaintenanceProjects,
                description: '维护频率较低的项目'
            });
            
            risks.push({
                factor: '问题积压',
                severity: highIssueProjects > totalProjects * 0.15 ? 'high' : highIssueProjects > totalProjects * 0.1 ? 'medium' : 'low',
                affectedProjects: highIssueProjects,
                description: '问题与PR比例失衡的项目'
            });
            
            risks.push({
                factor: '单点维护',
                severity: singleMaintainerProjects > totalProjects * 0.4 ? 'high' : singleMaintainerProjects > totalProjects * 0.3 ? 'medium' : 'low',
                affectedProjects: singleMaintainerProjects,
                description: '只有单一维护者的项目'
            });
            
            risks.push({
                factor: '许可证缺失',
                severity: noLicenseProjects > totalProjects * 0.2 ? 'high' : noLicenseProjects > totalProjects * 0.1 ? 'medium' : 'low',
                affectedProjects: noLicenseProjects,
                description: '缺少开源许可证的项目'
            });
        }
        
        return risks.sort((a, b) => b.affectedProjects - a.affectedProjects);
    };

    // 生成未来展望
    const generateFutureOutlook = (projectsList, projectsMetrics) => {
        const predictions = [];
        
        // 分析语言趋势
        const languageTrends = generateLanguageTrends(projectsList, projectsMetrics);
        const topLanguages = languageTrends.slice(0, 3);
        
        topLanguages.forEach(lang => {
            let predictionText = '';
            let impact = '';
            let timeframe = '';
            let probability = 0;
            
            if (lang.growth > 20) {
                predictionText = `${lang.language} 生态系统将持续快速发展`;
                impact = `预计将有更多 ${lang.language} 项目出现，社区活跃度持续提升`;
                timeframe = '未来 6-12 个月';
                probability = 85;
            } else if (lang.growth > 10) {
                predictionText = `${lang.language} 将保持稳定增长`;
                impact = `${lang.language} 项目质量将进一步提升，工具链日趋完善`;
                timeframe = '未来 12-18 个月';
                probability = 70;
            } else {
                predictionText = `${lang.language} 将趋于成熟稳定`;
                impact = `${lang.language} 生态系统将重点关注质量和可维护性`;
                timeframe = '未来 18-24 个月';
                probability = 60;
            }
            
            predictions.push({
                prediction: predictionText,
                impact,
                timeframe,
                probability
            });
        });
        
        // 添加技术趋势预测
        predictions.push({
            prediction: '多模态AI技术将成为主流',
            impact: '文本、图像、音频融合的AI应用将大幅增长',
            timeframe: '未来 12-18 个月',
            probability: 90
        });
        
        predictions.push({
            prediction: '边缘AI部署将显著增长',
            impact: '移动端和边缘设备的AI应用将快速发展',
            timeframe: '未来 6-12 个月',
            probability: 75
        });
        
        predictions.push({
            prediction: '开源大模型生态将更加完善',
            impact: '开源替代方案将挑战商业模型的地位',
            timeframe: '未来 18-24 个月',
            probability: 80
        });
        
        return predictions;
    };

    // 生成市场趋势
    const generateMarketTrends = (projectsList, projectsMetrics) => {
        const categories = {};
        
        projectsList.forEach(project => {
            const category = categorizeProject(project);
            if (!categories[category]) {
                categories[category] = {
                    name: category,
                    count: 0,
                    totalStars: 0,
                    averageGrowth: 0,
                    projects: []
                };
            }
            
            categories[category].count++;
            categories[category].projects.push(project);
            
            const metrics = projectsMetrics[project.full_name];
            if (metrics && metrics.length > 0) {
                const latest = metrics[metrics.length - 1];
                categories[category].totalStars += latest.stars || 0;
                
                // 计算增长率
                if (metrics.length >= 2) {
                    const current = metrics[metrics.length - 1];
                    const previous = metrics[metrics.length - 2];
                    if (previous.stars > 0) {
                        const growth = ((current.stars - previous.stars) / previous.stars) * 100;
                        categories[category].averageGrowth += growth;
                    }
                }
            }
        });
        
        // 计算平均值
        Object.values(categories).forEach(cat => {
            cat.averageStars = cat.totalStars / cat.count;
            cat.averageGrowth = cat.averageGrowth / cat.count;
        });
        
        return Object.values(categories).sort((a, b) => b.totalStars - a.totalStars);
    };

    // 项目分类
    const categorizeProject = (project) => {
        const name = project.full_name.toLowerCase();
        const description = (project.description || '').toLowerCase();
        
        if (name.includes('llm') || name.includes('gpt') || name.includes('transformer')) {
            return 'LLM大模型';
        } else if (name.includes('stable-diffusion') || name.includes('dalle') || description.includes('image')) {
            return '图像生成';
        } else if (name.includes('nlp') || name.includes('text')) {
            return '自然语言处理';
        } else if (name.includes('cv') || name.includes('vision')) {
            return '计算机视觉';
        } else if (name.includes('framework') || name.includes('tool')) {
            return '框架工具';
        } else if (name.includes('dataset') || name.includes('data')) {
            return '数据集';
        } else {
            return '其他';
        }
    };

    // 分析技术债务
    const analyzeTechnicalDebt = (projectsMetrics) => {
        let highDebtProjects = 0;
        let mediumDebtProjects = 0;
        let lowDebtProjects = 0;
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            if (!metrics || metrics.length === 0) return;
            
            const latest = metrics[metrics.length - 1];
            const issues = latest.issues || 0;
            const pullRequests = latest.pull_requests || 0;
            const contributors = latest.contributors || 0;
            
            // 计算技术债务指标
            let debtScore = 0;
            
            // 问题积压
            if (issues > pullRequests * 3) debtScore += 3;
            else if (issues > pullRequests * 2) debtScore += 2;
            else if (issues > pullRequests) debtScore += 1;
            
            // 维护者不足
            if (contributors <= 1) debtScore += 2;
            else if (contributors <= 3) debtScore += 1;
            
            // 更新频率
            const daysSinceUpdate = (Date.now() - new Date(latest.updated_at || Date.now())) / (1000 * 60 * 60 * 24);
            if (daysSinceUpdate > 90) debtScore += 3;
            else if (daysSinceUpdate > 30) debtScore += 1;
            
            if (debtScore >= 5) highDebtProjects++;
            else if (debtScore >= 3) mediumDebtProjects++;
            else lowDebtProjects++;
        });
        
        const totalProjects = Object.keys(projectsMetrics).length;
        
        return {
            highDebtProjects,
            mediumDebtProjects,
            lowDebtProjects,
            highDebtPercentage: (highDebtProjects / totalProjects) * 100,
            mediumDebtPercentage: (mediumDebtProjects / totalProjects) * 100,
            lowDebtPercentage: (lowDebtProjects / totalProjects) * 100,
            overallDebtScore: ((highDebtProjects * 3 + mediumDebtProjects * 2 + lowDebtProjects * 1) / totalProjects)
        };
    };

    // 分析安全趋势
    const analyzeSecurityTrends = (projectsMetrics) => {
        let securityFocusedProjects = 0;
        let vulnerableProjects = 0;
        let secureProjects = 0;
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            if (!metrics || metrics.length === 0) return;
            
            const project = projects.find(p => p.full_name === name);
            if (project) {
                const description = (project.description || '').toLowerCase();
                const topics = (project.topics || []).join(' ').toLowerCase();
                
                // 检查安全相关关键词
                const securityKeywords = ['security', 'secure', 'vulnerability', 'encryption', 'auth', 'privacy'];
                const hasSecurityFocus = securityKeywords.some(keyword => 
                    description.includes(keyword) || topics.includes(keyword)
                );
                
                if (hasSecurityFocus) {
                    securityFocusedProjects++;
                }
                
                // 简单的安全评估
                const latest = metrics[metrics.length - 1];
                const hasLicense = !!latest.license;
                const recentUpdate = (Date.now() - new Date(latest.updated_at || Date.now())) / (1000 * 60 * 60 * 24) < 90;
                const activeContributors = latest.contributors > 3;
                
                if (hasLicense && recentUpdate && activeContributors) {
                    secureProjects++;
                } else if (!hasLicense || !recentUpdate) {
                    vulnerableProjects++;
                }
            }
        });
        
        const totalProjects = Object.keys(projectsMetrics).length;
        
        return {
            securityFocusedProjects,
            vulnerableProjects,
            secureProjects,
            securityFocusPercentage: (securityFocusedProjects / totalProjects) * 100,
            vulnerablePercentage: (vulnerableProjects / totalProjects) * 100,
            securePercentage: (secureProjects / totalProjects) * 100,
            overallSecurityScore: (secureProjects / totalProjects) * 100
        };
    };

    // 分析性能指标
    const analyzePerformanceMetrics = (projectsMetrics) => {
        let highPerformanceProjects = 0;
        let mediumPerformanceProjects = 0;
        let lowPerformanceProjects = 0;
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            if (!metrics || metrics.length === 0) return;
            
            const latest = metrics[metrics.length - 1];
            const stars = latest.stars || 0;
            const forks = latest.forks || 0;
            const contributors = latest.contributors || 0;
            
            // 计算性能评分
            let performanceScore = 0;
            
            // 社区活跃度
            if (stars > 10000) performanceScore += 3;
            else if (stars > 1000) performanceScore += 2;
            else if (stars > 100) performanceScore += 1;
            
            // 开发活跃度
            if (contributors > 50) performanceScore += 3;
            else if (contributors > 10) performanceScore += 2;
            else if (contributors > 3) performanceScore += 1;
            
            // 社区参与度
            if (forks > stars * 0.1) performanceScore += 2;
            else if (forks > stars * 0.05) performanceScore += 1;
            
            if (performanceScore >= 6) highPerformanceProjects++;
            else if (performanceScore >= 3) mediumPerformanceProjects++;
            else lowPerformanceProjects++;
        });
        
        const totalProjects = Object.keys(projectsMetrics).length;
        
        return {
            highPerformanceProjects,
            mediumPerformanceProjects,
            lowPerformanceProjects,
            highPerformancePercentage: (highPerformanceProjects / totalProjects) * 100,
            mediumPerformancePercentage: (mediumPerformanceProjects / totalProjects) * 100,
            lowPerformancePercentage: (lowPerformanceProjects / totalProjects) * 100,
            averagePerformanceScore: ((highPerformanceProjects * 3 + mediumPerformanceProjects * 2 + lowPerformanceProjects * 1) / totalProjects)
        };
    };

    // 分析协作模式
    const analyzeCollaborationPatterns = (projectsMetrics) => {
        let soloProjects = 0;
        let smallTeamProjects = 0;
        let mediumTeamProjects = 0;
        let largeTeamProjects = 0;
        
        Object.entries(projectsMetrics).forEach(([name, metrics]) => {
            if (!metrics || metrics.length === 0) return;
            
            const latest = metrics[metrics.length - 1];
            const contributors = latest.contributors || 0;
            
            if (contributors <= 1) soloProjects++;
            else if (contributors <= 5) smallTeamProjects++;
            else if (contributors <= 20) mediumTeamProjects++;
            else largeTeamProjects++;
        });
        
        const totalProjects = Object.keys(projectsMetrics).length;
        
        return {
            soloProjects,
            smallTeamProjects,
            mediumTeamProjects,
            largeTeamProjects,
            soloPercentage: (soloProjects / totalProjects) * 100,
            smallTeamPercentage: (smallTeamProjects / totalProjects) * 100,
            mediumTeamPercentage: (mediumTeamProjects / totalProjects) * 100,
            largeTeamPercentage: (largeTeamProjects / totalProjects) * 100,
            averageTeamSize: Object.values(projectsMetrics).reduce((total, metrics) => {
                if (metrics && metrics.length > 0) {
                    return total + (metrics[metrics.length - 1].contributors || 0);
                }
                return total;
            }, 0) / totalProjects
        };
    };

    // 计算创新指数
    const calculateInnovationIndex = (projectsList, projectsMetrics) => {
        let totalInnovationScore = 0;
        let validProjects = 0;
        
        projectsList.forEach(project => {
            const metrics = projectsMetrics[project.full_name];
            if (!metrics || metrics.length === 0) return;
            
            let innovationScore = 0;
            const latest = metrics[metrics.length - 1];
            
            // 技术新颖性
            const description = (project.description || '').toLowerCase();
            const innovativeKeywords = ['ai', 'ml', 'transformer', 'diffusion', 'neural', 'deep', 'learning'];
            const noveltyScore = innovativeKeywords.filter(keyword => description.includes(keyword)).length;
            innovationScore += noveltyScore * 10;
            
            // 项目活跃度
            const daysSinceUpdate = (Date.now() - new Date(latest.updated_at || Date.now())) / (1000 * 60 * 60 * 24);
            if (daysSinceUpdate < 30) innovationScore += 20;
            else if (daysSinceUpdate < 90) innovationScore += 10;
            
            // 社区参与度
            const contributors = latest.contributors || 0;
            if (contributors > 20) innovationScore += 30;
            else if (contributors > 10) innovationScore += 20;
            else if (contributors > 5) innovationScore += 10;
            
            // 增长潜力
            if (metrics.length >= 2) {
                const current = metrics[metrics.length - 1];
                const previous = metrics[metrics.length - 2];
                if (previous.stars > 0) {
                    const growth = ((current.stars - previous.stars) / previous.stars) * 100;
                    if (growth > 20) innovationScore += 25;
                    else if (growth > 10) innovationScore += 15;
                    else if (growth > 5) innovationScore += 10;
                }
            }
            
            totalInnovationScore += innovationScore;
            validProjects++;
        });
        
        return {
            overallInnovationIndex: validProjects > 0 ? totalInnovationScore / validProjects : 0,
            innovativeProjectsCount: validProjects,
            innovationTrend: 'increasing' // 可以根据历史数据计算
        };
    };

    // 生成语言图表
    const generateLanguageChart = () => {
        if (!insights.languageTrends || insights.languageTrends.length === 0) return null;
        
        const data = insights.languageTrends.slice(0, 10);
        
        return {
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return `${params.name}<br/>
                            项目数量: ${params.value}<br/>
                            增长率: ${params.data.growth.toFixed(1)}%<br/>
                            平均Stars: ${params.data.averageStars.toFixed(0)}`;
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                textStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: '编程语言分布',
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
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: data.map(lang => ({
                        name: lang.language,
                        value: lang.count,
                        growth: lang.growth,
                        averageStars: lang.averageStars
                    }))
                }
            ]
        };
    };

    // 处理标签页变化
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // 处理刷新
    const handleRefresh = () => {
        setLastUpdated(new Date());
        window.location.reload();
    };

    // 导出报告
    const handleExport = () => {
        const exportData = {
            timestamp: new Date().toISOString(),
            timeRange,
            selectedMetric,
            insights,
            summary: {
                totalProjects: projects.length,
                languageTrends: insights.languageTrends?.length || 0,
                emergingTechnologies: insights.emergingTechnologies?.length || 0,
                riskFactors: insights.riskFactors?.length || 0
            }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecosystem-insights-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
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
                                <InsightsIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                                        生态系统洞察
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        深度分析 · 趋势预测 · 智能洞察 · 战略决策
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                                    onClick={handleRefresh}
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
                                    onClick={handleExport}
                                    sx={{ 
                                        borderColor: 'white', 
                                        color: 'white',
                                        '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    导出报告
                                </Button>
                            </Box>
                        </Box>
                        
                        {/* 控制面板 */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ color: 'white' }}>时间范围</InputLabel>
                                <Select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    sx={{ 
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                                        '& .MuiSvgIcon-root': { color: 'white' }
                                    }}
                                >
                                    <MenuItem value="3months">3个月</MenuItem>
                                    <MenuItem value="6months">6个月</MenuItem>
                                    <MenuItem value="1year">1年</MenuItem>
                                    <MenuItem value="all">全部</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ color: 'white' }}>分析维度</InputLabel>
                                <Select
                                    value={selectedMetric}
                                    onChange={(e) => setSelectedMetric(e.target.value)}
                                    sx={{ 
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                                        '& .MuiSvgIcon-root': { color: 'white' }
                                    }}
                                >
                                    <MenuItem value="all">全部维度</MenuItem>
                                    <MenuItem value="technology">技术趋势</MenuItem>
                                    <MenuItem value="community">社区动态</MenuItem>
                                    <MenuItem value="risk">风险分析</MenuItem>
                                    <MenuItem value="innovation">创新指数</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <TextField
                                size="small"
                                placeholder="搜索洞察..."
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
                            
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showAdvancedInsights}
                                        onChange={(e) => setShowAdvancedInsights(e.target.checked)}
                                        sx={{ 
                                            '& .MuiSwitch-switchBase.Mui-checked': { color: 'white' },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'rgba(255,255,255,0.3)' }
                                        }}
                                    />
                                }
                                label="高级洞察"
                                sx={{ color: 'white' }}
                            />
                        </Box>
                        
                        {/* 更新时间 */}
                        <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                            最后更新: {lastUpdated.toLocaleString()}
                            {autoRefresh && ' · 自动刷新: 每5分钟'}
                        </Typography>
                    </Paper>

                    {/* 标签页导航 */}
                    <Paper elevation={0} sx={{ mb: 4, borderRadius: 2 }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ 
                                '& .MuiTab-root': { 
                                    minWidth: 120,
                                    fontWeight: 500,
                                    textTransform: 'none'
                                }
                            }}
                        >
                            <Tab icon={<LanguageIcon />} label="语言生态" />
                            <Tab icon={<CodeIcon />} label="开发模式" />
                            <Tab icon={<AutoFixHighIcon />} label="新兴技术" />
                            <Tab icon={<GroupIcon />} label="社区动态" />
                            <Tab icon={<SecurityIcon />} label="风险分析" />
                            <Tab icon={<PsychologyIcon />} label="未来展望" />
                            {showAdvancedInsights && <Tab icon={<AssessmentIcon />} label="高级分析" />}
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
                            {/* 语言生态 */}
                            {tabValue === 0 && (
                                <Fade in={true}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={8}>
                                            <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                <CardHeader 
                                                    title="编程语言分布" 
                                                    action={
                                                        <IconButton onClick={() => setFullscreenChart('language')}>
                                                            <FullscreenIcon />
                                                        </IconButton>
                                                    }
                                                />
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
                                            <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                <CardHeader title="语言增长排行" />
                                                <CardContent>
                                                    <List>
                                                        {insights.languageTrends?.slice(0, 8).map((lang, index) => (
                                                            <ListItem key={index} sx={{ px: 0 }}>
                                                                <ListItemAvatar>
                                                                    <Avatar sx={{ bgcolor: `hsl(${200 + index * 30}, 70%, 60%)` }}>
                                                                        <LanguageIcon />
                                                                    </Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={lang.language}
                                                                    secondary={
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                                            <Chip 
                                                                                label={`${lang.growth > 0 ? '+' : ''}${lang.growth.toFixed(1)}%`}
                                                                                size="small"
                                                                                color={lang.growth > 0 ? 'success' : lang.growth < 0 ? 'error' : 'default'}
                                                                            />
                                                                            <Typography variant="body2" color="text.secondary">
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
                                </Fade>
                            )}

                            {/* 开发模式 */}
                            {tabValue === 1 && (
                                <Fade in={true}>
                                    <Grid container spacing={3}>
                                        {insights.developmentPatterns?.map((pattern, index) => (
                                            <Grid item xs={12} md={6} key={index}>
                                                <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                                <CodeIcon />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="h6">{pattern.pattern}</Typography>
                                                                <Chip 
                                                                    label={pattern.impact === 'high' ? '高影响' : pattern.impact === 'medium' ? '中等影响' : '低影响'}
                                                                    size="small"
                                                                    color={pattern.impact === 'high' ? 'error' : pattern.impact === 'medium' ? 'warning' : 'success'}
                                                                />
                                                            </Box>
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            {pattern.description}
                                                        </Typography>
                                                        <Box>
                                                            <Typography variant="body2" gutterBottom>
                                                                普及率: {pattern.prevalence.toFixed(1)}%
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
                                </Fade>
                            )}

                            {/* 新兴技术 */}
                            {tabValue === 2 && (
                                <Fade in={true}>
                                    <Grid container spacing={3}>
                                        {insights.emergingTechnologies?.map((tech, index) => (
                                            <Grid item xs={12} md={6} key={index}>
                                                <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                                <AutoFixHighIcon />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="h6">{tech.name}</Typography>
                                                                <Chip 
                                                                    label={tech.potential === 'very_high' ? '极高潜力' : tech.potential === 'high' ? '高潜力' : tech.potential === 'medium' ? '中等潜力' : '低潜力'}
                                                                    size="small"
                                                                    color={tech.potential === 'very_high' || tech.potential === 'high' ? 'success' : 'primary'}
                                                                />
                                                            </Box>
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            {tech.description}
                                                        </Typography>
                                                        <Box>
                                                            <Typography variant="body2" gutterBottom>
                                                                采用率: {tech.adoptionRate.toFixed(1)}%
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
                                </Fade>
                            )}

                            {/* 社区动态 */}
                            {tabValue === 3 && insights.communityGrowth && (
                                <Fade in={true}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={8}>
                                            <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                <CardHeader title="社区增长指标" />
                                                <CardContent>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={6} md={3}>
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <Typography variant="h4" color="primary.main">
                                                                    {insights.communityGrowth.totalContributors?.toLocaleString() || 0}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    总贡献者
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={6} md={3}>
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <Typography variant="h4" color="success.main">
                                                                    {insights.communityGrowth.monthlyGrowth?.toFixed(1) || 0}%
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    月增长率
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={6} md={3}>
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <Typography variant="h4" color="warning.main">
                                                                    {insights.communityGrowth.activeProjects || 0}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    活跃项目
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={6} md={3}>
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <Typography variant="h4" color="info.main">
                                                                    {insights.communityGrowth.retentionRate?.toFixed(1) || 0}%
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
                                        <Grid item xs={12} md={4}>
                                            <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                <CardHeader title="参与度分析" />
                                                <CardContent>
                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            参与度评分
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={insights.communityGrowth.engagementScore || 0} 
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            {insights.communityGrowth.engagementScore?.toFixed(1) || 0} / 100
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            多样性指数
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={insights.communityGrowth.diversityIndex || 0} 
                                                            color="secondary"
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            {insights.communityGrowth.diversityIndex?.toFixed(1) || 0} / 100
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Fade>
                            )}

                            {/* 风险分析 */}
                            {tabValue === 4 && (
                                <Fade in={true}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Card elevation={0} sx={{ borderRadius: 2 }}>
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
                                                                        <TableCell>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                {risk.severity === 'high' && <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />}
                                                                                {risk.severity === 'medium' && <WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} />}
                                                                                {risk.severity === 'low' && <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />}
                                                                                {risk.factor}
                                                                            </Box>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Chip 
                                                                                label={risk.severity === 'high' ? '高' : risk.severity === 'medium' ? '中' : '低'}
                                                                                size="small"
                                                                                color={
                                                                                    risk.severity === 'high' ? 'error' :
                                                                                    risk.severity === 'medium' ? 'warning' : 'success'
                                                                                }
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge 
                                                                                badgeContent={risk.affectedProjects} 
                                                                                color={risk.severity === 'high' ? 'error' : risk.severity === 'medium' ? 'warning' : 'success'}
                                                                            >
                                                                                <Typography variant="body2">
                                                                                    {risk.affectedProjects}
                                                                                </Typography>
                                                                            </Badge>
                                                                        </TableCell>
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
                                </Fade>
                            )}

                            {/* 未来展望 */}
                            {tabValue === 5 && (
                                <Fade in={true}>
                                    <Grid container spacing={3}>
                                        {insights.futureOutlook?.map((prediction, index) => (
                                            <Grid item xs={12} md={6} key={index}>
                                                <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
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
                                </Fade>
                            )}

                            {/* 高级分析 */}
                            {tabValue === 6 && showAdvancedInsights && (
                                <Fade in={true}>
                                    <Grid container spacing={3}>
                                        {/* 技术债务分析 */}
                                        <Grid item xs={12} md={4}>
                                            <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                <CardHeader title="技术债务分析" />
                                                <CardContent>
                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            整体债务评分
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={insights.technicalDebt?.overallDebtScore || 0} 
                                                            color="warning"
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            {insights.technicalDebt?.overallDebtScore?.toFixed(1) || 0} / 100
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        高债务项目: {insights.technicalDebt?.highDebtProjects || 0}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        中等债务项目: {insights.technicalDebt?.mediumDebtProjects || 0}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        低债务项目: {insights.technicalDebt?.lowDebtProjects || 0}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        {/* 安全分析 */}
                                        <Grid item xs={12} md={4}>
                                            <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                <CardHeader title="安全态势分析" />
                                                <CardContent>
                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            整体安全评分
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={insights.securityAnalysis?.overallSecurityScore || 0} 
                                                            color="success"
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            {insights.securityAnalysis?.overallSecurityScore?.toFixed(1) || 0} / 100
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        安全项目: {insights.securityAnalysis?.secureProjects || 0}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        安全关注项目: {insights.securityAnalysis?.securityFocusedProjects || 0}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        风险项目: {insights.securityAnalysis?.vulnerableProjects || 0}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        {/* 创新指数 */}
                                        <Grid item xs={12} md={4}>
                                            <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
                                                <CardHeader title="创新指数" />
                                                <CardContent>
                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            整体创新指数
                                                        </Typography>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={insights.innovationIndex?.overallInnovationIndex || 0} 
                                                            color="primary"
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            {insights.innovationIndex?.overallInnovationIndex?.toFixed(1) || 0} / 100
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        创新项目数: {insights.innovationIndex?.innovativeProjectsCount || 0}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        创新趋势: {insights.innovationIndex?.innovationTrend === 'increasing' ? '上升' : '稳定'}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Fade>
                            )}
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default Insights; 