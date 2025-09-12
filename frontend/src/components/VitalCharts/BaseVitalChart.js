// src/components/VitalCharts/BaseVitalChart.js
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BaseVitalChart = ({ 
  data, 
  dataKey, 
  color, 
  unit, 
  label,
  height = 300,
  customTooltip,
  secondaryDataKey,
  secondaryColor,
  formatTooltipLabel
}) => {
  const defaultTooltipFormatter = (value, name) => [
    `${value} ${unit}`,
    name
  ];

  const defaultLabelFormatter = (value, payload) => {
    if (formatTooltipLabel) {
      return formatTooltipLabel(value, payload);
    }
    if (payload && payload.length > 0 && payload[0].payload) {
      const data = payload[0].payload;
      const date = new Date(value).toLocaleDateString();
      const time = data.time || '';
      return `${date} ${time}`;
    }
    return new Date(value).toLocaleDateString();
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id={`${dataKey}Gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
          {secondaryColor && (
            <linearGradient id={`${secondaryDataKey}Gradient`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={secondaryColor} stopOpacity={0}/>
            </linearGradient>
          )}
        </defs>
        <CartesianGrid strokeDasharray="2 2" stroke="#374151" strokeOpacity={0.5} />
        <XAxis 
          dataKey="date" 
          stroke="#9ca3af" 
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#f9fafb'
          }}
          labelFormatter={defaultLabelFormatter}
          formatter={customTooltip || defaultTooltipFormatter}
        />
        <Line 
          type="monotone" 
          dataKey={dataKey}
          stroke={color} 
          strokeWidth={3}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#ffffff' }}
          fill={`url(#${dataKey}Gradient)`}
        />
        {secondaryDataKey && (
          <Line 
            type="monotone" 
            dataKey={secondaryDataKey}
            stroke={secondaryColor} 
            strokeWidth={3}
            dot={{ fill: secondaryColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: secondaryColor, strokeWidth: 2, fill: '#ffffff' }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BaseVitalChart;
