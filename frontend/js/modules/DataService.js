export class DataService {
    static async getAllProjectsData() {
        const projects = window.projectManager.getProjects();
        
        // 从data_type.yml中获取的数据类型
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
                        const response = await fetch(`http://localhost:8080/frontend/data/${project}/${dataType}.json`);
                        if (response.ok) {
                            const data = await response.json();
                            projectsData[project][dataType] = data;
                        } else {
                            console.error(`Failed to load ${dataType} data for ${project}: ${response.status}`);
                        }
                    } catch (error) {
                        console.error(`Error loading ${dataType} data for ${project}:`, error);
                        projectsData[project][dataType] = null;
                    }
                }
            }
        }
        
        return projectsData;
    }
} 