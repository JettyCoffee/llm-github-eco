import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, 
    TextField, 
    Button,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Fade
} from '@mui/material';
import { useRouter } from 'next/router';
import useDebounce from '../hooks/useDebounce';

const SearchComponent = ({ 
    compact = false,
    showAnalyzeButton = true,
    onProjectSelect,
    placeholder = "输入 GitHub 项目名称（例如：langchain-chatchat）进行分析",
    backgroundColor = '#f8f9fa'
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availableProjects, setAvailableProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const router = useRouter();
    const dropdownRef = useRef(null);
    const listRef = useRef(null);

    // 获取所有项目
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects/search?q=');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                setAvailableProjects(data.map(project => project.full_name));
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
            const searchProjects = async () => {
                try {
                    const response = await fetch(`/api/projects/search?q=${encodeURIComponent(debouncedSearchTerm)}`);
                    if (!response.ok) throw new Error('Failed to search projects');
                    const data = await response.json();
                    const projectNames = data.map(project => project.full_name);
                    setFilteredProjects(projectNames);
                    setShowDropdown(projectNames.length > 0);
                    setHighlightedIndex(-1);
                } catch (error) {
                    console.error('Error searching projects:', error);
                }
            };

            searchProjects();
        }
    }, [debouncedSearchTerm]);

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

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setSearchTerm(project.split('/').pop());
        setShowDropdown(false);
        setHighlightedIndex(-1);
        
        // 如果有外部回调，调用它
        if (onProjectSelect) {
            onProjectSelect(project);
        }
    };

    const handleAnalyze = () => {
        if (!selectedProject) {
            alert('请选择一个项目');
            return;
        }
        
        // 如果有外部回调，调用它，否则使用默认导航
        if (onProjectSelect) {
            onProjectSelect(selectedProject);
        } else {
            router.push(`/dashboard?project=${encodeURIComponent(selectedProject)}`);
        }
    };

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
        <Box
            ref={dropdownRef}
            sx={{
                position: 'relative',
                width: '100%',
                maxWidth: compact ? '400px' : '100%'
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                gap: compact ? 1 : 2, 
                alignItems: 'center',
                borderRadius: compact ? 1 : 2,
                ...(compact && {
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden'
                })
            }}>
                <Box sx={{ position: 'relative', flex: 1 }}>
                    <TextField
                        fullWidth
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedProject('');
                        }}
                        onKeyDown={handleKeyDown}
                        variant="outlined"
                        size={compact ? "small" : "medium"}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: compact ? 0 : 2,
                                bgcolor: backgroundColor,
                                fontSize: compact ? '0.875rem' : '1rem',
                                height: compact ? '40px' : 'auto',
                                ...(compact && {
                                    border: 'none',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        border: 'none'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: 'none'
                                    }
                                })
                            }
                        }}
                    />
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
                                zIndex: 1000,
                                mt: 1,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
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
                                        >
                                            <ListItemButton onClick={() => handleProjectSelect(project)}>
                                                <ListItemText
                                                    primary={project}
                                                    secondary={projectName}
                                                    primaryTypographyProps={{
                                                        variant: 'body2',
                                                        sx: { fontWeight: 500 }
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Paper>
                    </Fade>
                </Box>
                {showAnalyzeButton && (
                    <Button
                        variant="contained"
                        size={compact ? "small" : "large"}
                        onClick={handleAnalyze}
                        disabled={!selectedProject}
                        sx={{
                            minWidth: compact ? '80px' : '120px',
                            height: compact ? '40px' : 'auto',
                            borderRadius: compact ? 0 : 2,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            boxShadow: compact ? 'none' : '0 3px 5px 2px rgba(33, 150, 243, .3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
                            },
                            '&.Mui-disabled': {
                                background: 'rgba(0, 0, 0, 0.12)'
                            }
                        }}
                    >
                        分析
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default SearchComponent; 