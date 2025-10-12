import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doctorAPI, testCenterAPI, symptomsAPI } from '../services/api';

// Scroll to top component
function ScrollTop() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: showScroll ? 1 : 0 }}
      className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg shadow-xl z-50 transition-all duration-200"
      onClick={scrollTop}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  );
}

const LandingPage = () => {
  // Add CSS keyframes for gradient animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [symptomsQuery, setSymptomsQuery] = useState('');
  const [searchType, setSearchType] = useState('doctors'); // 'doctors', 'testCenters', 'symptoms'
  const [doctors, setDoctors] = useState([]);
  const [testCenters, setTestCenters] = useState([]);
  const [symptomsResults, setSymptomsResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user') || localStorage.getItem('token') || localStorage.getItem('authToken');
    setIsLoggedIn(!!user);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    navigate('/');
  };

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      if (searchType === 'symptoms') return; // Don't auto-load for symptoms
      
      setLoading(true);
      setError(null);
      
      try {
        if (searchType === 'doctors') {
          const response = await doctorAPI.getAllDoctors();
          const doctorsData = response.data?.data || response.data || [];
          setDoctors(doctorsData);
          setFilteredResults(doctorsData);
        } else {
          // Use demo data for test centers instead of API
          const demoTestCenters = [
            {
              id: 1,
              name: 'Square Hospitals Ltd.',
              location: 'Panthapath, Dhaka',
              phone: '+88-02-8159457',
              services: ['Blood Tests', 'Pathology', 'Radiology', 'Cardiology'],
              rating: 4.8
            },
            {
              id: 2,
              name: 'United Hospital Limited',
              location: 'Gulshan, Dhaka',
              phone: '+88-02-9883311',
              services: ['Hematology', 'Lab Services', 'Imaging', 'Emergency'],
              rating: 4.9
            },
            {
              id: 3,
              name: 'Apollo Hospitals Dhaka',
              location: 'Bashundhara, Dhaka',
              phone: '+88-10678',
              services: ['Blood Analysis', 'Diagnostic Services', 'CT Scan', 'MRI'],
              rating: 4.7
            },
            {
              id: 4,
              name: 'Labaid Specialized Hospital',
              location: 'Dhanmondi, Dhaka',
              phone: '+88-02-9611233',
              services: ['Blood Count', 'Pathology', 'Biochemistry', 'Microbiology'],
              rating: 4.6
            },
            {
              id: 5,
              name: 'Ibn Sina Hospital',
              location: 'Kallyanpur, Dhaka',
              phone: '+88-02-9002513',
              services: ['Hematology Tests', 'Lab Tests', 'X-Ray', 'Ultrasound'],
              rating: 4.5
            },
            {
              id: 6,
              name: 'Green Life Medical College Hospital',
              location: 'Panthapath, Dhaka',
              phone: '+88-02-58151275',
              services: ['Blood Screening', 'Medical Tests', 'ECG', 'Endoscopy'],
              rating: 4.4
            },
            {
              id: 7,
              name: 'Bangladesh Medical College Hospital',
              location: 'Dhanmondi, Dhaka',
              phone: '+88-02-9665188',
              services: ['Clinical Pathology', 'Blood Tests', 'Urine Tests', 'Stool Tests'],
              rating: 4.3
            },
            {
              id: 8,
              name: 'Holy Family Red Crescent Medical College Hospital',
              location: 'Maghbazar, Dhaka',
              phone: '+88-02-9337513',
              services: ['Laboratory Medicine', 'Blood Bank', 'Histopathology', 'Cytology'],
              rating: 4.2
            }
          ];
          setTestCenters(demoTestCenters);
          setFilteredResults(demoTestCenters);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (searchType === 'doctors') {
          setError(`Failed to load ${searchType}. Please check if the backend server is running.`);
        }
        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchType]);

  // Search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (searchType === 'symptoms') return; // Symptoms search is handled separately
      
      if (!searchTerm.trim()) {
        const results = searchType === 'doctors' ? doctors : testCenters;
        setFilteredResults(results);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let searchResults = [];
        
        if (searchType === 'doctors') {
          if (searchTerm== null || searchTerm.trim()=="") return;
          console.log(searchTerm);
          const response = await doctorAPI.searchDoctors(searchTerm);
          if (response.data && response.data) {
            searchResults = response.data || [];
          }
          } else {
            // Use demo data for test centers instead of API calls
            if (searchTerm.toLowerCase().includes('cbc') || searchTerm.toLowerCase().includes('complete blood count')) {
              // Show CBC-specific data with pricing
              searchResults = [
                {
                  id: 1,
                  name: 'Square Hospitals Ltd.',
                  location: 'Panthapath, Dhaka',
                  phone: '+88-02-8159457',
                  services: ['CBC Test', 'Blood Tests', 'Pathology'],
                  testName: 'Complete Blood Count (CBC)',
                  cost: '৳650',
                  duration: '30 minutes',
                  reportTime: '6-8 hours',
                  availability: 'Daily 7:00 AM - 11:00 PM',
                  department: 'Pathology Lab',
                  fasting: 'Not Required',
                  rating: 4.8
                },
                {
                  id: 2,
                  name: 'United Hospital Limited',
                  location: 'Gulshan, Dhaka',
                  phone: '+88-02-9883311',
                  services: ['CBC Test', 'Hematology', 'Lab Services'],
                  testName: 'Complete Blood Count (CBC)',
                  cost: '৳700',
                  duration: '25 minutes',
                  reportTime: '4-6 hours',
                  availability: 'Daily 6:00 AM - 12:00 AM',
                  department: 'Clinical Laboratory',
                  fasting: 'Not Required',
                  rating: 4.9
                },
                {
                  id: 3,
                  name: 'Apollo Hospitals Dhaka',
                  location: 'Bashundhara, Dhaka',
                  phone: '+88-10678',
                  services: ['CBC Test', 'Blood Analysis', 'Diagnostic Services'],
                  testName: 'Complete Blood Count (CBC)',
                  cost: '৳720',
                  duration: '20 minutes',
                  reportTime: '3-5 hours',
                  availability: 'Daily 24/7',
                  department: 'Laboratory Medicine',
                  fasting: 'Not Required',
                  rating: 4.7
                },
                {
                  id: 4,
                  name: 'Labaid Specialized Hospital',
                  location: 'Dhanmondi, Dhaka',
                  phone: '+88-02-9611233',
                  services: ['CBC Test', 'Blood Count', 'Pathology'],
                  testName: 'Complete Blood Count (CBC)',
                  cost: '৳580',
                  duration: '35 minutes',
                  reportTime: '6-12 hours',
                  availability: 'Daily 7:00 AM - 10:00 PM',
                  department: 'Pathology Department',
                  fasting: 'Not Required',
                  rating: 4.6
                },
                {
                  id: 5,
                  name: 'Ibn Sina Hospital',
                  location: 'Kallyanpur, Dhaka',
                  phone: '+88-02-9002513',
                  services: ['CBC Test', 'Hematology Tests', 'Lab Tests'],
                  testName: 'Complete Blood Count (CBC)',
                  cost: '৳520',
                  duration: '40 minutes',
                  reportTime: '8-12 hours',
                  availability: 'Daily 6:00 AM - 11:00 PM',
                  department: 'Laboratory Services',
                  fasting: 'Not Required',
                  rating: 4.5
                },
                {
                  id: 6,
                  name: 'Green Life Medical College Hospital',
                  location: 'Panthapath, Dhaka',
                  phone: '+88-02-58151275',
                  services: ['CBC Test', 'Blood Screening', 'Medical Tests'],
                  testName: 'Complete Blood Count (CBC)',
                  cost: '৳600',
                  duration: '30 minutes',
                  reportTime: '6-10 hours',
                  availability: 'Daily 8:00 AM - 10:00 PM',
                  department: 'Clinical Pathology',
                  fasting: 'Not Required',
                  rating: 4.4
                }
              ];
            } else {
              // Filter from existing demo test centers data
              const allTestCenters = testCenters.length > 0 ? testCenters : [
                {
                  id: 1,
                  name: 'Square Hospitals Ltd.',
                  location: 'Panthapath, Dhaka',
                  phone: '+88-02-8159457',
                  services: ['Blood Tests', 'Pathology', 'Radiology', 'Cardiology'],
                  rating: 4.8
                },
                {
                  id: 2,
                  name: 'United Hospital Limited',
                  location: 'Gulshan, Dhaka',
                  phone: '+88-02-9883311',
                  services: ['Hematology', 'Lab Services', 'Imaging', 'Emergency'],
                  rating: 4.9
                },
                {
                  id: 3,
                  name: 'Apollo Hospitals Dhaka',
                  location: 'Bashundhara, Dhaka',
                  phone: '+88-10678',
                  services: ['Blood Analysis', 'Diagnostic Services', 'CT Scan', 'MRI'],
                  rating: 4.7
                },
                {
                  id: 4,
                  name: 'Labaid Specialized Hospital',
                  location: 'Dhanmondi, Dhaka',
                  phone: '+88-02-9611233',
                  services: ['Blood Count', 'Pathology', 'Biochemistry', 'Microbiology'],
                  rating: 4.6
                },
                {
                  id: 5,
                  name: 'Ibn Sina Hospital',
                  location: 'Kallyanpur, Dhaka',
                  phone: '+88-02-9002513',
                  services: ['Hematology Tests', 'Lab Tests', 'X-Ray', 'Ultrasound'],
                  rating: 4.5
                },
                {
                  id: 6,
                  name: 'Green Life Medical College Hospital',
                  location: 'Panthapath, Dhaka',
                  phone: '+88-02-58151275',
                  services: ['Blood Screening', 'Medical Tests', 'ECG', 'Endoscopy'],
                  rating: 4.4
                },
                {
                  id: 7,
                  name: 'Bangladesh Medical College Hospital',
                  location: 'Dhanmondi, Dhaka',
                  phone: '+88-02-9665188',
                  services: ['Clinical Pathology', 'Blood Tests', 'Urine Tests', 'Stool Tests'],
                  rating: 4.3
                },
                {
                  id: 8,
                  name: 'Holy Family Red Crescent Medical College Hospital',
                  location: 'Maghbazar, Dhaka',
                  phone: '+88-02-9337513',
                  services: ['Laboratory Medicine', 'Blood Bank', 'Histopathology', 'Cytology'],
                  rating: 4.2
                }
              ];
              
              // Filter based on search term
              searchResults = allTestCenters.filter(center => 
                center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                center.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                center.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
              );
            }
          }

        setFilteredResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setError(`Search failed. Please check if the backend server is running.`);
        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType, doctors, testCenters]);

  // Symptoms search functionality
  const handleSymptomsSearch = async () => {
    if (!symptomsQuery.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await symptomsAPI.searchDoctorsBySymptoms(symptomsQuery);
      if (response.data && response.data.doctorSuggestion) {
        setSymptomsResults(response.data.doctorSuggestion);
        setFilteredResults(response.data.doctorSuggestion);
      } else {
        setError('No doctor suggestions found for your symptoms.');
        setFilteredResults([]);
      }
    } catch (error) {
      console.error('Symptoms search error:', error);
      setError('Failed to search for doctors based on symptoms. Please try again.');
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchTerm('');
    setSymptomsQuery('');
    setError(null);
  };

  return (
    <div className="min-h-screen text-white" style={{backgroundColor: '#0B0B0C', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
      {/* Navigation */}
      <nav className="bg-zinc-900/95 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent animate-gradient bg-300% hover:bg-200%"
              style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                backgroundSize: '300% 300%',
                animation: 'gradient 6s ease infinite'
              }}
            >
              NiramoyAI
            </motion.div>
            
            <div className="flex items-center space-x-6">
              {isLoggedIn && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 text-zinc-300 hover:text-white transition-all duration-200 font-medium rounded-lg border border-transparent hover:border-zinc-700 bg-transparent hover:bg-zinc-800/50"
                  onClick={() => navigate('/diagnosis')}
                >
                  Diagnosis
                </motion.button>
              )}

              {isLoggedIn ? (
                <div className="relative profile-dropdown">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all duration-200"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <span>Profile</span>
                    <svg className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>

                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-2 z-50"
                    >
                      <button
                        className="w-full text-left px-4 py-2 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200 rounded-lg font-medium"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/dashboard');
                        }}
                      >
                        Dashboard
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200 rounded-lg font-medium"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/profile');
                        }}
                      >
                        Profile
                      </button>
                      <hr className="border-zinc-700 my-2" />
                      <button
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200 rounded-lg font-medium"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 text-zinc-300 hover:text-white transition-all duration-200 font-medium rounded-lg border border-transparent hover:border-zinc-700 bg-transparent hover:bg-zinc-800/50"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-black py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-blue-600/5"></div>
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight" 
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    backgroundSize: '200% 200%',
                    animation: 'gradient 8s ease infinite'
                  }}>
                AI-Powered
                <br />
                Healthcare
              </h1>
              <p className="text-xl text-zinc-400 mb-8 leading-relaxed font-medium" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', lineHeight: '1.5'}}>
                Advanced medical diagnosis, doctor recommendations, and comprehensive health insights powered by artificial intelligence.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
                            <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-semibold transition-all duration-200 text-lg shadow-xl hover:shadow-2xl animate-float"
                onClick={() => navigate(isLoggedIn ? '/diagnosis' : '/signup')}
              >
                {isLoggedIn ? 'Start Diagnosis' : 'Get Started'}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative -mt-16 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-zinc-900/95 border border-zinc-700/50 rounded-2xl p-8 backdrop-blur-lg shadow-2xl relative overflow-hidden"
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 animate-pulse">
              <div className="h-full w-full rounded-2xl bg-zinc-900/95"></div>
            </div>
            <div className="relative z-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-white" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
              Search Healthcare Providers
            </h2>
            
            {/* Search Type Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  searchType === 'symptoms'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
                onClick={() => handleSearchTypeChange('symptoms')}
              >
                Symptoms Search
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  searchType === 'doctors'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
                onClick={() => handleSearchTypeChange('doctors')}
              >
                Doctors
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  searchType === 'testCenters'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
                onClick={() => handleSearchTypeChange('testCenters')}
              >
                Test Centers
              </motion.button>
            </div>

            {/* Search Input */}
            {searchType === 'symptoms' ? (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    className="w-full p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none resize-none transition-all duration-200"
                    rows="4"
                    placeholder="Describe your symptoms... (e.g., headache, fever, chest pain)"
                    value={symptomsQuery}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSymptomsSearch();
                      }
                    }}
                    onChange={(e) => setSymptomsQuery(e.target.value)}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  onClick={handleSymptomsSearch}
                  
                  disabled={loading || !symptomsQuery.trim()}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Finding Doctors...
                    </div>
                  ) : (
                    'Find Doctors for Symptoms'
                  )}
                </motion.button>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200"
                  placeholder={`Search ${searchType === 'doctors' ? 'doctors by name, specialty, or location' : 'test centers by name, services, or location'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-12 text-white"
            style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}
          >
            {searchType === 'symptoms' ? 'Recommended Doctors' : 
             searchType === 'doctors' ? 'Available Doctors' : 'Test Centers'}
          </motion.h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-8"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition-all hover:shadow-lg"
                >
                  {/* Doctor/Test Center Card Content */}
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mr-4 overflow-hidden flex-shrink-0">
                      {searchType === 'doctors' || searchType === 'symptoms' ? (
                        item.imageFile ? (
                          <>
                            <img 
                              src={`data:${item.mimeType};base64,${item.imageFile}`}
                              alt={item.name || 'Doctor'}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                console.log('Image failed to load:', item.imageFile);
                                e.target.style.display = 'none';
                                e.target.parentNode.querySelector('.fallback-icon').style.display = 'block';
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:');
                              }}
                            />
                            <svg className="w-8 h-8 text-white fallback-icon" style={{display: 'none'}} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </>
                        ) : (
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        )
                      ) : (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.name 
                      || item?.doctor?.name
                        
                        }</h3>
                      {(item.degree || item?.doctor?.degree) && (
                        <p className="text-sm text-gray-400">{item.degree
                        || item?.doctor?.degree}</p>
                      )}
                      {item.rating && (
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-400 ml-2">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specialty/Services */}
                  {(item.specialty || item?.doctor?.specialization) && (
                    <div className="mb-3">
                      <span className="inline-block bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                        {item.specialty || item?.doctor?.specialization}
                      </span>
                    </div>
                  )}

                  {item.services && item.services.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {item.services.slice(0, 3).map((service, idx) => (
                          <span key={idx} className="inline-block bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs">
                            {service}
                          </span>
                        ))}
                        {item.services.length > 3 && (
                          <span className="text-xs text-gray-400">+{item.services.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hospital/Location */}
                  {(item.hospital || item?.doctor?.hospitalName)&& (
                    <p className="text-sm text-gray-300 mb-2">🏥 {item.hospital || item?.doctor?.hospitalName}</p>
                  )}
                  {item.location && (
                    <p className="text-sm text-gray-400 mb-2">📍 {item.location}</p>
                  )}

                  {/* Experience */}
                  {(item.experience|| item?.doctor?.experience) && (
                    <p className="text-sm text-gray-400 mb-3">⏱️ {item.experience || (item?.doctor?.experience + " years of")} experience</p>
                  )}

                  {/* Contact Info */}
                  {item.phone && (
                    <p className="text-sm text-gray-400 mb-2">📞 {item.phone}</p>
                  )}
                  {item.email && (
                    <p className="text-sm text-gray-400 mb-4">✉️ {item.email}</p>
                  )}

                  {/* Test-Specific Information (for test centers) */}
                  {searchType === 'testCenters' && item.testName && (
                    <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3 mb-4">
                      <h4 className="text-blue-300 font-semibold mb-2">🧪 {item.testName}</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {item.cost && (
                          <div className="flex items-center">
                            <span className="text-gray-400">💰 Cost:</span>
                            <span className="text-green-400 font-semibold ml-1">{item.cost}</span>
                          </div>
                        )}
                        {item.duration && (
                          <div className="flex items-center">
                            <span className="text-gray-400">⏱️ Duration:</span>
                            <span className="text-white ml-1">{item.duration}</span>
                          </div>
                        )}
                        {item.reportTime && (
                          <div className="flex items-center">
                            <span className="text-gray-400">📋 Report:</span>
                            <span className="text-white ml-1">{item.reportTime}</span>
                          </div>
                        )}
                        {item.fasting && (
                          <div className="flex items-center">
                            <span className="text-gray-400">🍽️ Fasting:</span>
                            <span className="text-white ml-1">{item.fasting}</span>
                          </div>
                        )}
                      </div>
                      {item.availability && (
                        <div className="mt-2 pt-2 border-t border-blue-700/30">
                          <span className="text-gray-400 text-xs">🕒 Available: </span>
                          <span className="text-white text-xs">{item.availability}</span>
                        </div>
                      )}
                      {item.department && (
                        <div className="mt-1">
                          <span className="text-gray-400 text-xs">🏥 Department: </span>
                          <span className="text-blue-300 text-xs">{item.department}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-md"
                      onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
                    >
                      Contact
                    </motion.button>
                    {item.profileLink && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-3 border border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg text-sm transition-all duration-200 bg-transparent hover:bg-zinc-800/50"
                        onClick={() => window.open(item.profileLink, '_blank')}
                      >
                        Profile
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredResults.length === 0 && (searchTerm || symptomsQuery) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                No {searchType === 'symptoms' ? 'doctors' : searchType} found
              </h3>
              <p className="text-zinc-500">
                Try adjusting your search terms or browse all available options.
              </p>
            </motion.div>
          )}
        </div>
      </section>
      {/* Features Section */}
      <section className="bg-zinc-950 py-24 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete Healthcare Ecosystem
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Advanced AI-powered platform bridging the gap between patients and healthcare providers
            </p>
          </motion.div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Symptom-Based Search",
                description: "Enter your symptoms and get matched with the right specialists, nearby doctors, and test centers using AI-powered recommendations.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "AI Diagnosis Review",
                description: "Upload prescriptions and health documents. Our AI explains diagnoses in simple terms and suggests next steps for better care.",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                title: "Health Knowledge Graph",
                description: "Automated creation of your personal health timeline and knowledge graph from uploaded documents and medical history.",
                gradient: "from-purple-500 to-indigo-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 h-full hover:border-zinc-700 transition-all duration-300 group-hover:shadow-2xl relative overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Advanced Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 rounded-3xl p-8 mb-16"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">Advanced Healthcare Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Context-Aware Chatbot",
                  description: "AI-powered assistant using your health data",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )
                },
                {
                  title: "Personal Dashboard",
                  description: "Visualize health trends and diagnosis timeline",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: "Doctor Access Portal",
                  description: "Professionals can access structured patient data",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  title: "Cost Estimation",
                  description: "Estimate treatment costs and required tests",
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                  <p className="text-zinc-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Powered by Modern Technology</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {[
                { name: "React.js" },
                { name: "Spring Boot" },
                { name: "AI/LLM" },
                { name: "Knowledge Graph" },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: 1.1, 
                    opacity: 1,
                    boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
                  }}
                  className="px-6 py-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="text-zinc-300 font-medium relative z-10">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4" 
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    backgroundSize: '200% 200%',
                    animation: 'gradient 4s ease infinite'
                  }}>
                NiramoyAI
              </h3>
              <p className="text-zinc-400 mb-6 max-w-md" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
                Your trusted AI-powered healthcare companion. Advanced medical insights, doctor recommendations, and comprehensive health management at your fingertips.
              </p>
              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-zinc-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="text-white text-sm font-bold">f</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-zinc-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="text-white text-sm font-bold">t</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-zinc-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="text-white text-sm font-bold">in</span>
                </motion.div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold mb-4" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>Services</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">AI Diagnosis</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Doctor Search</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Test Centers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Health Analytics</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>Company</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-500 text-sm" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
              © 2025 NiramoyAI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors">Privacy</a>
              <a href="#" className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors">Terms</a>
              <a href="#" className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <ScrollTop />
    </div>
  );
};

export default LandingPage;
