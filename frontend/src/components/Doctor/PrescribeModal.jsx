import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Search, Users, Loader, Plus, Trash2, Send, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, doctorAPI } from '../../services/api';
import './PrescribeModal.css';

const PrescribeModal = ({ isOpen, onClose, doctorProfile }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [vitals, setVitals] = useState([]);

  // Prescription form states
  const [manualPatientName, setManualPatientName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [medications, setMedications] = useState([
    { id: 1, name: '', frequency: 'Once daily', duration: '' }
  ]);
  const [tests, setTests] = useState('');
  const [notes, setNotes] = useState('');
  const [nextMedId, setNextMedId] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  const frequencyOptions = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Once weekly',
    'As needed'
  ];

  const dosesOptions = [
    '250mg',
    '500mg',
    '1g',
    '2g',
    '5mg',
    '10mg',
    '20mg',
    '50mg',
    '100mg',
    '1 tablet',
    '2 tablets',
    '3 tablets',
    '1 capsule',
    '2 capsules',
    '5ml',
    '10ml'
  ];

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);
      const response = await doctorAPI.getPatients();
      if (response.data.patients) {
        setPatients(response.data.patients);
        setFilteredPatients(response.data.patients);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setPatientsLoading(false);
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
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
      alert('Failed to load patient data');
    }
  };

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { id: nextMedId, name: '', frequency: 'Once daily', duration: '' }
    ]);
    setNextMedId(nextMedId + 1);
  };

  const handleRemoveMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const handleMedicationChange = (id, field, value) => {
    setMedications(medications.map(med =>
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const validateForm = () => {
    if (!selectedPatient && !manualPatientName.trim()) {
      alert('Please select a patient or enter patient name');
      return false;
    }
    if (!diagnosis.trim()) {
      alert('Please enter a diagnosis');
      return false;
    }

    for (let med of medications) {
      if (!med.name.trim()) {
        alert('Please enter medication name for all medications');
        return false;
      }
      if (!med.duration.trim()) {
        alert('Please enter duration for all medications');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('appointmentDate', new Date().toLocaleDateString('en-CA'));
      formData.append('doctorName', doctorProfile?.name || 'Doctor');
      formData.append('doctorId', selectedPatient?.id || manualPatientName);
      formData.append('symptoms', diagnosis);

      const prescriptionText = `
Diagnosis: ${diagnosis}

Medications:
${medications.map((med, idx) => `${idx + 1}. ${med.name} - ${med.frequency} - For ${med.duration}`).join('\n')}

${tests ? `Recommended Tests:\n${tests}\n` : ''}
${advice ? `Advice:\n${advice}\n` : ''}
${notes ? `Notes:\n${notes}` : ''}
      `.trim();

      formData.append('prescription', prescriptionText);

      const response = await doctorAPI.createPrescription(formData);

      if (response.status === 200 || response.status === 201) {
        alert('Prescription created successfully!');
        resetForm();
      } else {
        alert(`Failed to create prescription: ${response.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error creating prescription:', err);
      alert(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setDiagnosis('');
    setAdvice('');
    setMedications([{ id: 1, name: '', frequency: 'Once daily', duration: '' }]);
    setTests('');
    setNotes('');
    setNextMedId(2);
    setSelectedPatient(null);
    setPatientData(null);
    setVitals([]);
    setManualPatientName('');
  };

  const generatePrescriptionHTML = () => {
    const currentDate = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // Calculate age from date of birth
    const calculateAge = (dob) => {
      if (!dob) return 'N/A';
      try {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age + ' years';
      } catch (e) {
        return 'N/A';
      }
    };

    const patientName = selectedPatient?.name || manualPatientName;
    const patientId = selectedPatient?.id || 'N/A';
    const patientGender = selectedPatient?.gender || 'Not specified';
    const patientAge = calculateAge(vitals?.dateOfBirth);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${patientName}</title>
        <style>
          @page { size: A4; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            background: white;
            color: #000;
            font-size: 12px;
            line-height: 1.4;
          }
          .prescription-page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            margin: 0 auto;
            background: white;
            position: relative;
          }
          
          /* Header Section */
          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 10px;
            border-bottom: 2px solid #2563eb;
            margin-bottom: 15px;
          }
          .doctor-info-left {
            flex: 1;
          }
          .doctor-name {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 3px;
          }
          .doctor-degrees {
            font-size: 11px;
            color: #555;
            margin-bottom: 2px;
          }
          .doctor-specialty {
            font-size: 11px;
            font-weight: 600;
            color: #333;
            margin-bottom: 2px;
          }
          .doctor-institution {
            font-size: 10px;
            color: #666;
            font-style: italic;
          }
          .doctor-info-right {
            text-align: right;
            font-size: 10px;
            color: #666;
          }
          
          /* Patient Info Bar */
          .patient-info-bar {
            display: flex;
            justify-content: space-between;
            padding: 8px 12px;
            background: #f3f4f6;
            border-left: 4px solid #2563eb;
            margin-bottom: 15px;
            font-size: 11px;
          }
          .patient-info-item {
            display: flex;
            gap: 5px;
          }
          .patient-info-item .label {
            font-weight: 600;
            color: #374151;
          }
          .patient-info-item .value {
            color: #6b7280;
          }
          
          /* Main Content Layout */
          .content-section {
            margin-bottom: 15px;
          }
          
          /* Rx Symbol */
          .rx-symbol {
            font-size: 36px;
            font-weight: bold;
            color: #2563eb;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 10px;
          }
          
          /* Diagnosis Box */
          .diagnosis-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 8px 10px;
            border-radius: 4px;
            margin-bottom: 12px;
          }
          .diagnosis-box .title {
            font-weight: bold;
            font-size: 11px;
            color: #1e40af;
            margin-bottom: 4px;
          }
          .diagnosis-box .content {
            font-size: 11px;
            color: #1e3a8a;
          }
          
          /* Medications List */
          .medications-list {
            margin-bottom: 12px;
          }
          .medication-item {
            display: flex;
            gap: 8px;
            padding: 6px 0;
            border-bottom: 1px solid #f3f4f6;
            font-size: 11px;
          }
          .medication-item:last-child {
            border-bottom: none;
          }
          .med-number {
            min-width: 20px;
            font-weight: bold;
            color: #6b7280;
          }
          .med-details {
            flex: 1;
          }
          .med-name {
            font-weight: 600;
            color: #111827;
            margin-bottom: 2px;
          }
          .med-dosage {
            font-size: 10px;
            color: #6b7280;
          }
          
          /* Info Box */
          .info-box {
            background: #fefce8;
            border: 1px solid #fde68a;
            padding: 8px 10px;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .info-box .title {
            font-weight: bold;
            font-size: 10px;
            color: #92400e;
            margin-bottom: 4px;
            text-transform: uppercase;
          }
          .info-box .content {
            font-size: 10px;
            color: #78350f;
            line-height: 1.5;
          }
          
          /* Signature Section */
          .signature-section {
            margin-top: 30px;
            text-align: right;
            padding-right: 40px;
          }
          .signature-line {
            border-top: 1px solid #000;
            width: 180px;
            display: inline-block;
            margin-bottom: 5px;
          }
          .signature-name {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 2px;
            font-size: 11px;
          }
          
          /* Footer */
          .footer-section {
            position: absolute;
            bottom: 15mm;
            left: 15mm;
            right: 15mm;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
          }
          
          @media print {
            body { margin: 0; padding: 0; }
            .prescription-page { margin: 0; padding: 15mm; }
            @page { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="prescription-page">
          <!-- Header Section -->
          <div class="header-section">
            <div class="doctor-info-left">
              <div class="doctor-name">Dr. ${doctorProfile?.name || 'Doctor Name'}</div>
              <div class="doctor-degrees">${doctorProfile?.degree || 'MBBS'}</div>
              <div class="doctor-specialty">${doctorProfile?.specialization || 'General Physician'}</div>
              <div class="doctor-institution">${doctorProfile?.hospitalName || 'Medical Center'}</div>
            </div>
            <div class="doctor-info-right">
              <div style="margin-top: 5px; font-weight: 600; color: #333;">Date: ${currentDate}</div>
            </div>
          </div>
          
          <!-- Patient Info Bar -->
          <div class="patient-info-bar">
            <div class="patient-info-item">
              <span class="label">Name:</span>
              <span class="value">${patientName}</span>
            </div>
            <div class="patient-info-item">
              <span class="label">Age:</span>
              <span class="value">${patientAge}</span>
            </div>
            <div class="patient-info-item">
              <span class="label">Gender:</span>
              <span class="value">${patientGender}</span>
            </div>
            <div class="patient-info-item">
              <span class="label">ID:</span>
              <span class="value">#${patientId}</span>
            </div>
          </div>
          
          <!-- Prescription Section -->
          <div class="content-section">
            <div class="rx-symbol">℞</div>
            
            <!-- Diagnosis -->
            <div class="diagnosis-box">
              <div class="title">Diagnosis</div>
              <div class="content">${diagnosis}</div>
            </div>
            
            <!-- Medical Alerts -->
            ${vitals?.chronicDiseases || vitals?.allergies || vitals?.majorHealthIncidents ? `
            <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 8px 10px; border-radius: 4px; margin-bottom: 12px;">
              <div style="font-weight: bold; font-size: 11px; color: #991b1b; margin-bottom: 6px;">⚠ Medical History & Alerts:</div>
              ${vitals?.chronicDiseases ? `
              <div style="font-size: 10px; color: #7f1d1d; margin-bottom: 4px;">
                <strong>Chronic Diseases:</strong> ${vitals.chronicDiseases}
              </div>
              ` : ''}
              ${vitals?.allergies ? `
              <div style="font-size: 10px; color: #7f1d1d; margin-bottom: 4px;">
                <strong>Allergies:</strong> ${vitals.allergies}
              </div>
              ` : ''}
              ${vitals?.majorHealthIncidents ? `
              <div style="font-size: 10px; color: #7f1d1d;">
                <strong>Major Health Incidents:</strong> ${vitals.majorHealthIncidents}
              </div>
              ` : ''}
            </div>
            ` : ''}
            
            <!-- Medications -->
            ${medications.length > 0 && medications[0].name ? `
            <div class="medications-list">
              <div style="font-weight: bold; font-size: 11px; margin-bottom: 8px; color: #1f2937;">Medications:</div>
              ${medications.map((med, index) => `
                <div class="medication-item">
                  <div class="med-number">${index + 1}.</div>
                  <div class="med-details">
                    <div class="med-name">${med.name}</div>
                    <div class="med-dosage">${med.frequency} - For ${med.duration}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            ` : ''}
            
            <!-- Advice -->
            ${advice ? `
            <div class="info-box">
              <div class="title">Advice</div>
              <div class="content">${advice.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            
            <!-- Tests -->
            ${tests ? `
            <div class="info-box">
              <div class="title">Recommended Tests</div>
              <div class="content">${tests.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            
            <!-- Notes -->
            ${notes ? `
            <div class="info-box" style="background: #f0fdf4; border-color: #bbf7d0;">
              <div class="title" style="color: #166534;">Additional Notes</div>
              <div class="content" style="color: #14532d;">${notes.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
          </div>
          
          <!-- Signature -->
          <div class="signature-section">
            <div class="signature-line"></div>
            <div class="signature-name">Dr. ${doctorProfile?.name || 'Doctor Name'}</div>
            <div style="font-size: 10px; color: #6b7280;">${doctorProfile?.degree || 'MBBS'}</div>
          </div>
          
          <!-- Footer -->
          <div class="footer-section">
            <div>This is a computer-generated prescription | NiramoyAI Healthcare Platform</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrintPrescription = () => {
    if (!validateForm()) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrescriptionHTML());
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (!isOpen) return null;

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
z              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="pm-modal pm-modal-split"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="pm-header pm-header-full">
                <div>
                  <h2 className="pm-title">Create Prescription</h2>
                  <p className="pm-subtitle">Select a patient and fill in prescription details</p>
                </div>
                <button
                  onClick={onClose}
                  className="pm-close-btn"
                  title="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content - Two Panel Layout */}
              <div className="pm-content pm-content-split">
                {/* LEFT PANEL - Patient Search or Details */}
                <div className="pm-left-panel">
                  {!selectedPatient ? (
                    <>
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
                      {patientsLoading ? (
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
                              className={`pm-patient-item`}
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
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="pm-no-patients">
                          <Users size={32} />
                          <p>
                            {patientSearchTerm
                              ? 'No patients found'
                              : 'No patients yet'}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Patient Details View */}
                      <div className="pm-patient-details-header">
                        <button
                          onClick={() => {
                            setSelectedPatient(null);
                            setPatientData(null);
                            setVitals([]);
                            setPatientSearchTerm('');
                            fetchPatients();
                          }}
                          className="pm-back-btn"
                          title="Back to patient list"
                        >
                          ← Back
                        </button>
                        <h3 className="pm-section-title">Patient Information</h3>
                      </div>

                      {/* Patient Details Scroll Area */}
                      <div className="pm-patient-details-content">
                        {/* Patient Header */}
                        <div className="pm-details-card pm-details-header-card">
                          <div className="pm-details-avatar">
                            {selectedPatient.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="pm-details-name-section">
                            <h4 className="pm-details-name">{selectedPatient.name}</h4>
                            <p className="pm-details-id">ID: #{selectedPatient.id}</p>
                            <p className="pm-details-gender">{selectedPatient.gender || 'Not specified'}</p>
                          </div>
                        </div>

                        {/* Vitals Section */}
                        {vitals && Object.keys(vitals).length > 0 && (
                          <div className="pm-details-card">
                            <h5 className="pm-details-card-title">Vitals</h5>
                            <div className="pm-vitals-grid">
                              {vitals.bloodPressure && (
                                <div className="pm-vital-item">
                                  <span className="pm-vital-label">BP</span>
                                  <span className="pm-vital-value">{vitals.bloodPressure}</span>
                                </div>
                              )}
                              {vitals.heartRate && (
                                <div className="pm-vital-item">
                                  <span className="pm-vital-label">HR</span>
                                  <span className="pm-vital-value">{vitals.heartRate} bpm</span>
                                </div>
                              )}
                              {vitals.temperature && (
                                <div className="pm-vital-item">
                                  <span className="pm-vital-label">Temp</span>
                                  <span className="pm-vital-value">{vitals.temperature}°F</span>
                                </div>
                              )}
                              {vitals.weight && (
                                <div className="pm-vital-item">
                                  <span className="pm-vital-label">Weight</span>
                                  <span className="pm-vital-value">{vitals.weight} kg</span>
                                </div>
                              )}
                              {vitals.height && (
                                <div className="pm-vital-item">
                                  <span className="pm-vital-label">Height</span>
                                  <span className="pm-vital-value">{vitals.height} cm</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Medical History */}
                        {patientData?.medicalHistory && (
                          <div className="pm-details-card">
                            <h5 className="pm-details-card-title">Medical History</h5>
                            <p className="pm-details-text">{patientData.medicalHistory}</p>
                          </div>
                        )}

                        {/* Allergies */}
                        {vitals?.allergies && (
                          <div className="pm-details-card pm-details-alert">
                            <h5 className="pm-details-card-title">⚠ Allergies</h5>
                            <p className="pm-details-text">{vitals.allergies}</p>
                          </div>
                        )}

                        {/* Chronic Diseases */}
                        {vitals?.chronicDiseases && (
                          <div className="pm-details-card pm-details-alert">
                            <h5 className="pm-details-card-title">⚠ Chronic Diseases</h5>
                            <p className="pm-details-text">{vitals.chronicDiseases}</p>
                          </div>
                        )}

                        {/* Lifestyle */}
                        {vitals?.lifestyle && (
                          <div className="pm-details-card">
                            <h5 className="pm-details-card-title">Lifestyle</h5>
                            <p className="pm-details-text">{vitals.lifestyle}</p>
                          </div>
                        )}

                        {/* Blood Type */}
                        {patientData?.bloodType && (
                          <div className="pm-details-card">
                            <h5 className="pm-details-card-title">Blood Type</h5>
                            <p className="pm-details-text pm-blood-type">{patientData.bloodType}</p>
                          </div>
                        )}

                        {/* Address */}
                        {patientData?.address && (
                          <div className="pm-details-card">
                            <h5 className="pm-details-card-title">Address</h5>
                            <p className="pm-details-text">{patientData.address}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* RIGHT PANEL - Prescription Form */}
                <div className="pm-right-panel">
                  <form onSubmit={handleSubmit} className="pm-form">
                    {/* Patient Header - Always Show When Available */}
                    {selectedPatient && (
                      <div className="pm-patient-header">
                        <div className="pm-patient-avatar-large">
                          {selectedPatient.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="pm-patient-details">
                          <h4>{selectedPatient.name}</h4>
                          <p>ID: #{selectedPatient.id}</p>
                          <p className="pm-patient-status">Selected</p>
                        </div>
                      </div>
                    )}

                    {!selectedPatient && (
                      <div className="pm-no-selection">
                        <p>Select a patient from the left panel to create prescription</p>
                      </div>
                    )}

                    {/* Patient Name Field - Only show when patient not selected */}
                    {!selectedPatient && (
                      <div className="pm-form-group">
                        <label className="pm-label">
                          <span>Patient Name</span>
                        </label>
                        <input
                          type="text"
                          value={manualPatientName}
                          onChange={(e) => setManualPatientName(e.target.value)}
                          placeholder="Enter patient name manually..."
                          className="pm-textarea"
                          style={{ padding: '8px 12px', fontFamily: 'inherit', minHeight: '40px' }}
                        />
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          Optional: Use this if you want to enter a prescription without selecting from the patient list
                        </p>
                      </div>
                    )}

                    {/* Prescription Form - Always Show as Skeleton */}
                    <>
                      {/* Diagnosis */}
                      <div className="pm-form-group">
                        <label className="pm-label">
                          <span>Diagnosis *</span>
                        </label>
                        <textarea
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          placeholder="Enter patient's diagnosis..."
                          className="pm-textarea"
                          rows="2"
                          disabled={!selectedPatient}
                        />
                      </div>

                      {/* Medications */}
                      <div className="pm-form-group">
                        <div className="pm-form-header">
                          <label className="pm-label">Medications *</label>
                          <button
                            type="button"
                            onClick={handleAddMedication}
                            className="pm-add-btn"
                            disabled={!selectedPatient}
                          >
                            <Plus size={16} />
                            Add
                          </button>
                        </div>

                        <div className="pm-med-medications-list">
                          {medications.map((medication, index) => (
                            <div key={medication.id} className="pm-med-item">
                              <div className="pm-med-number">#{index + 1}</div>
                              <input
                                type="text"
                                value={medication.name}
                                onChange={(e) => handleMedicationChange(medication.id, 'name', e.target.value)}
                                placeholder="Medicine name"
                                className="pm-med-input"
                                disabled={!selectedPatient}
                              />
                              <select
                                value={medication.frequency}
                                onChange={(e) => handleMedicationChange(medication.id, 'frequency', e.target.value)}
                                className="pm-med-select"
                                disabled={!selectedPatient}
                              >
                                {frequencyOptions.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={medication.duration}
                                onChange={(e) => handleMedicationChange(medication.id, 'duration', e.target.value)}
                                placeholder="e.g., 5 days, 1 week"
                                className="pm-med-input pm-med-duration"
                                disabled={!selectedPatient}
                              />
                              {medications.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedication(medication.id)}
                                  className="pm-remove-btn"
                                  disabled={!selectedPatient}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Advice */}
                      <div className="pm-form-group">
                        <label className="pm-label">Advice</label>
                        <textarea
                          value={advice}
                          onChange={(e) => setAdvice(e.target.value)}
                          placeholder="Medical advice (e.g., rest, diet, lifestyle changes)..."
                          className="pm-textarea"
                          rows="2"
                          disabled={!selectedPatient}
                        />
                      </div>

                      {/* Tests */}
                      <div className="pm-form-group">
                        <label className="pm-label">Recommended Tests</label>
                        <textarea
                          value={tests}
                          onChange={(e) => setTests(e.target.value)}
                          placeholder="Lab tests or diagnostic procedures..."
                          className="pm-textarea"
                          rows="2"
                          disabled={!selectedPatient}
                        />
                      </div>

                      {/* Notes */}
                      <div className="pm-form-group">
                        <label className="pm-label">Additional Notes</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any additional notes or warnings..."
                          className="pm-textarea"
                          rows="2"
                          disabled={!selectedPatient}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="pm-actions">
                        <button
                          type="button"
                          onClick={onClose}
                          className="pm-cancel-btn"
                          disabled={submitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handlePrintPrescription}
                          className="pm-print-btn"
                          disabled={submitting || (!selectedPatient && !manualPatientName.trim()) || !diagnosis.trim()}
                          title="Print prescription"
                        >
                          <Printer size={16} />
                          Print
                        </button>
                        <button
                          type="submit"
                          className="pm-submit-btn"
                          disabled={submitting || (!selectedPatient && !manualPatientName.trim())}
                        >
                          {submitting ? (
                            <>
                              <div className="pm-spinner-small" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Create Prescription
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  </form>
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
