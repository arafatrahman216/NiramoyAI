import React, { useState } from 'react';
import { Pill, Clock, Calendar, ChevronDown, ChevronUp, Bell } from 'lucide-react';

// Dummy medication data for a single day with some medications at same time
const dummyMedications = [
  {
    id: 1,
    name: "Metformin",
    dosage: "500mg",
    time: "08:00",
    instruction: "Take with breakfast",
    type: "tablet",
    status: "upcoming"
  },
  {
    id: 2,
    name: "Vitamin D",
    dosage: "1000IU",
    time: "08:00",
    instruction: "Take with breakfast",
    type: "capsule",
    status: "upcoming"
  },
  {
    id: 3,
    name: "Lisinopril",
    dosage: "10mg",
    time: "12:00",
    instruction: "Take with lunch",
    type: "tablet",
    status: "upcoming"
  },
  {
    id: 4,
    name: "Atorvastatin",
    dosage: "20mg",
    time: "20:00",
    instruction: "Take with dinner",
    type: "tablet",
    status: "upcoming"
  },
  {
    id: 5,
    name: "Aspirin",
    dosage: "81mg",
    time: "20:00",
    instruction: "Take with dinner",
    type: "tablet",
    status: "upcoming"
  },
  {
    id: 6,
    name: "Omega-3",
    dosage: "1000mg",
    time: "20:00",
    instruction: "Take with dinner",
    type: "capsule",
    status: "upcoming"
  },
  {
    id: 7,
    name: "Magnesium",
    dosage: "200mg",
    time: "22:00",
    instruction: "Take before bedtime",
    type: "tablet",
    status: "upcoming"
  },
  {
    id: 8,
    name: "Sodium",
    dosage: "200mg",
    time: "22:00",
    instruction: "Take before bedtime",
    type: "tablet",
    status: "upcoming"
  }
];

const MedicationTimeline = () => {
  const [medications, setMedications] = useState(dummyMedications);
  const [expandedId, setExpandedId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    return hour > 12 
      ? `${hour - 12}:${minutes} PM` 
      : `${hour === 0 ? 12 : hour}:${minutes} AM`;
  };

  const getCurrentMedicationStatus = (medTime) => {
    const [medHours, medMinutes] = medTime.split(':').map(Number);
    const now = currentTime;
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Create date objects for comparison
    const medDateTime = new Date();
    medDateTime.setHours(medHours, medMinutes, 0, 0);
    
    const currentDateTime = new Date();
    currentDateTime.setHours(currentHours, currentMinutes, 0, 0);
    
    if (medDateTime < currentDateTime) {
      return "past";
    } else if (
      medDateTime.getHours() === currentDateTime.getHours() && 
      Math.abs(medDateTime.getMinutes() - currentDateTime.getMinutes()) <= 30
    ) {
      return "current";
    } else {
      return "upcoming";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "current": return "bg-amber-500/20 border-amber-500/50";
      case "past": return "bg-gray-700/50 border-gray-600";
      default: return "bg-indigo-500/20 border-indigo-500/50";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "current": return <Bell className="w-4 h-4 text-amber-400" />;
      case "past": return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getPillIcon = (type) => {
    return <Pill className="w-5 h-5 text-purple-400" />;
  };

  // Sort medications by time
  const sortedMedications = [...medications].sort((a, b) => {
    const [aHours, aMinutes] = a.time.split(':').map(Number);
    const [bHours, bMinutes] = b.time.split(':').map(Number);
    return aHours - bHours || aMinutes - bMinutes;
  });

  // Group medications by time
  const groupedMedications = sortedMedications.reduce((groups, med) => {
    const time = med.time;
    if (!groups[time]) {
      groups[time] = [];
    }
    groups[time].push(med);
    return groups;
  }, {});

  return (
    <div className="bg-gray-800 rounded-2xl p-4 shadow-lg h-[500px] flex flex-col">
      {/* Header - Compact */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white mb-1">Medication Timeline</h2>
        <p className="text-sm text-gray-400">Today's schedule</p>
        <div className="mt-2 inline-flex items-center bg-gray-700/50 px-3 py-1 rounded-lg">
          <Clock className="w-4 h-4 mr-2 text-amber-400" />
          <span className="text-sm font-medium">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Scrollable Timeline */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 h-full w-0.5 bg-gradient-to-b from-indigo-500/30 via-purple-500/30 to-pink-500/30"></div>
          
          {/* Medication groups by time */}
          <div className="space-y-4">
            {Object.entries(groupedMedications).map(([time, medsAtTime], timeIndex) => {
              const status = getCurrentMedicationStatus(time);
              return (
                <div key={time} className="relative">
                  {/* Time marker */}
                  <div className={`absolute left-0 flex items-center justify-center w-6 h-6 rounded-full z-10 ${getStatusColor(status)} border-2`}>
                    {getStatusIcon(status)}
                  </div>
                  
                  {/* Time label */}
                  <div className="ml-8 mb-2">
                    <span className="text-sm font-medium text-indigo-400">{formatTime(time)}</span>
                  </div>
                  
                  {/* Medications at this time */}
                  <div className="ml-8 space-y-2">
                    {medsAtTime.map((med) => (
                      <div key={med.id} className={`rounded-lg p-3 transition-all duration-300 ${expandedId === med.id ? 'bg-gray-700' : 'bg-gray-700/50 hover:bg-gray-700'} border border-gray-600`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getPillIcon(med.type)}
                            <div className="ml-2">
                              <h4 className="text-sm font-medium text-white">{med.name} <span className="text-xs text-purple-400 ml-1">{med.dosage}</span></h4>
                              <p className="text-xs text-gray-400 mt-1">{med.instruction}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => toggleExpand(med.id)}
                            className="p-1 rounded hover:bg-gray-600/50 transition-colors"
                          >
                            {expandedId === med.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        
                        {expandedId === med.id && (
                          <div className="mt-2 pt-2 border-t border-gray-600">
                            <div className="flex items-center text-xs text-gray-400">
                              <span className="inline-flex items-center px-2 py-1 rounded bg-gray-600/50">
                                {med.type}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Compact Legend */}
      <div className="mt-3 p-2 bg-gray-700/30 rounded-lg border border-gray-600">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></div>
              <span className="text-gray-400">Upcoming</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
              <span className="text-gray-400">Due now</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-gray-500 mr-1"></div>
              <span className="text-gray-400">Past</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationTimeline;