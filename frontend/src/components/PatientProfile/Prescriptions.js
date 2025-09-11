// src/components/PatientProfile/Prescriptions.js
import React, { useState, useEffect } from 'react';
import { Pill, Clock, Calendar, AlertTriangle, CheckCircle, XCircle, Search, Filter, Plus, Eye } from 'lucide-react';
import AddPrescriptionModal from './AddPrescriptionModal';

const Prescriptions = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Fallback prescriptions data
  const fallbackPrescriptions = [
    {
      id: 1,
      medicationName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      startDate: '2025-09-01',
      endDate: '2025-10-01',
      status: 'active',
      prescribedBy: 'Dr. Sarah Johnson',
      instructions: 'Take with or without food. Monitor blood pressure regularly.',
      refillsRemaining: 2,
      totalRefills: 3,
      purpose: 'High blood pressure',
      sideEffects: ['Dizziness', 'Dry cough', 'Fatigue'],
      interactions: ['NSAIDs', 'Potassium supplements'],
      pharmacy: 'CVS Pharmacy - Main St'
    },
    {
      id: 2,
      medicationName: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '90 days',
      startDate: '2025-08-15',
      endDate: '2025-11-15',
      status: 'active',
      prescribedBy: 'Dr. Michael Chen',
      instructions: 'Take with meals to reduce stomach upset.',
      refillsRemaining: 1,
      totalRefills: 2,
      purpose: 'Type 2 diabetes',
      sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
      interactions: ['Alcohol', 'Contrast dyes'],
      pharmacy: 'Walgreens - Oak Ave'
    },
    {
      id: 3,
      medicationName: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily (evening)',
      duration: '30 days',
      startDate: '2025-07-20',
      endDate: '2025-08-20',
      status: 'completed',
      prescribedBy: 'Dr. Sarah Johnson',
      instructions: 'Take in the evening. Avoid grapefruit juice.',
      refillsRemaining: 0,
      totalRefills: 1,
      purpose: 'High cholesterol',
      sideEffects: ['Muscle pain', 'Liver problems'],
      interactions: ['Grapefruit', 'Warfarin'],
      pharmacy: 'CVS Pharmacy - Main St'
    },
    {
      id: 4,
      medicationName: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      duration: '7 days',
      startDate: '2025-09-05',
      endDate: '2025-09-12',
      status: 'completed',
      prescribedBy: 'Dr. Emily Rodriguez',
      instructions: 'Complete entire course even if feeling better.',
      refillsRemaining: 0,
      totalRefills: 0,
      purpose: 'Bacterial infection',
      sideEffects: ['Nausea', 'Diarrhea', 'Rash'],
      interactions: ['Birth control pills', 'Warfarin'],
      pharmacy: 'Rite Aid - Center St'
    },
    {
      id: 5,
      medicationName: 'Omeprazole',
      dosage: '20mg',
      frequency: 'Once daily (morning)',
      duration: '60 days',
      startDate: '2025-08-01',
      endDate: '2025-10-01',
      status: 'paused',
      prescribedBy: 'Dr. Michael Chen',
      instructions: 'Take 30 minutes before breakfast.',
      refillsRemaining: 1,
      totalRefills: 2,
      purpose: 'Acid reflux',
      sideEffects: ['Headache', 'Nausea', 'Diarrhea'],
      interactions: ['Clopidogrel', 'Atazanavir'],
      pharmacy: 'CVS Pharmacy - Main St'
    }
  ];

  useEffect(() => {
    setPrescriptions(fallbackPrescriptions);
    setFilteredPrescriptions(fallbackPrescriptions);
  }, [patientId]);

  useEffect(() => {
    let filtered = prescriptions;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(prescription => prescription.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(prescription => 
        prescription.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrescriptions(filtered);
  }, [searchTerm, filterStatus, prescriptions]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'paused': return <XCircle className="w-4 h-4 text-yellow-400" />;
      case 'expired': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      case 'paused': return 'text-yellow-400 bg-yellow-500/20';
      case 'expired': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Prescriptions' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'expired', label: 'Expired' }
  ];

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddPrescription = (newPrescription) => {
    setPrescriptions(prev => [newPrescription, ...prev]);
    setFilteredPrescriptions(prev => [newPrescription, ...prev]);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Prescriptions</h3>
        <div className="flex items-center space-x-2">
          <Pill className="w-6 h-6 text-emerald-400" />
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Prescription
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by medication name, purpose, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-gray-700">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No prescriptions found</p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-gray-700/50 rounded-xl p-6 border border-gray-600/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Pill className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">{prescription.medicationName}</h4>
                    <p className="text-emerald-400 font-medium">{prescription.dosage} • {prescription.frequency}</p>
                    <p className="text-sm text-gray-400">Prescribed by {prescription.prescribedBy}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor(prescription.status)}`}>
                    {getStatusIcon(prescription.status)}
                    <span className="ml-2 text-sm font-medium capitalize">{prescription.status}</span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Prescription Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm font-medium text-gray-300">Duration</span>
                  </div>
                  <p className="text-white">{prescription.duration}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(prescription.startDate).toLocaleDateString()} - {new Date(prescription.endDate).toLocaleDateString()}
                  </p>
                  {prescription.status === 'active' && (
                    <p className="text-xs text-emerald-400 mt-1">
                      {getDaysRemaining(prescription.endDate)} days remaining
                    </p>
                  )}
                </div>

                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <span className="w-4 h-4 text-purple-400 mr-2 text-sm font-bold">Rx</span>
                    <span className="text-sm font-medium text-gray-300">Refills</span>
                  </div>
                  <p className="text-white">{prescription.refillsRemaining} of {prescription.totalRefills} remaining</p>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{
                        width: `${(prescription.refillsRemaining / prescription.totalRefills) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <span className="w-4 h-4 text-orange-400 mr-2 text-sm font-bold">⚕</span>
                    <span className="text-sm font-medium text-gray-300">Purpose</span>
                  </div>
                  <p className="text-white">{prescription.purpose}</p>
                  <p className="text-xs text-gray-400 mt-1">{prescription.pharmacy}</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-300 mb-2">Instructions:</h5>
                <p className="text-gray-300 text-sm bg-gray-600/20 rounded-lg p-3">{prescription.instructions}</p>
              </div>

              {/* Side Effects and Interactions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Side Effects:</h5>
                  <div className="flex flex-wrap gap-2">
                    {prescription.sideEffects.map((effect, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Drug Interactions:</h5>
                  <div className="flex flex-wrap gap-2">
                    {prescription.interactions.map((interaction, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {interaction}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Total Prescriptions</h4>
          <p className="text-2xl font-bold text-white">{prescriptions.length}</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Active</h4>
          <p className="text-2xl font-bold text-green-400">
            {prescriptions.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Completed</h4>
          <p className="text-2xl font-bold text-blue-400">
            {prescriptions.filter(p => p.status === 'completed').length}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Refills Needed</h4>
          <p className="text-2xl font-bold text-yellow-400">
            {prescriptions.filter(p => p.refillsRemaining === 0 && p.status === 'active').length}
          </p>
        </div>
      </div>

      {/* Add Prescription Modal */}
      <AddPrescriptionModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        patientId={patientId}
        onPrescriptionAdded={handleAddPrescription}
      />
    </div>
  );
};

export default Prescriptions;
