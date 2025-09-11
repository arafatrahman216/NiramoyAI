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
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fallback dummy data for appointments
  const fallbackAppointments = [
    {
      id: 1,
      appointmentTime: "09:00:00",
      patient: {
        firstName: "John",
        lastName: "Doe"
      },
      consultationType: "REGULAR",
      status: "SCHEDULED",
      symptoms: "Chest pain and shortness of breath during physical activity"
    },
    {
      id: 2,
      appointmentTime: "10:30:00",
      patient: {
        firstName: "Sarah",
        lastName: "Johnson"
      },
      consultationType: "FOLLOW_UP",
      status: "SCHEDULED",
      symptoms: "Follow-up for diabetes management and blood sugar monitoring"
    },
    {
      id: 3,
      appointmentTime: "14:15:00",
      patient: {
        firstName: "Michael",
        lastName: "Brown"
      },
      consultationType: "EMERGENCY",
      status: "COMPLETED",
      symptoms: "Severe headache with nausea and dizziness"
    },
    {
      id: 4,
      appointmentTime: "16:00:00",
      patient: {
        firstName: "Emily",
        lastName: "Davis"
      },
      consultationType: "REGULAR",
      status: "CANCELLED",
      symptoms: "Regular checkup and blood pressure monitoring"
    },
    {
      id: 5,
      appointmentTime: "11:45:00",
      patient: {
        firstName: "James",
        lastName: "Wilson"
      },
      consultationType: "REGULAR",
      status: "SCHEDULED",
      symptoms: "Persistent cough and fever for the past week"
    },
    {
      id: 6,
      appointmentTime: "15:30:00",
      patient: {
        firstName: "Maria",
        lastName: "Garcia"
      },
      consultationType: "FOLLOW_UP",
      status: "SCHEDULED",
      symptoms: "Post-surgery follow-up and wound inspection"
    }
  ];

  // Fallback dummy data for recent visits
  const fallbackRecentVisits = [
    {
      id: 1,
      patientName: "Robert Wilson",
      visitDate: "2025-09-10",
      diagnosis: "Hypertension Stage 1",
      treatment: "Lisinopril 10mg daily, lifestyle modifications",
      notes: "Patient responded well to initial treatment. Blood pressure improved from 150/95 to 135/85."
    },
    {
      id: 2,
      patientName: "Lisa Anderson",
      visitDate: "2025-09-09",
      diagnosis: "Type 2 Diabetes Mellitus",
      treatment: "Metformin 500mg twice daily, dietary counseling",
      notes: "HbA1c levels decreased from 8.2% to 7.1%. Continue current medication."
    },
    {
      id: 3,
      patientName: "David Martinez",
      visitDate: "2025-09-08",
      diagnosis: "Acute Bronchitis",
      treatment: "Amoxicillin 500mg TID x 7 days, rest",
      notes: "Symptoms improving with antibiotic therapy. Follow up if no improvement in 3-4 days."
    },
    {
      id: 4,
      patientName: "Jennifer Taylor",
      visitDate: "2025-09-07",
      diagnosis: "Migraine with Aura",
      treatment: "Sumatriptan 50mg PRN, lifestyle modifications",
      notes: "Patient reports 70% reduction in migraine frequency with new medication regimen."
    },
    {
      id: 5,
      patientName: "Thomas Garcia",
      visitDate: "2025-09-06",
      diagnosis: "Gastroesophageal Reflux Disease",
      treatment: "Omeprazole 20mg daily, dietary changes",
      notes: "GERD symptoms well controlled. Patient educated on trigger foods to avoid."
    },
    {
      id: 6,
      patientName: "Amanda Rodriguez",
      visitDate: "2025-09-05",
      diagnosis: "Allergic Rhinitis",
      treatment: "Cetirizine 10mg daily, nasal spray",
      notes: "Seasonal allergies managed effectively. Patient advised to continue current regimen."
    },
    {
      id: 7,
      patientName: "Christopher Lee",
      visitDate: "2025-09-04",
      diagnosis: "Lower Back Pain",
      treatment: "Physical therapy, NSAIDs as needed",
      notes: "MRI shows no structural abnormalities. Patient responding well to conservative treatment."
    },
    {
      id: 8,
      patientName: "Patricia Moore",
      visitDate: "2025-09-03",
      diagnosis: "Anxiety Disorder",
      treatment: "Sertraline 25mg daily, therapy referral",
      notes: "Patient showing improvement with medication and counseling. Follow-up in 6 weeks."
    }
  ];

  // Fallback stats data
  const fallbackStats = {
    todayAppointments: 4,
    upcomingAppointments: 12,
    totalCompletedAppointments: 248,
    weeklyAppointments: 28
  };

  // Fallback doctor profile data
  const fallbackDoctorProfile = {
    specialization: "Internal Medicine",
    degree: "MD, MBBS",
    hospitalName: "City General Hospital",
    available: true,
    rating: 4.8,
    totalReviews: 156,
    experience: 12,
    licenseNumber: "MD12345"
  };

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
        console.log('Doctor Profile:', fallbackDoctorProfile);
        setDoctorProfile(profileResponse.data.doctor );
        console.log(doctorProfile); 
      }
      catch(err) { console.error('Error fetching doctor profile:', err); setDoctorProfile(fallbackDoctorProfile); }
      // Fetch dashboard stats

      try{
          const statsResponse = await axios.get(`${API_BASE_URL}/doctor/dashboard/stats`);
          console.log('Dashboard Stats:', statsResponse.data.stats);
          setStats(statsResponse.data.stats || fallbackStats);
      }
      catch(err) { console.error('Error fetching dashboard stats:', err); setStats(fallbackStats); }
      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const appointmentsResponse = await axios.get(`${API_BASE_URL}/doctor/appointments?startDate=${today}&endDate=${today}`);
      setAppointments(appointmentsResponse.data.appointments || fallbackAppointments);

      // Fetch recent visits (last 7 days)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentVisitsResponse = await axios.get(`${API_BASE_URL}/doctor/visits/recent?limit=10`);
      setRecentVisits(recentVisitsResponse.data.visits || fallbackRecentVisits);

    } catch (err) {
      // Use fallback data when API calls fail
      
      setAppointments(fallbackAppointments);
      setRecentVisits(fallbackRecentVisits);
      
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

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Dr. {user?.firstName}!</h1>
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
              <div className="text-sm text-gray-400">Today's Appointments</div>
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
              <h3 className="text-xl font-semibold text-white mb-4">Today's Appointments</h3>
              {appointments.length > 0 ? (
                <div className="max-h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-white">
                            {appointment.patient?.firstName} {appointment.patient?.lastName}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {formatTime(appointment.appointmentTime)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400' :
                            appointment.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                            appointment.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {appointment.status}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded-full">
                            {appointment.consultationType}
                          </span>
                        </div>
                      </div>
                      {appointment.symptoms && (
                        <p className="text-gray-400 text-sm mt-2">
                          <span className="font-medium">Symptoms:</span> {
                            appointment.symptoms.length > 80 ? 
                            appointment.symptoms.substring(0, 80) + '...' : 
                            appointment.symptoms
                          }
                        </p>
                      )}
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
          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Patient Visits</h3>
              {recentVisits.length > 0 ? (
                <div className="max-h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
                  {recentVisits.slice(0, 10).map((visit, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-white">
                            {visit.patientName || `${visit.patient?.firstName} ${visit.patient?.lastName}`}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {new Date(visit.visitDate || visit.appointmentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                        {visit.diagnosis && (
                          <div>
                            <span className="font-medium text-gray-300">Diagnosis:</span>
                            <p>{visit.diagnosis}</p>
                          </div>
                        )}
                        {visit.treatment && (
                          <div>
                            <span className="font-medium text-gray-300">Treatment:</span>
                            <p>{visit.treatment}</p>
                          </div>
                        )}
                      </div>
                      {visit.notes && (
                        <p className="text-gray-400 text-sm mt-2">
                          <span className="font-medium text-gray-300">Notes:</span> {
                            visit.notes.length > 60 ? 
                            visit.notes.substring(0, 60) + '...' : 
                            visit.notes
                          }
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No recent visits to display</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

