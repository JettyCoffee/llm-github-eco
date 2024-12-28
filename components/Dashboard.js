// components/Dashboard.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChartCard from './ChartCard';
import Metrics from './Metrics';
import GithubTable from './GithubTable';
import { ChartService } from '../utils/ChartService';
import { getDeepestProjects } from '../utils/helpers'; // 导入辅助函数

const Dashboard = () => {
    const [addedProjects, setAddedProjects] = useState([]); // 用户添加的项目
    const [projectsData, setProjectsData] = useState({}); // 各项目的数据
    const [chartOptions, setChartOptions] = useState({}); // 各图表的配置

    /**
     * 添加新项目
     * @param {string} projectName - 项目路径
     */
    const handleAddProject = async (projectName) => {
        if (addedProjects.includes(projectName)) {
            alert('该项目已添加');
            return;
        }

        try {
            // 获取该项目的数据
            const projectData = await fetchProjectData(projectName);
            if (projectData) {
                setAddedProjects([...addedProjects, projectName]);
                setProjectsData((prevData) => ({
                    ...prevData,
                    [projectName]: projectData,
                }));
            } else {
                alert('未找到该项目的数据');
            }
        } catch (error) {
            console.error('Error adding project:', error);
            alert('添加项目时发生错误');
        }
    };

    /**
     * 获取项目的数据
     * @param {string} projectName - 项目路径
     * @returns {Object|null} - 项目数据或 null
     */
    const fetchProjectData = async (projectName) => {
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

        return projectData;
    };

    /**
     * 初始化图表
     */
    useEffect(() => {
        if (addedProjects.length > 0 && Object.keys(projectsData).length > 0) {
            // 初始化图表配置
            ChartService.initCharts(addedProjects, projectsData);
            // 获取生成的图表配置
            const options = ChartService.getChartOptions();
            setChartOptions(options);
        }
    }, [addedProjects, projectsData]);

    return (
        <div className="dashboard-container">
            <Header onAddProject={handleAddProject} />

            {/* 左侧面板 */}
            <div className="left-panel">
                <ChartCard title="PR处理效率" chartId="pr-efficiency-chart" chartOptions={chartOptions.prEfficiencyOptions} />
                <ChartCard title="OpenRank" chartId="openrank-chart" chartOptions={chartOptions.openRankOptions} />
            </div>

            {/* 中间面板 */}
            <div className="center-panel">
                <div className="card">
                    <Metrics projectsData={projectsData} />
                </div>
                <GithubTable projectsData={projectsData} />
            </div>

            {/* 右侧面板 */}
            <div className="right-panel">
                <ChartCard title="关注度" chartId="attention-chart" chartOptions={chartOptions.attentionOptions} />
                <ChartCard title="开发者活跃度" chartId="developer-activity-chart" chartOptions={chartOptions.developerActivityOptions} />
                <ChartCard title="项目活跃度" chartId="project-activity-chart" chartOptions={chartOptions.projectActivityOptions} />
                {/* 已删除问题解决时间图表 */}
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;
