// pages/_app.js
import '../styles/globals.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* 预加载关键资源 */}
      <link rel="preload" href="/css/style.css" as="style" />
      <link
        rel="preload"
        href="https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js"
        as="script"
      />
      <link
        rel="preload"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        as="style"
      />

      {/* 引入 Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      {/* 异步加载非关键 JS */}
      <Script
        src="https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="lazyOnload"
      />

      {/* 使用 module 方式加载 JS */}
      <Script type="module" src="/js/main.js" strategy="lazyOnload" />
      <Script type="module" src="/js/charts.js" strategy="lazyOnload" />
      <Script type="module" src="/js/radar.js" strategy="lazyOnload" />

      {/* 渲染页面组件 */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
