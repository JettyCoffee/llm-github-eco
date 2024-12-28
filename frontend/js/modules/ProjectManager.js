import { DataService } from './DataService.js';
import { ChartService } from './ChartService.js';
import { RadarChart } from '../radar.js';

export class ProjectManager {
    constructor() {
        this.projects = [];
        this.charts = {};
        this.initProjects();
        this.initEventListeners();
    }

    // 从data文件夹加载项目列表
    async initProjects() {
        try {
            const response = await fetch('http://localhost:8080/frontend/data/folder_structure.json');
            if (response.ok) {
                const projectsList = await response.json();
                this.projects = projectsList.slice(0, 2);
                this.allProjects = projectsList;
                
                this.updateProjectSelect();
                
                // 使用 DataService
                const projectsData = await DataService.getAllProjectsData();
                if (projectsData) {
                    console.log('Initial project data loaded:', projectsData);
                    // 确保DOM已经完全加载
                    setTimeout(() => {
                        this.initializeAllCharts(projectsData);
                    }, 100);
                }
            } else {
                console.error('Failed to load projects list');
            }
        } catch (error) {
            console.error('Error loading projects list:', error);
        }
    }

    // 初始化所有图表
    initializeAllCharts(data) {
        // 保存雷达图实例
        if (!this.charts.radar) {
            this.charts.radar = new RadarChart('radar-chart');
        }
        this.charts.radar.updateChart(data);

        // 初始化其他图表
        ChartService.initCharts(data);
    }

    // 更新所有图表
    updateAllCharts(data) {
        console.log('Updating charts with data:', data);
        console.log('Current projects:', this.projects);

        // 更新雷达图
        if (this.charts.radar) {
            this.charts.radar.updateChart(data);
        }

        // 更新其他图表
        ChartService.initCharts(data);
    }

    // 更新选择框选项
    updateProjectSelect() {
        const projectSelect = document.getElementById('project-select');
        projectSelect.innerHTML = '<option value="">选择项目...</option>';
        
        // 只显示尚未添加的项目
        this.allProjects.forEach(project => {
            if (!this.projects.includes(project)) {
                const option = document.createElement('option');
                option.value = project;
                // 只显示项目名而不是完整路径
                const projectName = project.split('/')[1];
                option.textContent = projectName || project;
                projectSelect.appendChild(option);
            }
        });
    }

    initEventListeners() {
        const addButton = document.getElementById('add-project');
        const projectSelect = document.getElementById('project-select');

        addButton.addEventListener('click', async () => {
            const selectedProject = projectSelect.value;
            if (!selectedProject) {
                alert('请选择一个项目');
                return;
            }

            if (this.projects.includes(selectedProject)) {
                alert('该项目已添加');
                return;
            }

            try {
                console.log('Adding project:', selectedProject);
                this.projects.push(selectedProject);
                
                const projectsData = await getAllProjectsData();
                console.log('Loaded updated data:', projectsData);
                
                if (projectsData) {
                    // 使用新的更新方法
                    this.updateAllCharts(projectsData);
                    this.updateProjectSelect();
                    projectSelect.value = '';
                    
                    console.log('Successfully updated all charts');
                } else {
                    throw new Error('Failed to load project data');
                }
            } catch (error) {
                console.error('Error adding project:', error);
                this.projects = this.projects.filter(p => p !== selectedProject);
                alert('添加项目失败');
            }
        });
    }

    getProjects() {
        return this.projects;
    }
} 