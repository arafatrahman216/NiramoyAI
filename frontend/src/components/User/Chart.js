// src/components/User/Chart.js
import React from 'react';
import {
  BloodPressureChart,
  HeartRateChart,
  BloodSugarChart
} from '../VitalCharts';

const Chart = ({ 
  title, 
  subtitle, 
  icon, 
  color, 
  healthVitals,
  chartType // 'bloodPressure', 'diabetes', 'heartRate'
}) => {
  const getDataSource = () => {
    switch(chartType) {
      case 'bloodPressure': return healthVitals.bloodPressure;
      case 'diabetes': return healthVitals.diabetes;
      case 'heartRate': return healthVitals.heartRate;
      default: return [];
    }
  };

  const renderChart = () => {
    const data = getDataSource();
    
    switch(chartType) {
      case 'bloodPressure':
        return <BloodPressureChart data={data} height={280} />;
      case 'heartRate':
        return <HeartRateChart data={data} height={280} />;
      case 'diabetes':
        return <BloodSugarChart data={data} height={280} />;
      default:
        return <div className="text-gray-400 text-center py-8">No chart available</div>;
    }
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
      
      {renderChart()}
    </div>
  );
};

export default Chart;
