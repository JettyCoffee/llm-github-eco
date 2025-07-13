// components/Footer.js
import React from 'react';
import {
    Box,
    Container,
    Typography,
    Link,
    Grid,
    Divider,
    IconButton,
    Chip,
    Stack,
    Grid2
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import LaunchIcon from '@mui/icons-material/Launch';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import SecurityIcon from '@mui/icons-material/Security';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import BugReportIcon from '@mui/icons-material/BugReport';
import FeedbackIcon from '@mui/icons-material/Feedback';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'rgba(249, 249, 249, 0.95)',
                backdropFilter: 'blur(40px) saturate(180%)',
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                py: 6,
                mt: 'auto'
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Logo 和简介 */}
                    <Grid item xs={12} md={3}>
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                GitHub 大模型生态系统可视化
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    lineHeight: 1.6,
                                    maxWidth: '300px',
                                    fontSize: '0.875rem',
                                    mb: 2
                                }}
                            >
                                专业的 AI 大模型生态系统分析平台，助力开发者洞察技术趋势，把握创新机遇。
                            </Typography>
                            
                            {/* 项目特色标签 */}
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                                <Chip 
                                    label="开源" 
                                    size="small" 
                                    variant="outlined"
                                    icon={<CodeIcon />}
                                    sx={{ fontSize: '0.75rem' }}
                                />
                                <Chip 
                                    label="实时数据" 
                                    size="small" 
                                    variant="outlined"
                                    icon={<DataObjectIcon />}
                                    sx={{ fontSize: '0.75rem' }}
                                />
                                <Chip 
                                    label="AI 分析" 
                                    size="small" 
                                    variant="outlined"
                                    icon={<RocketLaunchIcon />}
                                    sx={{ fontSize: '0.75rem' }}
                                />
                            </Stack>
                        </Box>
                        
                        {/* 社交媒体链接 */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                size="small"
                                href="https://github.com/JettyCoffee/llm-github-eco"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: 'text.secondary',
                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                    borderRadius: 2,
                                    width: 36,
                                    height: 36,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        color: '#007AFF',
                                        bgcolor: 'rgba(0, 122, 255, 0.1)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <GitHubIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                            <IconButton
                                size="small"
                                href="mailto:jettycoffee@gmail.com"
                                sx={{
                                    color: 'text.secondary',
                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                    borderRadius: 2,
                                    width: 36,
                                    height: 36,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        color: '#007AFF',
                                        bgcolor: 'rgba(0, 122, 255, 0.1)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <EmailIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* 核心功能 */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 2,
                                fontSize: '0.875rem'
                            }}
                        >
                            核心功能
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {[
                                { name: '项目总览', href: '/overview' },
                                { name: '智能分析', href: '/analytics' },
                                { name: '图表中心', href: '/charts' },
                                { name: '生态洞察', href: '/insights' },
                                { name: '数据仪表板', href: '/dashboard' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    color="text.secondary"
                                    underline="none"
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 400,
                                        py: 0.5,
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            color: '#007AFF',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* 专业分析 */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 2,
                                fontSize: '0.875rem'
                            }}
                        >
                            专业分析
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {[
                                { name: '项目排行榜', href: '/rankings' },
                                { name: '趋势分析', href: '/trends' },
                                { name: '开发者洞察', href: '/developers' },
                                { name: '技术栈分析', href: '/tech-stack' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    color="text.secondary"
                                    underline="none"
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 400,
                                        py: 0.5,
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            color: '#007AFF',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* 技术栈 */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 2,
                                fontSize: '0.875rem'
                            }}
                        >
                            技术栈
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {[
                                { name: 'React + Next.js', desc: '前端框架' },
                                { name: 'Material-UI', desc: '组件库' },
                                { name: 'ECharts', desc: '数据可视化' },
                                { name: 'Supabase', desc: '后端服务' },
                                { name: 'Vercel', desc: '部署平台' }
                            ].map((tech) => (
                                <Box key={tech.name} sx={{ py: 0.5 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: '0.875rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        {tech.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: '0.75rem',
                                            opacity: 0.8
                                        }}
                                    >
                                        {tech.desc}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* 帮助与支持 */}
                    <Grid item xs={12} md={3}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 2,
                                fontSize: '0.875rem'
                            }}
                        >
                            帮助与支持
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                            {[
                                { name: '使用指南', href: '/help', icon: <HelpIcon sx={{ fontSize: 14 }} /> },
                                { name: '常见问题', href: '/faq', icon: <InfoIcon sx={{ fontSize: 14 }} /> },
                                { name: '功能反馈', href: '/feedback', icon: <FeedbackIcon sx={{ fontSize: 14 }} /> },
                                { name: '报告问题', href: '/issues', icon: <BugReportIcon sx={{ fontSize: 14 }} /> }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    color="text.secondary"
                                    underline="none"
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 400,
                                        py: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            color: '#007AFF',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                        </Box>
                        
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                lineHeight: 1.6,
                                fontSize: '0.875rem',
                                mb: 2
                            }}
                        >
                            基于 <Link 
                                href="https://github.com/X-lab2017/open-digger"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="primary"
                                underline="none"
                                sx={{
                                    fontWeight: 500,
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                OpenDigger 数据集
                                <LaunchIcon sx={{ fontSize: 14 }} />
                            </Link> 构建的开源项目分析平台
                        </Typography>
                    </Grid>
                </Grid>

                <Divider 
                    sx={{ 
                        my: 4,
                        borderColor: 'rgba(0, 0, 0, 0.08)'
                    }} 
                />

                {/* 版权信息 */}
                <Grid2 container spacing={2} alignItems="center">
                    <Grid2 item xs={12} md={6}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontSize: '0.875rem',
                                fontWeight: 400
                            }}
                        >
                            © 2025 GitHub 大模型生态系统可视化. JettyCoffee. All rights reserved.
                        </Typography>
                    </Grid2>
                </Grid2>
            </Container>
        </Box>
    );
};

export default Footer;
