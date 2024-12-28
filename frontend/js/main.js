import { ProjectManager } from './modules/ProjectManager.js';
import { DataService } from './modules/DataService.js';
import { TimeService } from './modules/TimeService.js';
import { ParticlesService } from './modules/ParticlesService.js';
import { ChartService } from './modules/ChartService.js';
import { RadarChart } from './radar.js';

// 将需要的函数挂载到全局
window.getAllProjectsData = DataService.getAllProjectsData;
window.initCharts = ChartService.initCharts;

// 初始化函数
async function init() {
    try {
        // 更新时间
        TimeService.startTimeUpdate();
        
        // 初始化背景
        ParticlesService.initParticles();
        
        // 初始化项目管理器
        window.projectManager = new ProjectManager();
        
        // 初始化雷达图实例（保存为全局变量）
        window.radarChart = new RadarChart('radar-chart');
        
        // 加载数据
        const projectsData = await DataService.getAllProjectsData();
        console.log('Loaded project data:', projectsData);
        
        // 初始化图表
        if (projectsData) {
            ChartService.initCharts(projectsData);
            window.radarChart.updateChart(projectsData);
        } else {
            console.error('Failed to load project data');
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);