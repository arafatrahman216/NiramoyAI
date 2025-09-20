// src/components/RecentVisits.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Image } from 'lucide-react';
import { vi } from 'date-fns/locale';

const RecentVisits = ({ 
  visits = [], 
  title = "Recent Visits",
  height = "auto",
  width = "100%",
  viewerType = "patient", // "patient" or "doctor"
  showPrescriptionImage = true,
  className = ""
}) => {
    const navigate = useNavigate();
  const [expandedVisit, setExpandedVisit] = useState(null);

  const getPersonName = (visit) => {
    if (viewerType === "patient") {
      return visit.doctorName || visit.doctor || "Unknown Doctor";
    } else {
      return visit.patientName || visit.patient || "Unknown Patient";
    }
  };

  const getPersonIcon = () => {
    return viewerType === "patient" ? "👨‍⚕️" : "🧑‍🤝‍🧑";
  };

  const onclick = (userid) => {
    if (viewerType === "doctor" && userid) {
      navigate('/patient/profile?id=' + userid);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  const getVisitDisplayData = (visit) => {
    if (viewerType === "patient") {
      return {
        personName: getPersonName(visit),
        date: visit.appointmentDate || visit.date || visit.visitDate,
        primaryInfo: visit.symptoms || visit.reason || visit.chiefComplaint,
        secondaryInfo: visit.prescription || visit.treatment || visit.notes,
        badge: "Visit"
      };
    } else {
      return {
        personName: getPersonName(visit),
        date: visit.appointmentDate || visit.date || visit.visitDate,
        primaryInfo: visit.diagnosis || visit.reason || visit.chiefComplaint,
        secondaryInfo: visit.treatment || visit.notes || visit.prescription,
        badge: "Completed"
      };
    }
  };

  if (!visits || visits.length === 0) {
    return (
      <div 
        className={`bg-gray-800 rounded-2xl p-6 shadow-lg ${className}`}
        style={{ height, width }}
      >
        <h2 className="text-xl font-semibold mb-6 text-white">{title}</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-500 text-2xl">📋</span>
          </div>
          <p className="text-gray-400">No recent visits found</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-gray-800 rounded-2xl p-6 shadow-lg ${className}`}
      style={{ height, width }}
    >
      <h2 className="text-xl font-semibold mb-6 text-white">{title}</h2>
      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: height === "auto" ? "none" : `calc(${height} - 120px)` }}>
        {visits.map((visit, index) => {
          const displayData = getVisitDisplayData(visit);
          
          return (
            <div  
              key={visit.id || index} 
              className="bg-gradient-to-br from-gray-700 to-gray-750 border border-gray-600 rounded-xl p-4 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-400 text-lg">{getPersonIcon()}</span>
                  </div>
                  <div
                    onClick={() => onclick( visit.userId)}
                  >
                    <h3 className="text-white font-semibold text-sm">{displayData.personName}</h3>
                    <p className="text-gray-400 text-xs">{formatDate(displayData.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    {displayData.badge}
                  </span>
                  {showPrescriptionImage && visit.prescriptionFileUrl && (
                    <button
                      onClick={() => setExpandedVisit(expandedVisit === index ? null : index)}
                      className="p-1 rounded hover:bg-gray-600/50 transition-colors"
                    >
                      {expandedVisit === index ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-gray-400 text-xs mt-0.5">🩺</span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {viewerType === "patient" ? "Symptoms" : "Diagnosis"}
                    </p>
                    <p className="text-white text-sm">{displayData.primaryInfo}</p>
                  </div>
                </div>
                
                {displayData.secondaryInfo && (
                  <div className="flex items-start space-x-2 pt-2 border-t border-gray-600">
                    <span className="text-gray-400 text-xs mt-0.5">📝</span>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {viewerType === "patient" ? "Notes" : "Treatment"}
                      </p>
                      <p className="text-emerald-400 text-sm">{displayData.secondaryInfo}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Expandable Prescription Image Section */}
              {showPrescriptionImage && expandedVisit === index && visit.prescriptionFileUrl && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex items-center space-x-2 mb-3">
                    <Image className="w-4 h-4 text-blue-400" />
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Prescription Image</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
                    <img 
                      src={visit.prescriptionFileUrl} 
                      alt="Prescription"
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }}
                    />
                    <div 
                      className="hidden text-center py-8 text-gray-400"
                    >
                      <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Image not available</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentVisits;