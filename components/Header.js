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
    Collapse,
    Slide,
    Zoom
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
    
    // 根据当前路由自动判断是否显示搜索栏
    const shouldShowSearch = router.pathname !== '/';

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
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        minHeight: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* Logo和品牌名 - 左侧 */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            minWidth: 'fit-content'
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
                                    display: { xs: 'none', md: 'block' }
                                }}
                            >
                                GitHub 大模型生态系统可视化
                            </Typography>
                        </Link>
                    </Box>

                    {/* 中央导航菜单 - 包含搜索栏 */}
                    <Box 
                        sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, md: 2 },
                            flex: 1,
                            justifyContent: 'center'
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
                        
                        {/* 搜索栏 - 带动画效果 */}
                        <Fade in={shouldShowSearch} timeout={500}>
                            <Box 
                                sx={{ 
                                    display: shouldShowSearch ? 'block' : 'none',
                                    minWidth: '200px',
                                    maxWidth: '320px',
                                    mx: 1,
                                    position: 'relative'
                                }}
                            >
                                <Zoom in={shouldShowSearch} timeout={300}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(45deg, rgba(0, 122, 255, 0.1), rgba(88, 86, 214, 0.1))',
                                                borderRadius: '12px',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                pointerEvents: 'none'
                                            },
                                            '&:hover::before': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <SearchComponent 
                                            compact={true}
                                            showAnalyzeButton={true}
                                            onProjectSelect={handleProjectSelect}
                                            placeholder="搜索项目..."
                                            backgroundColor="rgba(248, 249, 250, 0.8)"
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    borderRadius: '12px',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(0, 122, 255, 0.2)',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    '&:hover': {
                                                        borderColor: 'rgba(0, 122, 255, 0.4)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 12px rgba(0, 122, 255, 0.15)'
                                                    },
                                                    '&.Mui-focused': {
                                                        borderColor: 'rgba(0, 122, 255, 0.6)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 6px 20px rgba(0, 122, 255, 0.2)'
                                                    }
                                                },
                                                '& .MuiInputBase-input': {
                                                    fontSize: '0.875rem',
                                                    color: 'text.primary',
                                                    '&::placeholder': {
                                                        color: 'text.secondary',
                                                        opacity: 0.8
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                </Zoom>
                            </Box>
                        </Fade>
                        
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

                    {/* 右侧工具栏 */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            alignItems: 'center',
                            minWidth: 'fit-content'
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
