// ==============================================
// LOG SUMMARY COMPONENT
// ==============================================
// Reusable component for displaying health log summary
import React from 'react';
import { Calendar, Clock, Heart, Stethoscope, FileText } from 'lucide-react';

const LogSummary = ({ formData }) => {
  const formatVitals = () => {
    const vitals = [];
    
    if (formData.blood_pressure_systolic && formData.blood_pressure_diastolic) {
      vitals.push(`Blood Pressure: ${formData.blood_pressure_systolic}/${formData.blood_pressure_diastolic} mmHg`);
    }
    if (formData.blood_sugar) vitals.push(`Blood Sugar: ${formData.blood_sugar} mg/dL`);
    if (formData.heart_rate) vitals.push(`Heart Rate: ${formData.heart_rate} bpm`);
    if (formData.oxygen_saturation) vitals.push(`Oxygen Saturation: ${formData.oxygen_saturation}%`);
    if (formData.temperature) vitals.push(`Temperature: ${formData.temperature}°F`);
    if (formData.weight) vitals.push(`Weight: ${formData.weight} lbs`);
    if (formData.stress_level) vitals.push(`Stress Level: ${formData.stress_level}/10`);
    
    return vitals;
  };

  const vitals = formatVitals();

  return (
    <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-400" />
        Log Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-zinc-300">
          <Calendar className="w-4 h-4 mr-2 text-blue-400" />
          <span>{formData.log_date}</span>
        </div>
        <div className="flex items-center text-sm text-zinc-300">
          <Clock className="w-4 h-4 mr-2 text-green-400" />
          <span>{formData.log_time}</span>
        </div>
      </div>

      {/* Vitals Summary */}
      {vitals.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center">
            <Heart className="w-4 h-4 mr-2 text-red-400" />
            Vital Signs Recorded
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {vitals.map((vital, index) => (
              <div key={index} className="text-sm text-zinc-400 bg-zinc-800/50 p-2 rounded-lg">
                {vital}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Symptoms Summary */}
      {formData.symptoms && formData.symptoms.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center">
            <Stethoscope className="w-4 h-4 mr-2 text-amber-400" />
            Symptoms Reported ({formData.symptoms.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.symptoms.map((symptom, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes Summary */}
      {formData.notes && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-purple-400" />
            Additional Notes
          </h4>
          <div className="bg-zinc-800/50 p-3 rounded-lg">
            <p className="text-sm text-zinc-400 leading-relaxed">
              {formData.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogSummary;
