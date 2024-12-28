// utils/ChartService.js
import * as echarts from 'echarts';

export class ChartService {
    static charts = {}; // 存储所有初始化的图表实例
    static chartOptions = {}; // 存储所有图表的配置选项

    /**
     * 初始化单个图表
     * @param {string} containerId - 图表容器的 ID
     * @returns {Object|null} - ECharts 实例或 null
     */
    static initializeChart(containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Container not found: ${containerId}`);
                return null;
            }

            // 如果图表实例已存在，先销毁它
            if (this.charts[containerId]) {
                this.charts[containerId].dispose();
            }

            const chart = echarts.init(container);
            this.charts[containerId] = chart;

            // 设置图表自适应
            const resizeChart = () => {
                if (container && chart) {
                    chart.resize();
                }
            };

            if (window.ResizeObserver) {
                const resizeObserver = new ResizeObserver(() => resizeChart());
                resizeObserver.observe(container);
            }

            window.addEventListener('resize', resizeChart);

            return chart;
        } catch (error) {
            console.error(`Error initializing chart ${containerId}:`, error);
            return null;
        }
    }

    /**
     * 初始化所有图表
     * @param {Array} projects - 项目路径数组
     * @param {Object} projectsData - 包含所有项目数据的对象
     */
    static initCharts(projects, projectsData) {
        if (typeof window === 'undefined') return; // 确保在客户端运行

        if (!projects || !Array.isArray(projects)) {
            console.error('Invalid projects list');
            return;
        }

        console.log('Initializing all charts with data:', projectsData);
        this.initPREfficiencyChart(projects, projectsData);
        this.initOpenRankChart(projects, projectsData);
        this.initAttentionChart(projects, projectsData);
        this.initDeveloperActivityChart(projects, projectsData);
        this.initProjectActivityChart(projects, projectsData);
        this.updateCoreData(projects, projectsData);
        this.initGithubTable(projects, projectsData);
    }

    /**
     * 获取所有图表的配置选项
     * @returns {Object} - 包含所有图表配置的对象
     */
    static getChartOptions() {
        return this.chartOptions;
    }

    /**
     * 初始化 PR 处理效率图表
     * @param {Array} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initPREfficiencyChart(projects, data) {
        const chart = this.initializeChart('pr-efficiency-chart');
        if (!chart) return;

        const series = [];
        const legendData = [];
        let xData = [];

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];
            const requests = projectData.change_requests || {};
            const duration = projectData.change_request_resolution_duration || {};

            const timePoints = Object.keys(requests);
            xData = [...new Set([...xData, ...timePoints])].sort();

            const displayName = this.getDisplayName(project);

            series.push({
                name: `${displayName} PR数量`,
                type: 'bar',
                stack: 'PR',
                data: xData.map(time => requests[time] || 0),
                itemStyle: {
                    color: `rgba(0, 168, 255, ${0.8 - index * 0.2})`
                }
            });

            series.push({
                name: `${displayName} 处理时长`,
                type: 'line',
                yAxisIndex: 1,
                data: xData.map(time => duration[time] || 0),
                itemStyle: {
                    color: `rgba(255, 215, 0, ${0.8 - index * 0.2})`
                }
            });

            legendData.push(`${displayName} PR数量`, `${displayName} 处理时长`);
        });

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: legendData,
                top: 30,
                textStyle: {
                    color: '#7eb6ef',
                },
            },
            grid: {
                top: '3%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xData,
                axisLabel: {
                    color: '#7eb6ef',
                    rotate: 45
                }
            },
            yAxis: [{
                type: 'value',
                name: 'PR数量',
                axisLabel: {
                    color: '#7eb6ef'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(126, 182, 239, 0.2)'
                    }
                }
            }, {
                type: 'value',
                name: '处理时长(天)',
                axisLabel: {
                    color: '#7eb6ef'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(126, 182, 239, 0.2)'
                    }
                }
            }],
            series: series
        };

        // 设置图表配置
        chart.setOption(option);

        // 保存图表配置
        this.chartOptions.prEfficiencyOptions = option;
    }

    /**
     * 初始化 OpenRank 图表
     * @param {Array} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initOpenRankChart(projects, data) {
        const chart = this.initializeChart('openrank-chart');
        if (!chart) return;

        const series = projects.map((project) => {
            const projectData = data[project]?.openrank || {};
            const timeData = Object.entries(projectData)
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .sort(([a], [b]) => a.localeCompare(b));

            return {
                name: this.getDisplayName(project),
                type: 'line',
                smooth: true,
                data: timeData.map(([_, value]) => value),
                lineStyle: {
                    width: 2
                },
                areaStyle: {
                    opacity: 0.2
                }
            };
        });

        const timeAxis = this.getCommonTimeAxis(data, 'openrank');

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: projects.map(project => this.getDisplayName(project)),
                top: 30,
                textStyle: {
                    color: '#7eb6ef',
                },
            },
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: timeAxis,
                axisLabel: {
                    color: '#7eb6ef',
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: 'OpenRank',
                axisLabel: {
                    color: '#7eb6ef'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(126, 182, 239, 0.2)'
                    }
                }
            },
            series: series
        };

        // 设置图表配置
        chart.setOption(option);

        // 保存图表配置
        this.chartOptions.openRankOptions = option;
    }

    /**
     * 初始化关注度图表
     * @param {Array} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initAttentionChart(projects, data) {
        const chart = this.initializeChart('attention-chart');
        if (!chart) return;

        const series = projects.map((project) => {
            const projectData = data[project]?.attention || {};
            const timeData = Object.entries(projectData)
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .sort(([a], [b]) => a.localeCompare(b));

            return {
                name: this.getDisplayName(project),
                type: 'line',
                smooth: true,
                data: timeData.map(([_, value]) => value),
                lineStyle: {
                    width: 2
                }
            };
        });

        const timeAxis = this.getCommonTimeAxis(data, 'attention');

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: projects.map(project => this.getDisplayName(project)),
                top: 30,
                textStyle: {
                    color: '#7eb6ef',
                },
            },
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: timeAxis,
                axisLabel: {
                    color: '#7eb6ef',
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: '关注度',
                axisLabel: {
                    color: '#7eb6ef'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(126, 182, 239, 0.2)'
                    }
                }
            },
            series: series
        };

        // 设置图表配置
        chart.setOption(option);

        // 保存图表配置
        this.chartOptions.attentionOptions = option;
    }

    /**
     * 初始化开发者活跃度图表
     * @param {Array} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initDeveloperActivityChart(projects, data) {
        const chart = this.initializeChart('developer-activity-chart');
        if (!chart) return;

        const series = projects.map((project) => {
            const projectData = data[project]?.new_contributors || {};
            const timeData = Object.entries(projectData)
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .sort(([a], [b]) => a.localeCompare(b));

            return {
                name: this.getDisplayName(project),
                type: 'line',
                smooth: true,
                data: timeData.map(([_, value]) => value),
                lineStyle: {
                    width: 2
                }
            };
        });

        const timeAxis = this.getCommonTimeAxis(data, 'new_contributors');

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: projects.map(project => this.getDisplayName(project)),
                top: 30,
                textStyle: {
                    color: '#7eb6ef',
                },
            },
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: timeAxis,
                axisLabel: {
                    color: '#7eb6ef',
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: '开发者活跃度',
                axisLabel: {
                    color: '#7eb6ef'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(126, 182, 239, 0.2)'
                    }
                }
            },
            series: series
        };

        // 设置图表配置
        chart.setOption(option);

        // 保存图表配置
        this.chartOptions.developerActivityOptions = option;
    }

    /**
     * 初始化项目活跃度图表
     * @param {Array} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initProjectActivityChart(projects, data) {
        const chart = this.initializeChart('project-activity-chart');
        if (!chart) return;

        const series = projects.map((project, index) => {
            const projectData = data[project]?.activity || {};
            const timeData = Object.entries(projectData)
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .sort(([a], [b]) => a.localeCompare(b));

            return {
                name: this.getDisplayName(project),
                type: 'line',
                smooth: true,
                data: timeData.map(([_, value]) => value),
                lineStyle: {
                    color: index === 0 ? '#00a8ff' : '#00ff00',
                    width: 2
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: index === 0 ? 'rgba(0, 168, 255, 0.3)' : 'rgba(0, 255, 0, 0.3)'
                    }, {
                        offset: 1,
                        color: index === 0 ? 'rgba(0, 168, 255, 0.1)' : 'rgba(0, 255, 0, 0.1)'
                    }])
                }
            };
        });

        const timeAxis = this.getCommonTimeAxis(data, 'activity');

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: projects.map(project => this.getDisplayName(project)),
                top: 30,
                textStyle: {
                    color: '#7eb6ef',
                },
            },
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: timeAxis,
                axisLabel: {
                    color: '#7eb6ef',
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: '项目活跃度',
                axisLabel: {
                    color: '#7eb6ef'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(126, 182, 239, 0.2)'
                    }
                }
            },
            series: series
        };

        // 设置图表配置
        chart.setOption(option);

        // 保存图表配置
        this.chartOptions.projectActivityOptions = option;
    }

    /**
     * 更新核心数据指标
     * @param {Array} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static updateCoreData(projects, data) {
        // Calculate average OpenRank
        let openrankSum = 0;
        let openrankCount = 0;

        // Calculate average developer activity
        let activitySum = 0;
        let activityCount = 0;

        projects.forEach(project => {
            const projectData = data[project];
            if (projectData) {
                // Get latest month data
                const openrankData = Object.entries(projectData.openrank || {})
                    .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                    .sort(([a], [b]) => b.localeCompare(a)); // Descending sort

                const activityData = Object.entries(projectData.activity || {})
                    .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                    .sort(([a], [b]) => b.localeCompare(a));

                if (openrankData.length > 0) {
                    openrankSum += openrankData[0][1];
                    openrankCount++;
                }

                if (activityData.length > 0) {
                    activitySum += activityData[0][1];
                    activityCount++;
                }
            }
        });

        // Calculate averages
        const openrankAvg = openrankCount ? (openrankSum / openrankCount).toFixed(2) : '0.00';
        const activityAvg = activityCount ? (activitySum / activityCount).toFixed(2) : '0.00';

        // Update display
        const openrankElement = document.getElementById('openrank-avg');
        const githubElement = document.getElementById('github-avg');

        if (openrankElement) openrankElement.textContent = openrankAvg;
        if (githubElement) githubElement.textContent = activityAvg;
    }

    /**
     * 初始化 GitHub 表格
     * @param {Array} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initGithubTable(projects, data) {
        const tableContainer = document.getElementById('github-table');
        if (!tableContainer) return;

        // 计算每个项目的指标
        const projectMetrics = projects.map(project => {
            const projectData = data[project];
            if (!projectData) return null;

            // 获取最新月度数据
            const getLatestMonthlyValue = (dataType) => {
                const dataObj = projectData[dataType] || {};
                const monthlyData = Object.entries(dataObj)
                    .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                    .sort(([a], [b]) => b.localeCompare(a)); // 降序排序

                return monthlyData.length ? monthlyData[0][1] : 0;
            };

            // 使用与雷达图相同的五个维度指标
            const metrics = {
                stars: getLatestMonthlyValue('stars'),
                technical_fork: getLatestMonthlyValue('technical_fork'),
                new_contributors: getLatestMonthlyValue('new_contributors'),
                issues_closed: getLatestMonthlyValue('issues_closed'),
                change_requests_accepted: getLatestMonthlyValue('change_requests_accepted')
            };

            return {
                project: this.getDisplayName(project),
                stars: metrics.stars.toFixed(2),
                technical_fork: metrics.technical_fork.toFixed(2),
                new_contributors: metrics.new_contributors.toFixed(2),
                issues_closed: metrics.issues_closed.toFixed(2),
                change_requests_accepted: metrics.change_requests_accepted.toFixed(2)
            };
        }).filter(item => item !== null);

        // 创建表格 HTML
        const tableHTML = `
            <table style="width:100%; color:#7eb6ef; border-collapse:collapse;">
                <thead>
                    <tr style="background:rgba(0,168,255,0.1);">
                        <th style="padding:10px; text-align:left;">项目名</th>
                        <th style="padding:10px; text-align:center;">星标数</th>
                        <th style="padding:10px; text-align:center;">技术分叉</th>
                        <th style="padding:10px; text-align:center;">新贡献者</th>
                        <th style="padding:10px; text-align:center;">已解决问题</th>
                        <th style="padding:10px; text-align:center;">已接受PR</th>
                    </tr>
                </thead>
                <tbody>
                    ${projectMetrics.map((metric, index) => `
                        <tr style="background:${index % 2 === 0 ? 'rgba(0,168,255,0.05)' : 'transparent'}">
                            <td style="padding:10px; text-align:left;">${metric.project}</td>
                            <td style="padding:10px; text-align:center;">${metric.stars}</td>
                            <td style="padding:10px; text-align:center;">${metric.technical_fork}</td>
                            <td style="padding:10px; text-align:center;">${metric.new_contributors}</td>
                            <td style="padding:10px; text-align:center;">${metric.issues_closed}</td>
                            <td style="padding:10px; text-align:center;">${metric.change_requests_accepted}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = tableHTML;
    }

    /**
     * 获取项目的显示名称（路径的最后一部分）
     * @param {string} project - 项目路径
     * @returns {string} - 项目显示名称
     */
    static getDisplayName(project) {
        const parts = project.split('/');
        return parts[parts.length - 1];
    }

    /**
     * 获取所有项目在特定数据类型上的共有时间轴
     * @param {Object} data - 项目数据
     * @param {string} dataType - 数据类型
     * @returns {Array} - 排序后的时间点数组
     */
    static getCommonTimeAxis(data, dataType) {
        const categoriesSet = new Set();
        Object.values(data).forEach((projectData) => {
            if (projectData && projectData[dataType]) {
                Object.keys(projectData[dataType]).forEach((key) => categoriesSet.add(key));
            }
        });
        return Array.from(categoriesSet).sort();
    }
}
