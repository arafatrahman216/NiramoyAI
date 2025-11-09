// ==============================================
// GAMIFIED HEALTH DATA FORM
// ==============================================
// Streamlined, Duolingo-style health questionnaire
import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, Sparkles, Trophy, Star, Heart, Flame } from 'lucide-react';
import { patientAPI } from '../../services/api';

const UpdatedHealthDataForm = ({ isOnboarding = false, onComplete, onSubmitStart }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    date_of_birth: '',
    has_chronic_disease: false,
    chronic_diseases: [],
    has_allergies: false,
    allergies: [],
    exercise_frequency: '',
    lifestyle_factors: [],
    custom_lifestyle: ''
  });

  // All questions in a single form
  const questions = [
    {
      id: 'gender',
      question: "What's your gender?",
      type: 'choice',
      options: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    {
      id: 'date_of_birth',
      question: "When were you born?",
      type: 'date',
      placeholder: 'Select your date of birth'
    },
    {
      id: 'has_chronic_disease',
      question: "Do you have any chronic diseases?",
      type: 'yesno',
      followUp: {
        id: 'chronic_diseases',
        question: "Select your chronic conditions",
        type: 'multi-select',
        options: [
          'Diabetes',
          'Hypertension',
          'Asthma',
          'Heart Disease',
          'Arthritis',
          'Thyroid Disorder',
          'Kidney Disease',
          'Cancer'
        ]
      }
    },
    {
      id: 'has_allergies',
      question: "Do you have any allergies?",
      type: 'yesno',
      followUp: {
        id: 'allergies',
        question: "Select your allergies",
        type: 'multi-select',
        options: [
          'Peanuts',
          'Tree Nuts',
          'Dairy',
          'Eggs',
          'Shellfish',
          'Penicillin',
          'Pollen',
          'Dust',
          'Pet Dander'
        ]
      }
    },
    {
      id: 'exercise_frequency',
      question: "How often do you exercise?",
      type: 'choice',
      options: [
        'None in a week',
        '1-2 times a week',
        '3-4 times a week',
        '5-6 times a week',
        'Everyday'
      ]
    },
    {
      id: 'lifestyle_factors',
      question: "Anything else about your lifestyle?",
      type: 'multi-select-with-other',
      options: ['Smoking', 'Alcohol', 'Poor Sleep', 'Irregular Diet', 'High Stress', 'Sedentary', 'Caffeine']
    }
  ];

  const totalQuestions = questions.length;
  const progress = 100; // Always 100% as all questions are visible

  // Celebration effects
  useEffect(() => {
    // No milestone celebration for single form
  }, [progress]);

  const triggerMilestone = (message) => {
    setShowMilestone(message);
    setTimeout(() => {
      setShowMilestone(false);
    }, 2000);
  };

  const handleAnswer = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, option) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option]
    }));
  };

  const handleNext = () => {
    handleSubmit();
  };

  const handleSubmit = () => {
    // Notify parent that submission has started (close modal, show loading)
    if (isOnboarding && onSubmitStart) {
      onSubmitStart();
    }

    // Combine exercise_frequency and lifestyle_factors into lifestyle array
    const lifestyleItems = [...formData.lifestyle_factors];
    if (formData.exercise_frequency) {
      lifestyleItems.push(formData.exercise_frequency);
    }
    if (formData.custom_lifestyle) {
      lifestyleItems.push(formData.custom_lifestyle);
    }

    // Match the exact format that HealthDataForm uses
    const cleanSubmissionData = {
      gender: formData.gender || null,
      date_of_birth: formData.date_of_birth || null,
      weight: null,
      height: null,
      heart_rate: null,
      blood_pressure: null,
      blood_type: null,
      major_health_events: null,
      lifestyle: lifestyleItems.filter(Boolean),
      allergies: (formData.has_allergies ? formData.allergies : []).filter(Boolean),
      major_events: [],
      chronic_diseases: (formData.has_chronic_disease ? formData.chronic_diseases : []).filter(Boolean),
      calculated_age: null
    };

    // Remove empty arrays and null values for cleaner submission (same as HealthDataForm)
    Object.keys(cleanSubmissionData).forEach(key => {
      if (Array.isArray(cleanSubmissionData[key]) && cleanSubmissionData[key].length === 0) {
        cleanSubmissionData[key] = [];
      }
      if (cleanSubmissionData[key] === null || cleanSubmissionData[key] === '') {
        cleanSubmissionData[key] = null;
      }
    });

    console.log('Form submitted:', cleanSubmissionData);

    // Use the same pattern as HealthDataForm
    try {
      patientAPI.submitHealthData(cleanSubmissionData)
        .then(response => {
          console.log('Health data submitted successfully, Response:', response.data);
          if (isOnboarding && onComplete) {
            onComplete(true); // Pass success flag
          } else {
            triggerMilestone('Success! Your health profile is complete! 🎉');
            setTimeout(() => {
              alert('Health data submitted successfully!');
              resetForm();
            }, 2000);
          }
        })
        .catch(error => {
          console.error('Error submitting health data:', error);
          if (isOnboarding && onComplete) {
            onComplete(false); // Pass failure flag
          } else {
            alert('Failed to submit health data. Please try again.');
          }
        });
    } catch (error) {
      console.error('Error submitting health data:', error);
      if (isOnboarding && onComplete) {
        onComplete(false); // Pass failure flag
      } else {
        alert('Failed to submit health data. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setCurrentPage(0);
    setFormData({
      gender: '',
      date_of_birth: '',
      has_chronic_disease: false,
      chronic_diseases: [],
      has_allergies: false,
      allergies: [],
      exercise_frequency: '',
      lifestyle_factors: [],
      custom_lifestyle: ''
    });
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'choice':
        return (
          <div className="flex flex-wrap gap-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                className={`px-3 py-1.5 text-sm rounded-xl border transition-all
                  ${formData[question.id] === option
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'yesno':
        return (
          <div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAnswer(question.id, true)}
                className={`px-3 py-1.5 text-sm rounded-xl border transition-all
                  ${formData[question.id] === true
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                  }`}
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer(question.id, false)}
                className={`px-3 py-1.5 text-sm rounded-xl border transition-all
                  ${formData[question.id] === false
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                  }`}
              >
                No
              </button>
            </div>
            
            {/* Follow-up question appears inline when Yes is selected */}
            {formData[question.id] === true && question.followUp && (
              <div className="mt-4 pl-4 border-l-2 border-emerald-500/30 animate-slide-in">
                <p className="text-zinc-400 text-sm mb-3">{question.followUp.question}</p>
                {renderQuestion(question.followUp)}
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="relative">
            <input
              type="number"
              value={formData[question.id]}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="w-full p-3 pr-12 rounded-lg border-2 border-zinc-800 bg-zinc-900/50 text-zinc-100 text-sm
                focus:border-emerald-500 focus:outline-none transition-all duration-300"
            />
            {question.unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">
                {question.unit}
              </span>
            )}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={formData[question.id]}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full p-3 rounded-lg border-2 border-zinc-800 bg-zinc-900/50 text-zinc-100 text-sm
              focus:border-emerald-500 focus:outline-none transition-all duration-300"
          />
        );

      case 'multi-select':
      case 'multi-select-with-other':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMultiSelect(question.id, option)}
                  className={`px-3 py-1.5 text-sm rounded-xl border transition-all
                    ${formData[question.id]?.includes(option)
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                    }`}
                >
                  {option}
                </button>
              ))}
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded-xl border-2 border-dashed border-zinc-600 text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 transition-all"
                onClick={() => {
                  const fieldName = question.id === 'lifestyle_factors' ? 'lifestyle factor' : 
                                   question.id === 'chronic_diseases' ? 'chronic disease' :
                                   question.id === 'allergies' ? 'allergy' : 'item';
                  const customValue = prompt(`Enter other ${fieldName}:`);
                  if (customValue && customValue.trim()) {
                    if (question.type === 'multi-select-with-other') {
                      handleAnswer('custom_lifestyle', customValue.trim());
                    } else {
                      handleMultiSelect(question.id, customValue.trim());
                    }
                  }
                }}
              >
                Others
              </button>
            </div>

            {question.type === 'multi-select-with-other' && formData.custom_lifestyle && (
              <div className="mt-2 text-sm text-zinc-400">
                Custom: <span className="text-emerald-400">{formData.custom_lifestyle}</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${isOnboarding ? '' : 'min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black'} text-white ${isOnboarding ? '' : 'flex items-center justify-center p-4'} relative overflow-hidden`}>
      {/* Animated background elements - only show if not onboarding */}
      {!isOnboarding && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      )}

      {/* Milestone celebration */}
      {showMilestone && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-xl shadow-2xl 
            animate-bounce text-lg font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {showMilestone}
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      )}

      <div className={`w-full ${isOnboarding ? '' : 'max-w-3xl'} relative z-10`}>
        {/* Header - only show if not onboarding */}
        {!isOnboarding && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 
              rounded-full mb-3">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">Health Profile</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100">Tell us about yourself</h1>
            <p className="text-zinc-400 text-sm mt-2">Help us understand your health better</p>
          </div>
        )}

        {/* Question Form */}
        <div className={`${isOnboarding ? '' : 'bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 shadow-2xl'}`}>
          {/* Questions */}
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {questions.map((question, index) => (
              <div key={index} className="animate-fade-in">
                <h3 className="text-base font-semibold text-zinc-100 mb-3">
                  {question.question}
                </h3>
                {renderQuestion(question)}
              </div>
            ))}
          </div>

          {/* Submit button */}
          <div className="flex justify-end mt-6 pt-6 border-t border-zinc-800">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 
                text-white font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 
                transition-all duration-300 flex items-center gap-2 shadow-lg 
                hover:shadow-emerald-500/50 hover:scale-[1.02]"
            >
              Submit
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fun motivational text - only show if not onboarding */}
        {!isOnboarding && (
          <div className="text-center mt-4">
            <p className="text-zinc-500 text-xs">
              Your health information is secure and private 🔒
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default UpdatedHealthDataForm;
