// src/components/User/Dashboard.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MiniSpeedometer} from "./MiniSpeedoMeter"
import MedicationTimeline from "./MedicationTimeline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";
import { API_BASE_URL } from "../../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  

  // Dummy fallback data
  const fallbackUser = {
    name: "John Doe",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    phoneNumber: "0123456789",
    role: "PATIENT",
    status: "Active",
  };

  const fallbackVitals = {
    bloodPressure: [
    ],
    diabetes: [],
    heartRate: [],
  };

  const fallbackVisits = [
    { date: "2025-08-20", doctor: "Dr. Smith", reason: "General Checkup" },
    { date: "2025-09-01", doctor: "Dr. Brown", reason: "Blood Test" },
  ];

  const fallbackProfile = {
    allergies: "...",
    bloodGroup: "...",
    height: "...",
    weight: "...",
    chronicDiseases: "...",
    systolic: "...",
    diastolic: "...",
    heartRate: "...",
    majorEvents : "...",
    majorHealthEvents: "...",
    lifestyle: "...",
  };

  const [healthVitals, setHealthVitals] = useState(fallbackVitals);
  const [recentVisits, setRecentVisits] = useState(fallbackVisits);
  const [healthProfile, setHealthProfile] = useState(fallbackProfile);

  const profile = user || fallbackUser;


  useEffect( () => {
    document.title = "Dashboard - NiramoyAI";

    const dashboardStats = async () =>{

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
      console.log("Fetched profile:", profile);
      }
    catch(error){
        console.error("Error fetching dashboard stats:", error);
        return null;
    }
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {profile.name}!</h1>
        <button
          onClick={() => navigate("/healthlog")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
        >
          + Add Health Log
        </button>
      </header>

      <div className="space-y-6">
        {/* User Info - Elegant & Classy Design */}
       <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 relative overflow-hidden">
  {/* Decorative background element */}
  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
  
  <div className="relative z-10">
    {/* Profile Avatar */}
    <div className="flex items-center mb-4">
      <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
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
    <div className="w-7 h-7 bg-gray-700 rounded-lg flex items-center justify-center">
      <span className="text-xs">📧</span>
    </div>
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Email</p>
      <p className="text-sm font-medium text-white">{profile.email}</p>
    </div>
  </div>

  {/* Phone */}
  <div className="flex items-center space-x-2">
    <div className="w-7 h-7 bg-gray-700 rounded-lg flex items-center justify-center">
      <span className="text-xs">📱</span>
    </div>
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Phone</p>
      <p className="text-sm font-medium text-white">{profile.phoneNumber}</p>
    </div>
  </div>
</div>

</div>

    {/* Status & Role */}
    <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-700">
      <div className="flex items-center space-x-2">
        <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-400 text-sm font-medium">{profile.status}</span>
      </div>
      <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow-md">
        {profile.role}
      </span>
    </div>
  </div>
</div>


        {/* Health Profile and Medication Timeline - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Profile - Static Information Cards */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
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
            <MedicationTimeline />
          </div>
        </div>

        {/* Current Vitals - Speedometer Cards */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
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
          {/* Enhanced Charts */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">💉</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Blood Pressure Trends</h2>
              <p className="text-sm text-gray-400">Systolic & Diastolic readings over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={healthVitals.bloodPressure} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#374151" strokeOpacity={0.5} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                formatter={(value, name) => [
                  `${value} mmHg`,
                  name === 'systolic' ? 'Systolic' : 'Diastolic'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="systolic" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: '#ffffff' }}
              />
              <Line 
                type="monotone" 
                dataKey="diastolic" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">🍯</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Blood Sugar Monitoring</h2>
              <p className="text-sm text-gray-400">Glucose levels tracking</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={healthVitals.diabetes} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="sugarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#374151" strokeOpacity={0.5} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                formatter={(value) => [`${value} mg/dL`, 'Blood Sugar']}
              />
              <Line 
                type="monotone" 
                dataKey="sugar" 
                stroke="#eab308" 
                strokeWidth={3}
                dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#eab308', strokeWidth: 2, fill: '#ffffff' }}
                fill="url(#sugarGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">❤️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Heart Rate Monitor</h2>
              <p className="text-sm text-gray-400">Cardiovascular health tracking</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={healthVitals.heartRate} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#374151" strokeOpacity={0.5} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                formatter={(value) => [`${value} bpm`, 'Heart Rate']}
              />
              <Line 
                type="monotone" 
                dataKey="bpm" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
                fill="url(#heartRateGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        </div>



        {/* Recent Visits */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Doctor Visits</h2>
          <ul className="divide-y divide-gray-700">
            {recentVisits.map((visit, index) => (
              <li key={index} className="py-3 flex justify-between">
                <span>{visit.date}</span>
                <span>{visit.doctor}</span>
                <span className="text-gray-400">{visit.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
