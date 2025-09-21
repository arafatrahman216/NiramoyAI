// src/components/PatientProfile/HealthLogs.js
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart, Thermometer, Activity, Droplet, Eye, Clipboard, Search, Filter, Zap } from 'lucide-react';
import { fallbackHealthLogs } from '../../utils/dummyData';

const HealthLogs = ({ patientId ,healthLog}) => {
  const [healthLogs, setHealthLogs] = useState(healthLog || []);
  const [filteredLogs, setFilteredLogs] = useState(healthLog || []);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setHealthLogs(healthLog || fallbackHealthLogs);
    setFilteredLogs(healthLog || fallbackHealthLogs);
    console.log("Health Logs:", healthLog);
    console.log("Fallback Logs:", fallbackHealthLogs);
  }, [patientId]);


  const getStressLevelColor = (level) => {
    if (level <= 3) return 'text-green-400';
    if (level <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSeverityColor = (severity) => {
    return 'text-gray-400';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Health Logs</h3>
        <Clipboard className="w-6 h-6 text-emerald-400" />
      </div>

      {/* Health Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Clipboard className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No health logs found</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.healthLogId} className="bg-gray-700/50 rounded-xl p-6 border border-gray-600/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Clipboard className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Health Log</h4>
                    <p className="text-emerald-400 font-medium text-sm">ID: {log.healthLogId}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(log.logDatetime).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {log.time}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Heart className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-xs text-gray-400">Blood Pressure</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {log.bloodPressure}
                  </p>
                </div>
                
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Activity className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-xs text-gray-400">Heart Rate</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.heartRate} bpm</p>
                </div>
                
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Thermometer className="w-4 h-4 text-orange-400 mr-2" />
                    <span className="text-xs text-gray-400">Temperature</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.temperature}°F</p>
                </div>
                
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <span className="w-4 h-4 text-purple-400 mr-2 text-xs font-bold">W</span>
                    <span className="text-xs text-gray-400">Weight</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.weight} lbs</p>
                </div>
                
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Droplet className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-xs text-gray-400">Blood Sugar</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.bloodSugar} mg/dL</p>
                </div>

                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Eye className="w-4 h-4 text-cyan-400 mr-2" />
                    <span className="text-xs text-gray-400">Oxygen</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.oxygenSaturation}%</p>
                </div>
              </div>

              {/* Stress Level */}
              <div className="mb-4">
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="text-sm text-gray-400">Stress Level</span>
                    </div>
                    <span className={`text-sm font-semibold ${getStressLevelColor(log.stressLevel)}`}>
                      {log.stressLevel}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        log.stressLevel <= 3 ? 'bg-green-500' :
                        log.stressLevel <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${log.stressLevel * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              { log.otherSymptoms && log.otherSymptoms.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Symptoms:</h5>
                  <div className="flex flex-wrap gap-2">
                    {log.otherSymptoms.map((symptom, index) => (
                      <span key={index} className="bg-gray-600/30 rounded-lg px-3 py-1 text-xs font-semibold text-gray-300">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Notes:</h5>
                <p className="text-gray-300 text-sm leading-relaxed">{log.note}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Total Logs</h4>
          <p className="text-2xl font-bold text-white">{healthLogs.length}</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Avg Blood Sugar</h4>
          <p className="text-2xl font-bold text-blue-400">
            {healthLogs.length > 0 
              ? Math.round(healthLogs.reduce((sum, log) => sum + log.bloodSugar, 0) / healthLogs.length)
              : 0
            } mg/dL
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Avg Stress Level</h4>
          <p className="text-2xl font-bold text-yellow-400">
            {healthLogs.length > 0 
              ? (healthLogs.reduce((sum, log) => sum + log.stressLevel, 0) / healthLogs.length).toFixed(1)
              : 0
            }/10
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Last Log</h4>
          <p className="text-lg font-semibold text-white">
            {healthLogs.length > 0 
              ? new Date(healthLogs[0].logDatetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'N/A'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthLogs;
