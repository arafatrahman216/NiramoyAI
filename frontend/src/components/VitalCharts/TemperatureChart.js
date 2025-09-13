// src/components/VitalCharts/TemperatureChart.js
import React from 'react';
import BaseVitalChart from './BaseVitalChart';

const TemperatureChart = ({ data, height = 300 }) => {
  return (
    <BaseVitalChart
      data={data}
      dataKey="temp"
      color="#f59e0b"
      unit="°F"
      label="Temperature"
      height={height}
    />
  );
};

export default TemperatureChart;
