// src/components/VitalCharts/BloodSugarChart.js
import React from 'react';
import BaseVitalChart from './BaseVitalChart';

const BloodSugarChart = ({ data, height = 300 }) => {
  return (
    <BaseVitalChart
      data={data}
      dataKey="sugar"
      color="#3b82f6"
      unit="mg/dL"
      label="Blood Sugar"
      height={height}
    />
  );
};

export default BloodSugarChart;
