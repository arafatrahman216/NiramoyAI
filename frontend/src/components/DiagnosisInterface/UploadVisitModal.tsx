import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { diagnosisAPI } from '../../services/api';

// ==============================================
// UPLOAD VISIT MODAL COMPONENT
// ==============================================
// Single-page modal for uploading visit information
// Includes: Appointment details, symptoms, prescription (mandatory), test reports (optional)

interface UploadVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Doctor database with ID mapping
const DOCTORS_DB: { [key: string]: string } = {
  "1": "Hasib",
  "5": "Dr Dip",
  "6": "Dr Masud",
  "7": "Dr Ikbal",
  "8": "S. Ahmed",
  "9": "S. M. Mahfuzur Rahman",
  "10": "Shamim Ahmed"
};

interface VisitData {
  doctorName: string;
  doctorId: string | null;
  symptoms: string;
  prescriptionFile: File | null;
  testReports: File[];
}

const UploadVisitModal: React.FC<UploadVisitModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // MODAL STATE MANAGEMENT
  const [visitData, setVisitData] = useState<VisitData>({
    doctorName: '',
    doctorId: null,
    symptoms: '',
    prescriptionFile: null,
    testReports: []
  });

  const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState<number>(-1);

  // FORM HANDLERS
  const handleInputChange = (field: keyof VisitData, value: string | boolean) => {
    setVisitData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrescriptionFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setVisitData(prev => ({ ...prev, prescriptionFile: file }));
  };

  const handleTestReportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setVisitData(prev => ({ ...prev, testReports: [...prev.testReports, ...files] }));
  };

  const removeTestReport = (index: number) => {
    setVisitData(prev => ({
      ...prev,
      testReports: prev.testReports.filter((_, i) => i !== index)
    }));
  };

  // UPLOAD HANDLER
  const handleFinalUpload = async () => {
    // Validate required fields
    if (!visitData.doctorName || !visitData.symptoms || !visitData.prescriptionFile) {
      toast.error(t('uploadVisit.fileError'), {
        style: {
          background: '#7f1d1d',
          color: '#fff',
          border: '1px solid #dc2626',
          borderRadius: '6px',
          padding: '12px 16px',
          fontSize: '14px',
        },
      });
      return;
    }
    
    // Close modal and navigate immediately
    onClose();
    resetForm();
    navigate('/diagnosis');
    
    // Create FormData for upload
    const formData = new FormData();
    formData.append('doctorName', visitData.doctorName);
    formData.append('symptoms', visitData.symptoms);
    
    // Append doctorId only if selected from suggestions
    if (visitData.doctorId) {
      formData.append('doctorId', visitData.doctorId);
    }
    
    // Prescription file is mandatory
    if (visitData.prescriptionFile) {
      formData.append('prescriptionFile', visitData.prescriptionFile);
    }
    
    // Test reports are optional - append each file with the same field name
    visitData.testReports.forEach((file) => {
      formData.append('testReports', file);
    });
    
    // Show promise-based toast that tracks upload progress
    toast.promise(
      diagnosisAPI.uploadVisitData(formData),
      {
        loading: t('uploadVisit.uploading'),
        success: t('uploadVisit.uploadSuccess'),
        error: (err) => {
          console.error('Upload error:', err);
          
          // Handle different error status codes
          if (err.response?.status === 401) {
            return t('uploadVisit.authError');
          } else if (err.response?.status === 500) {
            return t('uploadVisit.serverError');
          } else if (err.response?.status === 400) {
            return t('uploadVisit.badRequestError');
          } else {
            return t('uploadVisit.uploadError');
          }
        }
      },
      {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151',
          borderRadius: '6px',
          padding: '12px 16px',
          fontSize: '14px',
          minWidth: '300px',
        },
        success: {
          duration: 3000,
          style: {
            background: '#065f46',
            color: '#fff',
            border: '1px solid #10b981',
            borderRadius: '6px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: '#7f1d1d',
            color: '#fff',
            border: '1px solid #dc2626',
            borderRadius: '6px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        },
        loading: {
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '6px',
            padding: '12px 16px',
            fontSize: '14px',
          },
        },
      }
    );
  };

  // UTILITY FUNCTIONS
  const resetForm = () => {
    setVisitData({
      doctorName: '',
      doctorId: null,
      symptoms: '',
      prescriptionFile: null,
      testReports: []
    });
    setShowDoctorSuggestions(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // DOCTOR AUTOCOMPLETE FUNCTIONS
  // Get doctor suggestions based on input
  const getFilteredDoctors = useMemo(() => {
    if (!visitData.doctorName.trim()) return [];
    
    const input = visitData.doctorName.toLowerCase();
    const doctorsList = Object.entries(DOCTORS_DB);
    
    // Filter doctors that match the input
    return doctorsList.filter(([_, name]) => 
      name.toLowerCase().includes(input)
    );
  }, [visitData.doctorName]);

  // Handle doctor name input change
  const handleDoctorNameChange = (value: string) => {
    setVisitData(prev => ({
      ...prev,
      doctorName: value,
      doctorId: null // Clear doctorId when user types
    }));
    setSelectedDoctorIndex(-1); // Reset selected index
    
    // Show loading state and simulate DB fetch delay
    if (value.trim().length > 0) {
      setIsLoadingDoctors(true);
      setShowDoctorSuggestions(false);
      
      // Simulate database fetch delay (300-500ms)
      const delay = Math.random() * 200 + 300;
      setTimeout(() => {
        setIsLoadingDoctors(false);
        setShowDoctorSuggestions(true);
      }, delay);
    } else {
      setIsLoadingDoctors(false);
      setShowDoctorSuggestions(false);
    }
  };

  // Handle doctor selection from suggestions
  const handleDoctorSelect = (doctorId: string, doctorName: string) => {
    setVisitData(prev => ({
      ...prev,
      doctorName: doctorName,
      doctorId: doctorId
    }));
    setShowDoctorSuggestions(false);
    setSelectedDoctorIndex(-1);
  };

  // Handle keyboard navigation in doctor list
  const handleDoctorInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDoctorSuggestions || getFilteredDoctors.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedDoctorIndex(prev => 
          prev < getFilteredDoctors.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedDoctorIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedDoctorIndex >= 0 && selectedDoctorIndex < getFilteredDoctors.length) {
          const [doctorId, doctorName] = getFilteredDoctors[selectedDoctorIndex];
          handleDoctorSelect(doctorId, doctorName);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDoctorSuggestions(false);
        setSelectedDoctorIndex(-1);
        break;
      default:
        break;
    }
  };

  // VALIDATION
  const isFormValid = () => {
    return visitData.doctorName && 
           visitData.symptoms &&
           visitData.prescriptionFile; // Prescription file is mandatory
  };

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP WITH BLUR EFFECT */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleClose} />
      
      {/* MODAL CONTAINER */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
          
          {/* MODAL HEADER */}
          <div className="p-6 border-b border-zinc-700 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white">{t('uploadVisit.title')}</h2>
              <p className="text-zinc-400 text-sm mt-1">
                {t('uploadVisit.subtitle')}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* MODAL CONTENT */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: APPOINTMENT DETAILS */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-white mb-4">{t('uploadVisit.appointmentDetails')}</h3>
                
                {/* DOCTOR NAME */}
                <div className="relative">
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('uploadVisit.doctorName')} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={visitData.doctorName}
                      onChange={(e) => handleDoctorNameChange(e.target.value)}
                      onKeyDown={handleDoctorInputKeyDown}
                      onFocus={() => visitData.doctorName && setShowDoctorSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowDoctorSuggestions(false), 200)}
                      placeholder={t('uploadVisit.enterDoctorName')}
                      className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    />
                    
                    {/* DOCTOR SUGGESTIONS DROPDOWN */}
                    {(showDoctorSuggestions || isLoadingDoctors) && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-600 rounded-lg shadow-xl z-10 backdrop-blur-sm bg-zinc-800/95">
                        
                        {/* LOADING STATE */}
                        {isLoadingDoctors && (
                          <div className="px-4 py-3 flex items-center justify-center gap-2 text-zinc-400">
                            <div className="inline-block">
                              <svg className="animate-spin h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </div>
                            <span className="text-sm">{t('uploadVisit.fetchingDoctors')}</span>
                          </div>
                        )}

                        {/* DOCTOR LIST */}
                        {showDoctorSuggestions && getFilteredDoctors.length > 0 && (
                          <div className="max-h-64 overflow-y-auto">
                            {getFilteredDoctors.map(([doctorId, doctorName], index) => (
                              <button
                                key={doctorId}
                                onClick={() => handleDoctorSelect(doctorId, doctorName)}
                                className={`w-full text-left px-4 py-2 text-sm text-white transition-colors ${
                                  index < getFilteredDoctors.length - 1 ? 'border-b border-zinc-700/50' : ''
                                } ${
                                  visitData.doctorId === doctorId 
                                    ? 'bg-emerald-500/30' 
                                    : selectedDoctorIndex === index 
                                    ? 'bg-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'hover:bg-emerald-500/10'
                                }`}
                              >
                                {doctorName}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* NO RESULTS STATE */}
                        {showDoctorSuggestions && getFilteredDoctors.length === 0 && (
                          <div className="px-4 py-6 text-center">
                            <svg className="w-8 h-8 text-zinc-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21l-4.35-4.35m0 0a7 7 0 10-9.9 0" />
                            </svg>
                            <p className="text-sm text-zinc-400">{t('uploadVisit.noDoctorsFound')}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SELECTED DOCTOR BADGE */}
                    {visitData.doctorId && (
                      <div className="mt-2 inline-block bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm border border-emerald-500/50">
                        {visitData.doctorName}
                      </div>
                    )}
                  </div>
                </div>


                {/* SYMPTOMS */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('uploadVisit.symptoms')} *
                  </label>
                  <textarea
                    value={visitData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    placeholder={t('uploadVisit.symptomsPlaceholder')}
                    rows={4}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                    required
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: FILE UPLOADS */}
              <div className="space-y-6">
                
                {/* PRESCRIPTION FILE UPLOAD (MANDATORY) */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">{t('uploadVisit.medicalDocuments')}</h3>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('uploadVisit.uploadPrescriptionRequired')}
                  </label>
                  <div className="border-2 border-dashed border-emerald-600 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors bg-emerald-500/5">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handlePrescriptionFileChange}
                      className="hidden"
                      id="prescription-upload"
                    />
                    <label
                      htmlFor="prescription-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-emerald-400 font-medium">
                        {visitData.prescriptionFile ? visitData.prescriptionFile.name : t('uploadVisit.uploadPrescription')}
                      </span>
                      <span className="text-zinc-400 text-xs">JPG, PNG, PDF {t('uploadVisit.uploadPrescriptionRequired').split('*')[1]}</span>
                    </label>
                  </div>
                </div>

                {/* TEST REPORTS UPLOAD (OPTIONAL) */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {t('uploadVisit.uploadTestReports')}
                  </label>
                  <div className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center hover:border-zinc-500 transition-colors">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      multiple
                      onChange={handleTestReportFileChange}
                      className="hidden"
                      id="test-reports-upload"
                    />
                    <label
                      htmlFor="test-reports-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-zinc-400">
                        {t('uploadVisit.uploadTestReports')}
                      </span>
                      <span className="text-zinc-500 text-xs">{t('uploadVisit.testReportsSubtitle')}</span>
                    </label>
                  </div>
                </div>

                {/* UPLOADED TEST REPORTS LIST */}
                {visitData.testReports.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">{t('uploadVisit.testReports')} ({visitData.testReports.length})</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {visitData.testReports.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-white text-sm">{file.name}</span>
                            <span className="text-zinc-400 text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            onClick={() => removeTestReport(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* MODAL FOOTER */}
          <div className="p-6 border-t border-zinc-700 flex justify-between items-center">
            
            {/* REQUIRED FIELDS NOTICE */}
            <div className="text-sm text-zinc-400">
              {t('uploadVisit.requiredFields')}
            </div>

            {/* UPLOAD BUTTON */}
            <button
              onClick={handleFinalUpload}
              disabled={!isFormValid()}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {t('uploadVisit.upload')}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default UploadVisitModal;
