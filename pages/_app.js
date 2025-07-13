// pages/_app.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { ProjectProvider } from '../contexts/ProjectContext';
import Header from '../components/Header';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import Head from 'next/head';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>GitHub LLM Eco</title>
                <link rel="icon" href="/githubcopilot.svg" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ProjectProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Header />
                    <Component {...pageProps} />
                </ThemeProvider>
            </ProjectProvider>
        </CacheProvider>
    );
}

export default MyApp;

