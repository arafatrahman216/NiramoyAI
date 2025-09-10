// ==============================================
// VITALS LOG STEP COMPONENT
// ==============================================
// Step for logging vital signs and measurements
import React from 'react';
import { Heart, Thermometer, Weight, Activity, Droplets, Gauge } from 'lucide-react';

const VitalsLogStep = ({ formData, handleInputChange }) => {
  const getStressLevelColor = (level) => {
    if (level <= 3) return 'text-green-400';
    if (level <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStressLevelText = (level) => {
    if (level <= 2) return 'Very Low';
    if (level <= 4) return 'Low';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'High';
    return 'Very High';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Vital Signs</h2>
        <p className="text-zinc-400">Record your current health measurements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Pressure */}
        <div className="md:col-span-2">
          <label className="flex items-center text-zinc-300 mb-3">
            <Heart className="w-5 h-5 mr-2 text-red-400" />
            Blood Pressure (mmHg)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                placeholder="120"
                value={formData.blood_pressure_systolic}
                onChange={(e) => handleInputChange('blood_pressure_systolic', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-red-400 focus:outline-none transition-colors hover:border-zinc-600"
              />
              <label className="text-xs text-zinc-500 mt-1 block">Systolic (top)</label>
            </div>
            <div>
              <input
                type="number"
                placeholder="80"
                value={formData.blood_pressure_diastolic}
                onChange={(e) => handleInputChange('blood_pressure_diastolic', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-red-400 focus:outline-none transition-colors hover:border-zinc-600"
              />
              <label className="text-xs text-zinc-500 mt-1 block">Diastolic (bottom)</label>
            </div>
          </div>
        </div>

        {/* Blood Sugar */}
        <div>
          <label className="flex items-center text-zinc-300 mb-2">
            <Droplets className="w-5 h-5 mr-2 text-blue-400" />
            Blood Sugar (mg/dL)
          </label>
          <input
            type="number"
            placeholder="90"
            value={formData.blood_sugar}
            onChange={(e) => handleInputChange('blood_sugar', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-400 focus:outline-none transition-colors hover:border-zinc-600"
          />
        </div>

        {/* Heart Rate */}
        <div>
          <label className="flex items-center text-zinc-300 mb-2">
            <Activity className="w-5 h-5 mr-2 text-red-500" />
            Heart Rate (bpm)
          </label>
          <input
            type="number"
            placeholder="72"
            value={formData.heart_rate}
            onChange={(e) => handleInputChange('heart_rate', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none transition-colors hover:border-zinc-600"
          />
        </div>

        {/* Oxygen Saturation */}
        <div>
          <label className="flex items-center text-zinc-300 mb-2">
            <Gauge className="w-5 h-5 mr-2 text-cyan-400" />
            Oxygen Saturation (%)
          </label>
          <input
            type="number"
            placeholder="98"
            min="0"
            max="100"
            value={formData.oxygen_saturation}
            onChange={(e) => handleInputChange('oxygen_saturation', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none transition-colors hover:border-zinc-600"
          />
        </div>

        {/* Temperature */}
        <div>
          <label className="flex items-center text-zinc-300 mb-2">
            <Thermometer className="w-5 h-5 mr-2 text-orange-400" />
            Temperature (°F)
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="98.6"
            value={formData.temperature}
            onChange={(e) => handleInputChange('temperature', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-400 focus:outline-none transition-colors hover:border-zinc-600"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="flex items-center text-zinc-300 mb-2">
            <Weight className="w-5 h-5 mr-2 text-purple-400" />
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="70"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-purple-400 focus:outline-none transition-colors hover:border-zinc-600"
          />
        </div>

        {/* Stress Level */}
        <div>
          <label className="flex items-center text-zinc-300 mb-2">
            <Activity className="w-5 h-5 mr-2 text-yellow-400" />
            Stress Level (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.stress_level || 5}
            onChange={(e) => handleInputChange('stress_level', e.target.value)}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>1 (Low)</span>
            <span className={`font-medium ${getStressLevelColor(formData.stress_level)}`}>
              {formData.stress_level ? `${formData.stress_level} - ${getStressLevelText(formData.stress_level)}` : '5 - Moderate'}
            </span>
            <span>10 (High)</span>
          </div>
        </div>

        {/* Date and Time */}
        <div>
          <label className="block text-zinc-300 mb-2">Date</label>
          <input
            type="date"
            value={formData.log_date}
            onChange={(e) => handleInputChange('log_date', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors hover:border-zinc-600"
          />
        </div>

        <div>
          <label className="block text-zinc-300 mb-2">Time</label>
          <input
            type="time"
            value={formData.log_time}
            onChange={(e) => handleInputChange('log_time', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors hover:border-zinc-600"
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #065f46;
          box-shadow: 0 0 0 1px #065f46;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #065f46;
          box-shadow: 0 0 0 1px #065f46;
        }
      `}</style>
    </div>
  );
};

export default VitalsLogStep;
