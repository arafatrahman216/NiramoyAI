// ==============================================
// COMPLETE LOG STEP COMPONENT
// ==============================================
// Final step showing summary and completion
import React from 'react';
import { CheckCircle, RotateCcw, FileText } from 'lucide-react';
import { useEffect, useState , useRef} from 'react';
import LogSummary from './LogSummary';
import axios from 'axios';

const CompleteLogStep = ({ formData, resetForm }) => {
  const [vitals, setVitals] = useState([]);
  const hasPosted = useRef(false); // 👈 guard against double calls


  // format + send vitals only once when component mounts
  useEffect(() => {
    if (hasPosted.current) return; // stop if already sent once
    hasPosted.current = true;

    const formatVitals = async () => {
      const newVitals = [];
      
      if (formData.blood_pressure_systolic && formData.blood_pressure_diastolic) {
        newVitals.push(`Blood Pressure: ${formData.blood_pressure_systolic}/${formData.blood_pressure_diastolic} mmHg`);
      }
      if (formData.blood_sugar) newVitals.push(`Blood Sugar: ${formData.blood_sugar} mg/dL`);
      if (formData.heart_rate) newVitals.push(`Heart Rate: ${formData.heart_rate} bpm`);
      if (formData.oxygen_saturation) newVitals.push(`Oxygen Saturation: ${formData.oxygen_saturation}%`);
      if (formData.temperature) newVitals.push(`Temperature: ${formData.temperature}°F`);
      if (formData.weight) newVitals.push(`Weight: ${formData.weight} lbs`);
      if (formData.stress_level) newVitals.push(`Stress Level: ${formData.stress_level}`);

      console.log("Formatted vitals:", formData );
      try {
        const response = await axios.post('http://localhost:8000/api/user/vitals',   formData,
         {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("Response from server:", response.data);
      } catch (error) {
        console.error("Error sending vitals to server:", error);
      }

      setVitals(newVitals);
    };

    formatVitals();
  }, [formData]); // run only when formData changes

  const hasData = vitals.length > 0 || (formData.symptoms && formData.symptoms.length > 0) || formData.notes;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-light text-white mb-2">Health Log Complete!</h2>
        <p className="text-zinc-400">Your health information has been successfully recorded</p>
      </div>

      {hasData ? (
        <>
          {/* Log Summary */}
          <LogSummary formData={formData} />

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-800/30 rounded-xl p-6">
            <h3 className="text-lg font-medium text-emerald-300 mb-4">What's Next?</h3>
            <div className="space-y-3 text-sm text-emerald-200/80">
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-3 flex-shrink-0"></div>
                <p>Your health data has been securely saved and is available for review in your dashboard.</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-3 flex-shrink-0"></div>
                <p>Consider setting daily reminders to log your health information consistently.</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-3 flex-shrink-0"></div>
                <p>Share this information with your healthcare provider during your next appointment.</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-3 flex-shrink-0"></div>
                <p>Monitor trends over time to better understand your health patterns.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-zinc-400 mb-4">No health data was recorded in this session.</p>
          <button
            onClick={resetForm}
            className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start New Log
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {hasData && (
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Log Another Entry
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center px-6 py-3 bg-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-600 transition-colors font-medium"
          >
            <FileText className="w-4 h-4 mr-2" />
            Print Summary
          </button>
        </div>
      )}

      {/* Emergency Notice */}
      <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4">
        <h4 className="text-sm font-medium text-red-300 mb-2">Emergency Reminder</h4>
        <p className="text-xs text-red-200/80">
          If you're experiencing a medical emergency, don't rely on this app. 
          Call 911 or go to your nearest emergency room immediately.
        </p>
      </div>
    </div>
  );
};

export default CompleteLogStep;
