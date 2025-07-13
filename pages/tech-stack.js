import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    AlertTitle,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Button,
    Divider,
    IconButton,
    Tooltip,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    Code,
    TrendingUp,
    TrendingDown,
    Language,
    Build,
    Assessment,
    Timeline,
    CompareArrows,
    Speed,
    Memory,
    Storage,
    CloudQueue,
    Security,
    Widgets,
    DataObject,
    Api,
    DeviceHub
} from '@mui/icons-material';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const TechStack = () => {
    const [category, setCategory] = useState('all');
    const [timeRange, setTimeRange] = useState('6m');
    const [sortBy, setSortBy] = useState('popularity');
    const [showHeaderSearch, setShowHeaderSearch] = useState(true);
    const router = useRouter();

    // 模拟技术栈数据
    const techStackData = {
        languages: [
            { name: 'Python', projects: 8400, percentage: 68.5, trend: 'up', growth: 12.3, color: '#3776AB' },
            { name: 'JavaScript', projects: 2100, percentage: 17.2, trend: 'up', growth: 8.7, color: '#F7DF1E' },
            { name: 'TypeScript', projects: 1800, percentage: 14.7, trend: 'up', growth: 25.4, color: '#3178C6' },
            { name: 'C++', projects: 890, percentage: 7.3, trend: 'stable', growth: 2.1, color: '#00599C' },
            { name: 'Rust', projects: 560, percentage: 4.6, trend: 'up', growth: 34.8, color: '#CE422B' },
            { name: 'Go', projects: 450, percentage: 3.7, trend: 'up', growth: 15.2, color: '#00ADD8' },
            { name: 'Java', projects: 340, percentage: 2.8, trend: 'stable', growth: 1.3, color: '#ED8B00' },
            { name: 'Swift', projects: 280, percentage: 2.3, trend: 'up', growth: 18.9, color: '#FA7343' }
        ],
        frameworks: [
            { name: 'PyTorch', projects: 4200, percentage: 42.3, trend: 'up', stars: 73000, category: 'Deep Learning' },
            { name: 'TensorFlow', projects: 3800, percentage: 38.2, trend: 'stable', stars: 185000, category: 'Deep Learning' },
            { name: 'Transformers', projects: 2100, percentage: 21.1, trend: 'up', stars: 127000, category: 'NLP' },
            { name: 'FastAPI', projects: 1800, percentage: 18.1, trend: 'up', stars: 70000, category: 'Web Framework' },
            { name: 'React', projects: 1600, percentage: 16.1, trend: 'up', stars: 220000, category: 'Frontend' },
            { name: 'Gradio', projects: 1200, percentage: 12.1, trend: 'up', stars: 30000, category: 'UI Framework' },
            { name: 'Streamlit', projects: 980, percentage: 9.9, trend: 'up', stars: 32000, category: 'UI Framework' },
            { name: 'LangChain', projects: 890, percentage: 8.9, trend: 'up', stars: 89000, category: 'LLM Framework' }
        ],
        toolsAndLibraries: [
            { name: 'NumPy', usage: 89.2, category: 'Scientific Computing', description: '数值计算基础库' },
            { name: 'Pandas', usage: 76.8, category: 'Data Processing', description: '数据处理和分析' },
            { name: 'Matplotlib', usage: 68.4, category: 'Visualization', description: '数据可视化' },
            { name: 'Scikit-learn', usage: 62.1, category: 'Machine Learning', description: '机器学习工具包' },
            { name: 'OpenCV', usage: 58.7, category: 'Computer Vision', description: '计算机视觉库' },
            { name: 'Pillow', usage: 55.3, category: 'Image Processing', description: '图像处理库' },
            { name: 'CUDA', usage: 49.2, category: 'GPU Computing', description: 'GPU并行计算' },
            { name: 'Docker', usage: 72.5, category: 'Containerization', description: '容器化部署' }
        ],
        infrastructureTools: [
            { name: 'AWS', usage: 45.2, category: 'Cloud Platform', growth: 8.3 },
            { name: 'Google Cloud', usage: 32.8, category: 'Cloud Platform', growth: 12.7 },
            { name: 'Azure', usage: 28.4, category: 'Cloud Platform', growth: 15.2 },
            { name: 'Kubernetes', usage: 38.7, category: 'Orchestration', growth: 22.1 },
            { name: 'Redis', usage: 31.2, category: 'Database', growth: 6.8 },
            { name: 'PostgreSQL', usage: 41.9, category: 'Database', growth: 9.4 },
            { name: 'MongoDB', usage: 27.3, category: 'Database', growth: 11.2 },
            { name: 'Elasticsearch', usage: 23.8, category: 'Search Engine', growth: 14.5 }
        ],
        emergingTech: [
            { name: 'WebAssembly', adoption: 23.4, growth: 45.2, description: '高性能Web应用' },
            { name: 'ONNX', adoption: 34.7, growth: 38.9, description: '模型格式标准' },
            { name: 'TensorRT', adoption: 28.1, growth: 52.3, description: 'NVIDIA推理优化' },
            { name: 'OpenVINO', adoption: 19.6, growth: 41.8, description: 'Intel推理引擎' },
            { name: 'JAX', adoption: 15.8, growth: 67.4, description: 'Google研究框架' },
            { name: 'MLX', adoption: 12.3, growth: 89.2, description: 'Apple Silicon优化' }
        ]
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return <TrendingUp sx={{ color: '#4CAF50', fontSize: 20 }} />;
            case 'down':
                return <TrendingDown sx={{ color: '#F44336', fontSize: 20 }} />;
            default:
                return <Timeline sx={{ color: '#FFC107', fontSize: 20 }} />;
        }
    };

    const LanguageCard = ({ language, index }) => (
        <Card sx={{ 
            mb: 2, 
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: language.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        mr: 2
                    }}>
                        {index + 1}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {language.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatNumber(language.projects)} 个项目
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTrendIcon(language.trend)}
                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                            +{language.growth}%
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={language.percentage}
                        sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: language.color
                            }
                        }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 50 }}>
                        {language.percentage}%
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    const FrameworkCard = ({ framework }) => (
        <Card sx={{ 
            height: '100%',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {framework.name}
                    </Typography>
                    <Chip 
                        label={framework.category}
                        size="small"
                        sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Code sx={{ color: '#007AFF', fontSize: 18 }} />
                    <Typography variant="body2">
                        {formatNumber(framework.projects)} 个项目
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Assessment sx={{ color: '#FFD700', fontSize: 18 }} />
                    <Typography variant="body2">
                        {formatNumber(framework.stars)} stars
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={framework.percentage}
                        sx={{
                            flex: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: '#007AFF'
                            }
                        }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {framework.percentage}%
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                        p: 1, 
                        borderRadius: 2, 
                        bgcolor: `${color}20`, 
                        color: color,
                        mr: 2
                    }}>
                        {icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <>
            <Header showSearch={showHeaderSearch} />
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 8 }}>
                <Container maxWidth="xl">
                    {/* 页面标题 */}
                    <Box sx={{ py: 4 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #007AFF 30%, #5856D6 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2
                            }}
                        >
                            ⚙️ 技术栈分析
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                            深入分析项目技术栈选择，发现技术偏好和趋势
                        </Typography>

                        <Alert severity="info" sx={{ mb: 3 }}>
                            <AlertTitle>技术栈分析</AlertTitle>
                            基于GitHub项目的技术栈使用情况，分析编程语言、框架、工具的流行度和发展趋势
                        </Alert>
                    </Box>

                    {/* 统计概览 */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="编程语言"
                                value={techStackData.languages.length}
                                icon={<Language />}
                                color="#007AFF"
                                subtitle="主要编程语言种类"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="框架工具"
                                value={techStackData.frameworks.length}
                                icon={<Build />}
                                color="#4CAF50"
                                subtitle="热门框架和库"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="基础设施"
                                value={techStackData.infrastructureTools.length}
                                icon={<CloudQueue />}
                                color="#FF9800"
                                subtitle="云平台和数据库"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="新兴技术"
                                value={techStackData.emergingTech.length}
                                icon={<Speed />}
                                color="#9C27B0"
                                subtitle="前沿技术趋势"
                            />
                        </Grid>
                    </Grid>

                    {/* 筛选控制 */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>分类</InputLabel>
                                <Select
                                    value={category}
                                    label="分类"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <MenuItem value="all">全部</MenuItem>
                                    <MenuItem value="languages">编程语言</MenuItem>
                                    <MenuItem value="frameworks">框架工具</MenuItem>
                                    <MenuItem value="infrastructure">基础设施</MenuItem>
                                    <MenuItem value="emerging">新兴技术</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>时间范围</InputLabel>
                                <Select
                                    value={timeRange}
                                    label="时间范围"
                                    onChange={(e) => setTimeRange(e.target.value)}
                                >
                                    <MenuItem value="3m">3个月</MenuItem>
                                    <MenuItem value="6m">6个月</MenuItem>
                                    <MenuItem value="1y">1年</MenuItem>
                                    <MenuItem value="2y">2年</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>排序方式</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="排序方式"
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <MenuItem value="popularity">流行度</MenuItem>
                                    <MenuItem value="growth">增长率</MenuItem>
                                    <MenuItem value="projects">项目数</MenuItem>
                                    <MenuItem value="stars">Star数</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Paper>

                    <Grid container spacing={3}>
                        {/* 编程语言排行 */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Language sx={{ mr: 1, color: '#007AFF' }} />
                                    编程语言排行
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    {techStackData.languages.slice(0, 6).map((language, index) => (
                                        <LanguageCard key={language.name} language={language} index={index} />
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>

                        {/* 工具和库使用情况 */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Widgets sx={{ mr: 1, color: '#4CAF50' }} />
                                    工具和库使用情况
                                </Typography>
                                <List>
                                    {techStackData.toolsAndLibraries.map((tool, index) => (
                                        <ListItem key={index} sx={{ px: 0 }}>
                                            <ListItemText
                                                primary={tool.name}
                                                secondary={`${tool.category} - ${tool.description}`}
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={tool.usage}
                                                    sx={{
                                                        width: 80,
                                                        height: 4,
                                                        borderRadius: 2,
                                                        bgcolor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: '#4CAF50'
                                                        }
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ minWidth: 40 }}>
                                                    {tool.usage}%
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>

                        {/* 热门框架 */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Build sx={{ mr: 1, color: '#FF9800' }} />
                                    热门框架和库
                                </Typography>
                                <Grid container spacing={3} sx={{ mt: 1 }}>
                                    {techStackData.frameworks.map((framework, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <FrameworkCard framework={framework} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* 基础设施工具 */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CloudQueue sx={{ mr: 1, color: '#9C27B0' }} />
                                    基础设施工具
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>工具</TableCell>
                                                <TableCell>分类</TableCell>
                                                <TableCell align="right">使用率</TableCell>
                                                <TableCell align="right">增长率</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {techStackData.infrastructureTools.map((tool, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{tool.name}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={tool.category}
                                                            size="small"
                                                            sx={{ bgcolor: '#F3E5F5', color: '#7B1FA2' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">{tool.usage}%</TableCell>
                                                    <TableCell align="right">
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ color: '#4CAF50', fontWeight: 600 }}
                                                        >
                                                            +{tool.growth}%
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        {/* 新兴技术 */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Speed sx={{ mr: 1, color: '#F44336' }} />
                                    新兴技术趋势
                                </Typography>
                                <List>
                                    {techStackData.emergingTech.map((tech, index) => (
                                        <ListItem key={index} sx={{ px: 0 }}>
                                            <ListItemText
                                                primary={tech.name}
                                                secondary={tech.description}
                                            />
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {tech.adoption}%
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ color: '#4CAF50', fontWeight: 600 }}
                                                >
                                                    +{tech.growth}%
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default TechStack; 