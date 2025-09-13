// src/components/VitalCharts/HeartRateChart.js
import React from 'react';
import BaseVitalChart from './BaseVitalChart';

const HeartRateChart = ({ data, height = 300 }) => {
  return (
    <BaseVitalChart
      data={data}
      dataKey="rate"
      color="#22c55e"
      unit="bpm"
      label="Heart Rate"
      height={height}
    />
  );
};

export default HeartRateChart;
