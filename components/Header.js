// components/Header.js
import React, { useState, useEffect } from 'react';
import { getDeepestProjects } from '../utils/helpers'; // 导入辅助函数

const Header = ({ onAddProject }) => {
    const [time, setTime] = useState('');
    const [availableProjects, setAvailableProjects] = useState([]); // 可供选择的项目列表
    const [selectedProject, setSelectedProject] = useState('');

    useEffect(() => {
        // 更新时间每秒刷新一次
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString());
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // 从 API 路由获取可用项目列表
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                console.log('Fetched projects:', data.projects); // 添加日志

                // 仅保留最深层级的项目
                const deepestProjects = getDeepestProjects(data.projects);
                setAvailableProjects(deepestProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    const handleAddProject = () => {
        if (!selectedProject) {
            alert('请先选择一个项目');
            return;
        }
        onAddProject(selectedProject);
        setSelectedProject(''); // 重置选择
    };

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
    };

    // 辅助方法：获取项目的显示名称
    const getDisplayName = (project) => {
        const parts = project.split('/');
        return parts[parts.length - 1];
    };

    return (
        <header className="header">
            <div id="current-time" className="current-time">
                {time}
            </div>
            <div className="project-selector">
                <select
                    id="project-select"
                    className="project-select"
                    value={selectedProject}
                    onChange={handleProjectChange}
                >
                    <option value="">选择项目...</option>
                    {availableProjects.map((project) => (
                        <option key={project} value={project}>
                            {getDisplayName(project)}
                        </option>
                    ))}
                </select>
                <button
                    id="add-project"
                    className="add-project-btn"
                    onClick={handleAddProject}
                    disabled={!selectedProject}
                >
                    <i className="fas fa-plus"></i>
                    添加项目
                </button>
            </div>
        </header>
    );
};

export default Header;
