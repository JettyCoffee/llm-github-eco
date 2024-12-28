// utils/ChartService.js

/**
 * ChartService
 * 负责根据项目数据生成 ECharts 图表的配置
 */

export const ChartService = {
  /**
   * 根据项目数据生成所有图表的配置
   * @param {Object} projectsData - 包含所有项目数据的对象
   * @returns {Object} - 包含所有图表配置的对象
   */
  initCharts: (projectsData) => {
    // 生成 PR 处理效率图表配置
    const prEfficiencyOptions = generateLineChartOptions(
      projectsData,
      'pr_efficiency',
      'PR处理效率',
      '效率'
    );

    // 生成 OpenRank 图表配置
    const openRankOptions = generateBarChartOptions(
      projectsData,
      'openrank',
      'OpenRank',
      'OpenRank'
    );

    // 生成 关注度 图表配置
    const attentionOptions = generateLineChartOptions(
      projectsData,
      'attention',
      '关注度',
      '关注度'
    );

    // 生成 开发者活跃度 图表配置
    const developerActivityOptions = generateLineChartOptions(
      projectsData,
      'activity',
      '开发者活跃度',
      '活跃度'
    );

    // 生成 项目活跃度 图表配置
    const projectActivityOptions = generateLineChartOptions(
      projectsData,
      'project_activity',
      '项目活跃度',
      '活跃度'
    );

    // 生成 问题解决时间 图表配置
    const issueResolutionDurationOptions = generateLineChartOptions(
      projectsData,
      'issue_resolution_duration',
      '问题解决时间',
      '时间 (小时)' // 根据数据单位调整
    );

    return {
      prEfficiencyOptions,
      openRankOptions,
      attentionOptions,
      developerActivityOptions,
      projectActivityOptions,
      issueResolutionDurationOptions, // 添加新的图表配置
    };
  },
};

/**
 * 生成折线图（Line Chart）配置
 * @param {Object} projectsData - 所有项目的数据
 * @param {string} dataType - 数据类型（对应项目数据中的键）
 * @param {string} title - 图表标题
 * @param {string} yAxisName - Y轴名称
 * @returns {Object} - ECharts 折线图配置
 */
const generateLineChartOptions = (projectsData, dataType, title, yAxisName) => {
  const categories = getCommonCategories(projectsData, dataType);
  console.log(`Generating Line Chart for ${title}, Categories:`, categories); // 添加日志
  const series = Object.keys(projectsData).map((project) => ({
    name: project,
    type: 'line',
    data: extractSeriesData(projectsData[project][dataType], categories),
    smooth: true,
    emphasis: {
      focus: 'series'
    }
  }));

  console.log(`Line Chart Series:`, series); // 添加日志

  return {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: '#7eb6ef',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: Object.keys(projectsData),
      top: 30,
      textStyle: {
        color: '#7eb6ef',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: categories,
      axisLine: {
        lineStyle: {
          color: '#7eb6ef',
        },
      },
      axisLabel: {
        color: '#7eb6ef',
      },
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      axisLine: {
        lineStyle: {
          color: '#7eb6ef',
        },
      },
      axisLabel: {
        color: '#7eb6ef',
      },
      splitLine: {
        lineStyle: {
          color: '#7eb6ef',
          opacity: 0.2,
        },
      },
    },
    series,
  };
};

/**
 * 生成柱状图（Bar Chart）配置
 * @param {Object} projectsData - 所有项目的数据
 * @param {string} dataType - 数据类型（对应项目数据中的键）
 * @param {string} title - 图表标题
 * @param {string} yAxisName - Y轴名称
 * @returns {Object} - ECharts 柱状图配置
 */
const generateBarChartOptions = (projectsData, dataType, title, yAxisName) => {
  const categories = getCommonCategories(projectsData, dataType);
  console.log(`Generating Bar Chart for ${title}, Categories:`, categories); // 添加日志
  const series = Object.keys(projectsData).map((project) => ({
    name: project,
    type: 'bar',
    data: extractSeriesData(projectsData[project][dataType], categories),
    emphasis: {
      focus: 'series'
    }
  }));

  console.log(`Bar Chart Series:`, series); // 添加日志

  return {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: '#7eb6ef',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: Object.keys(projectsData),
      top: 30,
      textStyle: {
        color: '#7eb6ef',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        lineStyle: {
          color: '#7eb6ef',
        },
      },
      axisLabel: {
        color: '#7eb6ef',
      },
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      axisLine: {
        lineStyle: {
          color: '#7eb6ef',
        },
      },
      axisLabel: {
        color: '#7eb6ef',
      },
      splitLine: {
        lineStyle: {
          color: '#7eb6ef',
          opacity: 0.2,
        },
      },
    },
    series,
  };
};

/**
 * 提取系列数据，确保数据与分类一致
 * @param {Object} data - 项目数据中的特定数据类型对象（例如，pr_efficiency）
 * @param {Array} categories - 分类列表（例如，月份）
 * @returns {Array} - 按分类顺序排列的数据数组
 */
const extractSeriesData = (data, categories) => {
  if (!data) return [];
  return categories.map((category) => data[category] || 0);
};

/**
 * 获取所有项目共有的分类（例如月份）
 * @param {Object} projectsData - 所有项目的数据
 * @param {string} dataType - 数据类型（对应项目数据中的键）
 * @returns {Array} - 排序后的分类列表
 */
const getCommonCategories = (projectsData, dataType) => {
  const categoriesSet = new Set();
  Object.values(projectsData).forEach((projectData) => {
    if (projectData && projectData[dataType]) {
      Object.keys(projectData[dataType]).forEach((key) => categoriesSet.add(key));
    }
  });
  return Array.from(categoriesSet).sort();
};
