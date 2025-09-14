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

const VitalsChart = ({ patientId, charts }) => {
  const [vitalsData, setVitalsData] = useState([]);
  const [selectedVital, setSelectedVital] = useState('bloodPressure');

  useEffect(() => {
    setVitalsData(fallbackVitals);
    console.log('Health Log Data:', charts);
    console.log('Patient ID:', fallbackVitals);
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
      id: 'diabetes', 
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
        return <BloodPressureChart data={charts.bloodPressure} height={400} />;
      case 'heartRate':
        return <HeartRateChart data={charts.heartRate} height={400} />;
      case 'temperature':
        return <TemperatureChart data={charts.temperature} height={400} />;
      case 'diabetes':
        return <BloodSugarChart data={charts.diabetes} height={400} />;
      case 'stressLevel':
        return <StressLevelChart data={charts.stressLevel} height={400} />;
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
    </div>
  );
};

export default VitalsChart;
