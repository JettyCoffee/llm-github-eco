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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ProjectInfo = ({ project }) => {
    const [repoInfo, setRepoInfo] = useState(null);
    const [hfInfo, setHfInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const handlePopoverOpen = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverContent('');
    };

    const open = Boolean(anchorEl);

    const metricsExplanations = {
        stars: `Stars 数量：
• 衡量项目受欢迎程度的重要指标
• 表示有多少用户对项目感兴趣
• 反映项目在开发者社区的影响力`,

        forks: `Forks 数量：
• 表示项目被复制的次数
• 反映项目的技术价值和复用性
• 也表示有多少开发者可能在基于此项目开发`,

        issues: `Issues 数量：
• 当前开放的问题和功能请求数量
• 反映项目的活跃度和维护状态
• 包括 bug 报告和新功能建议`,

        license: `开源许可证：
• 项目的法律使用条款
• 定义了代码的使用、修改和分发权限
• 影响项目在商业环境中的应用`,

        topics: `项目标签：
• 项目的技术领域和应用场景
• 帮助其他开发者快速理解项目用途
• 提高项目在相关领域的可发现性`
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
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'primary.main'
                            }
                        }}
                        onClick={(e) => handlePopoverOpen(e, metricsExplanations.stars)}
                    >
                        <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
                        <Typography>
                            {repoInfo.stargazers_count.toLocaleString()} Stars
                        </Typography>
                        <InfoOutlinedIcon 
                            sx={{ 
                                ml: 0.5, 
                                fontSize: 16, 
                                color: 'text.secondary',
                                opacity: 0.7
                            }} 
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'primary.main'
                            }
                        }}
                        onClick={(e) => handlePopoverOpen(e, metricsExplanations.forks)}
                    >
                        <ForkRightIcon sx={{ color: 'success.main', mr: 1 }} />
                        <Typography>
                            {repoInfo.forks_count.toLocaleString()} Forks
                        </Typography>
                        <InfoOutlinedIcon 
                            sx={{ 
                                ml: 0.5, 
                                fontSize: 16, 
                                color: 'text.secondary',
                                opacity: 0.7
                            }} 
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'primary.main'
                            }
                        }}
                        onClick={(e) => handlePopoverOpen(e, metricsExplanations.issues)}
                    >
                        <AccountTreeIcon sx={{ color: 'info.main', mr: 1 }} />
                        <Typography>
                            {repoInfo.open_issues_count.toLocaleString()} Issues
                        </Typography>
                        <InfoOutlinedIcon 
                            sx={{ 
                                ml: 0.5, 
                                fontSize: 16, 
                                color: 'text.secondary',
                                opacity: 0.7
                            }} 
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'primary.main'
                            }
                        }}
                        onClick={(e) => handlePopoverOpen(e, metricsExplanations.license)}
                    >
                        <GavelIcon sx={{ color: 'secondary.main', mr: 1 }} />
                        <Typography>
                            {repoInfo.license?.name || 'No License'}
                        </Typography>
                        <InfoOutlinedIcon 
                            sx={{ 
                                ml: 0.5, 
                                fontSize: 16, 
                                color: 'text.secondary',
                                opacity: 0.7
                            }} 
                        />
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box 
                sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    flexWrap: 'wrap',
                    cursor: 'pointer',
                    '&:hover': {
                        '& .MuiChip-root': {
                            bgcolor: 'rgba(25, 118, 210, 0.12)'
                        }
                    }
                }}
                onClick={(e) => handlePopoverOpen(e, metricsExplanations.topics)}
            >
                {repoInfo.topics.map((topic) => (
                    <Chip
                        key={topic}
                        label={topic}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                            color: 'primary.main',
                            transition: 'background-color 0.3s'
                        }}
                    />
                ))}
                <InfoOutlinedIcon 
                    sx={{ 
                        ml: 0.5, 
                        fontSize: 16, 
                        color: 'text.secondary',
                        opacity: 0.7,
                        alignSelf: 'center'
                    }} 
                />
            </Box>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                PaperProps={{
                    sx: {
                        p: 2,
                        maxWidth: 300,
                        bgcolor: 'background.paper',
                        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                        '& .MuiTypography-root': {
                            whiteSpace: 'pre-line'
                        }
                    }
                }}
            >
                <Typography variant="body2">
                    {popoverContent}
                </Typography>
            </Popover>
        </Box>
    );
};

export default ProjectInfo; 