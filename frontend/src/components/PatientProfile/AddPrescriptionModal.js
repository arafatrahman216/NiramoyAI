// src/components/PatientProfile/AddPrescriptionModal.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Assuming there's a useAuth hook to get user info
import { X, Pill, Plus, Minus, FileText, Stethoscope, Calendar, Printer, Save, Search } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api'; // Assuming you have a config file for API base URL

const AddPrescriptionModal = ({ isOpen, onClose, patientId, onPrescriptionAdded }) => {
  const [formData, setFormData] = useState({
    medicines: [{
      id: 1,
      name: '',
      type: 'tab',
      morning: false,
      noon: false,
      evening: false,
      night: false,
      dose: '',
      duration: '',
      purpose: '',
      instruction: ''
    }],
    tests: [],
    diagnosis: '',
    symptoms: '',
    advice: '',
    followUpDate: '',
    customInstructions: ''
  });


  const { user } = useAuth(); // Assuming useAuth provides user info

  const [doctor, setDoctor] = useState({
    name: user?.name || 'Current Doctor',
    specialization: user?.specialization || 'General Practitioner',
    experience: user?.experience || '1 year',
    contact: user?.phoneNumber || '123-456-7890'
  });

  useEffect(() => {
    try {
        if (user?.role==='DOCTOR') {
            const doctor = axios.post(`{API_BASE_URL}/doctor/profile`);
            setDoctor(doctor.data);
        }
    } catch (error) {
        console.error('Error fetching doctor information:', error);
    }
    }, [user]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Medicine types
  const medicineTypes = [
    { value: 'tab', label: 'Tablet' },
    { value: 'cap', label: 'Capsule' },
    { value: 'syr', label: 'Syrup' },
    { value: 'inj', label: 'Injection' },
    { value: 'drops', label: 'Drops' },
    { value: 'oint', label: 'Ointment' },
    { value: 'powder', label: 'Powder' },
    { value: 'spray', label: 'Spray' }
  ];

  // Common medicines database
  const commonMedicines = [
    'Paracetamol', 'Ibuprofen', 'Aspirin', 'Omeprazole', 'Metformin',
    'Lisinopril', 'Atorvastatin', 'Amlodipine', 'Losartan', 'Metoprolol',
    'Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Cephalexin', 'Doxycycline',
    'Loratadine', 'Cetirizine', 'Montelukast', 'Prednisolone', 'Hydrocortisone'
  ];

  // Common tests
  const commonTests = [
    'Complete Blood Count (CBC)', 'Blood Sugar (Fasting)', 'Blood Sugar (PP)', 'HbA1c',
    'Lipid Profile', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)',
    'Thyroid Function Test (TFT)', 'Urine Routine', 'ECG', 'Chest X-Ray',
    'Blood Pressure Monitoring', 'Echocardiogram', 'Ultrasound Abdomen',
    'CT Scan', 'MRI', 'Blood Culture', 'Stool Test', 'Vitamin D', 'Vitamin B12'
  ];

  // Common instructions
  const commonInstructions = [
    'Take after food',
    'Take before food',
    'Take with food',
    'Take on empty stomach',
    'Take with water',
    'Take with milk',
    'Avoid alcohol',
    'Complete the course',
    'Do not stop suddenly',
    'Take at bedtime',
    'Apply topically',
    'Take as needed for pain',
    'Dissolve in water',
    'Chew thoroughly'
  ];

  // Duration options
  const durationOptions = [
    '3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '30 days',
    '2 months', '3 months', '6 months', 'Continue', 'As needed'
  ];

  const addMedicine = () => {
    const newMedicine = {
      id: Date.now(),
      name: '',
      type: 'tab',
      morning: false,
      noon: false,
      evening: false,
      night: false,
      dose: '',
      duration: '',
      purpose: '',
      instruction: ''
    };
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMedicine]
    }));
  };

  const removeMedicine = (id) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter(med => med.id !== id)
    }));
  };

  const updateMedicine = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    }));
  };

  const addTest = (testName) => {
    if (!formData.tests.includes(testName)) {
      setFormData(prev => ({
        ...prev,
        tests: [...prev.tests, testName]
      }));
    }
  };

  const removeTest = (testName) => {
    setFormData(prev => ({
      ...prev,
      tests: prev.tests.filter(test => test !== testName)
    }));
  };

  const getTimingText = (medicine) => {
    const times = [];
    if (medicine.morning) times.push('Morning');
    if (medicine.noon) times.push('Noon');
    if (medicine.evening) times.push('Evening');
    if (medicine.night) times.push('Night');
    return times.join(' - ') || 'Not specified';
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.medicines.length === 0) {
      newErrors.medicines = 'At least one medicine is required';
    } else {
      formData.medicines.forEach((med, index) => {
        if (!med.name.trim()) {
          newErrors[`medicine_${index}_name`] = 'Medicine name is required';
        }
        if (!med.morning && !med.noon && !med.evening && !med.night) {
          newErrors[`medicine_${index}_timing`] = 'At least one timing must be selected';
        }
        if (!med.dose.trim()) {
          newErrors[`medicine_${index}_dose`] = 'Dose is required';
        }
        if (!med.duration.trim()) {
          newErrors[`medicine_${index}_duration`] = 'Duration is required';
        }
      });
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const prescriptionData = {
        id: Date.now(),
        patientId,
        date: new Date().toISOString().split('T')[0],
        medicines: formData.medicines,
        tests: formData.tests,
        diagnosis: formData.diagnosis,
        symptoms: formData.symptoms,
        advice: formData.advice,
        followUpDate: formData.followUpDate,
        customInstructions: formData.customInstructions,
        prescribedBy: `Dr. ${user.name}`, // This would come from auth context
        status: 'active'
      };

      console.log('Adding prescription:', prescriptionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onPrescriptionAdded) {
        onPrescriptionAdded(prescriptionData);
      }

      onClose();
      
    } catch (error) {
      console.error('Error adding prescription:', error);
      alert('Failed to add prescription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintPreview = () => {
    if (validateForm()) {
      setShowPrintPreview(true);
    }
  };

  if (!isOpen) return null;

  if (showPrintPreview) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Print Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Prescription Preview</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={() => setShowPrintPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Prescription Content */}
          <div className="p-8 text-black bg-white" id="prescription-content">
            {/* Header */}
            <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-blue-600">Dr. {user.name}</h1>
              <p className="text-gray-600">{}</p>
              <p className="text-gray-600">Registration No: 12345</p>
              <p className="text-gray-600">Hospital Name | Phone: +1-234-567-8900 | Email: doctor@hospital.com</p>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p><strong>Patient Name:</strong> John Doe</p>
                <p><strong>Age:</strong> 35 years</p>
                <p><strong>Gender:</strong> Male</p>
              </div>
              <div>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Patient ID:</strong> {patientId}</p>
              </div>
            </div>

            {/* Symptoms */}
            {formData.symptoms && (
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">Chief Complaints:</h3>
                <p className="text-gray-700">{formData.symptoms}</p>
              </div>
            )}

            {/* Diagnosis */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Diagnosis:</h3>
              <p className="text-gray-700">{formData.diagnosis}</p>
            </div>

            {/* Medicines */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 border-b border-gray-300 pb-2">℞ Medications:</h3>
              <div className="space-y-4">
                {formData.medicines.map((medicine, index) => (
                  <div key={medicine.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-lg">{index + 1}. {medicine.name}</span>
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded">
                        {medicineTypes.find(t => t.value === medicine.type)?.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                      <div>
                        <strong>Dose:</strong> {medicine.dose}
                      </div>
                      <div>
                        <strong>Timing:</strong> {getTimingText(medicine)}
                      </div>
                      <div>
                        <strong>Duration:</strong> {medicine.duration}
                      </div>
                    </div>
                    {medicine.purpose && (
                      <div className="text-sm text-gray-600 mt-1">
                        <strong>For:</strong> {medicine.purpose}
                      </div>
                    )}
                    {medicine.instruction && (
                      <div className="text-sm text-gray-600 italic">
                        <strong>Instructions:</strong> {medicine.instruction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tests */}
            {formData.tests.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 border-b border-gray-300 pb-2">Investigations:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {formData.tests.map((test, index) => (
                    <li key={index} className="text-gray-700">{test}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Advice */}
            {formData.advice && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2 border-b border-gray-300 pb-2">Advice:</h3>
                <p className="text-gray-700">{formData.advice}</p>
              </div>
            )}

            {/* Follow-up */}
            {formData.followUpDate && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Follow-up:</h3>
                <p className="text-gray-700">Next visit on: {new Date(formData.followUpDate).toLocaleDateString()}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>This prescription is valid for 30 days from the date of issue.</p>
                </div>
                <div className="text-center">
                  <div className="w-40 border-t border-gray-400 mt-8">
                    <p className="text-sm font-medium mt-2">Doctor's Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-500/20 rounded-lg mr-3">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Create New Prescription</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Patient Info & Symptoms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chief Complaints / Symptoms
              </label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Patient's main complaints or symptoms..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Diagnosis *
              </label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 bg-gray-700 border ${
                  errors.diagnosis ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="Primary diagnosis..."
              />
              {errors.diagnosis && (
                <p className="text-red-400 text-sm mt-1">{errors.diagnosis}</p>
              )}
            </div>
          </div>

          {/* Medicines Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Pill className="w-5 h-5 mr-2 text-emerald-400" />
                Medications
              </h3>
              <button
                type="button"
                onClick={addMedicine}
                className="flex items-center px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {formData.medicines.map((medicine, index) => (
                <div key={medicine.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-emerald-400">Medicine {index + 1}</span>
                    {formData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(medicine.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
                        list={`medicines-${medicine.id}`}
                        className={`w-full px-3 py-2 bg-gray-700 border ${
                          errors[`medicine_${index}_name`] ? 'border-red-500' : 'border-gray-600'
                        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        placeholder="Enter medicine name"
                      />
                      <datalist id={`medicines-${medicine.id}`}>
                        {commonMedicines.map(med => (
                          <option key={med} value={med} />
                        ))}
                      </datalist>
                      {errors[`medicine_${index}_name`] && (
                        <p className="text-red-400 text-sm mt-1">{errors[`medicine_${index}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        value={medicine.type}
                        onChange={(e) => updateMedicine(medicine.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {medicineTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Timing Checkboxes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Timing *
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { key: 'morning', label: 'Morning', icon: '🌅' },
                        { key: 'noon', label: 'Noon', icon: '☀️' },
                        { key: 'evening', label: 'Evening', icon: '🌆' },
                        { key: 'night', label: 'Night', icon: '🌙' }
                      ].map(time => (
                        <label key={time.key} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={medicine[time.key]}
                            onChange={(e) => updateMedicine(medicine.id, time.key, e.target.checked)}
                            className="mr-2 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-gray-300">{time.icon} {time.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors[`medicine_${index}_timing`] && (
                      <p className="text-red-400 text-sm mt-1">{errors[`medicine_${index}_timing`]}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dose *
                      </label>
                      <input
                        type="text"
                        value={medicine.dose}
                        onChange={(e) => updateMedicine(medicine.id, 'dose', e.target.value)}
                        className={`w-full px-3 py-2 bg-gray-700 border ${
                          errors[`medicine_${index}_dose`] ? 'border-red-500' : 'border-gray-600'
                        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                        placeholder="e.g., 1 tablet, 10ml"
                      />
                      {errors[`medicine_${index}_dose`] && (
                        <p className="text-red-400 text-sm mt-1">{errors[`medicine_${index}_dose`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duration *
                      </label>
                      <select
                        value={medicine.duration}
                        onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                        className={`w-full px-3 py-2 bg-gray-700 border ${
                          errors[`medicine_${index}_duration`] ? 'border-red-500' : 'border-gray-600'
                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      >
                        <option value="">Select duration</option>
                        {durationOptions.map(dur => (
                          <option key={dur} value={dur}>{dur}</option>
                        ))}
                      </select>
                      {errors[`medicine_${index}_duration`] && (
                        <p className="text-red-400 text-sm mt-1">{errors[`medicine_${index}_duration`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Purpose
                      </label>
                      <input
                        type="text"
                        value={medicine.purpose}
                        onChange={(e) => updateMedicine(medicine.id, 'purpose', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="For pain, fever, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Instructions
                    </label>
                    <div className="flex gap-2 mb-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            updateMedicine(medicine.id, 'instruction', e.target.value);
                          }
                        }}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select common instruction</option>
                        {commonInstructions.map(inst => (
                          <option key={inst} value={inst}>{inst}</option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      value={medicine.instruction}
                      onChange={(e) => updateMedicine(medicine.id, 'instruction', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Custom instructions or select from dropdown above"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tests Section */}
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center mb-4">
              <Stethoscope className="w-5 h-5 mr-2 text-emerald-400" />
              Laboratory Tests / Investigations
            </h3>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {commonTests.map(test => (
                  <button
                    key={test}
                    type="button"
                    onClick={() => addTest(test)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      formData.tests.includes(test)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {test}
                  </button>
                ))}
              </div>
            </div>

            {formData.tests.length > 0 && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium text-gray-300 mb-2">Selected Tests:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.tests.map(test => (
                    <span
                      key={test}
                      className="flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm"
                    >
                      {test}
                      <button
                        type="button"
                        onClick={() => removeTest(test)}
                        className="ml-2 text-emerald-300 hover:text-emerald-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                General Advice
              </label>
              <textarea
                value={formData.advice}
                onChange={(e) => setFormData(prev => ({ ...prev, advice: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="General health advice, lifestyle modifications, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Instructions
                </label>
                <textarea
                  value={formData.customInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, customInstructions: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Any additional instructions or notes"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <div className="flex items-center text-sm text-gray-400">
              <span>* Required fields</span>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handlePrintPreview}
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Preview & Print
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Prescription
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;
