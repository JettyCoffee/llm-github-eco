// components/Header.js
import React from 'react';
import { 
    AppBar, 
    Toolbar, 
    Box, 
    IconButton, 
    Container,
    Typography,
    Link
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Header = () => {
    return (
        <AppBar 
            position="fixed" 
            color="inherit" 
            elevation={0}
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        minHeight: '56px',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* 左侧 Logo 和品牌名 */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                src="/header-logo.png"
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
                                    fontSize: '1.125rem',
                                    fontWeight: 500,
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Github 大模型生态系统可视化
                            </Typography>
                        </Link>
                    </Box>

                    {/* 中间导航菜单 */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            gap: 4,
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <Link
                            href="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                py: 1,
                                px: 2,
                                borderRadius: 1,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            首页
                        </Link>
                        <Link
                            href="/dashboard"
                            sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                py: 1,
                                px: 2,
                                borderRadius: 1,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            项目分析
                        </Link>
                    </Box>

                    {/* 右侧工具栏 */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <IconButton 
                            size="small"
                            sx={{
                                color: 'text.primary',
                                '&:hover': { color: 'primary.main' }
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
                                '&:hover': { color: 'primary.main' },
                                transition: 'color 0.3s ease'
                            }}
                        >
                            <GitHubIcon sx={{ fontSize: 20 }} />
                            <Typography 
                                variant="body2"
                                sx={{ 
                                    fontWeight: 500,
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                网站项目地址
                            </Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
