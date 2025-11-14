import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Search, Users, Loader, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, doctorAPI } from '../../services/api';
import CreatePrescriptionModal from './CreatePrescriptionModal';
import './PrescribeModal.css';

const PrescribeModal = ({ isOpen, onClose, doctorProfile }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getPatients();
      if (response.data.patients) {
        setPatients(response.data.patients);
        setFilteredPatients(response.data.patients);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSearch = (searchTerm) => {
    setPatientSearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    try {
      const response = await doctorAPI.accessPatientData(patient.id);
      if (response.data.success) {
        setPatientData(response.data.user);
        setVitals(response.data.vitals || []);
        setShowPrescriptionModal(true);
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
      alert('Failed to load patient data');
    }
  };

  const handleCreatePrescription = async (prescriptionData) => {
    try {
      const response = await doctorAPI.createPrescription({
        ...prescriptionData,
        patientId: selectedPatient.id
      });

      if (response.data.success || response.status === 200 || response.status === 201) {
        alert('Prescription created successfully!');
        handleClosePrescriptionModal();
      } else {
        throw new Error(response.data.message || 'Failed to create prescription');
      }
    } catch (err) {
      console.error('Error creating prescription:', err);
      alert(err.message || 'Error creating prescription');
      throw err;
    }
  };

  const handleClosePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedPatient(null);
    setPatientData(null);
    setVitals([]);
  };

  const handleBackFromPrescription = () => {
    handleClosePrescriptionModal();
  };

  if (!isOpen) return null;

  // When prescription modal is open, don't show the main modal
  if (showPrescriptionModal) {
    return (
      <CreatePrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={handleBackFromPrescription}
        patientName={selectedPatient?.name || 'Patient'}
        patientId={selectedPatient?.id}
        vitals={vitals}
        patientData={patientData}
        doctorData={doctorProfile}
        onSubmit={handleCreatePrescription}
      />
    );
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="pm-backdrop"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="pm-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="pm-header">
                <div>
                  <h2 className="pm-title">Create Prescription</h2>
                  <p className="pm-subtitle">Select a patient from your list</p>
                </div>
                <button
                  onClick={onClose}
                  className="pm-close-btn"
                  title="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="pm-content">
                {/* Patients List Section */}
                <div className="pm-patients-section">
                  <h3 className="pm-section-title">Your Patients</h3>
                  
                  {/* Search Box */}
                  <div className="pm-search-container">
                    <Search className="pm-search-icon" size={18} />
                    <input
                      type="text"
                      placeholder="Search patients by name..."
                      value={patientSearchTerm}
                      onChange={(e) => handlePatientSearch(e.target.value)}
                      className="pm-search-input"
                    />
                  </div>

                  {/* Patients List */}
                  {loading ? (
                    <div className="pm-loading">
                      <Loader size={32} className="pm-spinner" />
                      <p>Loading patients...</p>
                    </div>
                  ) : filteredPatients.length > 0 ? (
                    <div className="pm-patients-list">
                      {filteredPatients.map((patient) => (
                        <motion.div
                          key={patient.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pm-patient-item"
                          onClick={() => handleSelectPatient(patient)}
                        >
                          <div className="pm-patient-avatar">
                            {patient.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="pm-patient-info">
                            <h4 className="pm-patient-name">{patient.name}</h4>
                            <p className="pm-patient-gender">Gender: {patient.gender || 'N/A'}</p>
                            <p className="pm-patient-id">ID: #{patient.id}</p>
                          </div>
                          <div className="pm-select-btn">
                            <span className="pm-select-arrow">→</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="pm-no-patients">
                      <Users size={32} />
                      <p>
                        {patientSearchTerm
                          ? 'No patients found matching your search'
                          : 'No patients yet'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PrescribeModal;
