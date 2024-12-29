// pages/index.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { ProjectContext } from '../contexts/ProjectContext';
import { getDeepestProjects } from '../utils/helpers';

const ProjectSelection = () => {
    const { selectedProjects, setSelectedProjects } = useContext(ProjectContext);
    const [availableProjects, setAvailableProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const router = useRouter();
    const dropdownRef = useRef(null);

    // 获取所有项目
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                console.log('Fetched projects:', data.projects);

                // 仅保留最深层级项目（如果 API 已处理，可省略）
                const deepestProjects = getDeepestProjects(data.projects);
                setAvailableProjects(deepestProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    // 过滤项目
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredProjects([]);
            setShowDropdown(false);
        } else {
            const lowerCaseTerm = searchTerm.toLowerCase();
            const filtered = availableProjects.filter(project =>
                project.toLowerCase().includes(lowerCaseTerm)
            );
            setFilteredProjects(filtered);
            setShowDropdown(filtered.length > 0);
        }
    }, [searchTerm, availableProjects]);

    // 处理点击外部关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 选择项目
    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setSearchTerm(project.split('/').pop()); // 显示项目名称
        setShowDropdown(false);
    };

    // 确认选择
    const handleConfirm = () => {
        if (!selectedProject) {
            alert('请至少选择一个项目');
            return;
        }
        setSelectedProjects([selectedProject]);
        router.push('/dashboard');
    };

    // 处理键盘操作（如回车键）
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    return (
        <div className="project-selection-page">
            <div className="content" ref={dropdownRef}>
                {/* 可选：添加自定义 Logo 或删除此部分 */}
                <img src="/google-logo.png" alt="Google Logo" className="logo" />

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="搜索并选择项目"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedProject(''); // 重置已选择项目
                        }}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                </div>

                {showDropdown && (
                    <ul className="dropdown-list">
                        {filteredProjects.map(project => (
                            <li
                                key={project}
                                className="dropdown-item"
                                onClick={() => handleProjectSelect(project)}
                            >
                                {project.split('/').pop()}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    type="button"
                    onClick={handleConfirm}
                    className="confirm-button"
                    disabled={!selectedProject}
                >
                    确认
                </button>
            </div>

            <style jsx>{`
                .project-selection-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #ffffff;
                }
                .content {
                    position: relative;
                    text-align: center;
                }
                .logo {
                    width: 272px;
                    margin-bottom: 40px;
                }
                .search-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 10px;
                }
                .search-input {
                    width: 400px;
                    padding: 10px 20px;
                    border: 1px solid #dfe1e5;
                    border-radius: 24px;
                    font-size: 16px;
                    outline: none;
                    transition: box-shadow 0.2s, border-color 0.2s;
                }
                .search-input:focus {
                    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
                    border-color: #1a73e8;
                }
                .dropdown-list {
                    position: absolute;
                    top: 50px; /* 根据搜索框高度调整 */
                    left: 50%;
                    transform: translateX(-50%);
                    width: 400px;
                    max-height: 200px;
                    overflow-y: auto;
                    background-color: #ffffff;
                    border: 1px solid #dfe1e5;
                    border-radius: 4px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    z-index: 1000;
                }
                .dropdown-item {
                    padding: 10px 20px;
                    cursor: pointer;
                    color: #000000; /* 黑色文字 */
                }
                .dropdown-item:hover {
                    background-color: #f1f3f4;
                }
                .confirm-button {
                    padding: 10px 30px;
                    background-color: #1a73e8;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .confirm-button:disabled {
                    background-color: #a0c3ff;
                    cursor: not-allowed;
                }
                .confirm-button:not(:disabled):hover {
                    background-color: #1669c1;
                }

                /* Scrollbar Styles for Dropdown */
                .dropdown-list::-webkit-scrollbar {
                    width: 8px;
                }
                .dropdown-list::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .dropdown-list::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                .dropdown-list::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }

                /* 响应式设计 */
                @media (max-width: 600px) {
                    .search-input {
                        width: 80%;
                    }
                    .dropdown-list {
                        width: 80%;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProjectSelection;
