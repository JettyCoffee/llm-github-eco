export class RadarChart {
    constructor(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            // 确保容器尺寸正确
            container.style.width = '100%';
            container.style.height = '100%';
            this.chart = echarts.init(container, null, {
                renderer: 'canvas',
                useDirtyRect: false
            });
            this.initResizeListener(containerId);
        } else {
            console.error('Radar chart container not found:', containerId);
        }
    }

    // 初始化resize监听
    initResizeListener(containerId) {
        const container = document.getElementById(containerId);
        const resizeChart = () => {
            if (container && this.chart) {
                this.chart.resize();
            }
        };
        
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                resizeChart();
            });
            resizeObserver.observe(container);
        }
        window.addEventListener('resize', resizeChart);
    }

    // 计算中位数
    calculateMedian(data) {
        if (!data || !Object.keys(data).length) return 0;
        
        // 获取月度数据
        const monthlyValues = Object.entries(data)
            .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
            .map(([_, value]) => value)
            .sort((a, b) => a - b);
        
        if (monthlyValues.length === 0) return 0;
        
        const mid = Math.floor(monthlyValues.length / 2);
        
        if (monthlyValues.length % 2 === 0) {
            return (monthlyValues[mid - 1] + monthlyValues[mid]) / 2;
        } else {
            return monthlyValues[mid];
        }
    }

    // 更新图表数据
    updateChart(data) {
        if (!this.chart) {
            console.error('Radar chart not initialized');
            return;
        }

        const projects = window.projectManager.getProjects();
        if (!projects || projects.length === 0) {
            console.error('No projects available');
            return;
        }

        console.log('Updating radar chart with projects:', projects);
        
        // 为每个项目准备数据
        const seriesData = projects.map(project => {
            const projectData = data[project];
            if (!projectData) {
                console.warn(`No data for project: ${project}`);
                return null;
            }
            
            // 使用中位数计算各个指标
            const metrics = {
                stars: this.calculateMedian(projectData.stars),
                technical_fork: this.calculateMedian(projectData.technical_fork),
                new_contributors: this.calculateMedian(projectData.new_contributors),
                issues_closed: this.calculateMedian(projectData.issues_closed),
                change_requests_accepted: this.calculateMedian(projectData.change_requests_accepted)
            };

            console.log(`Metrics for ${project}:`, metrics);
            
            return {
                name: project.split('/')[1],
                value: [
                    metrics.stars,
                    metrics.technical_fork,
                    metrics.new_contributors,
                    metrics.issues_closed,
                    metrics.change_requests_accepted
                ]
            };
        }).filter(item => item !== null);

        if (seriesData.length === 0) {
            console.error('No valid data for radar chart');
            return;
        }

        // 计算最大值
        const maxValues = {
            stars: Math.max(...seriesData.map(item => item.value[0])) * 1.2 || 100,
            technical_fork: Math.max(...seriesData.map(item => item.value[1])) * 1.2 || 100,
            new_contributors: Math.max(...seriesData.map(item => item.value[2])) * 1.2 || 100,
            issues_closed: Math.max(...seriesData.map(item => item.value[3])) * 1.2 || 100,
            change_requests_accepted: Math.max(...seriesData.map(item => item.value[4])) * 1.2 || 100
        };

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item'
            },
            radar: {
                center: ['50%', '50%'],
                radius: '65%',
                indicator: [
                    { name: '星标数', max: maxValues.stars },
                    { name: '技术分叉', max: maxValues.technical_fork },
                    { name: '新贡献者', max: maxValues.new_contributors },
                    { name: '已解决问题', max: maxValues.issues_closed },
                    { name: '已接受PR', max: maxValues.change_requests_accepted }
                ],
                shape: 'circle',
                splitNumber: 5,
                axisName: {
                    color: '#7eb6ef'
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(0, 168, 255, 0.02)', 'rgba(0, 168, 255, 0.05)',
                               'rgba(0, 168, 255, 0.08)', 'rgba(0, 168, 255, 0.11)',
                               'rgba(0, 168, 255, 0.14)']
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(0, 168, 255, 0.3)'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(0, 168, 255, 0.2)'
                    }
                }
            },
            series: [{
                type: 'radar',
                data: seriesData,
                symbol: 'none',
                lineStyle: {
                    width: 2
                },
                areaStyle: {
                    opacity: 0.2
                },
                emphasis: {
                    lineStyle: {
                        width: 4
                    }
                }
            }]
        };

        console.log('Radar chart option:', option);
        
        try {
            this.chart.clear();
            this.chart.setOption(option, true);
        } catch (error) {
            console.error('Error updating radar chart:', error);
        }
    }
} 