// utils/ChartService.js
import * as echarts from 'echarts';
import { getDeepestProjects } from './helpers'; // 如果需要，可导入辅助函数

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
     * @param {Array<string>} projects - 项目路径数组
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
        this.initIssueDimensionsChart(projects, projectsData);
        this.initCodeChangeChart(projects, projectsData);
        this.initAttentionChart(projects, projectsData);
        this.initRadarChart(projects, projectsData);
        this.initDataBars(projects, projectsData);
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
     * @param {Array<string>} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initPREfficiencyChart(projects, data) {
        const chart = this.initializeChart('pr-efficiency-chart');
        if (!chart) return;

        const legendData = [];
        const series = {
            prEfficiency: [],
            prAvgResponseTime: [],
            prAvgResolutionTime: []
        };
        let timeAxis = [];

        // 收集所有时间点
        projects.forEach(project => {
            if (!data[project]) return;

            const projectData = data[project];
            const changeRequests = projectData.change_requests || {};
            const times = Object.keys(changeRequests);
            timeAxis = [...new Set([...timeAxis, ...times])].sort();
        });

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];
            const changeRequestsAccepted = projectData.change_requests_accepted || {};
            const changeRequests = projectData.change_requests || {};
            const changeRequestResponseTime = projectData.change_request_response_time || {};
            const changeRequestResolutionDuration = projectData.change_request_resolution_duration || {};

            // 计算PR处理效率，响应时间和解决时间的时间序列
            const prEfficiencySeries = [];
            const prAvgResponseTimeSeries = [];
            const prAvgResolutionTimeSeries = [];

            timeAxis.forEach(time => {
                const accepted = changeRequestsAccepted[time] || 0;
                const submitted = changeRequests[time] || 0;
                const prEfficiency = submitted ? (accepted / submitted) * 100 : 0;

                const responseTime = changeRequestResponseTime[time] || 0;
                const resolutionTime = changeRequestResolutionDuration[time] || 0;

                prEfficiencySeries.push(prEfficiency);
                prAvgResponseTimeSeries.push(responseTime);
                prAvgResolutionTimeSeries.push(resolutionTime);
            });

            // 添加系列数据
            series.prEfficiency.push({
                name: `${this.getDisplayName(project)} PR处理效率 (%)`,
                type: 'line',
                data: prEfficiencySeries,
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 2,
                    color: `rgba(0, 168, 255, ${0.8 - index * 0.1})`
                }
            });

            series.prAvgResponseTime.push({
                name: `${this.getDisplayName(project)} PR平均响应时间 (天)`,
                type: 'line',
                data: prAvgResponseTimeSeries,
                smooth: true,
                symbol: 'none',
                yAxisIndex: 1,
                lineStyle: {
                    width: 2,
                    color: `rgba(255, 215, 0, ${0.8 - index * 0.1})`
                }
            });

            series.prAvgResolutionTime.push({
                name: `${this.getDisplayName(project)} PR平均解决时间 (天)`,
                type: 'line',
                data: prAvgResolutionTimeSeries,
                smooth: true,
                symbol: 'none',
                yAxisIndex: 1,
                lineStyle: {
                    width: 2,
                    color: `rgba(255, 0, 0, ${0.8 - index * 0.1})`
                }
            });

            // 添加到图例
            legendData.push(
                `${this.getDisplayName(project)} PR处理效率 (%)`,
                `${this.getDisplayName(project)} PR平均响应时间 (天)`,
                `${this.getDisplayName(project)} PR平均解决时间 (天)`
            );
        });

        // 合并所有系列
        const allSeries = [
            ...series.prEfficiency,
            ...series.prAvgResponseTime,
            ...series.prAvgResolutionTime
        ];

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
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
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
            yAxis: [{
                type: 'value',
                name: 'PR处理效率 (%)',
                position: 'left',
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
                name: '时间 (天)',
                position: 'right',
                axisLabel: {
                    color: '#7eb6ef'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(126, 182, 239, 0.2)'
                    }
                }
            }],
            series: allSeries
        };

        // 设置图表配置
        chart.setOption(option);

        // 保存图表配置
        this.chartOptions.prEfficiencyOptions = option;
    }

    /**
     * 初始化 OpenRank 图表
     * @param {Array<string>} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initOpenRankChart(projects, data) {
        const chart = this.initializeChart('openrank-chart');
        if (!chart) return;

        const series = [];
        const legendData = [];
        let xData = [];

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];
            const openrankData = projectData.openrank || {};

            // 假设 openrankData 的结构为 { "2024-01": 150, "2024-02": 200, ... }
            const timePoints = Object.keys(openrankData).sort();
            xData = [...new Set([...xData, ...timePoints])].sort();

            const openrankValues = timePoints.map(time => openrankData[time] || 0);

            series.push({
                name: this.getDisplayName(project),
                type: 'line',
                smooth: true,
                data: openrankValues,
                lineStyle: {
                    width: 2
                },
                areaStyle: {
                    opacity: 0.2
                }
            });

            legendData.push(this.getDisplayName(project));
        });

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legendData,
                top: 30,
                textStyle: {
                    color: '#7eb6ef',
                },
            },
            grid: {
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
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
     * 初始化 Issue 维度图表
     * @param {Array<string>} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initIssueDimensionsChart(projects, data) {
        const chart = this.initializeChart('issue-dimensions-chart');
        if (!chart) return;

        const series = [];
        const legendData = [];
        let xData = [];

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];
            const issuesNew = projectData.issues_new || 0;
            const issuesClosed = projectData.issues_closed || 0;
            const issueComments = projectData.issue_comments || 0;
            const issueResponseTime = projectData.issue_response_time || 0;
            const issueResolutionDuration = projectData.issue_resolution_duration || 0;

            // Issue处理率 = (已关闭的issue数量 / 新提交的issue数量) * 100%
            const issueProcessingRate = issuesNew ? (issuesClosed / issuesNew) * 100 : 0;

            // Issue平均响应时间
            const issueAvgResponseTime = issueResponseTime;

            // Issue平均解决时间
            const issueAvgResolutionTime = issueResolutionDuration;

            series.push({
                name: `${this.getDisplayName(project)} Issue处理率 (%)`,
                type: 'bar',
                stack: 'Issue',
                data: [issueProcessingRate],
                itemStyle: {
                    color: `rgba(0, 255, 0, ${0.8 - index * 0.1})`
                }
            });

            series.push({
                name: `${this.getDisplayName(project)} Issue平均响应时间 (天)`,
                type: 'line',
                yAxisIndex: 1,
                data: [issueAvgResponseTime],
                itemStyle: {
                    color: `rgba(255, 215, 0, ${0.8 - index * 0.1})`
                }
            });

            series.push({
                name: `${this.getDisplayName(project)} Issue平均解决时间 (天)`,
                type: 'line',
                yAxisIndex: 1,
                data: [issueAvgResolutionTime],
                itemStyle: {
                    color: `rgba(255, 0, 0, ${0.8 - index * 0.1})`
                }
            });

            legendData.push(`${this.getDisplayName(project)} Issue处理率 (%)`, `${this.getDisplayName(project)} Issue平均响应时间 (天)`, `${this.getDisplayName(project)} Issue平均解决时间 (天)`);
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
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: [''],
                axisLabel: {
                    color: '#7eb6ef'
                }
            },
            yAxis: [{
                type: 'value',
                name: 'Issue处理率 (%)',
                position: 'left',
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
                name: '时间 (天)',
                position: 'right',
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
        this.chartOptions.issueDimensionsOptions = option;
    }

    /**
     * 初始化代码变更行数图表
     * @param {Array<string>} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initCodeChangeChart(projects, data) {
        const chart = this.initializeChart('code-change-chart');
        if (!chart) return;

        const series = [];
        const legendData = [];
        let xData = [];

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];
            const codeChangeLinesAdd = projectData.code_change_lines_add || 0;
            const codeChangeLinesRemove = projectData.code_change_lines_remove || 0;

            // 代码变更总行数 = 新增的代码行数 + 删除的代码行数
            const totalCodeChanges = codeChangeLinesAdd + codeChangeLinesRemove;

            // 净代码变更行数 = 新增的代码行数 - 删除的代码行数
            const netCodeChanges = codeChangeLinesAdd - codeChangeLinesRemove;

            // 将数据添加到图表
            series.push({
                name: `${this.getDisplayName(project)} 代码变更总行数`,
                type: 'bar',
                stack: 'CodeChange',
                data: [totalCodeChanges],
                itemStyle: {
                    color: `rgba(255, 165, 0, ${0.8 - index * 0.1})`
                }
            });

            series.push({
                name: `${this.getDisplayName(project)} 净代码变更行数`,
                type: 'line',
                yAxisIndex: 1,
                data: [netCodeChanges],
                itemStyle: {
                    color: `rgba(0, 0, 255, ${0.8 - index * 0.1})`
                }
            });

            legendData.push(`${this.getDisplayName(project)} 代码变更总行数`, `${this.getDisplayName(project)} 净代码变更行数`);
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
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: [''],
                axisLabel: {
                    color: '#7eb6ef'
                }
            },
            yAxis: [{
                type: 'value',
                name: '代码变更总行数',
                position: 'left',
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
                name: '净代码变更行数',
                position: 'right',
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
        this.chartOptions.codeChangeOptions = option;
    }

    /**
     * 初始化关注度图表
     * @param {Array<string>} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initAttentionChart(projects, data) {
        const chart = this.initializeChart('attention-chart');
        if (!chart) return;

        const series = [];
        const legendData = [];
        let xData = [];

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];
            const attentionData = projectData.attention || {};

            // 假设 attentionData 的结构为 { "2024-01": 150, "2024-02": 200, ... }
            const timePoints = Object.keys(attentionData).sort();
            xData = [...new Set([...xData, ...timePoints])].sort();

            const attentionValues = timePoints.map(time => attentionData[time] || 0);

            series.push({
                name: this.getDisplayName(project),
                type: 'line',
                smooth: true,
                data: attentionValues,
                lineStyle: {
                    width: 2
                },
                areaStyle: {
                    opacity: 0.2
                }
            });

            legendData.push(this.getDisplayName(project));
        });

        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legendData,
                top: 30,
                textStyle: {
                    color: '#7eb6ef',
                },
            },
            grid: {
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
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
     * 初始化雷达图
     * @param {Array<string>} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initRadarChart(projects, data) {
        const chart = this.initializeChart('radar-chart');
        if (!chart) return;

        const radarIndicators = [
            { name: 'PR处理效率', max: 100 },
            { name: 'OpenRank', max: 500 }, // 假设最大值为500，可根据实际数据调整
            { name: 'Issue处理率', max: 100 },
            { name: '代码变更净行数', max: 1000 }, // 可根据实际数据调整
            { name: '关注度', max: 500 } // 可根据实际数据调整
        ];

        const series = [];

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];

            // PR处理效率
            const changeRequestsAccepted = projectData.change_requests_accepted || 0;
            const changeRequests = projectData.change_requests || 0;
            const prEfficiency = changeRequests ? (changeRequestsAccepted / changeRequests) * 100 : 0;

            // OpenRank
            const openRank = projectData.openrank || 0; // 取最新月份或其他逻辑

            // Issue处理率
            const issuesNew = projectData.issues_new || 0;
            const issuesClosed = projectData.issues_closed || 0;
            const issueProcessingRate = issuesNew ? (issuesClosed / issuesNew) * 100 : 0;

            // 代码变更净行数
            const codeChangeLinesAdd = projectData.code_change_lines_add || 0;
            const codeChangeLinesRemove = projectData.code_change_lines_remove || 0;
            const netCodeChanges = codeChangeLinesAdd - codeChangeLinesRemove;

            // 关注度
            const attention = projectData.attention || 0; // 取最新月份或其他逻辑

            series.push({
                name: this.getDisplayName(project),
                type: 'radar',
                data: [
                    {
                        value: [
                            prEfficiency,       // PR处理效率
                            openRank,           // OpenRank
                            issueProcessingRate,// Issue处理率
                            netCodeChanges,     // 代码变更净行数
                            attention           // 关注度
                        ],
                        name: this.getDisplayName(project),
                        areaStyle: {
                            opacity: 0.1
                        }
                    }
                ]
            });
        });

        const option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                data: projects.map(project => this.getDisplayName(project)),
                top: 30,
                textStyle: {
                    color: '#7eb6ef',
                },
            },
            radar: {
                indicator: radarIndicators,
                shape: 'circle',
                name: {
                    textStyle: {
                        color: '#7eb6ef',
                        fontSize: 14
                    }
                }
            },
            series: series
        };

        // 设置图表配置
        chart.setOption(option);

        // 保存图表配置
        this.chartOptions.radarOptions = option;
    }

    /**
     * 初始化数据栏
     * @param {Array<string>} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initDataBars(projects, data) {
        const chart = this.initializeChart('data-bars-chart');
        if (!chart) return;

        const series = [];
        const legendData = [];
        let categories = [];

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];

            // PR处理效率
            const changeRequestsAccepted = projectData.change_requests_accepted || 0;
            const changeRequests = projectData.change_requests || 0;
            const prEfficiency = changeRequests ? (changeRequestsAccepted / changeRequests) * 100 : 0;

            // OpenRank
            const openRank = projectData.openrank || 0;

            // Issue处理率
            const issuesNew = projectData.issues_new || 0;
            const issuesClosed = projectData.issues_closed || 0;
            const issueProcessingRate = issuesNew ? (issuesClosed / issuesNew) * 100 : 0;

            // 代码变更净行数
            const codeChangeLinesAdd = projectData.code_change_lines_add || 0;
            const codeChangeLinesRemove = projectData.code_change_lines_remove || 0;
            const netCodeChanges = codeChangeLinesAdd - codeChangeLinesRemove;

            // 关注度
            const attention = projectData.attention || 0;

            categories = [
                'PR处理效率 (%)',
                'OpenRank',
                'Issue处理率 (%)',
                '代码变更净行数',
                '关注度'
            ];

            series.push({
                name: this.getDisplayName(project),
                type: 'bar',
                stack: 'DataBars',
                data: [prEfficiency, openRank, issueProcessingRate, netCodeChanges, attention],
                itemStyle: {
                    color: `rgba(${(index * 50) % 255}, ${(index * 80) % 255}, ${(index * 110) % 255}, 0.8)`
                }
            });

            legendData.push(this.getDisplayName(project));
        });

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
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
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: categories,
                axisLabel: {
                    color: '#7eb6ef',
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
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
        this.chartOptions.dataBarsOptions = option;
    }

    /**
     * 初始化雷达图
     * @param {Array<string>} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initRadarChart(projects, data) {
        const chart = this.initializeChart('radar-chart');
        if (!chart) return;

        const radarIndicators = [
            { name: 'PR处理效率 (%)', max: 100 },
            { name: 'OpenRank', max: 500 }, // 根据实际数据调整
            { name: 'Issue处理率 (%)', max: 100 },
            { name: '代码变更净行数', max: 1000 }, // 根据实际数据调整
            { name: '关注度', max: 500 } // 根据实际数据调整
        ];

        const series = [];

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];

            // PR处理效率
            const changeRequestsAccepted = projectData.change_requests_accepted || 0;
            const changeRequests = projectData.change_requests || 0;
            const prEfficiency = changeRequests ? (changeRequestsAccepted / changeRequests) * 100 : 0;

            // OpenRank
            const openRank = projectData.openrank || 0;

            // Issue处理率
            const issuesNew = projectData.issues_new || 0;
            const issuesClosed = projectData.issues_closed || 0;
            const issueProcessingRate = issuesNew ? (issuesClosed / issuesNew) * 100 : 0;

            // 代码变更净行数
            const codeChangeLinesAdd = projectData.code_change_lines_add || 0;
            const codeChangeLinesRemove = projectData.code_change_lines_remove || 0;
            const netCodeChanges = codeChangeLinesAdd - codeChangeLinesRemove;

            // 关注度
            const attention = projectData.attention || 0;

            series.push({
                name: this.getDisplayName(project),
                type: 'radar',
                data: [
                    {
                        value: [
                            prEfficiency,       // PR处理效率
                            openRank,           // OpenRank
                            issueProcessingRate,// Issue处理率
                            netCodeChanges,     // 代码变更净行数
                            attention           // 关注度
                        ],
                        name: this.getDisplayName(project),
                        areaStyle: {
                            opacity: 0.1
                        }
                    }
                ]
            });
        });

        const option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                data: projects.map(project => this.getDisplayName(project)),
                top: 30,
                textStyle: {
                    color: '#7eb6ef',
                },
            },
            radar: {
                indicator: radarIndicators,
                shape: 'circle',
                name: {
                    textStyle: {
                        color: '#7eb6ef',
                        fontSize: 14
                    }
                }
            },
            series: series
        };

        // 设置图表配置
        chart.setOption(option);

        // 保存图表配置
        this.chartOptions.radarOptions = option;
    }

    /**
     * 初始化数据栏
     * @param {Array<string>} projects - 项目路径数组
     * @param {Object} data - 所有项目数据
     */
    static initDataBars(projects, data) {
        const chart = this.initializeChart('data-bars-chart');
        if (!chart) return;

        const series = [];
        const legendData = [];
        let categories = [
            'PR处理效率 (%)',
            'OpenRank',
            'Issue处理率 (%)',
            '代码变更净行数',
            '关注度'
        ];

        projects.forEach((project, index) => {
            if (!data[project]) return;

            const projectData = data[project];

            // PR处理效率
            const changeRequestsAccepted = projectData.change_requests_accepted || 0;
            const changeRequests = projectData.change_requests || 0;
            const prEfficiency = changeRequests ? (changeRequestsAccepted / changeRequests) * 100 : 0;

            // OpenRank
            const openRank = projectData.openrank || 0;

            // Issue处理率
            const issuesNew = projectData.issues_new || 0;
            const issuesClosed = projectData.issues_closed || 0;
            const issueProcessingRate = issuesNew ? (issuesClosed / issuesNew) * 100 : 0;

            // 代码变更净行数
            const codeChangeLinesAdd = projectData.code_change_lines_add || 0;
            const codeChangeLinesRemove = projectData.code_change_lines_remove || 0;
            const netCodeChanges = codeChangeLinesAdd - codeChangeLinesRemove;

            // 关注度
            const attention = projectData.attention || 0;

            series.push({
                name: this.getDisplayName(project),
                type: 'bar',
                stack: 'DataBars',
                data: [prEfficiency, openRank, issueProcessingRate, netCodeChanges, attention],
                itemStyle: {
                    color: `rgba(${(index * 50) % 255}, ${(index * 80) % 255}, ${(index * 110) % 255}, 0.8)`
                }
            });

            legendData.push(this.getDisplayName(project));
        });

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
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
                top: '10%',
                left: '10%',
                right: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: categories,
                axisLabel: {
                    color: '#7eb6ef',
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
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
        this.chartOptions.dataBarsOptions = option;
    }

    /**
     * 更新核心数据指标
     * @param {Array<string>} projects - 项目路径数组
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
                // Get latest month data for OpenRank
                const openrankData = Object.entries(projectData.openrank || {})
                    .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                    .sort(([a], [b]) => b.localeCompare(a)); // Descending sort

                // Get latest month data for activity
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
        const activityElement = document.getElementById('activity-avg');

        if (openrankElement) openrankElement.textContent = openrankAvg;
        if (activityElement) activityElement.textContent = activityAvg;
    }

    /**
     * 初始化 GitHub 表格
     * @param {Array<string>} projects - 项目路径数组
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
     * @returns {Array<string>} - 排序后的时间点数组
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
