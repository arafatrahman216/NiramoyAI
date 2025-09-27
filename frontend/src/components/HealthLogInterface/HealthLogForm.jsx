// ==============================================
// HEALTH LOG FORM MAIN CONTAINER
// ==============================================
// Health logging form for daily health data entry
import React, { useState } from 'react';
import { Heart, Activity, Thermometer, FileText, BarChart3, Stethoscope, ArrowLeft, Home, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VitalsLogStep from './VitalsLogStep';
import SymptomsLogStep from './SymptomsLogStep';
import NotesLogStep from './NotesLogStep';
import ProgressBar from './ProgressBar';
import NavigationButtons from './NavigationButtons';
import CompleteLogStep from './CompleteLogStep';
import api, { API_BASE_URL } from '../../services/api';
import AudioButton from './AudioButton';

const HealthLogForm = ({ isModal = false, onClose = null }) => {
  const navigate = useNavigate();
  
  // ==============================================
  // STATE MANAGEMENT
  // ==============================================
  const [audioResponse, setAudioResponse] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Vitals
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    blood_sugar: '',
    heart_rate: '',
    oxygen_saturation: '',
    temperature: '',
    weight: '',
    stress_level: '',
    // Symptoms and Notes
    symptoms: [],
    notes: '',
    // Metadata
    log_date: new Date().toISOString().split('T')[0],
    log_time: new Date().toTimeString().split(' ')[0].substring(0, 5)
  });

  // Predefined symptom options
  const symptomOptions = [
    "Headache",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Chest Pain",
    "Shortness of Breath",
    "Fever",
    "Cough",
    "Joint Pain",
    "Muscle Pain",
    "Insomnia",
    "Anxiety",
    "Depression",
    "Loss of Appetite",
    "Digestive Issues",
    "Skin Rash",
    "Vision Problems",
    "Hearing Problems"
  ];

  // Custom symptom input state
  const [showCustomSymptom, setShowCustomSymptom] = useState(false);
  const [customSymptom, setCustomSymptom] = useState('');

  // Form steps configuration
  const steps = [
    { id: 'vitals', title: 'Vital Signs', icon: Heart },
    { id: 'symptoms', title: 'Symptoms', icon: Stethoscope },
    { id: 'notes', title: 'Notes', icon: FileText },
    { id: 'complete', title: 'Complete', icon: BarChart3 }
  ];

  // ==============================================
  // FORM HANDLERS
  // ==============================================
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleCustomSymptomAdd = () => {
    const symptom = customSymptom.trim();
    if (symptom && !formData.symptoms.includes(symptom)) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom]
      }));
      setCustomSymptom('');
      setShowCustomSymptom(false);
    }
  };

  const handleCustomSymptomCancel = () => {
    setCustomSymptom('');
    setShowCustomSymptom(false);
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission
  const handleSubmit = () => {
    // Prepare submission data
    const logData = {
      ...formData,
      timestamp: new Date().toISOString(),
      // Convert string values to numbers where appropriate
      blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : null,
      blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : null,
      blood_sugar: formData.blood_sugar ? parseFloat(formData.blood_sugar) : null,
      heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
      oxygen_saturation: formData.oxygen_saturation ? parseFloat(formData.oxygen_saturation) : null,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      stress_level: formData.stress_level ? parseInt(formData.stress_level) : null
    };

    console.log('Health log submitted:', logData);
    
    // TODO: Replace with actual API call
    try {
      // Simulate API call
      // const response = api.post('/user/vitals', logData);
      // console.log('API response:', response);
      // if (response && response.status === 200) 
      alert('Health log submitted successfully!');
      resetForm();
    } catch (error) {
      console.error('Error submitting health log:', error);
      alert('Error submitting health log. Please try again.');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      blood_sugar: '',
      heart_rate: '',
      oxygen_saturation: '',
      temperature: '',
      weight: '',
      stress_level: '',
      symptoms: [],
      notes: '',
      log_date: new Date().toISOString().split('T')[0],
      log_time: new Date().toTimeString().split(' ')[0].substring(0, 5)
    });
    setCurrentStep(0);
    setShowCustomSymptom(false);
    setCustomSymptom('');
  };

  // Navigation handlers
  const handleDashboardClick = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate('/dashboard');
    }
  };

  const handleBackClick = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  // ==============================================
  // Audio recording handled by AudioButton component now.

  // ==============================================
  // STEP RENDERER
  // ==============================================
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <VitalsLogStep 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <SymptomsLogStep 
            formData={formData}
            symptomOptions={symptomOptions}
            handleSymptomToggle={handleSymptomToggle}
            showCustomSymptom={showCustomSymptom}
            setShowCustomSymptom={setShowCustomSymptom}
            customSymptom={customSymptom}
            setCustomSymptom={setCustomSymptom}
            handleCustomSymptomAdd={handleCustomSymptomAdd}
            handleCustomSymptomCancel={handleCustomSymptomCancel}
          />
        );
      case 2:
        return (
          <NotesLogStep 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <CompleteLogStep 
            formData={formData}
            resetForm={resetForm}
          />
        );
      default:
        return null;
    }
  };

  // ==============================================
  // MAIN RENDER
  // ==============================================
  const containerClass = isModal 
    ? "w-full max-w-4xl mx-auto" 
    : "min-h-screen bg-black text-white flex items-center justify-center p-4";

  const contentClass = isModal 
    ? "w-full" 
    : "w-full max-w-4xl";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {/* Navigation Header */}
        {!isModal && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackClick}
                className="flex items-center px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleDashboardClick}
                className="flex items-center px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl transition-colors font-medium"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Modal Header */}
        {isModal && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-700">
            <h1 className="text-2xl font-light text-white">Health Log Entry</h1>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} steps={steps} />

        {/* Form Content */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {!isModal && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-white mb-2">Health Log Entry</h1>
              <p className="text-zinc-400">Record your daily health information</p>
              <div className="flex items-center justify-center mt-4 text-sm text-zinc-500">
                <span className="mr-2">📅 {formData.log_date}</span>
                <span>🕐 {formData.log_time}</span>
              </div>
            </div>
          )}

          {isModal && (
            <div className="text-center mb-6">
              <p className="text-zinc-400">Record your daily health information</p>
              <div className="flex items-center justify-center mt-3 text-sm text-zinc-500">
                <span className="mr-2">📅 {formData.log_date}</span>
                <span>🕐 {formData.log_time}</span>
              </div>
            </div>
          )}

          {renderStep()}

          {/* Audio Recording */}
          { currentStep < steps.length - 1 && <div className="mt-10">
            <AudioButton onUploadSuccess={(res)=>
              {
                setAudioResponse(res.healthLogRecord);
                console.log('Audio uploaded', res.healthLogRecord);

                console.log('formData before update:', formData); 
                setFormData(prev => ({
                  ...prev,
                  blood_pressure_systolic : (res.healthLogRecord.systolicBloodPressure!== "" )? res.healthLogRecord.systolicBloodPressure : prev.blood_pressure_systolic,
                  blood_pressure_diastolic : (res.healthLogRecord.diastolicBloodPressure!== "" )? res.healthLogRecord.diastolicBloodPressure : prev.blood_pressure_diastolic,
                  blood_sugar : (res.healthLogRecord.bloodSugar!== "" )? res.healthLogRecord.bloodSugar : prev.blood_sugar,
                  heart_rate : (res.healthLogRecord.heartRate!== "" )? res.healthLogRecord.heartRate : prev.heart_rate,
                  oxygen_saturation : (res.healthLogRecord.oxygenSaturation!== "" )? res.healthLogRecord.oxygenSaturation : prev.oxygen_saturation,
                  temperature : (res.healthLogRecord.temperature!== "" )? res.healthLogRecord.temperature : prev.temperature,
                  weight : (res.healthLogRecord.weight!== "" )? res.healthLogRecord.weight : prev.weight,
                  stress_level : (res.healthLogRecord.stressLevel!== "" )? res.healthLogRecord.stressLevel : prev.stress_level,
                  symptoms: (res.healthLogRecord.otherSymptoms && res.healthLogRecord.otherSymptoms.length > 0) ? Array.from(new Set([...prev.symptoms, ...res.healthLogRecord.otherSymptoms])) : prev.symptoms,

                  notes: (res.healthLogRecord.note) ? prev.notes + res.healthLogRecord.note : prev.notes

              }));
              console.log("after update : ", formData);
            }} />
          </div>
          }

          {/* Navigation Buttons */}
          {currentStep < steps.length - 1 && (
            <NavigationButtons 
              currentStep={currentStep} 
              steps={steps} 
              prevStep={prevStep} 
              nextStep={nextStep} 
            />
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
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in-right 0.5s ease-out;
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

export default HealthLogForm;
