// components/ChartCard.js
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Paper, Typography } from '@mui/material';

const ChartCard = ({ title, chartId, chartOptions }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current && chartOptions) {
            const chart = echarts.init(chartRef.current);
            chart.setOption(chartOptions);

            // 清理函数
            return () => {
                chart.dispose();
            };
        }
    }, [chartOptions]);

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <div id={chartId} ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
        </Paper>
    );
};

export default ChartCard;
