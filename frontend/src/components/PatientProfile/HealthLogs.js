// src/components/PatientProfile/HealthLogs.js
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart, Thermometer, Activity, Droplet, Eye, Clipboard, Search, Filter, Zap } from 'lucide-react';

const HealthLogs = ({ patientId }) => {
  const [healthLogs, setHealthLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback health logs data
  const fallbackHealthLogs = [
    {
      id: 1,
      healthLogId: 'HL-2025-001',
      date: '2025-09-11',
      time: '08:30',
      vitals: {
        bloodPressure: { systolic: 120, diastolic: 80 },
        heartRate: 72,
        temperature: 98.6,
        weight: 165,
        bloodSugar: 95,
        oxygenSaturation: 98,
        stressLevel: 2
      },
      symptoms: ['None'],
      notes: 'Regular morning checkup. Patient feeling well.',
      severity: 'low'
    },
    {
      id: 2,
      healthLogId: 'HL-2025-002',
      date: '2025-09-09',
      time: '14:20',
      vitals: {
        bloodPressure: { systolic: 118, diastolic: 78 },
        heartRate: 70,
        temperature: 98.3,
        weight: 164,
        bloodSugar: 110,
        oxygenSaturation: 97,
        stressLevel: 5
      },
      symptoms: ['Mild headache', 'Fatigue'],
      notes: 'Patient reports mild headache after lunch. Advised rest and hydration.',
      severity: 'medium'
    },
    {
      id: 3,
      healthLogId: 'HL-2025-003',
      date: '2025-09-07',
      time: '16:45',
      vitals: {
        bloodPressure: { systolic: 120, diastolic: 80 },
        heartRate: 74,
        temperature: 98.5,
        weight: 165,
        bloodSugar: 88,
        oxygenSaturation: 99,
        stressLevel: 3
      },
      symptoms: ['None'],
      notes: 'Post-medication monitoring. Blood pressure stable.',
      severity: 'low'
    },
    {
      id: 4,
      healthLogId: 'HL-2025-004',
      date: '2025-09-05',
      time: '11:15',
      vitals: {
        bloodPressure: { systolic: 122, diastolic: 79 },
        heartRate: 72,
        temperature: 98.2,
        weight: 163,
        bloodSugar: 102,
        oxygenSaturation: 96,
        stressLevel: 8
      },
      symptoms: ['Chest discomfort', 'Shortness of breath'],
      notes: 'Patient experienced chest discomfort. ECG normal, symptoms resolved.',
      severity: 'high'
    },
    {
      id: 5,
      healthLogId: 'HL-2025-005',
      date: '2025-09-03',
      time: '14:30',
      vitals: {
        bloodPressure: { systolic: 128, diastolic: 85 },
        heartRate: 78,
        temperature: 98.6,
        weight: 164,
        bloodSugar: 92,
        oxygenSaturation: 98,
        stressLevel: 4
      },
      symptoms: ['None'],
      notes: 'Weekly routine checkup. All vitals within normal range.',
      severity: 'low'
    }
  ];

  useEffect(() => {
    setHealthLogs(fallbackHealthLogs);
    setFilteredLogs(fallbackHealthLogs);
  }, [patientId]);

  useEffect(() => {
    let filtered = healthLogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.healthLogId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [searchTerm, healthLogs]);

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

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs by ID, symptoms or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
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
            <div key={log.id} className="bg-gray-700/50 rounded-xl p-6 border border-gray-600/50">
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
                        {new Date(log.date).toLocaleDateString('en-US', { 
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
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)} bg-gray-600/50`}>
                  {log.severity.toUpperCase()}
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
                    {log.vitals.bloodPressure.systolic}/{log.vitals.bloodPressure.diastolic}
                  </p>
                </div>
                
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Activity className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-xs text-gray-400">Heart Rate</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.vitals.heartRate} bpm</p>
                </div>
                
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Thermometer className="w-4 h-4 text-orange-400 mr-2" />
                    <span className="text-xs text-gray-400">Temperature</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.vitals.temperature}°F</p>
                </div>
                
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <span className="w-4 h-4 text-purple-400 mr-2 text-xs font-bold">W</span>
                    <span className="text-xs text-gray-400">Weight</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.vitals.weight} lbs</p>
                </div>
                
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Droplet className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-xs text-gray-400">Blood Sugar</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.vitals.bloodSugar} mg/dL</p>
                </div>

                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Eye className="w-4 h-4 text-cyan-400 mr-2" />
                    <span className="text-xs text-gray-400">Oxygen</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{log.vitals.oxygenSaturation}%</p>
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
                    <span className={`text-sm font-semibold ${getStressLevelColor(log.vitals.stressLevel)}`}>
                      {log.vitals.stressLevel}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        log.vitals.stressLevel <= 3 ? 'bg-green-500' :
                        log.vitals.stressLevel <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${log.vitals.stressLevel * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              {log.symptoms.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Symptoms:</h5>
                  <div className="flex flex-wrap gap-2">
                    {log.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs ${
                          symptom === 'None' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Notes:</h5>
                <p className="text-gray-300 text-sm leading-relaxed">{log.notes}</p>
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
              ? Math.round(healthLogs.reduce((sum, log) => sum + log.vitals.bloodSugar, 0) / healthLogs.length)
              : 0
            } mg/dL
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Avg Stress Level</h4>
          <p className="text-2xl font-bold text-yellow-400">
            {healthLogs.length > 0 
              ? (healthLogs.reduce((sum, log) => sum + log.vitals.stressLevel, 0) / healthLogs.length).toFixed(1)
              : 0
            }/10
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Last Log</h4>
          <p className="text-lg font-semibold text-white">
            {healthLogs.length > 0 
              ? new Date(healthLogs[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'N/A'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthLogs;
