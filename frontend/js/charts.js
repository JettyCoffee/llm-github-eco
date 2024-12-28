// 图表配置和初始化
function initCharts(projectsData) {
    initPREfficiencyChart(projectsData);
    initOpenRankChart(projectsData);
    initAttentionChart(projectsData);
    initDeveloperActivityChart(projectsData);
    initProjectActivityChart(projectsData);
    updateCoreData(projectsData);
    initGithubTable(projectsData);
}

// 通用图表初始化函数
function initializeChart(containerId) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container not found: ${containerId}`);
            return null;
        }
        
        const chart = echarts.init(container);
        
        // 设置图表自适应
        const resizeChart = () => {
            if (container && chart) {
                chart.resize();
            }
        };
        
        // 监听容器大小变化
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

// PR处理效率图表
function initPREfficiencyChart(data) {
    const chart = initializeChart('pr-efficiency-chart');
    const projects = window.projectManager.getProjects();
    
    const series = [];
    const legendData = [];
    let xData = [];
    
    projects.forEach((project, index) => {
        if (!data[project]) return;
        
        const projectData = data[project];
        const requests = projectData.change_requests || {};
        const duration = projectData.change_request_resolution_duration || {};
        
        // 获取所有时间点
        const timePoints = Object.keys(requests);
        xData = [...new Set([...xData, ...timePoints])].sort();
        
        // PR数量数据
        series.push({
            name: `${project} PR数量`,
            type: 'bar',
            stack: 'PR',
            data: xData.map(time => requests[time] || 0),
            itemStyle: {
                color: `rgba(0, 168, 255, ${0.8 - index * 0.2})`
            }
        });
        
        // PR处理时长数据
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

// 辅助函数：过滤并排序时间序列数据
function filterAndSortTimeData(data, pattern) {
    return Object.entries(data || {})
        .filter(([key]) => key.match(pattern))
        .sort(([a], [b]) => a.localeCompare(b));
}

// OpenRank图表
function initOpenRankChart(data) {
    const chart = initializeChart('openrank-chart');
    const projects = window.projectManager.getProjects();
    
    // 使用月度数据
    const series = projects.map((project, index) => {
        const projectData = data[project]?.openrank || {};
        // 只使用月度数据 (YYYY-MM 格式)
        const timeData = filterAndSortTimeData(projectData, /^\d{4}-\d{2}$/);
        
        return {
            name: project,
            type: 'line',
            smooth: true,
            data: timeData.map(([time, value]) => value),
            lineStyle: {
                width: 2
            },
            areaStyle: {
                opacity: 0.2
            }
        };
    });
    
    // 获取第一个项目的时间轴数据
    const timeAxis = filterAndSortTimeData(data[projects[0]]?.openrank || {}, /^\d{4}-\d{2}$/)
        .map(([time]) => time);
    
    const option = {
        tooltip: {
            trigger: 'axis'
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
            }
        },
        series: series
    };
    
    chart.setOption(option);
}

// 辅助函数：获取最新月度值
function getLatestMonthlyValue(data) {
    if (!data) return 0;
    const monthlyData = filterAndSortTimeData(data, /^\d{4}-\d{2}$/);
    return monthlyData.length ? monthlyData[monthlyData.length - 1][1] : 0;
}

// 关注度图表
function initAttentionChart(data) {
    const chart = initializeChart('attention-chart');
    
    const projects = [
        'martiansideofthemoon/ai-detection-paraphrases',
        'mayooear/gpt4-pdf-chatbot-langchain'
    ];
    
    const series = projects.map((project, index) => {
        const projectData = data[project]?.attention || {};
        const xData = Object.keys(projectData);
        const yData = xData.map(key => projectData[key]);
        
        return {
            name: project,
            type: 'line',
            smooth: true,
            data: yData,
            lineStyle: {
                width: 2
            }
        };
    });
    
    const option = {
        tooltip: {
            trigger: 'axis'
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
            data: Object.keys(data[projects[0]]?.attention || {}),
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
            }
        },
        series: series
    };
    
    chart.setOption(option);
}

// 开发者活跃度图表
function initDeveloperActivityChart(data) {
    const chart = initializeChart('developer-activity-chart');
    
    const projects = [
        'martiansideofthemoon/ai-detection-paraphrases',
        'mayooear/gpt4-pdf-chatbot-langchain'
    ];
    
    const series = projects.map((project, index) => {
        const projectData = data[project]?.new_contributors || {};
        const xData = Object.keys(projectData);
        const yData = xData.map(key => projectData[key]);
        
        return {
            name: project,
            type: 'line',
            smooth: true,
            data: yData
        };
    });
    
    const option = {
        tooltip: {
            trigger: 'axis'
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
            data: Object.keys(data[projects[0]]?.new_contributors || {}),
            axisLabel: {
                color: '#7eb6ef',
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: '新增贡献者',
            axisLabel: {
                color: '#7eb6ef'
            }
        },
        series: series
    };
    
    chart.setOption(option);
}

// 项目活跃度图表
function initProjectActivityChart(data) {
    const chart = initializeChart('project-activity-chart');
    
    const projects = [
        'martiansideofthemoon/ai-detection-paraphrases',
        'mayooear/gpt4-pdf-chatbot-langchain'
    ];
    
    const series = projects.map((project, index) => {
        const projectData = data[project]?.activity || {};
        const xData = Object.keys(projectData);
        const yData = xData.map(key => projectData[key]);
        
        return {
            name: project,
            type: 'line',
            smooth: true,
            data: yData,
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
    
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}'
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
            data: Object.keys(data[projects[0]]?.activity || {}),
            axisLabel: {
                color: '#7eb6ef',
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#7eb6ef'
            }
        },
        series: series
    };
    
    chart.setOption(option);
}

// 更新核心数据
function updateCoreData(data) {
    const projects = [
        'martiansideofthemoon/ai-detection-paraphrases',
        'mayooear/gpt4-pdf-chatbot-langchain'
    ];
    
    // 计算所有项目的月度平均值
    let openrankSum = 0;
    let openrankCount = 0;
    let activitySum = 0;
    let activityCount = 0;
    
    projects.forEach(project => {
        const projectData = data[project];
        if (projectData) {
            const openrankValues = Object.entries(projectData.openrank || {})
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .map(([_, value]) => value);
            
            const activityValues = Object.entries(projectData.activity || {})
                .filter(([key]) => key.match(/^\d{4}-\d{2}$/))
                .map(([_, value]) => value);
            
            if (openrankValues.length) {
                openrankSum += openrankValues.reduce((a, b) => a + b, 0);
                openrankCount += openrankValues.length;
            }
            
            if (activityValues.length) {
                activitySum += activityValues.reduce((a, b) => a + b, 0);
                activityCount += activityValues.length;
            }
        }
    });
    
    const openrankAvg = openrankCount ? (openrankSum / openrankCount).toFixed(2) : '0.00';
    const activityAvg = activityCount ? (activitySum / activityCount).toFixed(2) : '0.00';
    
    // 更新显示
    document.getElementById('openrank-avg').textContent = openrankAvg;
    document.getElementById('github-avg').textContent = activityAvg;
}

// 初始化GitHub数据表
function initGithubTable(data) {
    const tableContainer = document.getElementById('github-table');
    const projects = [
        'martiansideofthemoon/ai-detection-paraphrases',
        'mayooear/gpt4-pdf-chatbot-langchain'
    ];

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

// 辅助函数：获取最新值
function getLatestValue(data) {
    if (!data) return 0;
    const values = Object.values(data);
    return values.length ? values[values.length - 1] : 0;
}

// 辅助函数：格式化数字
function formatNumber(value) {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
} 