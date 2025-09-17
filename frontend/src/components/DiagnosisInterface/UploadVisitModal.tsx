import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface VisitData {
  appointmentDate: string;
  doctorName: string;
  symptoms: string;
  doctorId: string;
  prescription: string;
  prescriptionFile: File | null;
  testReports: File[];
}

const UploadVisitModal: React.FC<UploadVisitModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // MODAL STATE MANAGEMENT
  const [visitData, setVisitData] = useState<VisitData>({
    appointmentDate: '',
    doctorName: '',
    doctorId : '',
    symptoms: '',
    prescription: '',
    prescriptionFile: null,
    testReports: []
  });

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
    if (!visitData.appointmentDate || !visitData.doctorName || !visitData.symptoms || 
        !visitData.prescription || !visitData.prescriptionFile) {
      toast.error('Please fill in all required fields and upload a prescription image.', {
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
    formData.append('appointmentDate', visitData.appointmentDate);
    formData.append('doctorName', visitData.doctorName);
    formData.append('symptoms', visitData.symptoms);
    formData.append('doctorId', visitData.doctorId);
    formData.append('prescription', visitData.prescription);
    
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
        loading: 'Uploading visit data...',
        success: 'Visit uploaded successfully! 🎉',
        error: (err) => {
          console.error('Upload error:', err);
          
          // Handle different error status codes
          if (err.response?.status === 401) {
            return 'Authentication failed. Please log in again.';
          } else if (err.response?.status === 500) {
            return 'Server error. Please try again later.';
          } else if (err.response?.status === 400) {
            return 'Bad request. Please check your data.';
          } else {
            return 'Upload failed. Please try again.';
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
      appointmentDate: '',
      doctorName: '',
      doctorId: '',
      symptoms: '',
      prescription: '',
      prescriptionFile: null,
      testReports: []
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // VALIDATION
  const isFormValid = () => {
    return visitData.appointmentDate && 
           visitData.doctorName && 
           visitData.symptoms && 
           visitData.prescription &&
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
              <h2 className="text-2xl font-semibold text-white">Upload Visit</h2>
              <p className="text-zinc-400 text-sm mt-1">
                Add your appointment details and medical documents
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
                <h3 className="text-lg font-medium text-white mb-4">Appointment Details</h3>
                
                {/* APPOINTMENT DATE */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={visitData.appointmentDate}
                    onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                {/* DOCTOR NAME */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    value={visitData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    placeholder="Enter doctor's name"
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
                {/* DOCTOR ID */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Doctor ID (if any)
                  </label>
                  <input
                    type="text"
                    value={visitData.doctorId}
                    onChange={(e) => handleInputChange('doctorId', e.target.value)}
                    placeholder="Enter doctor's ID (optional)"
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>


                {/* SYMPTOMS */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Symptoms (Reason for visit) *
                  </label>
                  <textarea
                    value={visitData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    placeholder="Describe why you visited the doctor..."
                    rows={4}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                    required
                  />
                </div>

                {/* PRESCRIPTION */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    What the doctor prescribed *
                  </label>
                  <textarea
                    value={visitData.prescription}
                    onChange={(e) => handleInputChange('prescription', e.target.value)}
                    placeholder="Enter prescribed medications, treatments, or recommendations..."
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
                  <h3 className="text-lg font-medium text-white mb-4">Medical Documents</h3>
                  <label className="block text-sm font-medium text-white mb-2">
                    Upload Prescription * (Required)
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
                        {visitData.prescriptionFile ? visitData.prescriptionFile.name : 'Click to upload prescription'}
                      </span>
                      <span className="text-zinc-400 text-xs">JPG, PNG, PDF files accepted (Required)</span>
                    </label>
                  </div>
                </div>

                {/* TEST REPORTS UPLOAD (OPTIONAL) */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Upload Test Reports (Optional)
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
                        Click to upload test reports
                      </span>
                      <span className="text-zinc-500 text-xs">JPG, PNG, PDF files. Multiple files allowed (Optional)</span>
                    </label>
                  </div>
                </div>

                {/* UPLOADED TEST REPORTS LIST */}
                {visitData.testReports.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Test Reports ({visitData.testReports.length})</h4>
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
              * Required fields. Prescription image is mandatory.
            </div>

            {/* UPLOAD BUTTON */}
            <button
              onClick={handleFinalUpload}
              disabled={!isFormValid()}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Upload Visit
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default UploadVisitModal;
