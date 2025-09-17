// src/components/VitalCharts/BloodPressureChart.js
import React from 'react';
import BaseVitalChart from './BaseVitalChart';

const BloodPressureChart = ({ data, height = 300 }) => {
  const customTooltip = (value, name) => [
    `${value} mmHg`,
    name === 'systolic' ? 'Systolic' : 'Diastolic'
  ];

  return (
    <BaseVitalChart
      data={data}
      dataKey="systolic"
      secondaryDataKey="diastolic"
      color="#ef4444"
      secondaryColor="#3b82f6"
      unit="mmHg"
      label="Blood Pressure"
      height={height}
      customTooltip={customTooltip}
    />
  );
};

export default BloodPressureChart;
