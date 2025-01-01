// components/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { ProjectContext } from '../contexts/ProjectContext';
import Footer from './Footer';
import ChartCard from './ChartCard';
import { ChartService } from '../utils/ChartService';
import {
    Container,
    Grid,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Popover
} from '@mui/material';
import ProjectInfo from './ProjectInfo';
import Header from './Header';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// 计算代码质量与可维护性评分
const calculateCodeQualityScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data) return;

        let score = 0;
        let metrics = 0;

        // 1. PR 质量 (40分)
        if (data.change_requests?.length > 0 && data.change_requests_accepted?.length > 0) {
            const totalPRs = data.change_requests[data.change_requests.length - 1].value;
            const acceptedPRs = data.change_requests_accepted[data.change_requests_accepted.length - 1].value;
            const acceptRate = totalPRs > 0 ? (acceptedPRs / totalPRs) * 40 : 0;
            score += acceptRate;
            metrics++;
        }

        // 2. 代码审查效率 (30分)
        if (data.change_request_resolution_duration?.length > 0) {
            const resolutionTime = data.change_request_resolution_duration[data.change_request_resolution_duration.length - 1].value;
            score += Math.max(0, 30 * (1 - resolutionTime / (7 * 24 * 60))); // 一周内处理完成
            metrics++;
        }

        // 3. Issue 解决质量 (30分)
        if (data.issue_resolution_duration?.length > 0) {
            const resolutionTime = data.issue_resolution_duration[data.issue_resolution_duration.length - 1].value;
            score += Math.max(0, 30 * (1 - resolutionTime / (14 * 24 * 60))); // 两周内解决
            metrics++;
        }

        if (metrics > 0) {
            totalScore += (score / metrics);
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalScore / projectCount) : 0;
};

// 计算社区活跃度评分
const calculateCommunityScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data) return;

        let score = 0;
        let metrics = 0;

        // 1. 贡献者多样性 (40分)
        if (data.bus_factor?.length > 0) {
            const busFactor = data.bus_factor[data.bus_factor.length - 1].value;
            score += Math.min(busFactor * 8, 40); // 每0.125提升1分
            metrics++;
        }

        // 2. 新贡献者增长 (30分)
        if (data.new_contributors?.length > 0) {
            const newContributors = data.new_contributors[data.new_contributors.length - 1].value;
            score += Math.min(newContributors * 6, 30); // 每5位新贡献者得满分
            metrics++;
        }

        // 3. 社区响应度 (30分)
        if (data.issue_response_time?.length > 0) {
            const responseTime = data.issue_response_time[data.issue_response_time.length - 1].value;
            score += Math.max(0, 30 * (1 - responseTime / (24 * 60))); // 24小时内响应
            metrics++;
        }

        if (metrics > 0) {
            totalScore += (score / metrics);
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalScore / projectCount) : 0;
};

// 计算项目影响力评分
const calculateImpactScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data) return;

        let score = 0;
        let metrics = 0;

        // 1. Stars 增长 (40分)
        if (data.stars?.length >= 2) {
            const recentStars = data.stars.slice(-6);
            const growthRate = (recentStars[recentStars.length - 1].value - recentStars[0].value) / recentStars[0].value;
            score += Math.min(growthRate * 160, 40); // 25%增长率得满分
            metrics++;
        }

        // 2. 技术影响力 (30分)
        if (data.attention?.length >= 2) {
            const recentAttention = data.attention.slice(-6);
            const growthRate = (recentAttention[recentAttention.length - 1].value - recentAttention[0].value) / recentAttention[0].value;
            score += Math.min(growthRate * 120, 30); // 25%增长率得满分
            metrics++;
        }

        // 3. Fork 转化率 (30分)
        if (data.technical_fork?.length > 0) {
            const forkRate = data.technical_fork[data.technical_fork.length - 1].value;
            score += Math.min(forkRate * 60, 30); // 每0.5%得1分
            metrics++;
        }

        if (metrics > 0) {
            totalScore += (score / metrics);
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalScore / projectCount) : 0;
};

// 计算项目维护评分
const calculateMaintenanceScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data?.activity?.length) return;

        // 获取最近6个月的活动数据
        const recentActivity = data.activity.slice(-6);
        
        // 1. 维护频率 (40分)
        const activityLevel = recentActivity[recentActivity.length - 1].value;
        const frequencyScore = Math.min(activityLevel / 2.5, 40);
        
        // 2. 稳定性 (30分)
        const values = recentActivity.map(item => item.value);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const stabilityScore = 30 * Math.exp(-variance / (mean * mean));
        
        // 3. 持续性 (30分)
        const growthRate = (values[values.length - 1] - values[0]) / values[0];
        const continuityScore = Math.min(growthRate * 120, 30);
        
        totalScore += frequencyScore + stabilityScore + continuityScore;
        projectCount++;
    });

    return projectCount > 0 ? Math.round(totalScore / projectCount) : 0;
};

const Dashboard = () => {
    const { selectedProjects } = useContext(ProjectContext);
    const [projectsData, setProjectsData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const handlePopoverOpen = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverContent('');
    };

    const open = Boolean(anchorEl);

    const algorithmExplanations = {
        codeQuality: `代码质量与可维护性评分算法：
• PR质量 (40分)：PR接受率，100%接受率得满分
• 代码审查效率 (30分)：一周内完成审查得满分
• Issue解决质量 (30分)：两周内解决问题得满分`,

        community: `社区活跃度与贡献评分算法：
• 贡献者多样性 (40分)：bus_factor每0.125提升1分
• 新贡献者增长 (30分)：每月5位新贡献者得满分
• 社区响应度 (30分)：24小时内响应得满分`,

        impact: `项目影响力与应用评分算法：
• Stars增长 (40分)：6个月增长率25%得满分
• 技术影响力 (30分)：6个月增长率25%得满分
• Fork转化率 (30分)：每0.5%得1分，最高30分`,

        maintenance: `项目维护与更新评分算法：
• 维护频率 (40分)：基于活动水平，每2.5得1分
• 稳定性 (30分)：基于活动波动率，越稳定分数越高
• 持续性 (30分)：6个月增长率25%得满分`
    };

    /**
     * 获取所有项目的数据
     */
    useEffect(() => {
        const fetchAllProjectsData = async () => {
            console.log('Starting to fetch data for projects:', selectedProjects);
            const allProjectsData = {};

            for (const projectName of selectedProjects) {
                try {
                    console.log(`Fetching data for ${projectName}...`);
                    // 分别编码组织名和仓库名
                    const [org, repo] = projectName.split('/');
                    if (!org || !repo) {
                        console.error(`Invalid project name format: ${projectName}`);
                        continue;
                    }
                    const encodedPath = `${encodeURIComponent(org)}/${encodeURIComponent(repo)}`;
                    const response = await fetch(`/api/data/${encodedPath}/all`);
                    console.log(`Response status for ${projectName}:`, response.status);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`Raw data for ${projectName}:`, data);
                        
                        // 将数据转换为时间序列格式
                        const formattedData = {};
                        Object.entries(data).forEach(([metricType, timeSeriesData]) => {
                            formattedData[metricType] = timeSeriesData.map(({ time, value }) => ({
                                time,
                                value: typeof value === 'number' ? value : parseFloat(value) || 0
                            })).sort((a, b) => a.time.localeCompare(b.time));
                        });

                        allProjectsData[projectName] = formattedData;
                        console.log(`Formatted data for ${projectName}:`, formattedData);
                    } else {
                        console.error(`Failed to load data for ${projectName}: ${response.status}`);
                        const errorText = await response.text();
                        console.error(`Error details for ${projectName}:`, errorText);
                        allProjectsData[projectName] = {};
                    }
                } catch (error) {
                    console.error(`Error loading data for ${projectName}:`, error);
                    allProjectsData[projectName] = {};
                }
            }

            console.log('Final all projects data:', allProjectsData);
            setProjectsData(allProjectsData);
            setLoadingData(false);
        };

        if (selectedProjects.length > 0) {
            console.log('Selected projects changed, fetching new data...');
            setLoadingData(true);
            fetchAllProjectsData();
        }
    }, [selectedProjects]);

    /**
     * 初始化图表
     */
    useEffect(() => {
        if (selectedProjects.length > 0 && Object.keys(projectsData).length > 0) {
            try {
                // 初始化图表配置
                ChartService.initCharts(selectedProjects, projectsData);
                // 获取生成的图表配置
                const options = ChartService.getChartOptions();
                console.log('Chart options:', options);
                setChartOptions(options);
            } catch (error) {
                console.error('Error initializing charts:', error);
            }
        }
    }, [selectedProjects, projectsData]);

    if (loadingData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="dashboard-container">
            <Header />
            <Box sx={{ mt: '64px' }}>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    {/* 项目信息栏 */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3, 
                            mb: 4,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {selectedProjects.map((project) => (
                                <ProjectInfo key={project} project={project} />
                            ))}
                        </Box>
                    </Paper>

                    {/* 核心指标行 */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            gap: 3, 
                            mb: 4,
                            flexWrap: 'wrap'
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                flex: '1 1 calc(25% - 18px)',
                                minWidth: '200px',
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                                }
                            }}
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.codeQuality)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    代码质量与可维护性
                                </Typography>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        ml: 1, 
                                        fontSize: 16, 
                                        color: 'text.secondary',
                                        opacity: 0.7
                                    }} 
                                />
                            </Box>
                            <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 500 }}>
                                {calculateCodeQualityScore(projectsData)}/100
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: '1 1 calc(25% - 18px)',
                                minWidth: '200px',
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                                }
                            }}
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.community)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    社区活跃度与贡献
                                </Typography>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        ml: 1, 
                                        fontSize: 16, 
                                        color: 'text.secondary',
                                        opacity: 0.7
                                    }} 
                                />
                            </Box>
                            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                {calculateCommunityScore(projectsData)}/100
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: '1 1 calc(25% - 18px)',
                                minWidth: '200px',
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                                }
                            }}
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.impact)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    项目影响力与应用
                                </Typography>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        ml: 1, 
                                        fontSize: 16, 
                                        color: 'text.secondary',
                                        opacity: 0.7
                                    }} 
                                />
                            </Box>
                            <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 500 }}>
                                {calculateImpactScore(projectsData)}/100
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                flex: '1 1 calc(25% - 18px)',
                                minWidth: '200px',
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                                }
                            }}
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.maintenance)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    项目维护与更新
                                </Typography>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        ml: 1, 
                                        fontSize: 16, 
                                        color: 'text.secondary',
                                        opacity: 0.7
                                    }} 
                                />
                            </Box>
                            <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 500 }}>
                                {calculateMaintenanceScore(projectsData)}/100
                            </Typography>
                        </Paper>
                    </Box>

                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        PaperProps={{
                            sx: {
                                p: 2,
                                maxWidth: 300,
                                bgcolor: 'background.paper',
                                boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                                '& .MuiTypography-root': {
                                    whiteSpace: 'pre-line'
                                }
                            }
                        }}
                    >
                        <Typography variant="body2">
                            {popoverContent}
                        </Typography>
                    </Popover>

                    {/* 图表区域 */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {/* 项目关注度图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="project-attention-chart" chartOptions={chartOptions.projectAttentionOptions} />
                        </Box>

                        {/* OpenRank 图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="openrank-chart" chartOptions={chartOptions.openRankOptions} />
                        </Box>

                        {/* 代码变更行为图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="code-change-behavior-chart" chartOptions={chartOptions.codeChangeBehaviorOptions} />
                        </Box>

                        {/* PR 情况图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="pr-situation-chart" chartOptions={chartOptions.prSituationOptions} />
                        </Box>

                        {/* Issue 变化图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="issue-changes-chart" chartOptions={chartOptions.issueChangesOptions} />
                        </Box>

                        {/* 项目活跃度图表 */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <ChartCard chartId="project-activity-chart" chartOptions={chartOptions.projectActivityOptions} />
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Footer />

            <style jsx global>{`
                body {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    background-color: #ffffff;
                }
                .dashboard-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
