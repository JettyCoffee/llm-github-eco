// components/ChartCard.js
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ChartCard = ({ title, chartId, chartOptions }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && chartOptions) {
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.setOption(chartOptions);

      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }
      };
    }
  }, [chartOptions]);

  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div
        className="chart-container"
        id={chartId}
        ref={chartRef}
        style={{ height: '100%', width: '100%' }}
      ></div>
    </div>
  );
};

export default ChartCard;
