// src/components/PatientProfile/VitalsChart.js
import React, { useState, useEffect } from 'react';
import { TrendingUp, Heart, Thermometer, Activity, Droplet, Zap } from 'lucide-react';
import {
  BloodPressureChart,
  HeartRateChart,
  TemperatureChart,
  BloodSugarChart,
  StressLevelChart
} from '../VitalCharts';
import { fallbackVitals } from '../../utils/dummyData';

const VitalsChart = ({ patientId }) => {
  const [vitalsData, setVitalsData] = useState([]);
  const [selectedVital, setSelectedVital] = useState('bloodPressure');

  useEffect(() => {
    setVitalsData(fallbackVitals);
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

  const renderChart = () => {
    const data = vitalsData[selectedVital] || [];

    switch (selectedVital) {
      case 'bloodPressure':
        return <BloodPressureChart data={data} height={400} />;
      case 'heartRate':
        return <HeartRateChart data={data} height={400} />;
      case 'temperature':
        return <TemperatureChart data={data} height={400} />;
      case 'bloodSugar':
        return <BloodSugarChart data={data} height={400} />;
      case 'stressLevel':
        return <StressLevelChart data={data} height={400} />;
      default:
        return <div className="text-gray-400 text-center py-8">No chart available</div>;
    }
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
