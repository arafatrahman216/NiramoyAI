// src/components/PatientProfile/PatientProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
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
import axios from 'axios';
import { API_BASE_URL, doctorAPI } from '../../services/api';
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

        {/* Patient Overview Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Patient Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {patient?.name?.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {patient?.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        Age: {calculateAge(vitals?.dateOfBirth)} years
                      </div>
                      <div className="flex items-center text-gray-400">
                        <User className="w-4 h-4 mr-2" />
                        {patient?.gender}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Phone className="w-4 h-4 mr-2" />
                        {patient?.phoneNumber}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Mail className="w-4 h-4 mr-2" />
                        {patient?.email}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Droplets className="w-4 h-4 mr-2" />
                        Blood Type: {vitals?.bloodType}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <User2Icon className="w-4 h-4 mr-2" />
                        @{patient?.username}
                      </div>
                    </div>
                    
                    {patient?.allergies && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400 font-medium">Allergies: {patient.allergies}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Vitals */}
              <div className="lg:w-80">
                <h3 className="text-lg font-semibold text-white mb-4">Current Vitals</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                    <Heart className="w-6 h-6 text-red-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Blood Pressure</p>
                    <p className="text-sm font-semibold text-white">{vitals?.bloodPressure}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                    <Activity className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Heart Rate</p>
                    <p className="text-sm font-semibold text-white">{vitals?.heartRate} bpm</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                    <Height className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Height</p>
                    <p className="text-sm font-semibold text-white">{vitals?.height} cm</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                    <User className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Weight</p>
                    <p className="text-sm font-semibold text-white">{vitals?.weight} kgs</p>
                  </div>
                </div>
                {vitals?.chronicDiseases && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Chronic Diseases: {vitals.chronicDiseases}
                  </p>
                )}
              </div>
            </div>
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
