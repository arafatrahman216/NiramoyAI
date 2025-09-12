// src/components/PatientProfile/VitalsChart.js
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Heart, Thermometer, Activity, Droplet, Zap } from 'lucide-react';

const VitalsChart = ({ patientId }) => {
  const [vitalsData, setVitalsData] = useState([]);
  const [selectedVital, setSelectedVital] = useState('bloodPressure');

  // Fallback vitals data
  const fallbackVitalsData = {
    bloodPressure: [
      { date: '2025-09-01', systolic: 125, diastolic: 82, time: '09:00' },
      { date: '2025-09-03', systolic: 128, diastolic: 85, time: '14:30' },
      { date: '2025-09-05', systolic: 122, diastolic: 79, time: '11:15' },
      { date: '2025-09-07', systolic: 120, diastolic: 80, time: '16:45' },
      { date: '2025-09-09', systolic: 118, diastolic: 78, time: '10:20' },
      { date: '2025-09-11', systolic: 120, diastolic: 80, time: '08:30' }
    ],
    heartRate: [
      { date: '2025-09-01', rate: 75, time: '09:00' },
      { date: '2025-09-03', rate: 78, time: '14:30' },
      { date: '2025-09-05', rate: 72, time: '11:15' },
      { date: '2025-09-07', rate: 74, time: '16:45' },
      { date: '2025-09-09', rate: 70, time: '10:20' },
      { date: '2025-09-11', rate: 72, time: '08:30' }
    ],
    temperature: [
      { date: '2025-09-01', temp: 98.4, time: '09:00' },
      { date: '2025-09-03', temp: 98.6, time: '14:30' },
      { date: '2025-09-05', temp: 98.2, time: '11:15' },
      { date: '2025-09-07', temp: 98.5, time: '16:45' },
      { date: '2025-09-09', temp: 98.3, time: '10:20' },
      { date: '2025-09-11', temp: 98.6, time: '08:30' }
    ],
    bloodSugar: [
      { date: '2025-09-01', level: 105, time: '09:00' },
      { date: '2025-09-03', level: 112, time: '14:30' },
      { date: '2025-09-05', level: 98, time: '11:15' },
      { date: '2025-09-07', level: 108, time: '16:45' },
      { date: '2025-09-09', level: 102, time: '10:20' },
      { date: '2025-09-11', level: 95, time: '08:30' }
    ],
    stressLevel: [
      { date: '2025-09-01', level: 3, time: '09:00' },
      { date: '2025-09-03', level: 5, time: '14:30' },
      { date: '2025-09-05', level: 2, time: '11:15' },
      { date: '2025-09-07', level: 4, time: '16:45' },
      { date: '2025-09-09', level: 3, time: '10:20' },
      { date: '2025-09-11', level: 2, time: '08:30' }
    ]
  };

  useEffect(() => {
    setVitalsData(fallbackVitalsData);
  }, [patientId]);

  const vitalTypes = [
    { 
      id: 'bloodPressure', 
      label: 'Blood Pressure', 
      icon: Heart, 
      color: '#ef4444',
      unit: 'mmHg'
    },
    { 
      id: 'heartRate', 
      label: 'Heart Rate', 
      icon: Activity, 
      color: '#22c55e',
      unit: 'bpm'
    },
    { 
      id: 'temperature', 
      label: 'Temperature', 
      icon: Thermometer, 
      color: '#f59e0b',
      unit: '°F'
    },
    { 
      id: 'bloodSugar', 
      label: 'Blood Sugar', 
      icon: Droplet, 
      color: '#3b82f6',
      unit: 'mg/dL'
    },
    { 
      id: 'stressLevel', 
      label: 'Stress Level', 
      icon: Zap, 
      color: '#8b5cf6',
      unit: '/10'
    }
  ];

  const formatTooltipLabel = (value, payload) => {
    if (payload && payload.length > 0 && payload[0].payload) {
      const data = payload[0].payload;
      const date = new Date(value).toLocaleDateString();
      const time = data.time || '';
      return `${date} ${time}`;
    }
    return new Date(value).toLocaleDateString();
  };

  const renderChart = () => {
    const data = vitalsData[selectedVital] || [];
    const vitalType = vitalTypes.find(v => v.id === selectedVital);

    if (selectedVital === 'bloodPressure') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
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
              labelFormatter={formatTooltipLabel}
              formatter={(value, name) => [
                `${value} mmHg`,
                name === 'systolic' ? 'Systolic' : 'Diastolic'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    const dataKey = selectedVital === 'heartRate' ? 'rate' 
                   : selectedVital === 'temperature' ? 'temp'
                   : 'level'; // for bloodSugar and stressLevel
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id={`${selectedVital}Gradient`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={vitalType.color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={vitalType.color} stopOpacity={0}/>
            </linearGradient>
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
            labelFormatter={formatTooltipLabel}
            formatter={(value) => [`${value} ${vitalType.unit}`, vitalType.label]}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey}
            stroke={vitalType.color} 
            strokeWidth={3}
            dot={{ fill: vitalType.color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: vitalType.color, strokeWidth: 2, fill: '#ffffff' }}
            fill={`url(#${selectedVital}Gradient)`}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Vitals Monitoring</h3>
        <TrendingUp className="w-6 h-6 text-emerald-400" />
      </div>

      {/* Vital Type Selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        {vitalTypes.map((vital) => {
          const IconComponent = vital.icon;
          return (
            <button
              key={vital.id}
              onClick={() => setSelectedVital(vital.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                selectedVital === vital.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {vital.label}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-gray-700/30 rounded-xl p-4">
        {renderChart()}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {vitalsData[selectedVital] && vitalsData[selectedVital].length > 0 && (
          <>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-1">Latest Reading</h4>
              <p className="text-lg font-semibold text-white">
                {selectedVital === 'bloodPressure' 
                  ? `${vitalsData[selectedVital][vitalsData[selectedVital].length - 1].systolic}/${vitalsData[selectedVital][vitalsData[selectedVital].length - 1].diastolic}`
                  : selectedVital === 'heartRate'
                  ? vitalsData[selectedVital][vitalsData[selectedVital].length - 1].rate
                  : selectedVital === 'temperature'
                  ? vitalsData[selectedVital][vitalsData[selectedVital].length - 1].temp
                  : vitalsData[selectedVital][vitalsData[selectedVital].length - 1].level
                }
                {selectedVital !== 'bloodPressure' && (
                  <span className="text-sm text-gray-400 ml-1">
                    {vitalTypes.find(v => v.id === selectedVital)?.unit}
                  </span>
                )}
              </p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-1">Average</h4>
              <p className="text-lg font-semibold text-white">
                {selectedVital === 'bloodPressure' 
                  ? `${Math.round(vitalsData[selectedVital].reduce((acc, curr) => acc + curr.systolic, 0) / vitalsData[selectedVital].length)}/${Math.round(vitalsData[selectedVital].reduce((acc, curr) => acc + curr.diastolic, 0) / vitalsData[selectedVital].length)}`
                  : selectedVital === 'heartRate'
                  ? Math.round(vitalsData[selectedVital].reduce((acc, curr) => acc + curr.rate, 0) / vitalsData[selectedVital].length)
                  : selectedVital === 'temperature'
                  ? Math.round(vitalsData[selectedVital].reduce((acc, curr) => acc + curr.temp, 0) / vitalsData[selectedVital].length * 10) / 10
                  : selectedVital === 'stressLevel'
                  ? Math.round(vitalsData[selectedVital].reduce((acc, curr) => acc + curr.level, 0) / vitalsData[selectedVital].length * 10) / 10
                  : Math.round(vitalsData[selectedVital].reduce((acc, curr) => acc + curr.level, 0) / vitalsData[selectedVital].length)
                }
                {selectedVital !== 'bloodPressure' && (
                  <span className="text-sm text-gray-400 ml-1">
                    {vitalTypes.find(v => v.id === selectedVital)?.unit}
                  </span>
                )}
              </p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-1">Total Readings</h4>
              <p className="text-lg font-semibold text-white">{vitalsData[selectedVital].length}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VitalsChart;
