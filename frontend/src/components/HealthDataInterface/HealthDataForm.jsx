// ==============================================
// HEALTH DATA FORM MAIN CONTAINER
// ==============================================
// TODO: Refactor state management if form grows larger
// TODO: Add validation and error handling for all steps
import React, { useState } from 'react';
import { Heart, Activity, User, FileText } from 'lucide-react';
import BasicInfoStep from './BasicInfoStep';
import HealthVitalsStep from './HealthVitalsStep';
import LifestyleStep from './LifestyleStep';
import ProgressBar from './ProgressBar';
import NavigationButtons from './NavigationButtons';
import api from '../../services/api';

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
    const value = (customInputValue[type] || '').trim();
    if (value !== "" && !(selectedTags || []).includes(value)) {
      setSelectedTags([...(selectedTags || []), value]);
      setCustomInputValue({ ...customInputValue, [type]: "" });
      setShowCustomInput({ ...showCustomInput, [type]: false });
    }
  };
  const handleCustomInputCancel = (type) => {
    setCustomInputValue({ ...customInputValue, [type]: "" });
    setShowCustomInput({ ...showCustomInput, [type]: false });
  };

  const handleTagClick = (tag, selectedTags, setSelectedTags) => {
    if (!tag || tag.trim() === '') return;
    
    const safeTags = selectedTags || [];
    if (safeTags.includes(tag)) {
      setSelectedTags(safeTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...safeTags, tag]);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth || dateOfBirth.trim() === '') return null;
    
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      
      // Check if the date is valid
      if (isNaN(birthDate.getTime())) return null;
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Return null for negative ages or unrealistic ages
      return (age >= 0 && age <= 150) ? age : null;
    } catch (error) {
      console.error('Error calculating age:', error);
      return null;
    }
  };

  const steps = [
    { title: 'Basic Info', icon: User },
    { title: 'Health Vitals', icon: Activity },
    { title: 'Lifestyle', icon: FileText }
  ];

  const handleInputChange = (field, value) => {
    // Handle null/undefined values gracefully
    const safeValue = value == null ? '' : value;
    setFormData(prev => ({ ...prev, [field]: safeValue }));
  };

  const handleArrayChange = (field, value) => {
    // Handle null/undefined values gracefully
    if (!value || value.trim() === '') return;
    
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).includes(value)
        ? (prev[field] || []).filter(item => item !== value)
        : [...(prev[field] || []), value]
    }));
  };

  // ==============================================
  // NAVIGATION LOGIC
  // ==============================================
  // TODO: Add step validation before navigation
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle form submission on the last step
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Clean and prepare submission data, handling empty fields gracefully
    const cleanSubmissionData = {
      gender: formData.gender || null,
      date_of_birth: formData.date_of_birth || null,
      weight: formData.weight || null,
      height: formData.height || null,
      heart_rate: formData.heart_rate || null,
      blood_pressure: formData.blood_pressure || null,
      blood_type: formData.blood_type || null,
      major_health_events: formData.major_health_events || null,
      lifestyle: [...(formData.lifestyle || []), ...(selectedExercise || [])].filter(Boolean),
      allergies: (formData.allergies || []).filter(Boolean),
      major_events: (formData.major_events || []).filter(Boolean),
      chronic_diseases: (formData.chronic_diseases || []).filter(Boolean),
      calculatedAge: formData.date_of_birth ? calculateAge(formData.date_of_birth) : null
    };
    
    // Remove empty arrays and null values for cleaner submission
    Object.keys(cleanSubmissionData).forEach(key => {
      if (Array.isArray(cleanSubmissionData[key]) && cleanSubmissionData[key].length === 0) {
        cleanSubmissionData[key] = [];
      }
      if (cleanSubmissionData[key] === null || cleanSubmissionData[key] === '') {
        cleanSubmissionData[key] = null;
      }
    });
    
    console.log('Form submitted:', cleanSubmissionData);
    
    // Simulate API call for now (replace with actual API when ready)
    try {
      // api.patientAPI.submitHealthData(cleanSubmissionData)
      //   .then(response => {
      //     console.log('Health data submitted successfully:', response.data);
      //     alert('Health data submitted successfully!');
      //     resetForm();
      //   })
      //   .catch(error => {
      //     console.error('Error submitting health data:', error);
      //     alert('Failed to submit health data. Please try again.');
      //   });
      
      // For now, just show success message
      alert('Health data submitted successfully!');
      resetForm();
    } catch (error) {
      console.error('Error submitting health data:', error);
      alert('Failed to submit health data. Please try again.');
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
        return (
          <BasicInfoStep 
            formData={formData}
            handleInputChange={handleInputChange}
            calculateAge={calculateAge}
          />
        );
      case 1: 
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
      case 2: 
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
      default: 
        return (
          <BasicInfoStep 
            formData={formData}
            handleInputChange={handleInputChange}
            calculateAge={calculateAge}
          />
        );
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