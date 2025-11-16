import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Plus, Trash2, Send, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './CreatePrescriptionModal.css';
import { doctorAPI } from '../../services/api';

const CreatePrescriptionModal = ({ isOpen, onClose, patientName, patientId, vitals, patientData, doctorData, onSubmit }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [medications, setMedications] = useState([
    { id: 1, name: '', frequency: 'Once daily', doses: '' }
  ]);
  const [tests, setTests] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [nextMedId, setNextMedId] = useState(2);
  console.log(doctorData);
  

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

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { id: nextMedId, name: '', frequency: 'Once daily', doses: '' }
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
    if (!diagnosis.trim()) {
      alert('Please enter a diagnosis');
      return false;
    }
    
    for (let med of medications) {
      if (!med.name.trim()) {
        alert('Please enter medication name for all medications');
        return false;
      }
      if (!med.doses.trim()) {
        alert('Please enter doses for all medications');
        return false;
      }
    }
    
    return true;
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

    const calculateAge = (dob) => {
      if (!dob) return 'N/A';
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age + ' Y';
    };

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
          .content-grid {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          
          /* Left Column */
          .left-column {
            border-right: 1px solid #e5e7eb;
            padding-right: 15px;
          }
          .section-block {
            margin-bottom: 15px;
          }
          .section-heading {
            font-size: 11px;
            font-weight: bold;
            color: #1f2937;
            text-transform: uppercase;
            margin-bottom: 6px;
            padding-bottom: 3px;
            border-bottom: 1px solid #d1d5db;
          }
          .section-content {
            font-size: 10px;
            color: #4b5563;
            padding-left: 8px;
          }
          .vitals-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
            margin-top: 5px;
          }
          .vital-item {
            font-size: 10px;
          }
          .vital-item .label {
            font-weight: 600;
            color: #374151;
          }
          .vital-item .value {
            color: #6b7280;
          }
          .bullet-list {
            list-style: none;
            padding-left: 0;
          }
          .bullet-list li {
            padding-left: 15px;
            position: relative;
            margin-bottom: 3px;
            font-size: 10px;
            color: #4b5563;
          }
          .bullet-list li:before {
            content: "•";
            position: absolute;
            left: 5px;
            font-weight: bold;
          }
          .alert-box {
            background: #fef2f2;
            border: 1px solid #fca5a5;
            padding: 6px 8px;
            border-radius: 4px;
            margin-top: 5px;
          }
          .alert-box p {
            font-size: 10px;
            color: #991b1b;
            margin: 2px 0;
          }
          .alert-box strong {
            color: #7f1d1d;
          }
          
          /* Right Column - Rx Section */
          .right-column {
            padding-left: 10px;
          }
          .rx-symbol {
            font-size: 36px;
            font-weight: bold;
            color: #2563eb;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 10px;
          }
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
          
          /* Tests & Advice */
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
          .signature-text {
            font-size: 10px;
            color: #374151;
          }
          .signature-name {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 2px;
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
              <div class="doctor-name">Dr. ${doctorData?.name || 'Doctor Name'}</div>
              <div class="doctor-degrees">${doctorData?.degree || 'MBBS'}</div>
              <div class="doctor-specialty">${doctorData?.specialization || 'General Physician'}</div>
              <div class="doctor-institution">${doctorData?.hospitalName || 'Medical Center'}</div>
              ${doctorData?.registrationNumber ? `<div style="font-size: 9px; margin-top: 2px;">Reg No: ${doctorData.registrationNumber}</div>` : ''}
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
              <span class="value">${calculateAge(vitals?.dateOfBirth)}</span>
            </div>
            ${patientData?.gender ? `
            <div class="patient-info-item">
              <span class="label">Sex:</span>
              <span class="value">${patientData.gender}</span>
            </div>
            ` : ''}
            <div class="patient-info-item">
              <span class="label">ID:</span>
              <span class="value">#${patientId}</span>
            </div>
          </div>
          
          <!-- Main Content Grid -->
          <div class="content-grid">
            <!-- Left Column -->
            <div class="left-column">
              <!-- Clinical Information -->
              ${patientData?.vitals ? `
              <div class="section-block">
                <div class="section-heading">Clinical Information</div>
                <div class="section-content">
                  <div class="vitals-grid">
                    ${patientData.vitals.bloodPressure ? `
                    <div class="vital-item">
                      <span class="label">BP:</span>
                      <span class="value">${patientData.vitals.bloodPressure}</span>
                    </div>
                    ` : ''}
                    ${patientData.vitals.heartRate ? `
                    <div class="vital-item">
                      <span class="label">Pulse:</span>
                      <span class="value">${patientData.vitals.heartRate} bpm</span>
                    </div>
                    ` : ''}
                    ${patientData.vitals.temperature ? `
                    <div class="vital-item">
                      <span class="label">Temp:</span>
                      <span class="value">${patientData.vitals.temperature}°F</span>
                    </div>
                    ` : ''}
                    ${patientData.vitals.weight ? `
                    <div class="vital-item">
                      <span class="label">Weight:</span>
                      <span class="value">${patientData.vitals.weight} kg</span>
                    </div>
                    ` : ''}
                    ${patientData.vitals.height ? `
                    <div class="vital-item">
                      <span class="label">Height:</span>
                      <span class="value">${patientData.vitals.height} cm</span>
                    </div>
                    ` : ''}
                  </div>
                </div>
              </div>
              ` : ''}
              
              <!-- Examination/History -->
              <div class="section-block">
                <div class="section-heading">On Examinations</div>
                <div class="section-content">
                  ${patientData?.vitals?.bloodPressure || patientData?.vitals?.heartRate || patientData?.vitals?.temperature ? `
                  <ul class="bullet-list">
                    ${patientData.vitals.bloodPressure ? `<li>BP: ${patientData.vitals.bloodPressure} mmHg</li>` : ''}
                    ${patientData.vitals.heartRate ? `<li>Pulse: ${patientData.vitals.heartRate} bpm</li>` : ''}
                    ${patientData.vitals.temperature ? `<li>Temperature: ${patientData.vitals.temperature}°F</li>` : ''}
                  </ul>
                  ` : '<p style="font-size: 10px; color: #9ca3af;">Normal</p>'}
                </div>
              </div>
              
              <!-- Medical Alerts -->
              ${patientData?.vitals?.allergies || patientData?.vitals?.chronicDiseases ? `
              <div class="section-block">
                <div class="section-heading" style="color: #dc2626;">Medical Alerts</div>
                <div class="alert-box">
                  ${patientData.vitals.allergies ? `<p><strong>⚠ Allergies:</strong> ${patientData.vitals.allergies}</p>` : ''}
                  ${patientData.vitals.chronicDiseases ? `<p><strong>⚠ Chronic Diseases:</strong> ${patientData.vitals.chronicDiseases}</p>` : ''}
                </div>
              </div>
              ` : ''}
              
              <!-- Investigation -->
              ${tests ? `
              <div class="section-block">
                <div class="section-heading">Investigation</div>
                <div class="section-content">
                  <p style="font-size: 10px; line-height: 1.5;">${tests}</p>
                </div>
              </div>
              ` : ''}
            </div>
            
            <!-- Right Column - Prescription -->
            <div class="right-column">
              <div class="rx-symbol">℞</div>
              
              <!-- Diagnosis -->
              <div class="diagnosis-box">
                <div class="title">Diagnosis</div>
                <div class="content">${diagnosis}</div>
              </div>
              
              <!-- Medications -->
              ${medications.length > 0 && medications[0].name ? `
              <div class="medications-list">
                ${medications.map((med, index) => `
                  <div class="medication-item">
                    <div class="med-number">${index + 1}.</div>
                    <div class="med-details">
                      <div class="med-name">${med.name}</div>
                      <div class="med-dosage">${med.doses} - ${med.frequency}</div>
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
              
              <!-- Notes -->
              ${notes ? `
              <div class="info-box" style="background: #f0fdf4; border-color: #bbf7d0;">
                <div class="title" style="color: #166534;">Special Notes</div>
                <div class="content" style="color: #14532d;">${notes.replace(/\n/g, '<br>')}</div>
              </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Signature -->
          <div class="signature-section">
            <div class="signature-line"></div>
            <div class="signature-text">
              <div class="signature-name">Dr. ${doctorData?.name || 'Doctor Name'}</div>
              <div>${doctorData?.degree || 'MBBS'}</div>
              ${doctorData?.specialization ? `<div>${doctorData.specialization}</div>` : ''}
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer-section">
            <div>This is a computer-generated prescription | NiramoyAI Healthcare Platform</div>
            ${doctorData?.hospitalName ? `<div>${doctorData.hospitalName}</div>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const generatePrescriptionImage = () => {
    return new Promise((resolve, reject) => {
      const prescriptionHTML = generatePrescriptionHTML();

      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '210mm';
      container.innerHTML = prescriptionHTML;
      document.body.appendChild(container);

      // Use html2canvas to capture the image
      import('html2canvas').then(html2canvas => {
        html2canvas.default(container.querySelector('.prescription-page'), {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false
        }).then(canvas => {
          const imageData = canvas.toDataURL('image/png');
          document.body.removeChild(container);
          resolve(imageData);
        }).catch(error => {
          document.body.removeChild(container);
          reject(error);
        });
      }).catch(error => {
        document.body.removeChild(container);
        reject(error);
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Generate prescription image
      const imageData = await generatePrescriptionImage();
      console.log('Prescription Image Data:', imageData);

      // Convert base64 to blob for file upload
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();
      const prescriptionFile = new File([blob], `prescription_${patientId}_${Date.now()}.png`, { type: 'image/png' });

      // Get user ID (doctor ID) from localStorage
      const doctorId = localStorage.getItem('userId');

      // Create FormData to match the UploadVisitReqDTO exactly
      const formData = new FormData();
      formData.append('appointmentDate', new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD
      formData.append('doctorName', doctorData?.name || 'Doctor');
      formData.append('doctorId', patientId);
      formData.append('symptoms', diagnosis);
      
      // Create prescription text
      const prescriptionText = `
Diagnosis: ${diagnosis}

Medications:
${medications.map((med, idx) => `${idx + 1}. ${med.name} - ${med.doses} - ${med.frequency}`).join('\n')}

${tests ? `Recommended Tests:\n${tests}\n` : ''}
${advice ? `Advice:\n${advice}\n` : ''}
${notes ? `Notes:\n${notes}` : ''}
      `.trim();
      
      formData.append('prescription', prescriptionText);
      formData.append('prescriptionFile', prescriptionFile);
      // Note: testReports is a List<MultipartFile>, so we don't send anything for empty array
      // Backend should handle missing field as empty list

      // Send to API using doctorAPI
      console.log("form data : ");
      console.log(formData);
      
      
      const response = await doctorAPI.createPrescription(formData);
      
      console.log('API Response:', response.data);

      if (response.status === 200 || response.status === 201) {
        alert('Prescription created successfully!');
        resetForm();
        onClose();
      } else {
        console.error('API Error:', response.data);
        alert(`Failed to create prescription: ${response.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error creating prescription:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        alert(`Failed to create prescription: ${err.response.data.message || err.message}`);
      } else {
        alert('Failed to create prescription: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDiagnosis('');
    setAdvice('');
    setMedications([{ id: 1, name: '', frequency: 'Once daily', doses: '' }]);
    setTests('');
    setNotes('');
    setNextMedId(2);
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
            className="cpm-backdrop"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="cpm-modal"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="cpm-header">
              <div>
                <h2 className="cpm-title">Create Prescription</h2>
                <p className="cpm-subtitle">Patient: {patientName}</p>
              </div>
              <button
                onClick={onClose}
                className="cpm-close-btn"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="cpm-content">
              <form onSubmit={handleSubmit} className="cpm-form">
                {/* Diagnosis Section */}
                <div className="cpm-section">
                  <label className="cpm-label">
                    <span className="cpm-label-text">Diagnosis *</span>
                    <span className="cpm-required">Required</span>
                  </label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter patient's diagnosis..."
                    className="cpm-textarea"
                    rows="2"
                  />
                </div>

                {/* Advice Section */}
                <div className="cpm-section">
                  <label className="cpm-label">
                    <span className="cpm-label-text">Advice</span>
                  </label>
                  <textarea
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    placeholder="Enter medical advice (e.g., rest, diet, lifestyle changes)..."
                    className="cpm-textarea"
                    rows="2"
                  />
                </div>

                {/* Medications Section */}
                <div className="cpm-section">
                  <div className="cpm-medications-header">
                    <label className="cpm-label">
                      <span className="cpm-label-text">Medications *</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="cpm-add-med-btn"
                    >
                      <Plus size={16} />
                      Add Medication
                    </button>
                  </div>

                  <div className="cpm-medications-list">
                    {medications.map((medication, index) => (
                      <motion.div
                        key={medication.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="cpm-medication-card"
                      >
                        <div className="cpm-med-number">#{index + 1}</div>

                        <div className="cpm-med-field">
                          <label className="cpm-field-label">Medicine Name *</label>
                          <input
                            type="text"
                            value={medication.name}
                            onChange={(e) => handleMedicationChange(medication.id, 'name', e.target.value)}
                            placeholder="e.g., Amoxicillin, Aspirin"
                            className="cpm-input"
                          />
                        </div>

                        <div className="cpm-med-row">
                          <div className="cpm-med-field">
                            <label className="cpm-field-label">Frequency *</label>
                            <select
                              value={medication.frequency}
                              onChange={(e) => handleMedicationChange(medication.id, 'frequency', e.target.value)}
                              className="cpm-select"
                            >
                              {frequencyOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>

                          <div className="cpm-med-field">
                            <label className="cpm-field-label">Dose *</label>
                            <select
                              value={medication.doses}
                              onChange={(e) => handleMedicationChange(medication.id, 'doses', e.target.value)}
                              className="cpm-select"
                            >
                              <option value="">Select dose</option>
                              {dosesOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(medication.id)}
                            className="cpm-remove-med-btn"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        )}
                      </motion.div>
                  ))}
                </div>
                </div>

                {/* Tests Section */}
                <div className="cpm-section">
                  <label className="cpm-label">
                    <span className="cpm-label-text">Recommended Tests</span>
                  </label>
                  <textarea
                    value={tests}
                    onChange={(e) => setTests(e.target.value)}
                    placeholder="Enter recommended laboratory tests or diagnostic procedures (e.g., CBC, Blood Sugar, X-Ray)..."
                    className="cpm-textarea"
                    rows="2"
                  />
                </div>

                {/* Notes Section */}
                <div className="cpm-section">
                  <label className="cpm-label">
                    <span className="cpm-label-text">Additional Notes</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes or warnings..."
                    className="cpm-textarea"
                    rows="2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="cpm-actions">
                  <button
                    type="button"
                    onClick={onClose}
                    className="cpm-cancel-btn"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintPrescription}
                    className="cpm-print-btn"
                    disabled={loading}
                  >
                    <Printer size={16} />
                    Print Prescription
                  </button>
                  <button
                    type="submit"
                    className="cpm-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="cpm-spinner-small" />
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
              </form>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CreatePrescriptionModal;
