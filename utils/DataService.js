// utils/DataService.js
export const DataService = {
  /**
   * 获取所有项目的数据
   * @param {Array} projects - 项目名称列表（如 ['project1', 'project2', ...]）
   * @returns {Object} - 包含所有项目数据的对象
   */
  getAllProjectsData: async (projects) => {
    const dataTypes = {
      type: [
        'openrank', 'activity', 'stars', 'technical_fork', 'attention',
        'bus_factor', 'new_contributors'
      ],
      issue: [
        'issues_closed', 'issue_comments', 'issues_new',
        'issue_response_time', 'issue_resolution_duration'
      ],
      change_requests: [
        'change_requests_accepted', 'change_requests', 'change_requests_reviews',
        'change_request_response_time', 'change_request_resolution_duration'
      ],
      code_change_lines: [
        'code_change_lines_remove', 'code_change_lines_add'
      ]
    };
    
    const projectsData = {};
    
    for (const project of projects) {
      projectsData[project] = {};
      // 加载所有类型的数据
      for (const category in dataTypes) {
        for (const dataType of dataTypes[category]) {
          try {
            // 从 API 路由获取数据
            const response = await fetch(`/api/data/${project}/${dataType}`);
            if (response.ok) {
              const data = await response.json();
              projectsData[project][dataType] = data;
            } else {
              console.error(`Failed to load ${dataType} data for ${project}: ${response.status}`);
              projectsData[project][dataType] = null;
            }
          } catch (error) {
            console.error(`Error loading ${dataType} data for ${project}:`, error);
            projectsData[project][dataType] = null;
          }
        }
      }
    }
    
    return projectsData;
  },
  
  /**
   * 添加一个新的项目
   * @param {string} name - 项目名称
   * @returns {Object} - 添加后的项目数据
   */
  addProject: async (name) => {
    // 如果您仍然需要通过 Supabase 添加项目，可以保留此方法
    // 否则，如果项目数据仅在 public/data 中管理，可以省略此方法
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name }])
      .single();
    if (error) throw error;
    return data;
  },
};
