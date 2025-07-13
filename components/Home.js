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
    Link,
    Chip
} from '@mui/material';
import { useRouter } from 'next/router';
import useDebounce from '../hooks/useDebounce';
import { getDeepestProjects } from '../utils/helpers';
import { ProjectContext } from '../contexts/ProjectContext';
import GitHubIcon from '@mui/icons-material/GitHub';

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
                        Github 大模型生态系统可视化
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
                            href="https://github.com/JettyCoffee/llm-github-eco"
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
                                src="/Project-LLM-Github-Eco-2196F3.svg"
                                alt="Project LLM Github Eco"
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
                        本平台依托 GitHub 丰富的开源数据，打造业界领先的 AI 大模型生态系统分析与可视化工具。我们通过多维度、全方位的数据挖掘与智能可视化，助力开发者、研究者和企业洞察大模型生态的最新趋势与核心竞争力。无论是技术选型、生态评估还是创新决策，这里都能为您提供权威、直观、深入的分析支持，助力把握 AI 时代的每一次机遇！

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
                                    placeholder="输入 GitHub 项目名称（例如：langchain-chatchat）进行分析"
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
                {/* 使用指南 */}
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 6,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        使用指南
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {/* GitHub项目分析 */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <GitHubIcon sx={{ fontSize: 28, mr: 2, color: 'text.primary' }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        GitHub项目分析
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'left' }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                        1. 搜索与选择
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, pl: 2 }}>
                                        • 在主页搜索框输入项目名称<br/>
                                        • 从下拉列表选择目标项目<br/>
                                        • 点击"分析"按钮开始分析
                                    </Typography>

                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                        2. 查看评分详情
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, pl: 2 }}>
                                        • 点击评分卡片查看详细指标<br/>
                                        • 了解代码质量评分依据<br/>
                                        • 分析社区活跃度数据<br/>
                                        • 评估项目影响力表现
                                    </Typography>

                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                        3. 使用时序图表
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                                        • 调整时间范围分析趋势<br/>
                                        • 使用缩放工具查看细节<br/>
                                        • 导出数据生成分析报告
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Hugging Face模型排行 */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Box 
                                        component="img"
                                        src="/hf-logo.svg"
                                        alt="Hugging Face"
                                        sx={{ height: 28, mr: 2 }}
                                    />
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        Hugging Face分析
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'left' }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                        1. 模型排行榜
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, pl: 2 }}>
                                        • 点击导航栏"模型排行"进入<br/>
                                        • 使用筛选器选择任务类型<br/>
                                        • 按各项指标进行排序<br/>
                                        • 搜索特定模型查看详情
                                    </Typography>

                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                        2. 生态网络分析
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, pl: 2 }}>
                                        • 点击"view"查看网络图<br/>
                                        • 选择不同的视图模式：<br/>
                                        &nbsp;&nbsp;- Top 100衍生模型<br/>
                                        &nbsp;&nbsp;- 完整衍生关系<br/>
                                        &nbsp;&nbsp;- 按作者分组视图<br/>
                                        • 交互式探索网络关系
                                    </Typography>

                                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', color: 'primary.main', mb: 2 }}>
                                        3. 生态大屏分析
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                                        • 查看语言支持分布<br/>
                                        • 分析作者影响力排名<br/>
                                        • 了解组织类型分布<br/>
                                        • 掌握任务类型热度
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* 技术实现 */}
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        技术实现
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
                                <Typography variant="h6" gutterBottom>数据获取与处理</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • OpenDigger 数据集<br/>
                                    • Hugging Face API<br/>
                                    • 网页爬虫<br/>
                                    • Easy Graph 图计算<br/>
                                    • 数据预处理流水线<br/>
                                    • 增量数据更新
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
                                <Typography variant="h6" gutterBottom>前端开发</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • Next.js 15 + React 19<br/>
                                    • Material-UI 组件库<br/>
                                    • ECharts 数据可视化<br/>
                                    • PyVis 网络图<br/>
                                    • Tailwind CSS<br/>
                                    • 响应式设计
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
                                <Typography variant="h6" gutterBottom>后端服务</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • Flask 框架<br/>
                                    • 影响力算法<br/>
                                    • RESTful API<br/>
                                    • 数据预处理<br/>
                                    • 缓存优化<br/>
                                    • 性能监控
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* 影响力算法 */}
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        影响力算法
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
                                <Typography variant="h6" gutterBottom>自身影响力计算</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    基于以下因素综合计算：<br/>
                                    • 下载量（对数加权）<br/>
                                    • 点赞数（线性加权）<br/>
                                    • Space应用影响力<br/>
                                    • 时间衰减因子<br/><br/>
                                    计算公式：<br/>
                                    I_self = W₁·log(downloads) + W₂·likes + W₃·I_spaces + W₄·e^(-λt)
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
                                <Typography variant="h6" gutterBottom>总影响力计算</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    迭代计算三个部分：<br/>
                                    • 自身影响力（α₁权重）<br/>
                                    • 子模型影响力（α₂权重）<br/>
                                    • 父模型影响力（α₃权重）<br/><br/>
                                    计算公式：<br/>
                                    I_total = α₁·I_self + α₂·I_child + α₃·I_parent
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* 项目架构 */}
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        项目架构
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
                                <Typography variant="h6" gutterBottom>数据获取模块</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    • 模型元数据获取<br/>
                                    &nbsp;&nbsp;- 基础信息采集<br/>
                                    &nbsp;&nbsp;- 下载量统计<br/>
                                    &nbsp;&nbsp;- 点赞数追踪<br/>
                                    • 作者信息采集<br/>
                                    &nbsp;&nbsp;- 个人/组织识别<br/>
                                    &nbsp;&nbsp;- 影响力评估<br/>
                                    • 衍生关系分析<br/>
                                    &nbsp;&nbsp;- Model Tree 构建<br/>
                                    &nbsp;&nbsp;- 关系类型识别
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
                                <Typography variant="h6" gutterBottom>数据处理模块</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    • 图数据处理<br/>
                                    &nbsp;&nbsp;- 节点属性定义<br/>
                                    &nbsp;&nbsp;- 边关系构建<br/>
                                    &nbsp;&nbsp;- 图计算优化<br/>
                                    • 影响力计算<br/>
                                    &nbsp;&nbsp;- 自身影响力<br/>
                                    &nbsp;&nbsp;- 关系传播<br/>
                                    • 数据预处理<br/>
                                    &nbsp;&nbsp;- 清洗与过滤<br/>
                                    &nbsp;&nbsp;- 格式标准化
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
                                <Typography variant="h6" gutterBottom>可视化模块</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    • 排行榜系统<br/>
                                    &nbsp;&nbsp;- 多维度排序<br/>
                                    &nbsp;&nbsp;- 实时更新<br/>
                                    &nbsp;&nbsp;- 筛选功能<br/>
                                    • 网络关系图<br/>
                                    &nbsp;&nbsp;- 多视图切换<br/>
                                    &nbsp;&nbsp;- 交互式探索<br/>
                                    • 数据大屏<br/>
                                    &nbsp;&nbsp;- 实时统计<br/>
                                    &nbsp;&nbsp;- 趋势分析
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* 未来规划 */}
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4,
                            fontWeight: 600,
                            color: 'text.primary'
                        }}
                    >
                        未来规划
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
                                <Typography variant="h6" gutterBottom>数据扩展</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    • 扩大数据采集范围<br/>
                                    • 增加历史数据分析<br/>
                                    • 引入更多评估维度<br/>
                                    • 优化数据更新机制
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
                                <Typography variant="h6" gutterBottom>功能优化</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    • 完善评分算法<br/>
                                    • 增强可视化效果<br/>
                                    • 提升用户交互体验<br/>
                                    • 添加更多分析维度
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
                                <Typography variant="h6" gutterBottom>生态拓展</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                                    • 支持更多开源平台<br/>
                                    • 深化生态分析<br/>
                                    • 开放数据接口<br/>
                                    • 建立开发者社区
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