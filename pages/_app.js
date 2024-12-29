// pages/_app.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { ProjectProvider } from '../contexts/ProjectContext';

function MyApp({ Component, pageProps }) {
    return (
        <ProjectProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </ProjectProvider>
    );
}

export default MyApp;
