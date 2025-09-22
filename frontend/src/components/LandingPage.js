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
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
      onClick={scrollTop}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  );
}

const LandingPage = () => {
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
          const response = await testCenterAPI.getAllTestCenters();
          const testCentersData = response.data?.data || response.data || [];
          setTestCenters(testCentersData);
          setFilteredResults(testCentersData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError(`Failed to load ${searchType}. Please check if the backend server is running.`);
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
          const response = await testCenterAPI.searchTestCenters(searchTerm);
          if (response.data && response.data.success) {
            searchResults = response.data.data || [];
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
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navigation */}
      <nav className="bg-zinc-900/95 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"
            >
              NiramoyAI
            </motion.div>
            
            <div className="flex items-center space-x-6">
              {isLoggedIn && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
                  onClick={() => navigate('/diagnosis')}
                >
                  🩺 Diagnosis
                </motion.button>
              )}

              {isLoggedIn ? (
                <div className="relative profile-dropdown">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
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
                        className="w-full text-left px-4 py-2 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/dashboard');
                        }}
                      >
                        📊 Dashboard
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/profile');
                        }}
                      >
                        👤 Profile
                      </button>
                      <hr className="border-zinc-700 my-2" />
                      <button
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-zinc-700 hover:text-red-300 transition-colors"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered
                <br />
                Healthcare
              </h1>
              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
                onClick={() => navigate(isLoggedIn ? '/diagnosis' : '/signup')}
              >
                {isLoggedIn ? ' Start Diagnosis' : 'Get Started'}
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
            className="bg-zinc-900/95 border border-zinc-700/50 rounded-2xl p-8 backdrop-blur-lg shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              Search Healthcare Providers
            </h2>
            
            {/* Search Type Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  searchType === 'symptoms'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
                onClick={() => handleSearchTypeChange('symptoms')}
              >
                🩺 Symptoms Search
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  searchType === 'doctors'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
                onClick={() => handleSearchTypeChange('doctors')}
              >
                👨‍⚕️ Doctors
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  searchType === 'testCenters'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
                onClick={() => handleSearchTypeChange('testCenters')}
              >
                🧪 Test Centers
              </motion.button>
            </div>

            {/* Search Input */}
            {searchType === 'symptoms' ? (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    className="w-full p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
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
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-full pl-10 pr-4 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`Search ${searchType === 'doctors' ? 'doctors by name, specialty, or location' : 'test centers by name, services, or location'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
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

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
                      onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
                    >
                      Contact
                    </motion.button>
                    {item.profileLink && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 border border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg text-sm transition-colors"
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
                icon: "🔍",
                title: "Symptom-Based Search",
                description: "Enter your symptoms and get matched with the right specialists, nearby doctors, and test centers using AI-powered recommendations.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "🧠",
                title: "AI Diagnosis Review",
                description: "Upload prescriptions and health documents. Our AI explains diagnoses in simple terms and suggests next steps for better care.",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: "📊",
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
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 h-full hover:border-zinc-700 transition-all duration-300 group-hover:shadow-2xl">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
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
                  icon: "💬",
                  title: "Context-Aware Chatbot",
                  description: "AI-powered assistant using your health data"
                },
                {
                  icon: "📱",
                  title: "Personal Dashboard",
                  description: "Visualize health trends and diagnosis timeline"
                },
                {
                  icon: "👩‍⚕️",
                  title: "Doctor Access Portal",
                  description: "Professionals can access structured patient data"
                },
                {
                  icon: "💰",
                  title: "Cost Estimation",
                  description: "Estimate treatment costs and required tests"
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
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
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
                { name: "React.js", icon: "⚛️" },
                { name: "Spring Boot", icon: "🍃" },
                { name: "AI/LLM", icon: "🤖" },
                { name: "Knowledge Graph", icon: "🕸️" },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-emerald-500/50 transition-all"
                >
                  <span className="text-xl">{tech.icon}</span>
                  <span className="text-zinc-300 font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">NiramoyAI</h3>
          <p className="text-zinc-400">
            Your trusted AI-powered healthcare companion. Advanced medical insights at your fingertips.
          </p>
        </div>
      </footer>

      {/* Scroll to top */}
      <ScrollTop />
    </div>
  );
};

export default LandingPage;
