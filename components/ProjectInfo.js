import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Avatar, 
    Chip, 
    Link,
    Grid,
    Divider,
    Skeleton,
    IconButton,
    Tooltip,
    Popover
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GavelIcon from '@mui/icons-material/Gavel';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip as ChartTooltip,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartTooltip,
    Filler
);

const ProjectInfo = ({ project }) => {
    const [repoInfo, setRepoInfo] = useState(null);
    const [hfInfo, setHfInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starHistory, setStarHistory] = useState([]);
    const [forkHistory, setForkHistory] = useState([]);
    const [issueHistory, setIssueHistory] = useState([]);

    const miniChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#000',
                bodyColor: '#666',
                borderColor: '#ddd',
                borderWidth: 1,
                padding: 8,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return context.parsed.y.toLocaleString();
                    }
                }
            },
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        },
        elements: {
            line: {
                tension: 0.4
            },
            point: {
                radius: 0
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    useEffect(() => {
        const fetchRepoInfo = async () => {
            try {
                // 获取 GitHub 仓库信息
                const response = await fetch(`https://api.github.com/repos/${project}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRepoInfo(data);
                    
                    // 获取历史数据
                    const [owner, repo] = project.split('/');
                    const historyResponse = await fetch(`/api/data/${owner}/${repo}/all`);
                    if (historyResponse.ok) {
                        const historyData = await historyResponse.json();
                        // 处理 stars 数据
                        if (historyData.stars) {
                            const formattedStars = historyData.stars.map(item => ({
                                date: new Date(item.date).toLocaleDateString(),
                                value: item.value
                            }));
                            setStarHistory(formattedStars.slice(-6));
                        }
                        // 处理 technical_fork 数据
                        if (historyData.technical_fork) {
                            const formattedForks = historyData.technical_fork.map(item => ({
                                date: new Date(item.date).toLocaleDateString(),
                                value: item.value
                            }));
                            setForkHistory(formattedForks.slice(-6));
                        }
                        // 处理 issues_new 数据
                        if (historyData.issues_new) {
                            const formattedIssues = historyData.issues_new.map(item => ({
                                date: new Date(item.date).toLocaleDateString(),
                                value: item.value
                            }));
                            setIssueHistory(formattedIssues.slice(-6));
                        }
                    }
                    
                    // 尝试获取 Hugging Face 信息
                    try {
                        const hfResponse = await fetch(`https://huggingface.co/api/models/${project}`);
                        if (hfResponse.ok) {
                            const hfData = await hfResponse.json();
                            setHfInfo(hfData);
                        }
                    } catch (error) {
                        console.log('No Hugging Face model found:', error);
                    }
                } else {
                    console.error('Failed to fetch repo info:', response.status);
                }
            } catch (error) {
                console.error('Error fetching repo info:', error);
            } finally {
                setLoading(false);
            }
        };

        if (project) {
            fetchRepoInfo();
        }
    }, [project]);

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" sx={{ mt: 1 }} width="60%" />
                <Skeleton variant="text" width="40%" />
            </Box>
        );
    }

    if (!repoInfo) {
        return (
            <Typography color="error">
                无法加载仓库信息
            </Typography>
        );
    }

    const starChartData = {
        labels: starHistory.map(item => item.date),
        datasets: [{
            data: starHistory.map(item => item.value),
            fill: true,
            borderColor: '#f0b400',
            backgroundColor: 'rgba(240, 180, 0, 0.1)',
        }]
    };

    const forkChartData = {
        labels: forkHistory.map(item => item.date),
        datasets: [{
            data: forkHistory.map(item => item.value),
            fill: true,
            borderColor: '#2e7d32',
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
        }]
    };

    const issueChartData = {
        labels: issueHistory.map(item => item.date),
        datasets: [{
            data: issueHistory.map(item => item.value),
            fill: true,
            borderColor: '#0288d1',
            backgroundColor: 'rgba(2, 136, 209, 0.1)',
        }]
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                    src={repoInfo.owner.avatar_url}
                    alt={repoInfo.owner.login}
                    sx={{ 
                        width: 40, 
                        height: 40,
                        mr: 2,
                        border: '2px solid',
                        borderColor: 'primary.main'
                    }}
                />
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Link
                            href={repoInfo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                {repoInfo.name}
                            </Typography>
                        </Link>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="在 GitHub 中查看">
                                <IconButton 
                                    size="small" 
                                    href={repoInfo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <GitHubIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            {hfInfo && (
                                <Tooltip title="在 Hugging Face 中查看">
                                    <IconButton 
                                        size="small"
                                        href={`https://huggingface.co/${project}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Box 
                                            component="img" 
                                            src="/hf-logo.svg" 
                                            sx={{ width: 20, height: 20 }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {repoInfo.description}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={6} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
                            <Typography>
                                {repoInfo.stargazers_count.toLocaleString()} Stars
                            </Typography>
                        </Box>
                        <Box sx={{ height: 40 }}>
                            {starHistory.length > 0 && (
                                <Line data={starChartData} options={miniChartOptions} />
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ForkRightIcon sx={{ color: 'success.main', mr: 1 }} />
                            <Typography>
                                {repoInfo.forks_count.toLocaleString()} Forks
                            </Typography>
                        </Box>
                        <Box sx={{ height: 40 }}>
                            {forkHistory.length > 0 && (
                                <Line data={forkChartData} options={miniChartOptions} />
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccountTreeIcon sx={{ color: 'info.main', mr: 1 }} />
                            <Typography>
                                {repoInfo.open_issues_count.toLocaleString()} Issues
                            </Typography>
                        </Box>
                        <Box sx={{ height: 40 }}>
                            {issueHistory.length > 0 && (
                                <Line data={issueChartData} options={miniChartOptions} />
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GavelIcon sx={{ color: 'secondary.main', mr: 1, fontSize: '1.25rem' }} />
                            <Typography sx={{ fontSize: '0.95rem' }}>
                                {repoInfo.license?.name || 'No License'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DescriptionIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.25rem' }} />
                            <Link
                                href={`${repoInfo.html_url}/blob/main/README.md`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    textDecoration: 'none',
                                    color: 'text.primary',
                                    fontSize: '0.95rem',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                查看项目文档
                            </Link>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {repoInfo.topics.map((topic) => (
                    <Link
                        key={topic}
                        href={`https://github.com/topics/${topic}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'none'
                            }
                        }}
                    >
                        <Chip
                            label={topic}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(25, 118, 210, 0.08)',
                                color: 'primary.main',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: 'rgba(25, 118, 210, 0.16)',
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        />
                    </Link>
                ))}
            </Box>
        </Box>
    );
};

export default ProjectInfo; 