// components/Footer.js
import React from 'react';
import {
    Box,
    Container,
    Typography,
    Link,
    Grid,
    Divider,
    IconButton
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

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
                    <Grid item xs={12} md={4}>
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
                                    fontSize: '0.875rem'
                                }}
                            >
                                专业的 AI 大模型生态系统分析平台，助力开发者洞察技术趋势，把握创新机遇。
                            </Typography>
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
                        </Box>
                    </Grid>

                    {/* 功能链接 */}
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
                            功能
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {[
                                { name: '项目总览', href: '/overview' },
                                { name: '智能分析', href: '/analytics' },
                                { name: '图表中心', href: '/charts' },
                                { name: '生态洞察', href: '/insights' }
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
                                'React + Next.js',
                                'Material-UI',
                                'ECharts',
                                'Supabase'
                            ].map((tech) => (
                                <Typography
                                    key={tech}
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        fontSize: '0.875rem',
                                        py: 0.5
                                    }}
                                >
                                    {tech}
                                </Typography>
                            ))}
                        </Box>
                    </Grid>

                    {/* 联系信息 */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 2,
                                fontSize: '0.875rem'
                            }}
                        >
                            关于项目
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                lineHeight: 1.6,
                                fontSize: '0.875rem',
                                mb: 2
                            }}
                        >
                            基于 OpenDigger 数据集构建的开源项目分析平台，为开发者社区提供深度洞察。
                        </Typography>
                        <Link
                            href="https://github.com/X-lab2017/open-digger"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="text.secondary"
                            underline="none"
                            sx={{
                                fontSize: '0.875rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    color: '#007AFF',
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            OpenDigger 数据集 →
                        </Link>
                    </Grid>
                </Grid>

                <Divider 
                    sx={{ 
                        my: 4,
                        borderColor: 'rgba(0, 0, 0, 0.08)'
                    }} 
                />

                {/* 版权信息 */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
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
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: '0.875rem',
                            fontWeight: 400
                        }}
                    >
                        Made with ❤️ for the Open Source Community
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
