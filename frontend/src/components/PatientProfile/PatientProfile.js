// src/components/PatientProfile/PatientProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Heart,
  Activity, 
  Thermometer, 
  Weight,
  AlertTriangle,
  FileText,
  Pill,
  Clock,
  TrendingUp,
  TestTube, Droplets, User2Icon
} from 'lucide-react';


import VitalsChart from './VitalsChart';
import HealthLogs from './HealthLogs';
import VisitTimeline from './VisitTimeline';
import TestReports from './TestReports';
import { doctorAPI } from '../../services/api';
import { Height } from '@mui/icons-material';

const PatientProfile = () => {
  const [sparams] = useSearchParams();
  const [id, setId] = useState(sparams.get('id') || null);
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [healthLog, setHealthLog] = useState([]);
  const [charts, setCharts] = useState([]);
  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState('vitals');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fallback patient data
  const fallbackPatient = {
    id: 1,
    name: "John",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    bloodType: "A+",
    allergies: "Penicillin, Peanuts",
    emergencyContact: {
      name: "Jane Doe",
      phone: "+1 (555) 987-6543",
      relation: "Spouse"
    },
    currentVitals: {
      bloodPressure: "120/80",
      heartRate: 72,
      temperature: 98.6,
      weight: 175,
      height: "5'10\"",
      lastUpdated: "2025-09-11"
    }
  };

  const fallbackcurrentVitals = {
    bloodPressure: "120/80",
    heartRate: 72,
    temperature: 98.6,
    weight: 175,
    height: "5'10\"",
    lastUpdated: "2025-09-11",
    calculateAge: "24"

  };


  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      // console.log('Fetching data for patient ID:', id);

      const response = await doctorAPI.getPatientInfo(id);
      // console.log(response.data);
      
      setPatient(response.data.user || fallbackPatient);
      setVitals(response.data.vitals || fallbackcurrentVitals);
      setCharts(response.data.charts || []);
      setHealthLog(response.data.healthLogs );
      setVisits(response.data.visits || []);
    } catch (err) {
      setPatient(fallbackPatient);
      setVitals(fallbackcurrentVitals);
      setError('Using demo data - API connection failed');
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/doctor/dashboard');
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const tabs = [
    { id: 'vitals', label: 'Vitals & Charts', icon: Activity },
    { id: 'healthlogs', label: 'Health Logs', icon: FileText },
    { id: 'visits', label: 'Visit Timeline', icon: Clock },
    { id: 'tests', label: 'Test Reports', icon: TestTube }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            
            <h1 className="text-2xl font-bold text-white">
              Patient Profile - {patient?.name}
            </h1>
            
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Patient Overview Card - Modern & Compact */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl mb-8 overflow-hidden">
          <div className="p-8">
            {/* Header with Patient Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 via-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {patient?.name?.charAt(0)}
                </div>
                
                <div className="flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {patient?.name}
                  </h2>
                  <p className="text-emerald-400 font-medium text-sm mb-2">@{patient?.username}</p>
                  <div className="flex gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 border border-blue-500/30 rounded-full text-xs font-medium text-blue-300">
                      <Calendar className="w-3.5 h-3.5" />
                      {calculateAge(vitals?.dateOfBirth)} yrs
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/15 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300">
                      <User className="w-3.5 h-3.5" />
                      {patient?.gender}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/15 border border-rose-500/30 rounded-full text-xs font-medium text-rose-300">
                      <Droplets className="w-3.5 h-3.5" />
                      {vitals?.bloodType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Vitals - Compact Grid */}
              <div className="flex-1 w-full md:w-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-3 text-center hover:border-red-500/40 transition-all">
                    <Heart className="w-5 h-5 text-red-400 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-400 font-medium">BP</p>
                    <p className="text-sm font-bold text-white">{vitals?.bloodPressure || 'N/A'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-3 text-center hover:border-emerald-500/40 transition-all">
                    <Activity className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-400 font-medium">HR</p>
                    <p className="text-sm font-bold text-white">{vitals?.heartRate || 'N/A'} bpm</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-3 text-center hover:border-yellow-500/40 transition-all">
                    <Height className="w-5 h-5 text-yellow-400 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-400 font-medium">Height</p>
                    <p className="text-sm font-bold text-white">{vitals?.height || 'N/A'} cm</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-3 text-center hover:border-blue-500/40 transition-all">
                    <Weight className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-400 font-medium">Weight</p>
                    <p className="text-sm font-bold text-white">{vitals?.weight || 'N/A'} kg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergies Alert */}
            {patient?.allergies && (
              <div className="mt-4 p-4 bg-gradient-to-r from-red-500/15 to-rose-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-300 mb-0.5">Allergies</p>
                  <p className="text-sm text-red-200">{patient.allergies}</p>
                </div>
              </div>
            )}

            {/* Chronic Diseases */}
            {vitals?.chronicDiseases && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs font-semibold text-amber-300 mb-1">Chronic Conditions</p>
                <p className="text-sm text-amber-200">{vitals.chronicDiseases}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl mb-8">
          <div className="flex flex-wrap border-b border-gray-700">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'vitals' && <VitalsChart patientId={id} charts={charts} />}
            {activeTab === 'healthlogs' && <HealthLogs patientId={id} healthLog= {healthLog} />}
            {activeTab === 'visits' && <VisitTimeline patientId={id} fetchedVisits={visits} />}
            {activeTab === 'tests' && <TestReports patientId={id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
