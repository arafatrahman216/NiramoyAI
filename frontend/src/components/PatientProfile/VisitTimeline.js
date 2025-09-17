// src/components/PatientProfile/VisitTimeline.js
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Heart, Stethoscope, Pill, TestTube, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { fallbackVisits } from '../../utils/dummyData';

const VisitTimeline = ({ patientId }) => {
  const [visits, setVisits] = useState([]);
  const [expandedVisits, setExpandedVisits] = useState(new Set());

  useEffect(() => {
    setVisits(fallbackVisits);
  }, [patientId]);

  const toggleVisitExpansion = (visitId) => {
    const newExpanded = new Set(expandedVisits);
    if (newExpanded.has(visitId)) {
      newExpanded.delete(visitId);
    } else {
      newExpanded.add(visitId);
    }
    setExpandedVisits(newExpanded);
  };

  const getVisitTypeColor = (type) => {
    switch (type) {
      case 'routine': return 'text-blue-400 bg-blue-500/20';
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'specialist': return 'text-purple-400 bg-purple-500/20';
      case 'follow-up': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getVisitTypeIcon = (type) => {
    switch (type) {
      case 'routine': return <Stethoscope className="w-4 h-4" />;
      case 'urgent': return <Heart className="w-4 h-4" />;
      case 'specialist': return <User className="w-4 h-4" />;
      case 'follow-up': return <FileText className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Visit Timeline</h3>
        <Calendar className="w-6 h-6 text-emerald-400" />
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-600"></div>

        {visits.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No visits found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {visits.map((visit, index) => (
              <div key={visit.id} className="relative pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-4 w-4 h-4 rounded-full border-2 border-gray-800 ${
                  visit.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-500'
                }`}></div>

                {/* Visit Card */}
                <div className="bg-gray-700/50 rounded-xl border border-gray-600/50 overflow-hidden">
                  {/* Visit Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-600/30 transition-colors"
                    onClick={() => toggleVisitExpansion(visit.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-2 rounded-lg ${getVisitTypeColor(visit.type)}`}>
                            {getVisitTypeIcon(visit.type)}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white capitalize">
                              {visit.type} Visit
                            </h4>
                            <p className="text-emerald-400 font-medium">{visit.department}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(visit.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {visit.time}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            {visit.doctor}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {visit.location}
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mt-3">{visit.chiefComplaint}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          visit.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {visit.status.toUpperCase()}
                        </span>
                        {expandedVisits.has(visit.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedVisits.has(visit.id) && (
                    <div className="px-6 pb-6 border-t border-gray-600/50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          {/* Diagnosis */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Diagnosis:</h5>
                            <p className="text-white bg-gray-600/30 rounded-lg p-3">{visit.diagnosis}</p>
                          </div>

                          {/* Vitals */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Vitals:</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-gray-600/30 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-400">Blood Pressure</p>
                                <p className="text-white font-medium">{visit.vitals.bloodPressure}</p>
                              </div>
                              <div className="bg-gray-600/30 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-400">Heart Rate</p>
                                <p className="text-white font-medium">{visit.vitals.heartRate}</p>
                              </div>
                              <div className="bg-gray-600/30 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-400">Temperature</p>
                                <p className="text-white font-medium">{visit.vitals.temperature}</p>
                              </div>
                              <div className="bg-gray-600/30 rounded-lg p-2 text-center">
                                <p className="text-xs text-gray-400">Weight</p>
                                <p className="text-white font-medium">{visit.vitals.weight}</p>
                              </div>
                            </div>
                          </div>

                          {/* Procedures */}
                          {visit.procedures.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-300 mb-2">Procedures:</h5>
                              <div className="space-y-1">
                                {visit.procedures.map((procedure, index) => (
                                  <div key={index} className="flex items-center">
                                    <TestTube className="w-3 h-3 text-blue-400 mr-2" />
                                    <span className="text-gray-300 text-sm">{procedure}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          {/* Prescriptions */}
                          {visit.prescriptions.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-300 mb-2">Prescriptions:</h5>
                              <div className="space-y-2">
                                {visit.prescriptions.map((prescription, index) => (
                                  <div key={index} className="bg-gray-600/30 rounded-lg p-3">
                                    <div className="flex items-center mb-1">
                                      <Pill className="w-3 h-3 text-emerald-400 mr-2" />
                                      <span className="text-white font-medium text-sm">{prescription.medication}</span>
                                    </div>
                                    <p className="text-gray-300 text-xs">{prescription.instruction}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Labs Ordered */}
                          {visit.labsOrdered.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-300 mb-2">Labs Ordered:</h5>
                              <div className="flex flex-wrap gap-2">
                                {visit.labsOrdered.map((lab, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                                  >
                                    {lab}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Visit Info */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Duration</p>
                              <p className="text-white">{visit.duration}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Cost</p>
                              <p className="text-white">{visit.cost}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Notes:</h5>
                        <p className="text-gray-300 text-sm bg-gray-600/20 rounded-lg p-3">{visit.notes}</p>
                      </div>

                      {/* Follow-up */}
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Follow-up:</h5>
                        <p className="text-emerald-400 text-sm">{visit.followUp}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Total Visits</h4>
          <p className="text-2xl font-bold text-white">{visits.length}</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">This Year</h4>
          <p className="text-2xl font-bold text-blue-400">
            {visits.filter(v => new Date(v.date).getFullYear() === 2025).length}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Last Visit</h4>
          <p className="text-lg font-semibold text-white">
            {visits.length > 0 
              ? new Date(visits[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'N/A'
            }
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Urgent Visits</h4>
          <p className="text-2xl font-bold text-red-400">
            {visits.filter(v => v.type === 'urgent').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitTimeline;
