// pages/index.js
import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import ParticlesBackground from '../components/ParticlesBackground';

export default function Home() {
  return (
    <>
      <Head>
        <title>开源数据发展趋势仪表盘</title>
        <meta name="description" content="开源数据发展趋势仪表盘" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ParticlesBackground />
      <Dashboard />
    </>
  );
}
