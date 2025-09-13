// src/components/PatientProfile/Prescriptions.js
import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Printer, 
  Calendar,
  FileText,
  Activity,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import AddPrescriptionModal from './AddPrescriptionModal';
import { fallbackPrescriptions } from '../../utils/dummyData';

const Prescriptions = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedPrescriptions, setExpandedPrescriptions] = useState(new Set());

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
        prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medicines.some(med => 
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.purpose.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        prescription.tests.some(test => 
          test.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredPrescriptions(filtered);
  }, [searchTerm, filterStatus, prescriptions]);

  const getTimingText = (medicine) => {
    const times = [];
    if (medicine.morning) times.push('Morning');
    if (medicine.noon) times.push('Noon');
    if (medicine.evening) times.push('Evening');
    if (medicine.night) times.push('Night');
    return times.join(' - ') || 'As needed';
  };

  const getMedicineTypeLabel = (type) => {
    const types = {
      'tab': 'Tablet',
      'cap': 'Capsule', 
      'syr': 'Syrup',
      'inj': 'Injection',
      'drops': 'Drops',
      'oint': 'Ointment',
      'powder': 'Powder',
      'spray': 'Spray'
    };
    return types[type] || type;
  };

  const filterOptions = [
    { value: 'all', label: 'All Prescriptions' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'expired', label: 'Expired' }
  ];

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

  const togglePrescriptionExpansion = (prescriptionId) => {
    setExpandedPrescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(prescriptionId)) {
        newSet.delete(prescriptionId);
      } else {
        newSet.add(prescriptionId);
      }
      return newSet;
    });
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
          filteredPrescriptions.map((prescription) => {
            const isExpanded = expandedPrescriptions.has(prescription.id);
            
            return (
            <div key={prescription.id} className="bg-gray-700/50 rounded-xl border border-gray-600/50 overflow-hidden">
              {/* Header - Always Visible */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-600/20 transition-colors"
                onClick={() => togglePrescriptionExpansion(prescription.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Pill className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Prescription #{prescription.id}
                      </h3>
                      <p className="text-gray-400">
                        by Dr. {prescription.prescribedBy} • {prescription.date}
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        {prescription.diagnosis} • {prescription.medicines.length} medicine{prescription.medicines.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prescription.status === 'active' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {prescription.status}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-600/50">
                  {/* Diagnosis & Symptoms */}
                  <div className="mb-4 mt-4">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Diagnosis & Symptoms
                    </h4>
                    <p className="text-gray-300 mb-2">{prescription.diagnosis}</p>
                    {prescription.symptoms && (
                      <p className="text-gray-400 text-sm">Symptoms: {prescription.symptoms}</p>
                    )}
                  </div>

                  {/* Medicines */}
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Medicines ({prescription.medicines.length})
                    </h4>
                    <div className="space-y-3">
                      {prescription.medicines.map((medicine, index) => (
                        <div key={index} className="bg-gray-600/30 p-4 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="text-white font-medium">{medicine.name}</h5>
                              <p className="text-gray-400 text-sm">
                                {getMedicineTypeLabel(medicine.type)} • {medicine.dose} • {medicine.duration}
                              </p>
                            </div>
                            <span className="text-blue-400 text-sm">{getTimingText(medicine)}</span>
                          </div>
                          <div className="text-gray-300 text-sm mb-2">
                            <span className="font-medium">Purpose:</span> {medicine.purpose}
                          </div>
                          {medicine.instructions && (
                            <div className="text-gray-400 text-sm">
                              <span className="font-medium">Instructions:</span> {medicine.instructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tests */}
                  {prescription.tests && prescription.tests.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Recommended Tests
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {prescription.tests.map((test, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-600/50 text-gray-300 rounded-full text-sm"
                          >
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advice */}
                  {prescription.advice && (
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Doctor's Advice
                      </h4>
                      <p className="text-gray-300 text-sm bg-gray-600/20 rounded-lg p-3">{prescription.advice}</p>
                    </div>
                  )}

                  {/* Custom Instructions */}
                  {prescription.customInstructions && (
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Additional Instructions</h4>
                      <p className="text-gray-300 text-sm bg-gray-600/20 rounded-lg p-3">{prescription.customInstructions}</p>
                    </div>
                  )}

                  {/* Follow-up & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {prescription.followUpDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Follow-up: {prescription.followUpDate}
                        </span>
                      )}
                      <span>Prescribed: {prescription.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            );
          })
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
          <h4 className="text-sm font-medium text-gray-400 mb-1">Total Medicines</h4>
          <p className="text-2xl font-bold text-yellow-400">
            {prescriptions.reduce((total, prescription) => total + (prescription.medicines?.length || 0), 0)}
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
