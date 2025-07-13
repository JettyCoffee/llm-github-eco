import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Tab,
    Tabs,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Button,
    LinearProgress,
    Badge,
    Divider,
    Alert,
    AlertTitle,
    Tooltip,
    AvatarGroup
} from '@mui/material';
import {
    Person,
    Star,
    Code,
    GitHub,
    TrendingUp,
    Group,
    Public,
    LocationOn,
    Link as LinkIcon,
    Language,
    Assessment,
    EmojiEvents,
    Business,
    School,
    Verified,
    Timeline,
    WorkOutline,
    GroupWork,
    Insights,
    AutoGraph
} from '@mui/icons-material';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const Developers = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [sortBy, setSortBy] = useState('influence');
    const [category, setCategory] = useState('all');
    const [timeRange, setTimeRange] = useState('6m');
    const [showHeaderSearch, setShowHeaderSearch] = useState(true);
    const router = useRouter();

    // 模拟开发者数据
    const developersData = {
        overview: {
            totalDevelopers: 45600,
            activeDevelopers: 12300,
            newDevelopers: 2400,
            organizations: 890
        },
        topDevelopers: [
            {
                id: 1,
                name: 'Hugging Face Team',
                username: 'huggingface',
                type: 'organization',
                avatar: '/hf-logo.svg',
                followers: 89000,
                following: 245,
                publicRepos: 234,
                stars: 2400000,
                contributions: 15600,
                influence: 98.5,
                location: 'New York, USA',
                bio: 'The AI community building the future',
                specialties: ['NLP', 'Transformers', 'Diffusion', 'ML'],
                topProjects: ['transformers', 'diffusers', 'tokenizers', 'datasets'],
                verified: true,
                trending: true
            },
            {
                id: 2,
                name: 'OpenAI',
                username: 'openai',
                type: 'organization',
                avatar: '/githubcopilot.svg',
                followers: 156000,
                following: 89,
                publicRepos: 89,
                stars: 1800000,
                contributions: 8900,
                influence: 96.8,
                location: 'San Francisco, USA',
                bio: 'Creating safe AGI that benefits all of humanity',
                specialties: ['GPT', 'DALL-E', 'Codex', 'Whisper'],
                topProjects: ['gpt-3.5-turbo', 'whisper', 'gym', 'baselines'],
                verified: true,
                trending: false
            },
            {
                id: 3,
                name: 'Meta AI',
                username: 'facebookresearch',
                type: 'organization',
                avatar: '/githubcopilot.svg',
                followers: 67000,
                following: 120,
                publicRepos: 456,
                stars: 1200000,
                contributions: 12400,
                influence: 94.2,
                location: 'Menlo Park, USA',
                bio: 'Fundamental AI research at Meta',
                specialties: ['LLaMA', 'PyTorch', 'Computer Vision', 'NLP'],
                topProjects: ['llama', 'segment-anything', 'detectron2', 'pytorch'],
                verified: true,
                trending: true
            },
            {
                id: 4,
                name: 'Google Research',
                username: 'google-research',
                type: 'organization',
                avatar: '/githubcopilot.svg',
                followers: 89000,
                following: 67,
                publicRepos: 567,
                stars: 1500000,
                contributions: 16800,
                influence: 97.3,
                location: 'Mountain View, USA',
                bio: 'Google Research - Advancing AI for everyone',
                specialties: ['TensorFlow', 'JAX', 'BERT', 'T5'],
                topProjects: ['tensorflow', 'jax', 'bert', 'transformer'],
                verified: true,
                trending: false
            },
            {
                id: 5,
                name: 'Andrej Karpathy',
                username: 'karpathy',
                type: 'individual',
                avatar: '/githubcopilot.svg',
                followers: 234000,
                following: 89,
                publicRepos: 45,
                stars: 890000,
                contributions: 3400,
                influence: 95.6,
                location: 'San Francisco, USA',
                bio: 'AI researcher, educator, and former OpenAI/Tesla',
                specialties: ['Deep Learning', 'NLP', 'Computer Vision', 'Education'],
                topProjects: ['nanoGPT', 'micrograd', 'char-rnn', 'neuraltalk2'],
                verified: true,
                trending: true
            }
        ],
        contributionPatterns: [
            { category: 'NLP模型', developers: 12400, percentage: 32.5 },
            { category: '框架工具', developers: 8900, percentage: 23.4 },
            { category: '图像生成', developers: 6700, percentage: 17.6 },
            { category: '多模态', developers: 4800, percentage: 12.6 },
            { category: '数据集', developers: 3200, percentage: 8.4 },
            { category: '其他', developers: 2100, percentage: 5.5 }
        ],
        collaborationNetwork: [
            { name: 'Hugging Face x OpenAI', strength: 8.9, projects: 23 },
            { name: 'Meta x Google', strength: 7.2, projects: 18 },
            { name: 'Microsoft x OpenAI', strength: 9.1, projects: 31 },
            { name: 'Stability AI x Runway', strength: 6.8, projects: 14 },
            { name: 'Anthropic x EleutherAI', strength: 5.9, projects: 12 }
        ]
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const DeveloperCard = ({ developer, rank }) => (
        <Card sx={{ 
            mb: 2, 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Badge
                        badgeContent={rank}
                        color="primary"
                        sx={{
                            mr: 2,
                            '& .MuiBadge-badge': {
                                backgroundColor: rank <= 3 ? '#FFD700' : '#007AFF',
                                color: rank <= 3 ? '#000' : '#fff',
                                fontWeight: 'bold'
                            }
                        }}
                    >
                        <Avatar 
                            src={developer.avatar} 
                            sx={{ 
                                width: 56, 
                                height: 56,
                                border: developer.verified ? '2px solid #007AFF' : 'none'
                            }} 
                        />
                    </Badge>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                                {developer.name}
                            </Typography>
                            {developer.verified && (
                                <Verified sx={{ color: '#007AFF', fontSize: 20, mr: 1 }} />
                            )}
                            {developer.trending && (
                                <Chip 
                                    label="热门"
                                    size="small"
                                    sx={{ bgcolor: '#FF9800', color: 'white', fontSize: '0.7rem' }}
                                />
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            @{developer.username} • {developer.type === 'organization' ? '组织' : '个人开发者'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {developer.bio}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {developer.specialties.slice(0, 3).map((specialty, index) => (
                                <Chip
                                    key={index}
                                    label={specialty}
                                    size="small"
                                    sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}
                                />
                            ))}
                            {developer.specialties.length > 3 && (
                                <Chip
                                    label={`+${developer.specialties.length - 3}`}
                                    size="small"
                                    sx={{ bgcolor: '#F5F5F5', color: '#666' }}
                                />
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#007AFF' }}>
                            {developer.influence}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            影响力评分
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star sx={{ color: '#FFD700', fontSize: 18 }} />
                            <Typography variant="body2">{formatNumber(developer.stars)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Group sx={{ color: '#4CAF50', fontSize: 18 }} />
                            <Typography variant="body2">{formatNumber(developer.followers)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Code sx={{ color: '#FF9800', fontSize: 18 }} />
                            <Typography variant="body2">{developer.publicRepos}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Assessment sx={{ color: '#9C27B0', fontSize: 18 }} />
                            <Typography variant="body2">{formatNumber(developer.contributions)}</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ color: '#666', fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                            {developer.location}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            size="small"
                            startIcon={<GitHub />}
                            href={`https://github.com/${developer.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </Button>
                        <Button
                            size="small"
                            startIcon={<Assessment />}
                            onClick={() => router.push(`/developer/${developer.username}`)}
                        >
                            详细分析
                        </Button>
                    </Box>
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
                    {formatNumber(value)}
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
                            👥 开发者洞察
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                            分析开发者贡献模式，识别技术社区关键人物
                        </Typography>

                        <Alert severity="info" sx={{ mb: 3 }}>
                            <AlertTitle>开发者分析</AlertTitle>
                            基于GitHub活跃度、项目影响力、社区贡献等维度分析开发者在AI生态系统中的作用
                        </Alert>
                    </Box>

                    {/* 统计概览 */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="开发者总数"
                                value={developersData.overview.totalDevelopers}
                                icon={<Person />}
                                color="#007AFF"
                                subtitle="AI领域活跃开发者"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="活跃开发者"
                                value={developersData.overview.activeDevelopers}
                                icon={<TrendingUp />}
                                color="#4CAF50"
                                subtitle="近30天有贡献"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="新加入开发者"
                                value={developersData.overview.newDevelopers}
                                icon={<Star />}
                                color="#FF9800"
                                subtitle="本月新增"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="参与组织"
                                value={developersData.overview.organizations}
                                icon={<Business />}
                                color="#9C27B0"
                                subtitle="公司和机构"
                            />
                        </Grid>
                    </Grid>

                    {/* 筛选控制 */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>排序方式</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="排序方式"
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <MenuItem value="influence">影响力</MenuItem>
                                    <MenuItem value="stars">Star数</MenuItem>
                                    <MenuItem value="followers">关注者</MenuItem>
                                    <MenuItem value="contributions">贡献数</MenuItem>
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
                                    <MenuItem value="organization">组织</MenuItem>
                                    <MenuItem value="individual">个人</MenuItem>
                                    <MenuItem value="researcher">研究者</MenuItem>
                                    <MenuItem value="company">公司</MenuItem>
                                </Select>
                            </FormControl>

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
                                </Select>
                            </FormControl>
                        </Box>
                    </Paper>

                    <Grid container spacing={3}>
                        {/* 开发者排行榜 */}
                        <Grid item xs={12} lg={8}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EmojiEvents sx={{ mr: 1, color: '#FFD700' }} />
                                    影响力排行榜
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    {developersData.topDevelopers.map((developer, index) => (
                                        <DeveloperCard key={developer.id} developer={developer} rank={index + 1} />
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>

                        {/* 侧边栏信息 */}
                        <Grid item xs={12} lg={4}>
                            {/* 贡献分布 */}
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AutoGraph sx={{ mr: 1, color: '#007AFF' }} />
                                    贡献分布
                                </Typography>
                                <List>
                                    {developersData.contributionPatterns.map((pattern, index) => (
                                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                            <ListItemText
                                                primary={pattern.category}
                                                secondary={`${formatNumber(pattern.developers)} 位开发者`}
                                            />
                                            <ListItemSecondaryAction>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={pattern.percentage}
                                                        sx={{
                                                            width: 60,
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: 'grey.200',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: '#007AFF'
                                                            }
                                                        }}
                                                    />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {pattern.percentage}%
                                                    </Typography>
                                                </Box>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>

                            {/* 协作网络 */}
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <GroupWork sx={{ mr: 1, color: '#4CAF50' }} />
                                    协作网络
                                </Typography>
                                <List>
                                    {developersData.collaborationNetwork.map((collab, index) => (
                                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                            <ListItemText
                                                primary={collab.name}
                                                secondary={`${collab.projects} 个合作项目`}
                                            />
                                            <ListItemSecondaryAction>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                                                        {collab.strength}
                                                    </Typography>
                                                </Box>
                                            </ListItemSecondaryAction>
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

export default Developers; 