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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Alert,
    AlertTitle,
    LinearProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Button
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Timeline,
    ShowChart,
    PieChart,
    BarChart,
    Assessment,
    Insights,
    Speed,
    TrendingFlat,
    ArrowUpward,
    ArrowDownward,
    Code,
    Star,
    Group,
    Update
} from '@mui/icons-material';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const Trends = () => {
    const [timeRange, setTimeRange] = useState('6m');
    const [category, setCategory] = useState('all');
    const [metricType, setMetricType] = useState('stars');
    const [showHeaderSearch, setShowHeaderSearch] = useState(true);
    const router = useRouter();

    // 模拟趋势数据
    const trendData = {
        overview: {
            totalProjects: 12500,
            growthRate: 15.2,
            activeProjects: 8900,
            newProjects: 1200
        },
        categories: [
            {
                name: 'NLP模型',
                projects: 4200,
                growth: 18.5,
                trend: 'up',
                color: '#007AFF'
            },
            {
                name: '图像生成',
                projects: 2800,
                growth: 25.3,
                trend: 'up',
                color: '#4CAF50'
            },
            {
                name: '多模态',
                projects: 1900,
                growth: 32.1,
                trend: 'up',
                color: '#FF9800'
            },
            {
                name: '框架工具',
                projects: 2100,
                growth: 8.7,
                trend: 'stable',
                color: '#9C27B0'
            },
            {
                name: '数据集',
                projects: 1500,
                growth: -5.2,
                trend: 'down',
                color: '#F44336'
            }
        ],
        hotTechnologies: [
            { name: 'Transformer', projects: 3400, growth: 22.1, trend: 'up' },
            { name: 'Diffusion', projects: 2100, growth: 45.6, trend: 'up' },
            { name: 'RAG', projects: 1800, growth: 38.9, trend: 'up' },
            { name: 'LoRA', projects: 1200, growth: 28.7, trend: 'up' },
            { name: 'RLHF', projects: 890, growth: 55.2, trend: 'up' },
            { name: 'Multi-Agent', projects: 650, growth: 67.3, trend: 'up' }
        ],
        emergingTrends: [
            {
                title: '多模态大模型崛起',
                description: '结合文本、图像、音频的多模态模型项目快速增长',
                growth: 45.2,
                projects: 342,
                timeframe: '近3个月'
            },
            {
                title: '边缘计算优化',
                description: '针对移动设备和边缘计算的模型压缩与优化',
                growth: 38.7,
                projects: 287,
                timeframe: '近3个月'
            },
            {
                title: '开源LLM生态',
                description: '开源大语言模型及其衍生项目爆发式增长',
                growth: 52.1,
                projects: 458,
                timeframe: '近6个月'
            },
            {
                title: '工具链完善',
                description: '训练、推理、部署等工具链项目日趋完善',
                growth: 29.4,
                projects: 195,
                timeframe: '近3个月'
            }
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
                return <TrendingFlat sx={{ color: '#FFC107', fontSize: 20 }} />;
        }
    };

    const TrendCard = ({ title, value, growth, icon, color }) => (
        <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                        p: 1, 
                        borderRadius: 2, 
                        bgcolor: `${color}20`, 
                        color: color,
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
                    {formatNumber(value)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {growth > 0 ? (
                        <ArrowUpward sx={{ color: '#4CAF50', fontSize: 16, mr: 0.5 }} />
                    ) : (
                        <ArrowDownward sx={{ color: '#F44336', fontSize: 16, mr: 0.5 }} />
                    )}
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: growth > 0 ? '#4CAF50' : '#F44336',
                            fontWeight: 600 
                        }}
                    >
                        {Math.abs(growth)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        vs 上月
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    const CategoryCard = ({ category }) => (
        <Card sx={{ 
            mb: 2, 
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: category.color,
                        mr: 2
                    }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {category.name}
                    </Typography>
                    {getTrendIcon(category.trend)}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: category.color, mb: 1 }}>
                    {formatNumber(category.projects)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    项目数量
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={Math.min(Math.abs(category.growth), 100)} 
                        sx={{ 
                            flex: 1, 
                            mr: 2,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: category.growth > 0 ? '#4CAF50' : '#F44336'
                            }
                        }}
                    />
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: category.growth > 0 ? '#4CAF50' : '#F44336',
                            fontWeight: 600,
                            minWidth: 60
                        }}
                    >
                        {category.growth > 0 ? '+' : ''}{category.growth}%
                    </Typography>
                </Box>
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
                            📈 趋势分析
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                            分析大模型技术发展趋势，预测未来发展方向
                        </Typography>

                        <Alert severity="info" sx={{ mb: 3 }}>
                            <AlertTitle>趋势分析</AlertTitle>
                            基于GitHub项目活跃度、贡献者增长、技术采用率等多维度数据进行趋势分析
                        </Alert>
                    </Box>

                    {/* 控制面板 */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>时间范围</InputLabel>
                                <Select
                                    value={timeRange}
                                    label="时间范围"
                                    onChange={(e) => setTimeRange(e.target.value)}
                                >
                                    <MenuItem value="1m">1个月</MenuItem>
                                    <MenuItem value="3m">3个月</MenuItem>
                                    <MenuItem value="6m">6个月</MenuItem>
                                    <MenuItem value="1y">1年</MenuItem>
                                    <MenuItem value="2y">2年</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>分类</InputLabel>
                                <Select
                                    value={category}
                                    label="分类"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <MenuItem value="all">全部</MenuItem>
                                    <MenuItem value="nlp">NLP模型</MenuItem>
                                    <MenuItem value="image">图像生成</MenuItem>
                                    <MenuItem value="multimodal">多模态</MenuItem>
                                    <MenuItem value="framework">框架工具</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>指标类型</InputLabel>
                                <Select
                                    value={metricType}
                                    label="指标类型"
                                    onChange={(e) => setMetricType(e.target.value)}
                                >
                                    <MenuItem value="stars">Star增长</MenuItem>
                                    <MenuItem value="forks">Fork增长</MenuItem>
                                    <MenuItem value="contributors">贡献者增长</MenuItem>
                                    <MenuItem value="projects">项目数量</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Paper>

                    {/* 总体趋势概览 */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TrendCard
                                title="项目总数"
                                value={trendData.overview.totalProjects}
                                growth={trendData.overview.growthRate}
                                icon={<Code />}
                                color="#007AFF"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TrendCard
                                title="活跃项目"
                                value={trendData.overview.activeProjects}
                                growth={12.8}
                                icon={<Update />}
                                color="#4CAF50"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TrendCard
                                title="新增项目"
                                value={trendData.overview.newProjects}
                                growth={28.4}
                                icon={<Star />}
                                color="#FF9800"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TrendCard
                                title="总贡献者"
                                value={45600}
                                growth={22.1}
                                icon={<Group />}
                                color="#9C27B0"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        {/* 分类趋势 */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PieChart sx={{ mr: 1, color: '#007AFF' }} />
                                    分类趋势分析
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    {trendData.categories.map((category, index) => (
                                        <CategoryCard key={index} category={category} />
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>

                        {/* 热门技术 */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ShowChart sx={{ mr: 1, color: '#4CAF50' }} />
                                    热门技术趋势
                                </Typography>
                                <List>
                                    {trendData.hotTechnologies.map((tech, index) => (
                                        <ListItem key={index} sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <Box sx={{ 
                                                    width: 24, 
                                                    height: 24, 
                                                    borderRadius: '50%', 
                                                    bgcolor: '#007AFF',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {index + 1}
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={tech.name}
                                                secondary={`${formatNumber(tech.projects)} 个项目`}
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getTrendIcon(tech.trend)}
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: '#4CAF50',
                                                        fontWeight: 600,
                                                        minWidth: 50
                                                    }}
                                                >
                                                    +{tech.growth}%
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>

                        {/* 新兴趋势 */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Insights sx={{ mr: 1, color: '#FF9800' }} />
                                    新兴趋势洞察
                                </Typography>
                                <Grid container spacing={3} sx={{ mt: 1 }}>
                                    {trendData.emergingTrends.map((trend, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <Card sx={{ 
                                                height: '100%',
                                                transition: 'all 0.3s',
                                                '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                                            }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                                                            {trend.title}
                                                        </Typography>
                                                        <Chip 
                                                            label={trend.timeframe}
                                                            size="small"
                                                            sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        {trend.description}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Box>
                                                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                                                                +{trend.growth}%
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                增长率
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                {trend.projects}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                相关项目
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Button 
                                                        size="small" 
                                                        variant="outlined" 
                                                        fullWidth
                                                        sx={{ mt: 1 }}
                                                    >
                                                        查看详情
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default Trends; 