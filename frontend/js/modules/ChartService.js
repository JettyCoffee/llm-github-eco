export class ChartService {
    static charts = {};

    static initializeChart(containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Container not found: ${containerId}`);
                return null;
            }
            
            // 如果已经存在图表实例，先销毁
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

    static initCharts(projectsData) {
        console.log('Initializing all charts with data:', projectsData);
        this.initPREfficiencyChart(projectsData);
        this.initOpenRankChart(projectsData);
        this.initAttentionChart(projectsData);
        this.initDeveloperActivityChart(projectsData);
        this.initProjectActivityChart(projectsData);
        this.updateCoreData(projectsData);
        this.initGithubTable(projectsData);
    }

    static initPREfficiencyChart(data) {
        const chart = this.initializeChart('pr-efficiency-chart');
        if (!chart) return;

        const projects = window.projectManager.getProjects();
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
            
            series.push({
                name: `${project} PR数量`,
                type: 'bar',
                stack: 'PR',
                data: xData.map(time => requests[time] || 0),
                itemStyle: {
                    color: `rgba(0, 168, 255, ${0.8 - index * 0.2})`
                }
            });
            
            series.push({
                name: `${project} 处理时长`,
                type: 'line',
                yAxisIndex: 1,
                data: xData.map(time => duration[time] || 0),
                itemStyle: {
                    color: `rgba(255, 215, 0, ${0.8 - index * 0.2})`
                }
            });
            
            legendData.push(`${project} PR数量`, `${project} 处理时长`);
        });
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
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
        
        chart.setOption(option);
    }

    static initOpenRankChart(data) {
        const chart = this.initializeChart('openrank-chart');
        if (!chart) return;

        const projects = window.projectManager.getProjects();
        
        const series = projects.map((project, index) => {
            const projectData = data[project]?.openrank || {};
            const timeData = Object.entries(projectData)
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .sort(([a], [b]) => a.localeCompare(b));
            
            return {
                name: project.split('/')[1],
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

        const timeAxis = Object.keys(data[projects[0]]?.openrank || {})
            .filter(key => key.match(/^\d{4}-\d{2}$/))
            .sort();

        const option = {
            tooltip: {
                trigger: 'axis'
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
        
        chart.setOption(option);
    }

    static initAttentionChart(data) {
        const chart = this.initializeChart('attention-chart');
        if (!chart) return;

        const projects = window.projectManager.getProjects();
        
        const series = projects.map((project, index) => {
            const projectData = data[project]?.attention || {};
            const timeData = Object.entries(projectData)
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .sort(([a], [b]) => a.localeCompare(b));
            
            return {
                name: project.split('/')[1],
                type: 'line',
                smooth: true,
                data: timeData.map(([_, value]) => value),
                lineStyle: {
                    width: 2
                }
            };
        });

        const timeAxis = Object.keys(data[projects[0]]?.attention || {})
            .filter(key => key.match(/^\d{4}-\d{2}$/))
            .sort();

        const option = {
            tooltip: {
                trigger: 'axis'
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
        
        chart.setOption(option);
    }

    static initDeveloperActivityChart(data) {
        const chart = this.initializeChart('developer-activity-chart');
        if (!chart) return;

        const projects = window.projectManager.getProjects();
        
        const series = projects.map((project, index) => {
            const projectData = data[project]?.new_contributors || {};
            const timeData = Object.entries(projectData)
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .sort(([a], [b]) => a.localeCompare(b));
            
            return {
                name: project.split('/')[1],
                type: 'line',
                smooth: true,
                data: timeData.map(([_, value]) => value)
            };
        });

        const timeAxis = Object.keys(data[projects[0]]?.new_contributors || {})
            .filter(key => key.match(/^\d{4}-\d{2}$/))
            .sort();

        const option = {
            tooltip: {
                trigger: 'axis'
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
        
        chart.setOption(option);
    }

    static initProjectActivityChart(data) {
        const chart = this.initializeChart('project-activity-chart');
        if (!chart) return;

        const projects = window.projectManager.getProjects();
        
        const series = projects.map((project, index) => {
            const projectData = data[project]?.activity || {};
            const timeData = Object.entries(projectData)
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .sort(([a], [b]) => a.localeCompare(b));
            
            return {
                name: project.split('/')[1],
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

        const timeAxis = Object.keys(data[projects[0]]?.activity || {})
            .filter(key => key.match(/^\d{4}-\d{2}$/))
            .sort();

        const option = {
            tooltip: {
                trigger: 'axis'
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
        
        chart.setOption(option);
    }

    static updateCoreData(data) {
        const projects = window.projectManager.getProjects();
        
        // 计算 OpenRank 平均值
        let openrankSum = 0;
        let openrankCount = 0;
        
        // 计算 GitHub 活跃度平均值
        let activitySum = 0;
        let activityCount = 0;
        
        projects.forEach(project => {
            const projectData = data[project];
            if (projectData) {
                // 获取最新月份的数据
                const openrankData = Object.entries(projectData.openrank || {})
                    .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                    .sort(([a], [b]) => b.localeCompare(a)); // 降序排序，获取最新数据
                
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
        
        // 计算平均值
        const openrankAvg = openrankCount ? (openrankSum / openrankCount).toFixed(2) : '0.00';
        const activityAvg = activityCount ? (activitySum / activityCount).toFixed(2) : '0.00';
        
        // 更新显示
        const openrankElement = document.getElementById('openrank-avg');
        const githubElement = document.getElementById('github-avg');
        
        if (openrankElement) openrankElement.textContent = openrankAvg;
        if (githubElement) githubElement.textContent = activityAvg;
    }

    static initGithubTable(data) {
        const tableContainer = document.getElementById('github-table');
        if (!tableContainer) return;

        const projects = window.projectManager.getProjects();

        // 计算各项指标
        const projectMetrics = projects.map(project => {
            const projectData = data[project];
            if (!projectData) return null;

            // 获取最新月度数据
            const getLatestMonthlyValue = (data) => {
                if (!data) return 0;
                const monthlyData = Object.entries(data)
                    .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                    .sort(([a], [b]) => b.localeCompare(a));
                return monthlyData.length ? monthlyData[0][1] : 0;
            };

            // 使用与雷达图相同的五个维度指标
            const metrics = {
                stars: getLatestMonthlyValue(projectData.stars),
                technical_fork: getLatestMonthlyValue(projectData.technical_fork),
                new_contributors: getLatestMonthlyValue(projectData.new_contributors),
                issues_closed: getLatestMonthlyValue(projectData.issues_closed),
                change_requests_accepted: getLatestMonthlyValue(projectData.change_requests_accepted)
            };

            return {
                project: project.split('/')[1], // 只显示项目名
                stars: metrics.stars.toFixed(2),
                technical_fork: metrics.technical_fork.toFixed(2),
                new_contributors: metrics.new_contributors.toFixed(2),
                issues_closed: metrics.issues_closed.toFixed(2),
                change_requests_accepted: metrics.change_requests_accepted.toFixed(2)
            };
        }).filter(item => item !== null);

        // 创建表格HTML
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
} 