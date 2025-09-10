// ==============================================
// SYMPTOMS LOG STEP COMPONENT
// ==============================================
// Step for logging symptoms and health concerns
import React from 'react';
import { Plus, X, Stethoscope, AlertCircle } from 'lucide-react';

const SymptomsLogStep = ({ 
  formData, 
  symptomOptions, 
  handleSymptomToggle, 
  showCustomSymptom, 
  setShowCustomSymptom, 
  customSymptom, 
  setCustomSymptom, 
  handleCustomSymptomAdd, 
  handleCustomSymptomCancel 
}) => {
  
  const getSymptomSeverityColor = (symptom) => {
    const severityMap = {
      'Chest Pain': 'border-red-500 bg-red-500/10',
      'Shortness of Breath': 'border-red-400 bg-red-400/10',
      'Fever': 'border-orange-500 bg-orange-500/10',
      'Severe Headache': 'border-red-400 bg-red-400/10',
      'Dizziness': 'border-yellow-500 bg-yellow-500/10',
      'Fatigue': 'border-blue-400 bg-blue-400/10',
      'Nausea': 'border-green-400 bg-green-400/10',
      'Anxiety': 'border-purple-400 bg-purple-400/10',
      'Depression': 'border-indigo-400 bg-indigo-400/10'
    };
    return severityMap[symptom] || 'border-zinc-600 bg-zinc-700/30';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Symptoms & Concerns</h2>
        <p className="text-zinc-400">Select any symptoms you're experiencing today</p>
      </div>

      {/* Current Symptoms Display */}
      {formData.symptoms.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-amber-400" />
            Current Symptoms ({formData.symptoms.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {formData.symptoms.map((symptom, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium text-white border transition-colors ${getSymptomSeverityColor(symptom)}`}
              >
                {symptom}
                <button
                  onClick={() => handleSymptomToggle(symptom)}
                  className="ml-2 hover:bg-red-500/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Symptom Selection Grid */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <Stethoscope className="w-5 h-5 mr-2 text-emerald-400" />
          Common Symptoms
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {symptomOptions.map((symptom) => (
            <button
              key={symptom}
              onClick={() => handleSymptomToggle(symptom)}
              className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                formData.symptoms.includes(symptom)
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Symptom Input */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Other Symptoms</h3>
        
        {!showCustomSymptom ? (
          <button
            onClick={() => setShowCustomSymptom(true)}
            className="flex items-center px-4 py-3 bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-xl text-zinc-300 hover:border-emerald-500 hover:text-emerald-300 transition-colors w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Custom Symptom
          </button>
        ) : (
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomSymptomAdd()}
              placeholder="Describe your symptom..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCustomSymptomAdd}
                disabled={!customSymptom.trim()}
                className="px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
              <button
                onClick={handleCustomSymptomCancel}
                className="px-4 py-3 bg-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Severity Guidelines */}
      <div className="bg-zinc-900/30 border border-zinc-700 rounded-xl p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Severity Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded bg-red-500 mr-2"></div>
            <span className="text-zinc-400">Severe: Chest pain, difficulty breathing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded bg-yellow-500 mr-2"></div>
            <span className="text-zinc-400">Moderate: Persistent headache, dizziness</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded bg-blue-500 mr-2"></div>
            <span className="text-zinc-400">Mild: Fatigue, minor discomfort</span>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          <strong>Emergency:</strong> If experiencing severe chest pain, difficulty breathing, or other emergency symptoms, 
          seek immediate medical attention by calling 911.
        </p>
      </div>
    </div>
  );
};

export default SymptomsLogStep;
