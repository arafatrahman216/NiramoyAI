// src/components/User/Chart.js
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

const Chart = ({ 
  data, 
  dataKey, 
  title, 
  subtitle, 
  icon, 
  color, 
  gradientId, 
  unit, 
  healthVitals,
  chartType // 'bloodPressure', 'diabetes', 'heartRate'
}) => {
  const getDataSource = () => {
    switch(chartType) {
      case 'bloodPressure': return healthVitals.bloodPressure;
      case 'diabetes': return healthVitals.diabetes;
      case 'heartRate': return healthVitals.heartRate;
      default: return data;
    }
  };

  const formatTooltipLabel = (value, payload) => {
    if (payload && payload.length > 0 && payload[0].payload) {
      const data = payload[0].payload;
      const date = data.date ? new Date(data.date).toLocaleDateString() : '';
      const time = data.time ? new Date(data.time).toLocaleTimeString() : '';
      return `${date} ${time}`.trim();
    }
    return `Health Log #${value}`;
  };

  const formatXAxisTick = (value) => {
    const dataSource = getDataSource();
    const dataPoint = dataSource.find(item => item.healthLogId === value);
    if (dataPoint && dataPoint.date) {
      return new Date(dataPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return value;
  };

  const formatTooltipValue = (value, name) => {
    if (chartType === 'bloodPressure') {
      return [`${value} ${unit}`, name === 'systolic' ? 'Systolic' : 'Diastolic'];
    }
    return [`${value} ${unit}`, name];
  };

  const renderLines = () => {
    if (chartType === 'bloodPressure') {
      return (
        <>
          <Line 
            type="monotone" 
            dataKey="systolic" 
            stroke="#22c55e" 
            strokeWidth={3}
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: '#ffffff' }}
          />
          <Line 
            type="monotone" 
            dataKey="diastolic" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
          />
        </>
      );
    }
    
    return (
      <Line 
        type="monotone" 
        dataKey={dataKey}
        stroke={color} 
        strokeWidth={3}
        dot={{ fill: color, strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#ffffff' }}
        fill={gradientId ? `url(#${gradientId})` : undefined}
      />
    );
  };

  const renderGradients = () => {
    if (chartType === 'bloodPressure') {
      return (
        <>
          <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </>
      );
    }
    
    if (gradientId) {
      return (
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3" style={{background: `linear-gradient(to right, ${color}, ${color}aa)`}}>
          <span className="text-white text-lg">{icon}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={getDataSource()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            {renderGradients()}
          </defs>
          <CartesianGrid strokeDasharray="2 2" stroke="#374151" strokeOpacity={0.5} />
          <XAxis 
            dataKey="healthLogId" 
            stroke="#9ca3af" 
            fontSize={12}
            tickFormatter={formatXAxisTick}
          />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb'
            }}
            labelFormatter={formatTooltipLabel}
            formatter={formatTooltipValue}
          />
          {renderLines()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
