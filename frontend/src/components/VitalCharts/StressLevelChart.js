// src/components/VitalCharts/StressLevelChart.js
import React from 'react';
import BaseVitalChart from './BaseVitalChart';

const StressLevelChart = ({ data, height = 300 }) => {
  return (
    <BaseVitalChart
      data={data}
      dataKey="level"
      color="#8b5cf6"
      unit="/10"
      label="Stress Level"
      height={height}
    />
  );
};

export default StressLevelChart;
