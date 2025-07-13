// components/Header.js
import React, { useState, useEffect, useContext } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Box, 
    IconButton, 
    Container,
    Typography,
    Link,
    Fade,
    Collapse
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useRouter } from 'next/router';
import { ProjectContext } from '../contexts/ProjectContext';
import SearchComponent from './SearchComponent';

const Header = ({ showSearch = false }) => {
    const { setSelectedProjects } = useContext(ProjectContext);
    const router = useRouter();

    const handleProjectSelect = (project) => {
        setSelectedProjects([project]);
        router.push('/dashboard');
    };

    return (
        <AppBar 
            position="fixed" 
            color="inherit" 
            elevation={0}
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        minHeight: '64px',
                        position: 'relative'
                    }}
                >
                    {/* Logo和品牌名 - 始终在左侧 */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: showSearch ? 'translateX(0)' : 'translateX(0)',
                            zIndex: 2
                        }}
                    >
                        <Link
                            href="/"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'inherit'
                            }}
                        >
                            <Box
                                component="img"
                                src="/githubcopilot.svg"
                                alt="Logo"
                                sx={{
                                    width: 32,
                                    height: 32,
                                    mr: 1,
                                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.125rem' },
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #007AFF 30%, #5856D6 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: { xs: 'none', sm: showSearch ? 'none' : 'block', md: 'block' },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                GitHub 大模型生态系统可视化
                            </Typography>
                        </Link>
                    </Box>

                    {/* 中央导航菜单 */}
                    <Box 
                        sx={{ 
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: showSearch 
                                ? 'translate(-50%, -50%) scale(0.8) translateX(-80px)' 
                                : 'translate(-50%, -50%) scale(1)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: showSearch ? 0.7 : 1,
                            display: 'flex',
                            gap: { xs: 1, md: 3 },
                            alignItems: 'center',
                            zIndex: showSearch ? 1 : 2
                        }}
                    >
                        <Link
                            href="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                                fontWeight: 500,
                                py: 1,
                                px: { xs: 1, md: 2 },
                                borderRadius: 2,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                                    transform: 'translateY(-1px)',
                                }
                            }}
                        >
                            首页
                        </Link>
                        <Link
                            href="/overview"
                            sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                                fontWeight: 500,
                                py: 1,
                                px: { xs: 1, md: 2 },
                                borderRadius: 2,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                                    transform: 'translateY(-1px)',
                                }
                            }}
                        >
                            项目总览
                        </Link>
                        <Link
                            href="/analytics"
                            sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                                fontWeight: 500,
                                py: 1,
                                px: { xs: 1, md: 2 },
                                borderRadius: 2,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                                    transform: 'translateY(-1px)',
                                }
                            }}
                        >
                            数据分析
                        </Link>
                        <Link
                            href="/charts"
                            sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                                fontWeight: 500,
                                py: 1,
                                px: { xs: 1, md: 2 },
                                borderRadius: 2,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                                    transform: 'translateY(-1px)',
                                }
                            }}
                        >
                            图表中心
                        </Link>
                    </Box>

                    {/* 搜索框 - 从右侧滑入 */}
                    <Box 
                        sx={{ 
                            position: 'absolute',
                            right: showSearch ? '120px' : '-400px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            width: '300px',
                            zIndex: 3
                        }}
                    >
                        <SearchComponent 
                            compact={true}
                            showAnalyzeButton={true}
                            onProjectSelect={handleProjectSelect}
                            placeholder="搜索项目..."
                            backgroundColor="rgba(0, 122, 255, 0.1)"
                        />
                    </Box>

                    {/* 右侧工具栏 */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            alignItems: 'center',
                            marginLeft: 'auto',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            zIndex: 2
                        }}
                    >
                        <IconButton 
                            size="small"
                            sx={{
                                color: 'text.primary',
                                borderRadius: 2,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': { 
                                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            <DarkModeIcon sx={{ fontSize: 20 }} />
                        </IconButton>

                        <Box
                            component="a"
                            href="https://github.com/JettyCoffee/llm-github-eco"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: 'text.primary',
                                textDecoration: 'none',
                                borderRadius: 2,
                                px: 1,
                                py: 0.5,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': { 
                                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            <GitHubIcon sx={{ fontSize: 20 }} />
                            <Typography 
                                variant="body2"
                                sx={{ 
                                    fontWeight: 500,
                                    display: { xs: 'none', md: 'block' }
                                }}
                            >
                                项目GitHub地址
                            </Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
