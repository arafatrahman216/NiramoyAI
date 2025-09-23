// src/components/PatientProfile/VisitTimeline.js
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, Heart, Pill, TestTube, ChevronDown, ChevronUp, Eye, Download } from 'lucide-react';
import { fallbackVisits } from '../../utils/dummyData';

const VisitTimeline = ({ patientId, fetchedVisits }) => {
  const [visits, setVisits] = useState([]);
  const [expandedVisits, setExpandedVisits] = useState(new Set());
  const [expandedPrescriptions, setExpandedPrescriptions] = useState(new Set());
  const [expandedTestReports, setExpandedTestReports] = useState(new Set());

  useEffect(() => {
    if (fetchedVisits && fetchedVisits.length > 0) {
      setVisits(fetchedVisits);
      return;
    }
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

  const togglePrescriptionExpansion = (visitId) => {
    const newExpanded = new Set(expandedPrescriptions);
    if (newExpanded.has(visitId)) {
      newExpanded.delete(visitId);
    } else {
      newExpanded.add(visitId);
    }
    setExpandedPrescriptions(newExpanded);
  };

  const toggleTestReportExpansion = (visitId, reportIndex) => {
    const key = `${visitId}-${reportIndex}`;
    const newExpanded = new Set(expandedTestReports);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedTestReports(newExpanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
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
              <div key={visit.visitId} className="relative pl-16">
                {/* Timeline dot */}
                <div className="absolute left-4 w-4 h-4 rounded-full border-2 border-gray-800 bg-emerald-500"></div>

                {/* Visit Card */}
                <div className="bg-gray-700/50 rounded-xl border border-gray-600/50 overflow-hidden">
                  {/* Visit Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-600/30 transition-colors"
                    onClick={() => toggleVisitExpansion(visit.visitId)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <Heart className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">
                              Medical Visit
                            </h4>
                            <p className="text-emerald-400 font-medium">{visit.doctorName}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div className="flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {formatDate(visit.appointmentDate)}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            {formatTime(visit.appointmentDate)}
                          </div>
                          <div className="flex items-center text-gray-300">
                            <FileText className="w-4 h-4 mr-2 text-gray-400" />
                            {visit.medicines?.length || 0} Medications
                          </div>
                        </div>
                        
                        <p className="text-gray-300">{visit.symptoms}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {expandedVisits.has(visit.visitId) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedVisits.has(visit.visitId) && (
                    <div className="px-6 pb-6 border-t border-gray-600/50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          {/* Prescription */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Prescription:</h5>
                            <p className="text-white bg-gray-600/30 rounded-lg p-3">{visit.prescription}</p>
                          </div>

                          {/* Health Log/Vitals */}
                          {visit.healthLog && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-300 mb-2">Health Vitals:</h5>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-600/30 rounded-lg p-2 text-center">
                                  <p className="text-xs text-gray-400">Blood Pressure</p>
                                  <p className="text-white font-medium">{visit.healthLog.bloodPressure}</p>
                                </div>
                                <div className="bg-gray-600/30 rounded-lg p-2 text-center">
                                  <p className="text-xs text-gray-400">Heart Rate</p>
                                  <p className="text-white font-medium">{visit.healthLog.heartRate}</p>
                                </div>
                                <div className="bg-gray-600/30 rounded-lg p-2 text-center">
                                  <p className="text-xs text-gray-400">Temperature</p>
                                  <p className="text-white font-medium">{visit.healthLog.temperature}°F</p>
                                </div>
                                <div className="bg-gray-600/30 rounded-lg p-2 text-center">
                                  <p className="text-xs text-gray-400">Weight</p>
                                  <p className="text-white font-medium">{visit.healthLog.weight} kg</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Test Reports */}
                          {visit.testReportUrls && visit.testReportUrls.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-300 mb-2">Test Reports:</h5>
                              <div className="max-h-100 overflow-y-auto space-y-2">
                                {visit.testReportUrls.map((reportUrl, index) => {
                                  const reportKey = `${visit.visitId}-${index}`;
                                  return (
                                    <div key={index} className="bg-gray-600/30 rounded-lg overflow-hidden">
                                      {/* Clickable Header */}
                                      <div 
                                        className="p-3 cursor-pointer hover:bg-gray-600/50 transition-colors"
                                        onClick={() => toggleTestReportExpansion(visit.visitId, index)}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center">
                                            <TestTube className="w-4 h-4 text-blue-400 mr-2" />
                                            <span className="text-white text-sm font-medium">Test Report {index + 1}</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <button 
                                              className="p-1 hover:bg-gray-500/30 rounded"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(reportUrl, '_blank');
                                              }}
                                              title="Download Report"
                                            >
                                              <Download className="w-4 h-4 text-emerald-400" />
                                            </button>
                                            {expandedTestReports.has(reportKey) ? (
                                              <ChevronUp className="w-4 h-4 text-gray-400" />
                                            ) : (
                                              <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Expanded Test Report Image */}
                                      {expandedTestReports.has(reportKey) && (
                                        <div className="border-t border-gray-600/50">
                                          <div className="p-4">
                                            <div className="bg-white rounded-lg p-3">
                                              <img 
                                                src={reportUrl} 
                                                alt={`Test Report ${index + 1}`}
                                                className="w-full max-w-full h-auto rounded shadow-lg"
                                                style={{ maxHeight: '500px', objectFit: 'contain' }}
                                                onError={(e) => {
                                                  e.target.style.display = 'none';
                                                  e.target.nextSibling.style.display = 'flex';
                                                }}
                                              />
                                              <div className="hidden flex-col items-center justify-center py-12 text-gray-500">
                                                <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                <p className="text-lg font-medium mb-2">Test report preview not available</p>
                                                <p className="text-sm text-gray-600 mb-4">The report image could not be loaded</p>
                                                <button 
                                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                                                  onClick={() => window.open(reportUrl, '_blank')}
                                                >
                                                  <Download className="w-4 h-4" />
                                                  <span>Download Test Report</span>
                                                </button>
                                              </div>
                                            </div>
                                            
                                            {/* Action buttons for the image */}
                                            <div className="flex justify-center space-x-3 mt-3">
                                              <button 
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors flex items-center space-x-1"
                                                onClick={() => window.open(reportUrl, '_blank')}
                                              >
                                                <Eye className="w-3 h-3" />
                                                <span>View Full Size</span>
                                              </button>
                                              <button 
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center space-x-1"
                                                onClick={() => window.open(reportUrl, '_blank')}
                                              >
                                                <Download className="w-3 h-3" />
                                                <span>Download</span>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          {/* Medicines */}
                          {visit.medicines && visit.medicines.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-300 mb-2">Prescribed Medicines:</h5>
                              <div className="max-h-64 overflow-y-auto space-y-2">
                                {visit.medicines.map((medicine) => (
                                  <div key={medicine.medicineId} className="bg-gray-600/30 rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                      <Pill className="w-4 h-4 text-emerald-400 mr-2" />
                                      <span className="text-white font-medium">{medicine.medicineName}</span>
                                      <span className="text-gray-400 text-sm ml-2">({medicine.type})</span>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <p className="text-gray-300">
                                        <span className="text-gray-400">Dose:</span> {medicine.doses}
                                      </p>
                                      <p className="text-gray-300">
                                        <span className="text-gray-400">Frequency:</span> {medicine.frequency.length } times/day
                                      </p>
                                      <p className="text-gray-300">
                                        <span className="text-gray-400">Duration:</span> {medicine.duration}
                                      </p>
                                      <p className="text-gray-300">
                                        <span className="text-gray-400">Instructions:</span> {medicine.instructions}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Prescription File */}
                          {visit.prescriptionFileUrl && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-300 mb-2">Prescription Document:</h5>
                              <div 
                                className="bg-gray-600/30 rounded-lg p-3 cursor-pointer hover:bg-gray-600/50 transition-colors"
                                onClick={() => togglePrescriptionExpansion(visit.visitId)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <FileText className="w-4 h-4 text-emerald-400 mr-2" />
                                    <span className="text-white text-sm">View Prescription</span>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button 
                                      className="p-1 hover:bg-gray-500/30 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(visit.prescriptionFileUrl, '_blank');
                                      }}
                                    >
                                      <Download className="w-4 h-4 text-emerald-400" />
                                    </button>
                                    {expandedPrescriptions.has(visit.visitId) ? (
                                      <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                                
                                {/* Prescription Image Preview */}
                                {expandedPrescriptions.has(visit.visitId) && (
                                  <div className="mt-3 border-t border-gray-600/50 pt-3">
                                    <div className="bg-white rounded-lg p-2">
                                      <img 
                                        src={visit.prescriptionFileUrl} 
                                        alt="Prescription"
                                        className="w-full h-auto rounded"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'block';
                                        }}
                                      />
                                      <div className="hidden text-center py-8 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-2" />
                                        <p>Prescription preview not available</p>
                                        <button 
                                          className="mt-2 text-emerald-600 hover:text-emerald-700 underline"
                                          onClick={() => window.open(visit.prescriptionFileUrl, '_blank')}
                                        >
                                          Download Prescription
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {visit.healthLog?.notes && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Notes:</h5>
                          <p className="text-gray-300 text-sm bg-gray-600/20 rounded-lg p-3">{visit.healthLog.notes}</p>
                        </div>
                      )}
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
            {visits.filter(v => new Date(v.appointmentDate).getFullYear() === 2025).length}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Last Visit</h4>
          <p className="text-lg font-semibold text-white">
            {visits.length > 0 
              ? new Date(visits[0].appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'N/A'
            }
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Total Medicines</h4>
          <p className="text-2xl font-bold text-emerald-400">
            {visits.reduce((total, visit) => total + (visit.medicines?.length || 0), 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitTimeline;
