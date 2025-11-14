import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Activity, 
  AlertTriangle,
  FileText,
  Pill,
  Clock,
  TrendingUp,
  TestTube, 
  Droplets, 
  Lock,
  AlertCircle,
  Loader,
  PlusCircle
} from 'lucide-react';
import { API_BASE_URL, doctorAPI } from '../../services/api';
import VitalsChart from '../PatientProfile/VitalsChart';
import HealthLogs from '../PatientProfile/HealthLogs';
import VisitTimeline from '../PatientProfile/VisitTimeline';
import TestReports from '../PatientProfile/TestReports';
import CreatePrescriptionModal from './CreatePrescriptionModal';
import './DoctorPatientView.css';
import { PhoneAndroid } from '@mui/icons-material';

const DoctorPatientView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patientId = searchParams.get('id');

  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [healthLog, setHealthLog] = useState([]);
  const [visits, setVisits] = useState([]);
  const [charts, setCharts] = useState([]);
  const [activeTab, setActiveTab] = useState('vitals');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchPatientData(patientId);
    } else {
      setError('Patient ID is required');
      setLoading(false);
    }
    fetchDoctorProfile();
  }, [patientId]);

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctor/profile`);
      if (response.data.success) {
        setDoctorProfile(response.data.doctor);
      }
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
    }
  };

  const fetchPatientData = async (id) => {
    try {
      setLoading(true);
      const response = await doctorAPI.accessPatientData(id);

      if (response.data.success) {
        setPatient(response.data.user);
        setVitals(response.data.vitals || []);
        setCharts(response.data.charts || []);
        setHealthLog(response.data.healthLogs || []);
        setVisits(response.data.visits || []);
      } else {
        setError(response.data.message || 'Failed to fetch patient data');
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError(err.response?.data?.message || 'Error fetching patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async (prescriptionData) => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await doctorAPI.createPrescription({
        ...prescriptionData,
        patientId
      });

      if (response.data.success) {
        alert('Prescription created successfully!');
        setShowPrescriptionModal(false);
      } else {
        throw new Error(response.data.message || 'Failed to create prescription');
      }
    } catch (err) {
      console.error('Error creating prescription:', err);
      alert(err.message || 'Error creating prescription');
      throw err;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="dpv-container dpv-loading">
        <div className="dpv-spinner">
          <Loader size={48} className="dpv-spinner-icon" />
          <p>Loading patient information...</p>
        </div>
      </div>
    );
  }

  // Error state (handles both permission denied and other errors)
  if (error && !patient) {
    return (
      <div className="dpv-container">
        <div className="dpv-error-card">
          {error.toLowerCase().includes('permission') ? (
            <Lock size={48} />
          ) : (
            <AlertCircle size={48} />
          )}
          <h2>{error.toLowerCase().includes('permission') ? 'Access Denied' : 'Error Loading Patient'}</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="dpv-btn dpv-btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dpv-container">
      {/* Header */}
      <div className="dpv-header">
        <button 
          onClick={() => navigate(-1)}
          className="dpv-back-btn"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Patient Profile</h1>
      </div>

      {error && (
        <div className="dpv-error-banner">
          <AlertTriangle size={18} />
          <p>{error}</p>
        </div>
      )}

      {patient && (
        <>
          {/* Patient Info Card */}
          <div className="dpv-patient-info-card">
            <div className="dpv-patient-header">
              <div className="dpv-patient-avatar">
                {patient.name?.charAt(0).toUpperCase()}
              </div>
              <div className="dpv-patient-basic-info">
                <div className="dpv-name-header">
                  <h2>{patient.name}</h2>
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="dpv-create-prescription-btn-inline"
                    title="Create a new prescription for this patient"
                  >
                    <PlusCircle size={18} />
                    Create Prescription
                  </button>
                </div>
                <p className="dpv-patient-id">ID: #{patientId}</p>
                <div className="dpv-patient-meta">
                  <span className="dpv-meta-item">
                    <User size={14} />
                    {patient.gender || 'N/A'}
                  </span>
                  <span className="dpv-meta-item">
                    <PhoneAndroid size={14} />
                    {patient.phoneNumber || 'N/A'}
                  </span>
                  {patient.bloodType && (
                    <span className="dpv-meta-item dpv-blood-type">
                      {patient.bloodType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="dpv-contact-grid">
              {patient.email && (
                <div className="dpv-contact-item">
                  <Mail size={16} />
                  <div>
                    <p className="dpv-contact-label">Email</p>
                    <p className="dpv-contact-value">{patient.email}</p>
                  </div>
                </div>
              )}
              {patient.phone && (
                <div className="dpv-contact-item">
                  <Phone size={16} />
                  <div>
                    <p className="dpv-contact-label">Phone</p>
                    <p className="dpv-contact-value">{patient.phone}</p>
                  </div>
                </div>
              )}
              {patient.address && (
                <div className="dpv-contact-item">
                  <MapPin size={16} />
                  <div>
                    <p className="dpv-contact-label">Address</p>
                    <p className="dpv-contact-value">{patient.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Medical Info */}
            {( vitals|| vitals.allergies || vitals.height || vitals.lifestyle || vitals.chronicDiseases) && (
              <div className="dpv-medical-grid">
                {vitals && (
                  <>
                    <div className="dpv-medical-stat">
                      <p className="dpv-stat-label">BP</p>
                      <p className="dpv-stat-value">{vitals.bloodPressure || 'N/A'}</p>
                    </div>
                    <div className="dpv-medical-stat">
                      <p className="dpv-stat-label">HR</p>
                      <p className="dpv-stat-value">{vitals.heartRate ? `${vitals.heartRate} bpm` : 'N/A'}</p>
                    </div>
                    <div className="dpv-medical-stat">
                      <p className="dpv-stat-label">Temp</p>
                      <p className="dpv-stat-value">{vitals.temperature ? `${vitals.temperature}°F` : 'N/A'}</p>
                    </div>
                    <div className="dpv-medical-stat">
                      <p className="dpv-stat-label">Height</p>
                      <p className="dpv-stat-value">{vitals.height ? `${vitals.height} cm` : 'N/A'}</p>
                    </div>
                  </>
                )}
                
                {vitals.allergies && (
                  <div className="dpv-medical-alert">
                    <AlertTriangle size={14} />
                    <span>{vitals.allergies}</span>
                  </div>
                )}

                {vitals.chronicDiseases && (
                  <div className="dpv-medical-alert">
                    <AlertTriangle size={14} />
                    <span>{vitals.chronicDiseases}</span>
                  </div>
                )}

                {vitals.lifestyle && (
                  <div className="dpv-medical-badge">
                    <Activity size={14} />
                    <span>{vitals.lifestyle}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="dpv-tabs">
            <button
              onClick={() => setActiveTab('vitals')}
              className={`dpv-tab ${activeTab === 'vitals' ? 'dpv-tab-active' : ''}`}
            >
              <Activity size={18} />
              Vitals
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`dpv-tab ${activeTab === 'visits' ? 'dpv-tab-active' : ''}`}
            >
              <Calendar size={18} />
              Visits
            </button>
            <button
              onClick={() => setActiveTab('health-logs')}
              className={`dpv-tab ${activeTab === 'health-logs' ? 'dpv-tab-active' : ''}`}
            >
              <FileText size={18} />
              Health Logs
            </button>
            <button
              onClick={() => setActiveTab('test-reports')}
              className={`dpv-tab ${activeTab === 'test-reports' ? 'dpv-tab-active' : ''}`}
            >
              <TestTube size={18} />
              Test Reports
            </button>
          </div>

          {/* Tab Content */}
          <div className="dpv-tab-content">
            {activeTab === 'vitals' && (
              <div className="dpv-vitals-section">
                <VitalsChart vitals={vitals} charts={charts} />
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="dpv-visits-section">
                <VisitTimeline patientId={patientId} fetchedVisits={visits} />
              </div>
            )}

            {activeTab === 'health-logs' && (
              <div className="dpv-health-logs-section">
                <HealthLogs patientId={patientId} healthLog={healthLog} />
              </div>
            )}

            {activeTab === 'test-reports' && (
              <div className="dpv-test-reports-section">
                <TestReports />
              </div>
            )}
          </div>

          <CreatePrescriptionModal
            isOpen={showPrescriptionModal}
            onClose={() => setShowPrescriptionModal(false)}
            patientName={patient?.firstName && patient?.lastName ? `${patient.firstName} ${patient.lastName}` : patient?.name || 'Patient'}
            patientId={patientId} 
            vitals={vitals}
            patientData={{
              ...patient,
              vitals: vitals
            }}
            doctorData={doctorProfile}
            onSubmit={handleCreatePrescription}
          />
        </>
      )}
    </div>
  );
};

export default DoctorPatientView;
