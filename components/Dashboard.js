// components/Dashboard.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChartCard from './ChartCard';
import Metrics from './Metrics';
import GithubTable from './GithubTable';
import RadarChart from './RadarChart';
import ParticlesBackground from './ParticlesBackground';
import { ChartService } from '../utils/ChartService';

const Dashboard = () => {
  const [addedProjects, setAddedProjects] = useState([]);
  const [projectsData, setProjectsData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

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
      'code_change_lines_add' // 添加您需要的数据类型
    ];

    const projectData = {};

    for (const dataType of dataTypes) {
      try {
        const response = await fetch(`/api/data/${projectName}/${dataType}`);
        if (response.ok) {
          const data = await response.json();
          projectData[dataType] = data;
          console.log(`Loaded ${dataType} data for ${projectName}:`, data); // 添加日志
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

  useEffect(() => {
    // 生成图表配置
    const options = ChartService.initCharts(projectsData);
    setChartOptions(options);
  }, [projectsData]);

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
        <ChartCard title="问题解决时间" chartId="issue-resolution-duration-chart" chartOptions={chartOptions.issueResolutionDurationOptions} />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
