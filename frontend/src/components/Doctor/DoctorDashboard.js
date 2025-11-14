import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  User,
  LogOut,
  Calendar,
  Users,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail,
  Activity,
  FileText,
  QrCode,
  Pill
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, doctorAPI } from '../../services/api';
import RecentVisits from '../RecentVisits';
import DoctorQRModal from './DoctorQRModal';
import PrescribeModal from './PrescribeModal';
import { 
  fallbackDoctorAppointments,
  fallbackDoctorRecentVisits,
  fallbackDoctorStats,
  fallbackDoctorDashboardProfile,
  fallbackDoctorPatients
} from '../../utils/dummyData';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // DUMMY DATA FOR APPOINTMENTS (COMMENTED OUT DB FETCH)
  const dummyAppointments = [
    {
      appointmentId: 'APT001',
      patientName: 'Afham Adian',
      appointmentDate: new Date(2025, 10, 15, 19, 47).toISOString(),
      hospital: 'Ibn Sina Diagnostic and Consultation Center, Lalbagh',
      status: 'Pending'
    },
    {
      appointmentId: 'APT002',
      patientName: 'Arafat Rahman',
      appointmentDate: new Date(2025, 10, 16, 16, 51).toISOString(),
      hospital: 'Asgar Ali Hospital',
      status: 'Pending'
    },
    {
      appointmentId: 'APT003',
      patientName: 'Fatima Hassan',
      appointmentDate: new Date(2025, 10, 17, 10, 30).toISOString(),
      hospital: 'Bangladesh Institute of Health Sciences',
      status: 'Scheduled'
    },
    {
      appointmentId: 'APT004',
      patientName: 'Mohammed Ali',
      appointmentDate: new Date(2025, 10, 18, 14, 15).toISOString(),
      hospital: 'Popular Hospital Ltd.',
      status: 'Pending'
    },
    {
      appointmentId: 'APT005',
      patientName: 'Priya Sharma',
      appointmentDate: new Date(2025, 10, 19, 9, 0).toISOString(),
      hospital: 'Square Hospitals Ltd.',
      status: 'Completed'
    }
  ];
  
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState(dummyAppointments);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      
      // Fetch doctor profile
      try{
          const profileResponse = await axios.get(`${API_BASE_URL}/doctor/profile`);
        console.log('Doctor Profile:', profileResponse.data.doctor);
        console.log('Doctor Profile:', fallbackDoctorDashboardProfile);
        setDoctorProfile(profileResponse.data.doctor );
        console.log(doctorProfile); 
      }
      catch(err) { console.error('Error fetching doctor profile:', err); setDoctorProfile(fallbackDoctorDashboardProfile); }
      // Fetch dashboard stats

      try{
          const statsResponse = await axios.get(`${API_BASE_URL}/doctor/dashboard/stats`);
          console.log('Dashboard Stats:', statsResponse.data.stats);
          setStats(statsResponse.data.stats || fallbackDoctorStats);
      }
      catch(err) { console.error('Error fetching dashboard stats:', err); setStats(fallbackDoctorStats); }
      
      // ========== COMMENTED OUT: Fetch from DB ==========
      // This was fetching appointments from the database
      // Uncomment below to enable DB fetch instead of dummy data
      /*
      try {
        const today = new Date().toISOString().split('T')[0];
        const appointmentsResponse = await axios.get(`${API_BASE_URL}/doctor/appointments`);
        setAppointments(appointmentsResponse.data.appointments || fallbackDoctorAppointments);
      } catch(err) { 
        console.error('Error fetching today\'s appointments:', err); 
        setAppointments(fallbackDoctorAppointments); 
      }
      */
      // ========== END COMMENTED OUT ==========
      
      // Using DUMMY DATA for appointments instead
      setAppointments(dummyAppointments);
      
      // Fetch recent visits (last 7 days)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentVisitsResponse = await axios.get(`${API_BASE_URL}/doctor/recent-visits`);
      setRecentVisits(recentVisitsResponse.data.visits || fallbackDoctorRecentVisits);

    } catch (err) {
      // Use fallback data when API calls fail
      
      setAppointments(dummyAppointments);
      setRecentVisits(fallbackDoctorRecentVisits);
      
      setError('Using demo data - API connection failed');
      console.error('Error fetching doctor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/doctor/login');
  };

  const handleProfileClick = () => {
    navigate('/doctor/profile');
  };

  const handleShowQR = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctor/qr`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setQrData({
          link: response.data.link,
          qrImage: response.data.qrImage,
          doctorName: doctorProfile?.name || user?.name,
          specialty: doctorProfile?.specialization,
          degree: doctorProfile?.degree
        });
        setShowQRModal(true);
      }
    } catch (err) {
      console.error('Error fetching QR data:', err);
      // Show error notification
    }
  };

  const handleCreateNewQR = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/doctor/qr`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setQrData({
          link: response.data.link,
          qrImage: response.data.qrImage,
          doctorName: doctorProfile?.name || user?.name,
          specialty: doctorProfile?.specialization,
          degree: doctorProfile?.degree
        });
        setShowQRModal(true);
      }
    } catch (err) {
      console.error('Error creating new QR:', err);
      // Show error notification
    }
  };

  const formatTime = (timeString) => {
    try {
      // Handle full ISO datetime strings (e.g., "2025-11-15T19:47:42")
      if (timeString.includes('T')) {
        return new Date(timeString).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      // Handle time-only strings (e.g., "19:47:42")
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return timeString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      case 'NO_SHOW': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Stethoscope className="w-6 h-6 text-emerald-400 mr-2" />
              <span className="text-xl font-bold text-white">NiramoyAI - Doctor Portal</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPrescribeModal(true)}
                className="flex items-center px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors"
                title="Create a new prescription"
              >
                <Pill className="w-4 h-4 mr-2" />
                Prescribe
              </button>
              <button
                onClick={handleProfileClick}
                className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Dr. {user?.name}</h1>
          <p className="text-gray-400">Here's your medical practice overview for today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Doctor Info Card */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                {user?.name?.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dr. {user?.name}</h3>
              <p className="text-gray-400 mb-1">{doctorProfile?.specialization}</p>
              <p className="text-gray-400 mb-1">{doctorProfile?.degree}</p>
              <p className="text-gray-400 mb-3">{doctorProfile?.hospitalName}</p>
              
              <div className="flex justify-center mb-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  doctorProfile?.available 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {doctorProfile?.available ? 'Available' : 'Not Available'}
                </span>
              </div>
              
              <div className="flex items-center justify-center text-yellow-400">
                <Star className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {doctorProfile?.rating || 0} ({doctorProfile?.totalReviews || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {stats?.todayAppointments || 0}
              </div>
              <div className="text-sm text-gray-400">Appointments</div>
            </div>
            
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {stats?.upcomingAppointments || 0}
              </div>
              <div className="text-sm text-gray-400">Upcoming Appointments</div>
            </div>
            
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {stats?.totalCompletedAppointments || 0}
              </div>
              <div className="text-sm text-gray-400">Total Patients Treated</div>
            </div>
            
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {doctorProfile?.experience || 0}
              </div>
              <div className="text-sm text-gray-400">Years of Experience</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Appointments */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Appointments</h3>
              {appointments.length > 0 ? (
                <div className="max-h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
                  {appointments.map((appointment) => (
                    <div key={appointment.appointmentId} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-white">
                            {appointment.patientName}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {formatTime(appointment.appointmentDate)}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {appointment.hospital}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            appointment.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                            appointment.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                            appointment.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Visits */}
          <RecentVisits 
            visits={recentVisits}
            title="Recent Patient Visits"
            viewerType="doctor"
            showPrescriptionImage={true}
            height="500px"
            className="border border-gray-700 shadow-xl"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/doctor/appointments')}
                className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Calendar className="w-8 h-8 text-emerald-400 mb-2" />
                <span className="text-white font-medium">View All Appointments</span>
              </button>
              
              <button
                onClick={() => navigate('/doctor/schedule')}
                className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Clock className="w-8 h-8 text-blue-400 mb-2" />
                <span className="text-white font-medium">Manage Schedule</span>
              </button>
              
              <button
                onClick={() => navigate('/doctor/patients')}
                className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Users className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-white font-medium">Patient Records</span>
              </button>

              <button
                onClick={() => navigate('/doctor/profile')}
                className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <User className="w-8 h-8 text-yellow-400 mb-2" />
                <span className="text-white font-medium">Update Profile</span>
              </button>

              <button
                onClick={handleShowQR}
                className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <QrCode className="w-8 h-8 text-pink-400 mb-2" />
                <span className="text-white font-medium">Show QR</span>
              </button>

              <button
                onClick={handleCreateNewQR}
                className="flex flex-col items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <QrCode className="w-8 h-8 text-cyan-400 mb-2" />
                <span className="text-white font-medium">Create New QR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DoctorQRModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
        doctorData={qrData}
      />

      <PrescribeModal
        isOpen={showPrescribeModal}
        onClose={() => setShowPrescribeModal(false)}
        doctorProfile={doctorProfile}
      />
    </div>
  );
};

export default DoctorDashboard;

