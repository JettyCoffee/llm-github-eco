// components/Header.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppBar, Toolbar, Button, Box, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradientTypography from './GradientTypography'; // 自定义组件，用于渐变文字

const Header = () => {
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                {/* 左侧 Logo 和标题 */}
                <Box display="flex" alignItems="center" flexGrow={1}>
                    <Link href="/">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} />
                    </Link>
                    <GradientTypography variant="h6" sx={{ ml: 2 }}>
                        LLM Ecosystem Visualization
                    </GradientTypography>
                </Box>

                {/* 中间导航选项 */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 2, justifyContent: 'center' }}>
                    <Link href="/" passHref>
                        <Button color="inherit">首页</Button>
                    </Link>
                    <Link href="/rankings" passHref>
                        <Button color="inherit">排行榜</Button>
                    </Link>
                    <Link href="https://huggingface.co" passHref>
                        <Button color="inherit" target="_blank" rel="noopener noreferrer">HuggingFace</Button>
                    </Link>
                </Box>

                {/* 右侧小 Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
                    {/* 收藏页面按钮（需要浏览器支持） */}
                    <Tooltip title="收藏此页面">
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                if (window.sidebar && window.sidebar.addPanel) { // Firefox <=22
                                    window.sidebar.addPanel(document.title, window.location.href, '');
                                } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorites
                                    window.external.AddFavorite(location.href, document.title);
                                } else if (window.opera && window.print) { // Opera <=12
                                    this.title = document.title;
                                    return true;
                                } else { // Webkit - Chrome/Safari
                                    alert('请使用 Ctrl+D (Cmd+D) 收藏此页面。');
                                }
                            }}
                        >
                            <FavoriteIcon />
                        </IconButton>
                    </Tooltip>

                    {/* GitHub 项目链接按钮 */}
                    <Tooltip title="我的项目地址">
                        <IconButton
                            color="inherit"
                            component="a"
                            href="https://github.com/zzsyppt/llm-eco-viz"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GitHubIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
