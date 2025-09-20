// src/components/User/Dashboard.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MiniSpeedometer} from "./MiniSpeedoMeter"
import MedicationTimeline from "./MedicationTimeline";
import Chart from "./Chart";
import RecentVisits from "../RecentVisits";
import { Home, User, Activity, LogOut } from "lucide-react";

import axios from "axios";
import { API_BASE_URL , patientAPI, userInfoAPI} from "../../services/api";
import { 
  fallbackDashboardUser,
  fallbackDashboardVitals,
  fallbackDashboardVisits,
  fallbackDashboardProfile
} from "../../utils/dummyData";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [healthVitals, setHealthVitals] = useState(fallbackDashboardVitals);
  const [recentVisits, setRecentVisits] = useState(fallbackDashboardVisits);
  const [healthProfile, setHealthProfile] = useState(fallbackDashboardProfile);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const profile = user || fallbackDashboardUser;


  useEffect( () => {
    document.title = "Dashboard - NiramoyAI";

    const dashboardStats = async () =>{
      setLoading(true);
      
      try
      {
          const response= await axios.get(`${API_BASE_URL}/user/dashboard`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });
        const fetchedProfile = response.data.healthProfile;
        console.log("Fetched profile data:", fetchedProfile);
          const bloodPressure = fetchedProfile.bloodPressure;
          const systolicPressure = bloodPressure.split('/')[0];
          const diastolicPressure = bloodPressure.split('/')[1];
          console.log(systolicPressure, diastolicPressure);
        const profile = {
          allergies: fetchedProfile.allergies,
          bloodGroup:fetchedProfile.bloodType,
          height: fetchedProfile.height,
          weight: fetchedProfile.weight,
          chronicDiseases: fetchedProfile.chronicDiseases,
          systolic: systolicPressure,
          diastolic: diastolicPressure,
          heartRate: fetchedProfile.heartRate,
          majorEvents : fetchedProfile.majorEvents,
          majorHealthEvents: fetchedProfile.majorHealthEvents,
          lifestyle: fetchedProfile.lifestyle,
        }
        setHealthProfile(profile);
        setHealthVitals(response.data.vitals);
        setMedications(response.data.medications || []);
        setRecentVisits(response.data.recentVisits || fallbackDashboardVisits);
        console.log("Fetched profile:", response.data.medications);
        }
      catch(error){
          console.error("Error fetching dashboard stats:", error);
      }

      try{
        const response = await userInfoAPI.getRecentVisits();
        setRecentVisits(response.data.recentVisits || fallbackDashboardVisits);
        console.log("Fetched recent visits:", response.data);
      }
      catch(error){
          console.error("Error fetching recent visits:", error);
      }
      
      setLoading(false);
    }
    dashboardStats();

  }, []);


  // Health ranges configuration
  const getHealthRanges = (key) => {
    switch(key) {
      case 'heartRate':
        return {
          scale: { min: 40, max: 120 },
          green: { min: 60, max: 100 },
          yellow: { min: 100, max: 110 },
          red: { min: 40, max: 120 }
        };
      case 'weight':
        return {
          scale: { min: 40, max: 120 },
          green: { min: 60, max: 80 },
          yellow: { min: 50, max: 90 },
          red: { min: 40, max: 120 }
        };
      case 'systolic':
        return {
          scale: { min: 80, max: 180 },
          green: { min: 90, max: 120 },
          yellow: { min: 120, max: 140 },
          red: { min: 140, max: 180 }
        };
      case 'diastolic':
        return {
          scale: { min: 50, max: 110 },
          green: { min: 60, max: 80 },
          yellow: { min: 80, max: 90 },
          red: { min: 90, max: 110 }
        };
      default:
        return null;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Navbar */}
      <nav className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-emerald-400 mr-2" />
              <span className="text-xl font-bold text-white">NiramoyAI</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-3 py-2 text-emerald-400 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
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

      <div className="p-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Loading Dashboard</h2>
            <p className="text-zinc-400">Please wait while we fetch your health data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {profile.name}!</h1>
            <button
              onClick={() => navigate("/healthlog")}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium"
            >
              + Add Health Log
            </button>
          </header>

      <div className="space-y-6">
        {/* User Info - Elegant & Classy Design */}
       <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-700 relative overflow-hidden">
  {/* Decorative background element */}
  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full blur-2xl"></div>
  
  <div className="relative z-10">
    {/* Profile Avatar */}
    <div className="flex items-center mb-4">
      <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
        {profile.name?.charAt(0)}
      </div>
      <div className="ml-4">
        <h2 className="text-xl font-bold text-white">{profile.name}</h2>
        <p className="text-emerald-400 font-medium text-sm">@{profile.username}</p>
      </div>
    </div>

    {/* Contact Information - in one row, side by side */}
    <div  className="flex items-center -space-x-20 justify-center">
<div className="flex items-center space-x-6">
  {/* Email */}
  <div className="flex items-center space-x-2"
  style={{paddingRight: '40px'}}>
    <div className="w-7 h-7 bg-zinc-700 rounded-lg flex items-center justify-center">
      <span className="text-xs">📧</span>
    </div>
    <div>
      <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Email</p>
      <p className="text-sm font-medium text-white">{profile.email}</p>
    </div>
  </div>

  {/* Phone */}
  <div className="flex items-center space-x-2">
    <div className="w-7 h-7 bg-zinc-700 rounded-lg flex items-center justify-center">
      <span className="text-xs">📱</span>
    </div>
    <div>
      <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Phone</p>
      <p className="text-sm font-medium text-white">{profile.phoneNumber}</p>
    </div>
  </div>
</div>

</div>

    {/* Status & Role */}
    <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-700">
      <div className="flex items-center space-x-2">
        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
        <span className="text-emerald-400 text-sm font-medium">{profile.status}</span>
      </div>
      <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-md">
        {profile.role}
      </span>
    </div>
  </div>
</div>


        {/* Health Profile and Medication Timeline - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Profile - Static Information Cards */}
          <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Health Profile</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(healthProfile).map(([key, value]) => {
                // Only show non-vital cards in health profile
                const isVital = ['heartRate', 'weight', 'systolic', 'diastolic'].includes(key);
                
                if (isVital) return null; // Skip vital signs for health profile
                if (value==="" || value===null || value===undefined) return null;
                return (
                  <div
                    key={key}
                    className="bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-700 shadow-lg rounded-xl p-4 flex flex-col items-center justify-between hover:shadow-emerald-500/20 transition-shadow duration-200"
                  >
                    <div className="flex items-center mb-3 w-full justify-center">
                      <span className="text-lg mr-2">
                        {key === 'bloodGroup' ? '🩸' :
                         key === 'height' ? '📏' :
                         key === 'allergies' ? '🌾' :
                         key === 'chronicDiseases' ? '💊' :
                         key === 'majorHealthEvents' ?  '🩹' :
                         key === 'majorEvents' ? '🩹' :
                         key === 'lifestyle' ? '🏃' : '🩺'}
                      </span>
                      <span className="text-xs font-semibold capitalize text-emerald-400 text-center">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </div>
                    
                    <span className="text-sm font-bold text-white break-words text-center">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Medication Timeline */}
          <div className="h-fit">
            <MedicationTimeline fetchedMedications={medications} />
          </div>
        </div>

        {/* Current Vitals - Speedometer Cards */}
        <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Current Vitals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(healthProfile).map(([key, value]) => {
              const ranges = getHealthRanges(key);
              const isVital = ['heartRate', 'weight', 'systolic', 'diastolic'].includes(key);
              
              if (!isVital || !ranges) return null; // Only show vital signs with speedometers
              
              return (
                <div
                  key={key}
                  className="bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-700 shadow-lg rounded-xl p-4 flex flex-col items-center justify-between hover:shadow-emerald-500/20 transition-shadow duration-200"
                >
                  <div className="flex items-center mb-3 w-full justify-center">
                    <span className="text-lg mr-2">
                      {key === 'weight' ? '⚖️' :
                       key === 'systolic' ? '💉' :
                       key === 'diastolic' ? '💉' :
                       key === 'heartRate' ? '❤️' : '🩺'}
                    </span>
                    <span className="text-xs font-semibold capitalize text-emerald-400 text-center">
                      {key === 'systolic' ? 'Systolic BP' :
                       key === 'diastolic' ? 'Diastolic BP' :
                       key.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </div>
                  
                  <div className="w-full">
                    <MiniSpeedometer 
                      value={value} 
                      unit={key === 'weight' ? 'kg' : 
                            key === 'heartRate' ? 'bpm' : 
                            (key === 'systolic' || key === 'diastolic') ? 'mmHg' : ''}
                      ranges={ranges}
                      size={120}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        


        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <Chart
            chartType="bloodPressure"
            title="Blood Pressure Trends"
            subtitle="Systolic & Diastolic readings over time"
            icon="💉"
            color="#22c55e"
            unit="mmHg"
            healthVitals={healthVitals}
          />
          
          <Chart
            chartType="diabetes"
            dataKey="sugar"
            title="Blood Sugar Monitoring"
            subtitle="Glucose levels tracking"
            icon="🍯"
            color="#eab308"
            gradientId="sugarGradient"
            unit="mg/dL"
            healthVitals={healthVitals}
          />
          
          <Chart
            chartType="heartRate"
            dataKey="bpm"
            title="Heart Rate Monitor"
            subtitle="Cardiovascular health tracking"
            icon="❤️"
            color="#ef4444"
            gradientId="heartRateGradient"
            unit="bpm"
            healthVitals={healthVitals}
          />
        </div>



        {/* Recent Visits */}
        <RecentVisits 
          visits={recentVisits}
          title="Recent Doctor Visits"
          viewerType="patient"
          showPrescriptionImage={true}
        />
      </div>
      </>
      )}
      </div>
    </div>
  );
};

export default Dashboard;


/*
*/