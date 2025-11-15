import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Shield,
  Share2,
  ExternalLink,
  Clock,
  Printer
} from 'lucide-react';
import axios from 'axios';
import { printHealthProfile } from '../../utils/printer';
import { API_BASE_URL , sharedProfileAPI } from '../../services/api';
import { Height } from '@mui/icons-material';

// Lazy load components
const VitalsChart = React.lazy(() => import('../PatientProfile/VitalsChart'));
const HealthLogs = React.lazy(() => import('../PatientProfile/HealthLogs'));

const SharedProfile = () => {
  const { encryptedId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('vitals');

  // Dummy data for demonstration
  const dummyProfile = {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "New York, NY",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    bloodType: "A+",
    allergies: "Penicillin, Peanuts",
    currentVitals: {
      bloodPressure: "120/80",
      heartRate: 72,
      temperature: 98.6,
      weight: 175,
      height: "5'10\"",
      lastUpdated: "2025-09-21"
    }
  };

  const dummyVitals = [
    {
      date: "2025-09-21",
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 72,
      temperature: 98.6,
      weight: 175
    },
    {
      date: "2025-09-20",
      bloodPressure: { systolic: 118, diastolic: 78 },
      heartRate: 70,
      temperature: 98.4,
      weight: 174
    },
    {
      date: "2025-09-19",
      bloodPressure: { systolic: 122, diastolic: 82 },
      heartRate: 74,
      temperature: 98.8,
      weight: 176
    }
  ];

  const dummyHealthLogs = [
    {
      healthLogId: "HL001",
      date: "2025-09-21",
      symptoms: ["Mild headache", "Fatigue"],
      notes: "Feeling tired after long work hours",
      stressLevel: 4,
      sleepHours: 6,
      vitals: {
        heartRate: 72,
        bloodPressure: "120/80",
        temperature: 98.6
      }
    },
    {
      healthLogId: "HL002", 
      date: "2025-09-20",
      symptoms: ["Good energy"],
      notes: "Feeling well, good sleep last night",
      stressLevel: 2,
      sleepHours: 8,
      vitals: {
        heartRate: 70,
        bloodPressure: "118/78",
        temperature: 98.4
      }
    }
  ];

  useEffect(() => {
    console.log('Fetching shared profile for ID:', encryptedId);
    fetchSharedProfile();
  }, [encryptedId]);

  const fetchSharedProfile = async () => {
    try {
      setLoading(true);
      
      // For demonstration, using dummy data
      // Real API call would be:
      // const response = await axios.post(`${API_BASE_URL}/public/shared-profile`, {
      //   encryptedId: encryptedId
      // });

      try {
        const response = await sharedProfileAPI.getSharedProfile(encryptedId);
        console.log('API response:', response.data);
        setProfile(response.data.user);
        setProfile(prev => ({ ...prev, 
          bloodType: response.data.healthProfile.bloodType,
          dateOfBirth: response.data.healthProfile.dateOfBirth,
          bloodPressure: response.data.healthProfile.bloodPressure,
          height: response.data.healthProfile.height,
          weight: response.data.healthProfile.weight,
          heartRate: response.data.healthProfile.heartRate,

         }));
        setHealthLogs(response.data.healthLogs || []);
        setCharts(response.data.vitals || []); 
        setVitals(response.data.vitals || []);

      } catch (apiErr) {
        console.error('API call error:', apiErr);
        setError('Failed to load profile. The link may be invalid or expired.');
        return;
      }
      
      
    } catch (err) {
      console.error('Error fetching shared profile:', err);
      setError('Failed to load profile. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    printHealthProfile(profile, healthLogs);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">{t('sharedProfile.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">{t('sharedProfile.accessDenied')}</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {t('sharedProfile.returnHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-emerald-400" />
                <h1 className="text-xl font-bold">{t('sharedProfile.title')}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>{t('sharedProfile.printProfile')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 border border-gray-700">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {profile?.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{profile?.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">
                    {t('sharedProfile.email')}: {profile?.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">{profile?.gender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">{t('sharedProfile.bloodType')}: {profile?.bloodType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">{t('sharedProfile.dateOfBirth')}: {profile?.dateOfBirth}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-300 flex items-center">
              <Shield className="w-4 h-4 text-emerald-400 mr-2" />
              {t('sharedProfile.privacyNotice')}
            </p>
          </div>
        </div>

        {/* Current Vitals */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Activity className="w-6 h-6 text-emerald-400 mr-2" />
            {t('sharedProfile.currentVitals')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">{t('sharedProfile.bloodPressure')}</p>
              <p className="text-lg font-semibold">{profile?.bloodPressure}</p>
              <p className="text-xs text-gray-500">{t('sharedProfile.mmHg')}</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">{t('sharedProfile.heartRate')}</p>
              <p className="text-lg font-semibold">{profile?.heartRate}</p>
              <p className="text-xs text-gray-500">{t('sharedProfile.bpm')}</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <Height className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">{t('sharedProfile.height')}</p>
              <p className="text-lg font-semibold">{profile?.height}</p>
              <p className="text-xs text-gray-500">{t('sharedProfile.cms')}</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <Weight className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">{t('sharedProfile.weight')}</p>
              <p className="text-lg font-semibold">{profile?.weight}</p>
              <p className="text-xs text-gray-500">{t('sharedProfile.kgs')}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('vitals')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'vitals'
                    ? 'text-emerald-400 border-b-2 border-emerald-400 bg-gray-700/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                {t('sharedProfile.vitalsChart')}
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'logs'
                    ? 'text-emerald-400 border-b-2 border-emerald-400 bg-gray-700/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                {t('sharedProfile.healthLogs')}
              </button>
            </nav>
          </div>

          <div className="p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            }>
              {activeTab === 'vitals' && (
                <VitalsChart 
                  patientId={profile?.id} 
                  charts={charts}
                />
              )}
              {activeTab === 'logs' && (
                <HealthLogs 
                  patientId={profile?.id} 
                  healthLog={healthLogs}
                />
              )}
            </Suspense>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>{t('sharedProfile.poweredBy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedProfile;