// ==============================================
// HEALTH DATA FORM MAIN CONTAINER
// ==============================================
// TODO: Refactor state management if form grows larger
// TODO: Add validation and error handling for all steps
import React, { useState } from 'react';
import { Heart, Activity, User, FileText } from 'lucide-react';
import WelcomeStep from './WelcomeStep';
import BasicInfoStep from './BasicInfoStep';
import HealthVitalsStep from './HealthVitalsStep';
import LifestyleStep from './LifestyleStep';
import CompleteStep from './CompleteStep';
import ProgressBar from './ProgressBar';
import NavigationButtons from './NavigationButtons';

const HealthDataForm = () => {
  // ==============================================
  // STATE MANAGEMENT
  // ==============================================
  // TODO: Move to context if used globally
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
  const [selectedExercise, setSelectedExercise] = useState([]);

  // Exercise tags and custom input states
  const exerciseTags = [
    "No Exercise",
    "Light Exercise", 
    "Moderate Exercise",
    "Intense Exercise",
    "Yoga",
    "Sports",
    "Walking",
    "Cycling",
    "Swimming",
  ];

  const [showCustomInput, setShowCustomInput] = useState({
    exercise: false,
    lifestyle: false,
    allergies: false,
    chronic: false,
  });
  const [customInputValue, setCustomInputValue] = useState({
    exercise: "",
    lifestyle: "",
    allergies: "",
    chronic: "",
  });

  const handleCustomInputOpen = (type) => {
    setShowCustomInput({ ...showCustomInput, [type]: true });
  };
  const handleCustomInputChange = (type, value) => {
    setCustomInputValue({ ...customInputValue, [type]: value });
  };
  const handleCustomInputAdd = (type, selectedTags, setSelectedTags) => {
    if (customInputValue[type].trim() !== "") {
      setSelectedTags([...selectedTags, customInputValue[type].trim()]);
      setCustomInputValue({ ...customInputValue, [type]: "" });
      setShowCustomInput({ ...showCustomInput, [type]: false });
    }
  };
  const handleCustomInputCancel = (type) => {
    setCustomInputValue({ ...customInputValue, [type]: "" });
    setShowCustomInput({ ...showCustomInput, [type]: false });
  };

  const handleTagClick = (tag, selectedTags, setSelectedTags) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

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

  // ==============================================
  // NAVIGATION LOGIC
  // ==============================================
  // TODO: Add step validation before navigation
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

  const resetForm = () => {
    setCurrentStep(0);
    setFormData({
      gender: '', date_of_birth: '', weight: '', height: '', heart_rate: '', 
      blood_pressure: '', blood_type: '', major_health_events: '',
      lifestyle: [], allergies: [], major_events: [], chronic_diseases: []
    });
    setSelectedExercise([]);
    setShowCustomInput({
      exercise: false,
      lifestyle: false,
      allergies: false,
      chronic: false,
    });
    setCustomInputValue({
      exercise: "",
      lifestyle: "",
      allergies: "",
      chronic: "",
    });
  };

  // ==============================================
  // STEP RENDERER
  // ==============================================
  // TODO: Optimize with useMemo if performance issues
  const renderStep = () => {
    switch (currentStep) {
      case 0: 
        return <WelcomeStep nextStep={nextStep} />;
      case 1: 
        return (
          <BasicInfoStep 
            formData={formData}
            handleInputChange={handleInputChange}
            calculateAge={calculateAge}
          />
        );
      case 2: 
        return (
          <HealthVitalsStep 
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayChange={handleArrayChange}
            showCustomInput={showCustomInput}
            customInputValue={customInputValue}
            handleCustomInputOpen={handleCustomInputOpen}
            handleCustomInputChange={handleCustomInputChange}
            handleCustomInputCancel={handleCustomInputCancel}
          />
        );
      case 3: 
        return (
          <LifestyleStep 
            formData={formData}
            selectedExercise={selectedExercise}
            exerciseTags={exerciseTags}
            handleArrayChange={handleArrayChange}
            handleTagClick={handleTagClick}
            setSelectedExercise={setSelectedExercise}
            showCustomInput={showCustomInput}
            customInputValue={customInputValue}
            handleCustomInputOpen={handleCustomInputOpen}
            handleCustomInputChange={handleCustomInputChange}
            handleCustomInputCancel={handleCustomInputCancel}
            handleCustomInputAdd={handleCustomInputAdd}
          />
        );
      case 4: 
        return (
          <CompleteStep 
            formData={formData}
            calculateAge={calculateAge}
            resetForm={resetForm}
          />
        );
      default: 
        return <WelcomeStep nextStep={nextStep} />;
    }
  };

  // ==============================================
  // MAIN RENDER
  // ==============================================
  // TODO: Add loading and error states for async actions
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} steps={steps} />

        {/* Form Content */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {renderStep()}

          {/* Navigation Buttons */}
          <NavigationButtons 
            currentStep={currentStep} 
            steps={steps} 
            prevStep={prevStep} 
            nextStep={nextStep} 
          />
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
          background: #3f3f46;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #71717a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa;
        }
      `}</style>
    </div>
  );
};

export default HealthDataForm;