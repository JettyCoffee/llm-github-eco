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

// 计算可持续性评分
const calculateSustainabilityScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data) return;

        let score = 0;
        let metrics = 0;

        // 1. 贡献者多样性 (bus_factor)
        if (data.bus_factor?.length > 0) {
            const latestBusFactor = data.bus_factor[data.bus_factor.length - 1].value;
            score += Math.min(latestBusFactor * 20, 25); // 最高25分
            metrics++;
        }

        // 2. 新贡献者增长 (new_contributors)
        if (data.new_contributors?.length > 0) {
            const latestNewContributors = data.new_contributors[data.new_contributors.length - 1].value;
            score += Math.min(latestNewContributors * 5, 25); // 最高25分
            metrics++;
        }

        // 3. Issue 响应时间 (issue_response_time)
        if (data.issue_response_time?.length > 0) {
            const latestResponseTime = data.issue_response_time[data.issue_response_time.length - 1].value;
            score += Math.max(0, 25 * (1 - latestResponseTime / (24 * 60))); // 最高25分，24小时内响应
            metrics++;
        }

        // 4. PR 处理效率 (change_request_resolution_duration)
        if (data.change_request_resolution_duration?.length > 0) {
            const latestResolutionTime = data.change_request_resolution_duration[data.change_request_resolution_duration.length - 1].value;
            score += Math.max(0, 25 * (1 - latestResolutionTime / (7 * 24 * 60))); // 最高25分，一周内处理
            metrics++;
        }

        if (metrics > 0) {
            totalScore += (score / metrics);
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalScore / projectCount) : 0;
};

// 计算关注度趋势
const calculateAttentionTrend = (projectsData) => {
    let totalTrend = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data) return;

        let trend = 0;
        let metrics = 0;

        // 1. Stars 增长趋势
        if (data.stars?.length >= 2) {
            const recentStars = data.stars.slice(-6);
            const growthRate = (recentStars[recentStars.length - 1].value - recentStars[0].value) / recentStars[0].value;
            trend += Math.min(growthRate * 100, 25);
            metrics++;
        }

        // 2. 技术关注度趋势
        if (data.attention?.length >= 2) {
            const recentAttention = data.attention.slice(-6);
            const growthRate = (recentAttention[recentAttention.length - 1].value - recentAttention[0].value) / recentAttention[0].value;
            trend += Math.min(growthRate * 100, 25);
            metrics++;
        }

        // 3. Issue 活跃度
        if (data.issues_new?.length > 0 && data.issues_closed?.length > 0) {
            const issueActivity = (data.issues_new[data.issues_new.length - 1].value + 
                                 data.issues_closed[data.issues_closed.length - 1].value) / 2;
            trend += Math.min(issueActivity * 5, 25);
            metrics++;
        }

        // 4. PR 活跃度
        if (data.change_requests?.length > 0) {
            const prActivity = data.change_requests[data.change_requests.length - 1].value;
            trend += Math.min(prActivity * 5, 25);
            metrics++;
        }

        if (metrics > 0) {
            totalTrend += (trend / metrics);
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalTrend / projectCount) : 0;
};

// 计算发展度趋势
const calculateDevelopmentTrend = (projectsData) => {
    let totalTrend = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data) return;

        let trend = 0;
        let metrics = 0;

        // 1. 代码变更量
        if (data.code_change_lines_add?.length > 0 && data.code_change_lines_remove?.length > 0) {
            const addLines = data.code_change_lines_add[data.code_change_lines_add.length - 1].value;
            const removeLines = data.code_change_lines_remove[data.code_change_lines_remove.length - 1].value;
            const codeActivity = (addLines + removeLines) / 2;
            trend += Math.min(codeActivity / 1000, 25); // 每1000行代码变更满分
            metrics++;
        }

        // 2. PR 接受率
        if (data.change_requests?.length > 0 && data.change_requests_accepted?.length > 0) {
            const totalPRs = data.change_requests[data.change_requests.length - 1].value;
            const acceptedPRs = data.change_requests_accepted[data.change_requests_accepted.length - 1].value;
            const acceptRate = totalPRs > 0 ? (acceptedPRs / totalPRs) * 25 : 0;
            trend += acceptRate;
            metrics++;
        }

        // 3. Issue 解决率
        if (data.issues_new?.length > 0 && data.issues_closed?.length > 0) {
            const newIssues = data.issues_new[data.issues_new.length - 1].value;
            const closedIssues = data.issues_closed[data.issues_closed.length - 1].value;
            const resolveRate = newIssues > 0 ? (closedIssues / newIssues) * 25 : 0;
            trend += resolveRate;
            metrics++;
        }

        // 4. 活跃度趋势
        if (data.activity?.length >= 2) {
            const recentActivity = data.activity.slice(-6);
            const growthRate = (recentActivity[recentActivity.length - 1].value - recentActivity[0].value) / recentActivity[0].value;
            trend += Math.min(growthRate * 100, 25);
            metrics++;
        }

        if (metrics > 0) {
            totalTrend += (trend / metrics);
            projectCount++;
        }
    });

    return projectCount > 0 ? Math.round(totalTrend / projectCount) : 0;
};

// 计算 OpenRank 综合评分
const calculateOpenRankScore = (projectsData) => {
    let totalScore = 0;
    let projectCount = 0;

    Object.values(projectsData).forEach(data => {
        if (!data?.openrank?.length) return;

        // 获取最近6个月的 OpenRank 数据
        const recentOpenRank = data.openrank.slice(-6);
        
        // 1. 基础分数 (最新 OpenRank 值，最高40分)
        const baseScore = Math.min(recentOpenRank[recentOpenRank.length - 1].value / 2.5, 40);
        
        // 2. 增长趋势 (最高30分)
        const growthRate = (recentOpenRank[recentOpenRank.length - 1].value - recentOpenRank[0].value) / recentOpenRank[0].value;
        const trendScore = Math.min(growthRate * 100, 30);
        
        // 3. 稳定性 (波动率，最高30分)
        const values = recentOpenRank.map(item => item.value);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const stabilityScore = 30 * Math.exp(-variance / (mean * mean));
        
        totalScore += baseScore + trendScore + stabilityScore;
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
        sustainability: `可持续性评分算法：
• 贡献者多样性 (25分)：基于 bus_factor，每增加0.05提升1分
• 新贡献者增长 (25分)：每月新增5位贡献者可得满分
• Issue响应时间 (25分)：24小时内响应可得满分
• PR处理效率 (25分)：一周内处理完成可得满分`,

        attention: `关注度趋势算法：
• Stars增长趋势 (25分)：6个月增长率超25%得满分
• 技术关注度 (25分)：6个月增长率超25%得满分
• Issue活跃度 (25分)：每月5个活跃Issue得满分
• PR活跃度 (25分)：每月5个活跃PR得满分`,

        development: `发展度趋势算法：
• 代码变更量 (25分)：每月1000行代码变更得满分
• PR接受率 (25分)：PR接受率达到100%得满分
• Issue解决率 (25分)：Issue解决率达到100%得满分
• 活跃度趋势 (25分)：6个月增长率超25%得满分`,

        openrank: `OpenRank综合评分算法：
• 基础分数 (40分)：基于最新OpenRank值，每100分得16分
• 增长趋势 (30分)：6个月增长率超30%得满分
• 稳定性 (30分)：基于标准差计算波动率，波动越小分数越高`
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
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.sustainability)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    可持续性评分
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
                                {calculateSustainabilityScore(projectsData)}/100
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
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.attention)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    关注度趋势
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
                                {calculateAttentionTrend(projectsData)}/100
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
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.development)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    发展度趋势
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
                                {calculateDevelopmentTrend(projectsData)}/100
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
                            onClick={(e) => handlePopoverOpen(e, algorithmExplanations.openrank)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    OpenRank 综合评分
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
                                {calculateOpenRankScore(projectsData)}/100
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
