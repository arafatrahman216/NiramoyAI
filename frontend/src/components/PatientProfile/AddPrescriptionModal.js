// src/components/PatientProfile/AddPrescriptionModal.js
import React, { useState } from 'react';
import { X, Pill, Calendar, Clock, AlertTriangle, Save, User } from 'lucide-react';

const AddPrescriptionModal = ({ isOpen, onClose, patientId, onPrescriptionAdded }) => {
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    startDate: new Date().toISOString().split('T')[0],
    purpose: '',
    instructions: '',
    totalRefills: 0,
    sideEffects: '',
    interactions: '',
    pharmacy: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common medication suggestions
  const commonMedications = [
    'Lisinopril', 'Metformin', 'Atorvastatin', 'Amlodipine', 'Omeprazole',
    'Metoprolol', 'Losartan', 'Simvastatin', 'Levothyroxine', 'Hydrochlorothiazide'
  ];

  // Frequency options
  const frequencyOptions = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 8 hours', 'Every 12 hours', 'As needed', 'Before meals', 'After meals'
  ];

  // Duration options
  const durationOptions = [
    '7 days', '10 days', '14 days', '21 days', '30 days', '60 days', '90 days', '6 months', '1 year'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.medicationName.trim()) {
      newErrors.medicationName = 'Medication name is required';
    }
    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }
    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose/condition is required';
    }
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
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
      // Calculate end date based on duration
      const startDate = new Date(formData.startDate);
      const durationDays = parseInt(formData.duration.split(' ')[0]);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + durationDays);

      const prescriptionData = {
        ...formData,
        id: Date.now(), // Temporary ID
        endDate: endDate.toISOString().split('T')[0],
        status: 'active',
        prescribedBy: 'Dr. Current Doctor', // This would come from auth context
        refillsRemaining: formData.totalRefills,
        sideEffects: formData.sideEffects.split(',').map(s => s.trim()).filter(s => s),
        interactions: formData.interactions.split(',').map(s => s.trim()).filter(s => s)
      };

      // In a real app, this would be an API call
      console.log('Adding prescription:', prescriptionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the callback to update the prescriptions list
      if (onPrescriptionAdded) {
        onPrescriptionAdded(prescriptionData);
      }

      // Reset form and close modal
      setFormData({
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        startDate: new Date().toISOString().split('T')[0],
        purpose: '',
        instructions: '',
        totalRefills: 0,
        sideEffects: '',
        interactions: '',
        pharmacy: ''
      });
      onClose();
      
    } catch (error) {
      console.error('Error adding prescription:', error);
      alert('Failed to add prescription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-500/20 rounded-lg mr-3">
              <Pill className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Add New Prescription</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Medication Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Medication Name *
              </label>
              <input
                type="text"
                name="medicationName"
                value={formData.medicationName}
                onChange={handleInputChange}
                list="medications"
                className={`w-full px-3 py-2 bg-gray-700 border ${
                  errors.medicationName ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="Enter medication name"
              />
              <datalist id="medications">
                {commonMedications.map(med => (
                  <option key={med} value={med} />
                ))}
              </datalist>
              {errors.medicationName && (
                <p className="text-red-400 text-sm mt-1">{errors.medicationName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${
                  errors.dosage ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="e.g., 10mg, 500mg"
              />
              {errors.dosage && (
                <p className="text-red-400 text-sm mt-1">{errors.dosage}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Frequency *
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${
                  errors.frequency ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              >
                <option value="">Select frequency</option>
                {frequencyOptions.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
              {errors.frequency && (
                <p className="text-red-400 text-sm mt-1">{errors.frequency}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-gray-700 border ${
                  errors.duration ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              >
                <option value="">Select duration</option>
                {durationOptions.map(dur => (
                  <option key={dur} value={dur}>{dur}</option>
                ))}
              </select>
              {errors.duration && (
                <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Refills
              </label>
              <input
                type="number"
                name="totalRefills"
                value={formData.totalRefills}
                onChange={handleInputChange}
                min="0"
                max="11"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Purpose/Condition *
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 bg-gray-700 border ${
                errors.purpose ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="e.g., High blood pressure, Type 2 diabetes"
            />
            {errors.purpose && (
              <p className="text-red-400 text-sm mt-1">{errors.purpose}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instructions *
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 bg-gray-700 border ${
                errors.instructions ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              placeholder="e.g., Take with food. Monitor blood pressure regularly."
            />
            {errors.instructions && (
              <p className="text-red-400 text-sm mt-1">{errors.instructions}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pharmacy
            </label>
            <input
              type="text"
              name="pharmacy"
              value={formData.pharmacy}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., CVS Pharmacy - Main St"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Side Effects
                <span className="text-gray-500 text-xs ml-1">(comma-separated)</span>
              </label>
              <input
                type="text"
                name="sideEffects"
                value={formData.sideEffects}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Nausea, Dizziness, Headache"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Drug Interactions
                <span className="text-gray-500 text-xs ml-1">(comma-separated)</span>
              </label>
              <input
                type="text"
                name="interactions"
                value={formData.interactions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Warfarin, NSAIDs, Alcohol"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <div className="flex items-center text-sm text-gray-400">
              <AlertTriangle className="w-4 h-4 mr-1" />
              All fields marked with * are required
            </div>
            <div className="flex space-x-3">
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
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Add Prescription
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
