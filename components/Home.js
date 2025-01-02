import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    TextField, 
    Button,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Fade,
    Grid,
    Link
} from '@mui/material';
import { useRouter } from 'next/router';
import useDebounce from '../hooks/useDebounce';
import { getDeepestProjects } from '../utils/helpers';
import { ProjectContext } from '../contexts/ProjectContext';

const Home = () => {
    const { selectedProjects, setSelectedProjects } = useContext(ProjectContext);
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
    };

    const handleAnalyze = () => {
        if (!selectedProject) {
            alert('请选择一个项目');
            return;
        }
        setSelectedProjects([selectedProject]);
        router.push('/dashboard');
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
            sx={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: '64px',
                bgcolor: '#f8f9fa'
            }}
        >
            <Container maxWidth="md">
                <Box 
                    sx={{ 
                        textAlign: 'center',
                        py: 8
                    }}
                >
                    {/* 标题 */}
                    <Typography 
                        variant="h2" 
                        component="h1"
                        sx={{ 
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 20px rgba(33, 150, 243, 0.1)',
                            mb: 2
                        }}
                    >
                        LLM Ecosystem Visualization
                    </Typography>

                    {/* 副标题 */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
                        <Link
                            href="https://github.com/X-lab2017/open-digger"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'inline-block',
                                '&:hover': {
                                    opacity: 0.8
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src="/Data-OpenDigger-2097FF.svg"
                                alt="Data OpenDigger"
                                sx={{ 
                                    height: '20px'
                                }}
                            />
                        </Link>
                        <Link
                            href="https://github.com/zzsyppt/llm-eco-viz"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'inline-block',
                                '&:hover': {
                                    opacity: 0.8
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src="/Project-LLM-Eco-Viz-2196F3.svg"
                                alt="Project LLM Eco Viz"
                                sx={{ 
                                    height: '20px'
                                }}
                            />
                        </Link>
                    </Box>

                    {/* 项目介绍 */}
                    <Typography 
                        variant="body1"
                        sx={{ 
                            mb: 6,
                            color: 'text.secondary',
                            maxWidth: '800px',
                            mx: 'auto',
                            lineHeight: 1.8,
                            fontSize: '1.1rem'
                        }}
                    >
                        本项目致力于构建一个开源 AI 大模型生态分析与可视化平台。通过深入分析 GitHub 数据，我们提供了全方位的项目评估体系，
                        包括代码质量评估、社区活跃度分析、项目影响力衡量和维护状况追踪等多个维度。帮助开发者更好地了解和选择 AI 开源项目。
                    </Typography>

                    {/* 搜索框和下拉列表 */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            maxWidth: '800px',
                            mx: 'auto',
                            borderRadius: 5,
                            bgcolor: 'background.paper',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                            position: 'relative'
                        }}
                        ref={dropdownRef}
                    >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ position: 'relative', flex: 1 }}>
                                <TextField
                                    fullWidth
                                    placeholder="输入项目名称（例如：microsoft/deepspeed）进行分析"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setSelectedProject('');
                                    }}
                                    onKeyDown={handleKeyDown}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            bgcolor: '#f8f9fa'
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
                                            zIndex: 1,
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
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleAnalyze}
                                disabled={!selectedProject}
                                sx={{
                                    minWidth: '120px',
                                    borderRadius: 2,
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
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
                        </Box>
                    </Paper>
                </Box>

                {/* 功能介绍 */}
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        评分体系
                    </Typography>
                    <Typography 
                        component="div"
                        sx={{ 
                            color: 'text.secondary',
                            maxWidth: '800px',
                            mx: 'auto',
                            lineHeight: 1.8,
                            fontSize: '1.1rem',
                            textAlign: 'left'
                        }}
                    >
                        <Box component="ul" sx={{ pl: 2 }}>
                            <Box component="li" sx={{ mb: 2 }}>
                                <strong>代码质量与可维护性：</strong> 
                                <ul>
                                    <li>PR 质量趋势（40%）：分析 PR 接受率变化和当前水平</li>
                                    <li>代码审查效率（30%）：评估 PR 处理时间和改善趋势</li>
                                    <li>Issue 解决质量（30%）：衡量问题解决速度和效率提升</li>
                                </ul>
                            </Box>
                            <Box component="li" sx={{ mb: 2 }}>
                                <strong>社区活跃度与贡献：</strong>
                                <ul>
                                    <li>贡献者多样性（40%）：基于 Bus Factor 评估社区健康度</li>
                                    <li>新贡献者增长（30%）：追踪社区扩张速度和规模</li>
                                    <li>社区响应活跃度（30%）：分析 Issue 响应时间和改善情况</li>
                                </ul>
                            </Box>
                            <Box component="li" sx={{ mb: 2 }}>
                                <strong>项目影响力与应用：</strong>
                                <ul>
                                    <li>Stars 增长趋势（40%）：评估项目受欢迎程度</li>
                                    <li>技术影响力趋势（30%）：分析项目在生态中的地位</li>
                                    <li>Fork 应用情况（30%）：衡量项目的实际应用价值</li>
                                </ul>
                            </Box>
                            <Box component="li">
                                <strong>项目维护与更新：</strong>
                                <ul>
                                    <li>维护频率趋势（40%）：评估项目活动水平和增长情况</li>
                                    <li>维护稳定性（30%）：分析活动波动和改善趋势</li>
                                    <li>维护持续性（30%）：追踪长期维护质量和连续性</li>
                                </ul>
                            </Box>
                        </Box>
                    </Typography>
                </Box>

                {/* 数据分析与可视化 */}
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        数据分析与可视化
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>项目关注度分析</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    追踪 Stars、Attention 等指标的变化趋势，展示项目在社区中的关注度变化
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>代码变更分析</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    分析代码提交、PR 处理和 Issue 解决等行为，展示项目的开发活动特征
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>活跃度追踪</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    监控项目整体活跃度和 OpenRank 变化，反映项目的综合发展状况
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* 技术架构 */}
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        技术架构
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>前端技术栈</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • Next.js 15 + React 19<br/>
                                    • Material-UI 组件库<br/>
                                    • ECharts 数据可视化<br/>
                                    • Tailwind CSS 样式管理
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>数据处理</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • OpenDigger 数据源<br/>
                                    • Python 数据分析<br/>
                                    • Supabase 数据存储<br/>
                                    • RESTful API 接口
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>部署环境</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • Vercel 平台部署<br/>
                                    • GitHub Actions CI/CD<br/>
                                    • 环境变量配置<br/>
                                    • 自动化构建部署
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* 开发团队 */}
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        开发团队
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>@zzsyppt</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • 评分算法设计与实现<br/>
                                    • 数据分析模块开发<br/>
                                    • 可视化图表设计<br/>
                                    • 前端架构搭建
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>@JettyCoffee</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • 数据获取与处理<br/>
                                    • API 接口开发<br/>
                                    • 前端界面实现<br/>
                                    • 项目部署维护
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;