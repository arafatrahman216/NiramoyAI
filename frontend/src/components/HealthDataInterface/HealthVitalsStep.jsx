// ==============================================
// HEALTH VITALS STEP COMPONENT
// ==============================================
// TODO: Add range validation for vitals
// TODO: Add chronic condition suggestions from backend
import React from 'react';
import CustomTagInput from './CustomTagInput';

const HealthVitalsStep = ({ 
  formData, 
  handleInputChange, 
  handleArrayChange,
  showCustomInput,
  customInputValue,
  handleCustomInputOpen,
  handleCustomInputChange,
  handleCustomInputCancel
}) => {
  const addCustomCondition = () => {
    if (customInputValue.chronic.trim() !== "") {
      handleArrayChange('chronic_diseases', customInputValue.chronic.toLowerCase().replace(/['().<>\s]/g, '_'));
      handleCustomInputChange('chronic', '');
      handleCustomInputCancel('chronic');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Health Vitals & Conditions</h2>
        <p className="text-zinc-400">Your current health measurements and conditions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-zinc-300 mb-2">Heart Rate (bpm)</label>
          <input
            type="number"
            value={formData.heart_rate}
            onChange={(e) => handleInputChange('heart_rate', e.target.value)}
            placeholder="e.g., 72"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors hover:border-zinc-600 placeholder-zinc-500"
          />
        </div>

        <div>
          <label className="block text-zinc-300 mb-2">Blood Pressure</label>
          <input
            type="text"
            value={formData.blood_pressure}
            onChange={(e) => handleInputChange('blood_pressure', e.target.value)}
            placeholder="e.g., 120/80"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors hover:border-zinc-600 placeholder-zinc-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-zinc-300 mb-2">Blood Type</label>
          <select
            value={formData.blood_type}
            onChange={(e) => handleInputChange('blood_type', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors hover:border-zinc-600"
          >
            <option value="">Select blood type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-zinc-300 mb-2">Chronic Conditions</label>
          <p className="text-zinc-400 text-sm mb-3">Select any ongoing medical conditions you have:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 
              'Depression', 'Anxiety', 'Thyroid Disease', 'High Cholesterol', 'Migraine',
              'Sleep Apnea', 'COPD', 'Osteoporosis', 'GERD', 'IBS', 'None'
            ].map((condition) => (
              <button
                key={condition}
                onClick={() => handleArrayChange('chronic_diseases', condition.toLowerCase().replace(/['.\s]/g, '_'))}
                className={`px-3 py-1.5 text-sm rounded-xl border transition-all ${
                  formData.chronic_diseases.includes(condition.toLowerCase().replace(/['.\s]/g, '_'))
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                }`}
              >
                {condition}
              </button>
            ))}
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-xl border border-dashed border-zinc-600 text-zinc-400 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 transition-all"
              onClick={() => handleCustomInputOpen("chronic")}
            >
              Others
            </button>
          </div>
          
          <CustomTagInput
            isOpen={showCustomInput.chronic}
            value={customInputValue.chronic}
            placeholder="Enter custom condition"
            onChange={(value) => handleCustomInputChange('chronic', value)}
            onAdd={addCustomCondition}
            onCancel={() => handleCustomInputCancel('chronic')}
            buttonColor="emerald"
          />
          
          <div className="text-xs text-zinc-500 mt-2">
            Don't see your condition? Use the "Others" button to add it.
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-zinc-300 mb-2">Major Health Events</label>
          <textarea
            value={formData.major_health_events}
            onChange={(e) => handleInputChange('major_health_events', e.target.value)}
            placeholder="Please describe any significant health events, surgeries, hospitalizations, accidents, or major diagnoses you've had. For example: 'Had appendectomy in 2019, broke left arm in 2020, diagnosed with hypertension in 2021'"
            rows="4"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none hover:border-zinc-600 placeholder-zinc-500"
          />
          <p className="text-zinc-500 text-xs mt-1">
            Include any surgeries, major injuries, hospitalizations, or significant diagnoses
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthVitalsStep;
