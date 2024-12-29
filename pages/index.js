// pages/index.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { ProjectContext } from '../contexts/ProjectContext';
import { getDeepestProjects } from '../utils/helpers';
import {
    Container,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
    Button,
    Box,
    Tooltip,
    IconButton,
    Fade,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GitHubIcon from '@mui/icons-material/GitHub';
import useDebounce from '../hooks/useDebounce'; // 引入 useDebounce Hook

const ProjectSelection = () => {
    const { selectedProjects, setSelectedProjects } = useContext(ProjectContext);
    const [availableProjects, setAvailableProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // 防抖延迟 300ms
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1); // 当前高亮的项目索引
    const router = useRouter();
    const dropdownRef = useRef(null);
    const listRef = useRef(null); // 引用列表容器

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
        if (debouncedSearchTerm === '') {
            setFilteredProjects([]);
            setShowDropdown(false);
            setHighlightedIndex(-1);
        } else {
            const lowerCaseTerm = debouncedSearchTerm.toLowerCase();
            const filtered = availableProjects.filter(project =>
                project.toLowerCase().includes(lowerCaseTerm)
            );
            setFilteredProjects(filtered);
            setShowDropdown(filtered.length > 0);
            setHighlightedIndex(-1); // 重置高亮索引
        }
    }, [debouncedSearchTerm, availableProjects]);

    // 处理点击外部关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 自动滚动到高亮项
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const listItems = listRef.current.querySelectorAll('li');
            if (listItems[highlightedIndex]) {
                listItems[highlightedIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [highlightedIndex]);

    // 选择项目
    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setSearchTerm(project.split('/').pop()); // 显示项目名称
        setShowDropdown(false);
        setHighlightedIndex(-1);
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

    // 处理键盘操作（如回车键、箭头键、Esc键）
    const handleKeyDown = (e) => {
        if (!showDropdown) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev < filteredProjects.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < filteredProjects.length) {
                handleProjectSelect(filteredProjects[highlightedIndex]);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setShowDropdown(false);
            setHighlightedIndex(-1);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, position: 'relative' }} ref={dropdownRef}>
                <Typography variant="h4" align="center" gutterBottom>
                    选择项目
                </Typography>

                <TextField
                    fullWidth
                    label="搜索并选择项目"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedProject(''); // 重置已选择项目
                    }}
                    onKeyDown={handleKeyDown} // 添加键盘事件处理器
                    aria-autocomplete="list"
                    aria-controls="project-listbox"
                    aria-activedescendant={
                        highlightedIndex >= 0 ? `project-option-${highlightedIndex}` : undefined
                    }
                />

                {/* 动画效果使用 MUI 的 Fade 组件 */}
                <Fade in={showDropdown}>
                    <Paper
                        elevation={4}
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            maxHeight: 300,
                            overflowY: 'auto',
                            zIndex: 1,
                            mt: 1,
                        }}
                        role="listbox"
                        id="project-listbox"
                    >
                        <List ref={listRef}>
                            {filteredProjects.map((project, index) => {
                                const projectName = project.split('/').pop();
                                const isHighlighted = index === highlightedIndex;

                                return (
                                    <ListItem
                                        key={project}
                                        disablePadding
                                        selected={isHighlighted}
                                        sx={{
                                            backgroundColor: isHighlighted ? 'action.hover' : 'transparent',
                                        }}
                                        role="option"
                                        aria-selected={isHighlighted}
                                    >
                                        <ListItemButton onClick={() => handleProjectSelect(project)}>
                                            <ListItemText
                                                primary={
                                                    <span>
                                                        {projectName.split('').map((char, idx) => {
                                                            const regex = new RegExp(`(${debouncedSearchTerm})`, 'gi');
                                                            if (debouncedSearchTerm && regex.test(char)) {
                                                                return (
                                                                    <span
                                                                        key={idx}
                                                                        style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}
                                                                    >
                                                                        {char}
                                                                    </span>
                                                                );
                                                            }
                                                            return char;
                                                        })}
                                                    </span>
                                                }
                                                sx={{ color: '#000000' }} // 黑色文字
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Paper>
                </Fade>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                        disabled={!selectedProject}
                        size="large"
                        sx={{
                            transition: 'background-color 0.3s ease',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        确认
                    </Button>
                </Box>

                {/* 右侧小 Logo */}
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <Tooltip title="请使用 Ctrl+D (Cmd+D) 收藏此页面">
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                alert('请使用 Ctrl+D (Cmd+D) 收藏此页面。');
                            }}
                            sx={{
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                },
                            }}
                        >
                            <FavoriteIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="我的项目地址">
                        <IconButton
                            color="inherit"
                            component="a"
                            href="https://github.com/zzsyppt/llm-eco-viz"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                },
                            }}
                        >
                            <GitHubIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProjectSelection;
