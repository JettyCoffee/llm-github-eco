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
    CircularProgress
} from '@mui/material';

const Dashboard = () => {
    const { selectedProjects } = useContext(ProjectContext);
    const [projectsData, setProjectsData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loadingData, setLoadingData] = useState(true);

    /**
     * 获取所有项目的数据
     */
    useEffect(() => {
        const fetchAllProjectsData = async () => {
            const dataTypes = [
                'activity',
                'openrank',
                'stars',
                'technical_fork',
                'attention',
                'bus_factor',
                'new_contributors',
                'issues_closed',
                'issue_comments',
                'issues_new',
                'issue_response_time',
                'issue_resolution_duration',
                'change_requests_accepted',
                'change_requests',
                'change_requests_reviews',
                'change_request_response_time',
                'change_request_resolution_duration',
                'code_change_lines_remove',
                'code_change_lines_add'
            ];

            const allProjectsData = {};

            for (const projectName of selectedProjects) {
                const projectData = {};

                for (const dataType of dataTypes) {
                    try {
                        const response = await fetch(`/api/data/${encodeURIComponent(projectName)}/${dataType}`);
                        if (response.ok) {
                            const data = await response.json();
                            projectData[dataType] = data;
                            console.log(`Loaded ${dataType} data for ${projectName}:`, data);
                        } else {
                            console.error(`Failed to load ${dataType} data for ${projectName}: ${response.status}`);
                            projectData[dataType] = null;
                        }
                    } catch (error) {
                        console.error(`Error loading ${dataType} data for ${projectName}:`, error);
                        projectData[dataType] = null;
                    }
                }

                allProjectsData[projectName] = projectData;
            }

            setProjectsData(allProjectsData);
            setLoadingData(false);
        };

        if (selectedProjects.length > 0) {
            fetchAllProjectsData();
        }
    }, [selectedProjects]);

    /**
     * 初始化图表
     */
    useEffect(() => {
        if (selectedProjects.length > 0 && Object.keys(projectsData).length > 0) {
            // 初始化图表配置
            ChartService.initCharts(selectedProjects, projectsData);
            // 获取生成的图表配置
            const options = ChartService.getChartOptions();
            setChartOptions(options);
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
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* 项目信息栏 */}
                <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        项目信息
                    </Typography>
                    {selectedProjects.map((project) => (
                        <Box key={project} mb={2}>
                            <Typography variant="h6">{project.split('/').pop()}</Typography>
                            {/* 可以在此处添加更多项目信息，如描述、创建日期等 */}
                        </Box>
                    ))}
                </Paper>

                {/* 图表区域 */}
                <Grid container spacing={3}>
                    {/* PR 处理效率图表 */}
                    <Grid item xs={12} md={6}>
                        <ChartCard title="PR 处理效率" chartId="pr-efficiency-chart" chartOptions={chartOptions.prEfficiencyOptions} />
                    </Grid>

                    {/* OpenRank 图表 */}
                    <Grid item xs={12} md={6}>
                        <ChartCard title="OpenRank" chartId="openrank-chart" chartOptions={chartOptions.openRankOptions} />
                    </Grid>

                    {/* Issue 维度图表 */}
                    <Grid item xs={12} md={6}>
                        <ChartCard title="Issue 维度" chartId="issue-dimensions-chart" chartOptions={chartOptions.issueDimensionsOptions} />
                    </Grid>

                    {/* 代码变更行数图表 */}
                    <Grid item xs={12} md={6}>
                        <ChartCard title="代码变更行数" chartId="code-change-chart" chartOptions={chartOptions.codeChangeOptions} />
                    </Grid>

                    {/* 关注度图表 */}
                    <Grid item xs={12} md={6}>
                        <ChartCard title="关注度" chartId="attention-chart" chartOptions={chartOptions.attentionOptions} />
                    </Grid>

                    {/* 雷达图 */}
                    <Grid item xs={12} md={6}>
                        <ChartCard title="雷达图" chartId="radar-chart" chartOptions={chartOptions.radarOptions} />
                    </Grid>

                    {/* 数据栏图表 */}
                    <Grid item xs={12} md={6}>
                        <ChartCard title="数据栏" chartId="data-bars-chart" chartOptions={chartOptions.dataBarsOptions} />
                    </Grid>
                </Grid>
            </Container>

            {/* Footer */}
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
