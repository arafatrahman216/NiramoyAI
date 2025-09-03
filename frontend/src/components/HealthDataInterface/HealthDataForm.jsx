import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Heart, Activity, User, FileText } from 'lucide-react';

const HealthDataForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Part 1
    gender: '',
    date_of_birth: '',
    weight: '',
    height: '',
    heart_rate: '',
    blood_pressure: '',
    blood_type: '',
    major_health_events: '',
    // Part 2
    lifestyle: [],
    allergies: [],
    major_events: [],
    chronic_diseases: []
  });

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const steps = [
    { title: 'Welcome', icon: Heart },
    { title: 'Basic Info', icon: User },
    { title: 'Health Vitals', icon: Activity },
    { title: 'Lifestyle', icon: FileText },
    { title: 'Complete', icon: Heart }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const WelcomeStep = () => (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full mx-auto flex items-center justify-center">
        <Heart className="w-12 h-12 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-light text-white mb-4">Welcome to NiramoyAI</h2>
        <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
          Let's create your personalized health profile. This journey will take just a few minutes and help us provide you with the best care recommendations.
        </p>
      </div>
      <div className="pt-8">
        <button
          onClick={nextStep}
          className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Begin Journey
        </button>
      </div>
    </div>
  );

  const BasicInfoStep = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Basic Information</h2>
        <p className="text-gray-400">Tell us a little about yourself</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
          />
          {formData.date_of_birth && (
            <p className="text-teal-400 text-sm mt-1">
              Age: {calculateAge(formData.date_of_birth)} years old
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Weight (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="Enter weight"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Height (cm)</label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder="Enter height"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );

  const HealthVitalsStep = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Health Vitals & Conditions</h2>
        <p className="text-gray-400">Your current health measurements and conditions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Heart Rate (bpm)</label>
          <input
            type="number"
            value={formData.heart_rate}
            onChange={(e) => handleInputChange('heart_rate', e.target.value)}
            placeholder="e.g., 72"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Blood Pressure</label>
          <input
            type="text"
            value={formData.blood_pressure}
            onChange={(e) => handleInputChange('blood_pressure', e.target.value)}
            placeholder="e.g., 120/80"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-300 mb-2">Blood Type</label>
          <select
            value={formData.blood_type}
            onChange={(e) => handleInputChange('blood_type', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors"
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
          <label className="block text-gray-300 mb-2">Chronic Conditions</label>
          <p className="text-gray-400 text-sm mb-3">Select any ongoing medical conditions you have:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 
              'Depression', 'Anxiety', 'Thyroid Disease', 'High Cholesterol', 'Migraine',
              'Sleep Apnea', 'COPD', 'Osteoporosis', 'GERD', 'IBS', 'None'
            ].map((condition) => (
              <button
                key={condition}
                onClick={() => handleArrayChange('chronic_diseases', condition.toLowerCase().replace(/['.\s]/g, '_'))}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  formData.chronic_diseases.includes(condition.toLowerCase().replace(/['.\s]/g, '_'))
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            Don't see your condition? You can add it in the next step.
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-300 mb-2">Major Health Events</label>
          <textarea
            value={formData.major_health_events}
            onChange={(e) => handleInputChange('major_health_events', e.target.value)}
            placeholder="Please describe any significant health events, surgeries, hospitalizations, accidents, or major diagnoses you've had. For example: 'Had appendectomy in 2019, broke left arm in 2020, diagnosed with hypertension in 2021'"
            rows="4"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors resize-none"
          />
          <p className="text-gray-500 text-xs mt-1">
            Include any surgeries, major injuries, hospitalizations, or significant diagnoses
          </p>
        </div>
      </div>
    </div>
  );

  const LifestyleStep = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Lifestyle & Health History</h2>
        <p className="text-gray-400">Help us understand your lifestyle and health background</p>
      </div>

      <div className="space-y-8">
        {/* Lifestyle Habits */}
        <div>
          <h3 className="text-lg text-white mb-4">Lifestyle Habits</h3>
          <p className="text-gray-400 text-sm mb-4">Select all that apply to you:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Smoking', 'Alcohol', 'Regular Exercise', 'Vegetarian Diet', 'High Protein Diet', 'Low Carb Diet'].map((habit) => (
              <button
                key={habit}
                onClick={() => handleArrayChange('lifestyle', habit.toLowerCase().replace(' ', '_'))}
                className={`p-3 rounded-lg border transition-all ${
                  formData.lifestyle.includes(habit.toLowerCase().replace(' ', '_'))
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {habit}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <h3 className="text-lg text-white mb-4">Common Allergies</h3>
          <p className="text-gray-400 text-sm mb-4">Select any allergies you have:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Peanuts', 'Shellfish', 'Dairy', 'Gluten', 'Pollen', 'Dust', 'Medications', 'Pet Dander', 'Soy', 'Eggs', 'Tree Nuts', 'None'].map((allergy) => (
              <button
                key={allergy}
                onClick={() => handleArrayChange('allergies', allergy.toLowerCase().replace(' ', '_'))}
                className={`p-3 rounded-lg border transition-all ${
                  formData.allergies.includes(allergy.toLowerCase().replace(' ', '_'))
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        {/* Past Health Events */}
        <div>
          <h3 className="text-lg text-white mb-4">Past Health Events (Optional)</h3>
          <p className="text-gray-400 text-sm mb-4">Select significant health events you've experienced:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Surgery', 'Heart Attack', 'Stroke', 'Cancer', 'Fractures', 
              'Hospitalization', 'Blood Transfusion', 'Organ Transplant', 
              'Major Accident', 'Pregnancy Complications', 'Mental Health Crisis', 'None'
            ].map((event) => (
              <button
                key={event}
                onClick={() => handleArrayChange('major_events', event.toLowerCase().replace(' ', '_'))}
                className={`p-3 rounded-lg border transition-all text-left ${
                  formData.major_events && formData.major_events.includes(event.toLowerCase().replace(' ', '_'))
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {event}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CompleteStep = () => (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full mx-auto flex items-center justify-center">
        <Heart className="w-12 h-12 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-light text-white mb-4">Profile Complete!</h2>
        <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
          Thank you for providing your health information. NiramoyAI is now ready to provide you with personalized health insights and recommendations.
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg mx-auto">
        <pre className="text-left text-sm text-gray-300 overflow-x-auto">
          {JSON.stringify({
            ...formData,
            calculated_age: formData.date_of_birth ? calculateAge(formData.date_of_birth) : null
          }, null, 2)}
        </pre>
      </div>
      <button
        onClick={() => {
          setCurrentStep(0);
          setFormData({
            gender: '', date_of_birth: '', weight: '', height: '', heart_rate: '', 
            blood_pressure: '', blood_type: '', major_health_events: '',
            lifestyle: [], allergies: [], major_events: [], chronic_diseases: []
          });
        }}
        className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Start Over
      </button>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <WelcomeStep />;
      case 1: return <BasicInfoStep />;
      case 2: return <HealthVitalsStep />;
      case 3: return <LifestyleStep />;
      case 4: return <CompleteStep />;
      default: return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              {steps.slice(1, -1).map((step, index) => {
                const StepIcon = step.icon;
                const stepIndex = index + 1;
                return (
                  <div key={stepIndex} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      stepIndex === currentStep ? 'bg-teal-500 text-white' :
                      stepIndex < currentStep ? 'bg-green-500 text-white' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    {index < steps.length - 3 && (
                      <div className={`w-16 h-0.5 mx-2 ${
                        stepIndex < currentStep ? 'bg-green-500' : 'bg-gray-700'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <span className="text-gray-400">Step {currentStep} of {steps.length - 2}</span>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
          {renderStep()}

          {/* Navigation Buttons */}
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={prevStep}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <button
                onClick={nextStep}
                className="flex items-center bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
              >
                {currentStep === steps.length - 2 ? 'Complete' : 'Continue'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6B7280;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
    </div>
  );
};

export default HealthDataForm;