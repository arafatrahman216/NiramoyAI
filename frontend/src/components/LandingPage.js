import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doctorAPI, testCenterAPI, symptomsAPI } from '../services/api';
import AIChatbot, { ChatbotButton } from './AIChatbot';
import { useAuth } from '../context/AuthContext';

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
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-emerald-400"
            >
              NiramoyAI
            </motion.div>
            <div className="flex space-x-4">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-zinc-300 hover:text-white transition-colors"
                  onClick={() => navigate('/dashboard')}
                >
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline">{user.fullName || 'Profile'}</span>
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-emerald-500/25 overflow-hidden"
                    onClick={() => navigate('/signup')}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative">Sign Up</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-zinc-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-zinc-400 bg-clip-text text-transparent">
                Your personal assistant 
                <br />
                For better care
              </h1>
              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
Tell your symptoms, find the right doctor, book tests, and let AI guide your health journey
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-emerald-500/30 overflow-hidden"
                  onClick={() => navigate('/signup')}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <span className="relative flex items-center justify-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Get Started
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative px-6 py-3 bg-zinc-800/70 backdrop-blur-sm border border-zinc-600 hover:border-emerald-400 hover:bg-zinc-700/70 text-zinc-300 hover:text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden"
                  onClick={() => navigate('/diagnosis')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <span className="relative flex items-center justify-center gap-2 text-sm">
                    <span className="text-lg">🤖</span>
                    Ask AI Assistant
                  </span>
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-80 bg-gradient-to-br from-emerald-600/20 to-zinc-600/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-zinc-700">
                <svg className="w-32 h-32 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8 backdrop-blur-lg shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              Search Healthcare Providers
            </h2>
            
            {/* Search Type Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                  searchType === 'symptoms'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-600 hover:border-zinc-500'
                }`}
                onClick={() => handleSearchTypeChange('symptoms')}
              >
                {searchType === 'symptoms' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-100"></div>
                )}
                <span className="relative flex items-center gap-2">
                  🩺 Symptoms Search
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                  searchType === 'doctors'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-600 hover:border-zinc-500'
                }`}
                onClick={() => handleSearchTypeChange('doctors')}
              >
                {searchType === 'doctors' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-100"></div>
                )}
                <span className="relative flex items-center gap-2">
                  👨‍⚕️ Doctors
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                  searchType === 'testCenters'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-600 hover:border-zinc-500'
                }`}
                onClick={() => handleSearchTypeChange('testCenters')}
              >
                {searchType === 'testCenters' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-100"></div>
                )}
                <span className="relative flex items-center gap-2">
                  🧪 Test Centers
                </span>
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
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/25 overflow-hidden"
                  onClick={handleSymptomsSearch}
                  disabled={loading || !symptomsQuery.trim()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Finding Doctors...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Find Doctors for Symptoms
                      </span>
                    )}
                  </span>
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
                  className="w-full pl-10 pr-4 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
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
                  className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition-all"
                >
                  {/* Doctor/Test Center Card Content */}
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mr-4 overflow-hidden flex-shrink-0">
                      {searchType === 'doctors' || searchType === 'symptoms' ? (
                        item.image ? (
                          <>
                            <img 
                              src={item.image}
                              alt={item.name || 'Doctor'}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                console.log('Image failed to load:', item.image);
                                e.target.style.display = 'none';
                                e.target.parentNode.querySelector('.fallback-icon').style.display = 'block';
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:', item.image);
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
                          <span key={idx} className="inline-block bg-zinc-600/20 text-zinc-400 px-2 py-1 rounded text-xs">
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
                    <p className="text-sm text-zinc-300 mb-2">🏥 {item.hospital || item?.doctor?.hospitalName}</p>
                  )}
                  {item.location && (
                    <p className="text-sm text-zinc-400 mb-2">📍 {item.location}</p>
                  )}

                  {/* Experience */}
                  {(item.experience|| item?.doctor?.experience) && (
                    <p className="text-sm text-zinc-400 mb-3">⏱️ {item.experience || (item?.doctor?.experience + " years of")} experience</p>
                  )}

                  {/* Contact Info */}
                  {item.phone && (
                    <p className="text-sm text-zinc-400 mb-2">📞 {item.phone}</p>
                  )}
                  {item.email && (
                    <p className="text-sm text-zinc-400 mb-4">✉️ {item.email}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
                      onClick={() => navigate('/dashboard')}
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
      <section className="bg-zinc-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-white"
          >
            Why Choose NiramoyAI?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🩺",
                title: "Verified Doctors",
                description: "All doctors are verified and licensed professionals with proven track records."
              },
              {
                icon: "🧪",
                title: "Accredited Centers", 
                description: "Partner with only accredited test centers for accurate and reliable results."
              },
              {
                icon: "⭐",
                title: "Quality Care",
                description: "Access to high-quality healthcare services with patient satisfaction guarantee."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-emerald-400 mb-4"
              >
                NiramoyAI
              </motion.h3>
              <p className="text-zinc-400 mb-4 max-w-md">
                Your trusted healthcare companion. Find the best doctors and test centers near you with AI-powered assistance.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.118.112.422.085.534-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.160-1.507-.7-2.448-2.78-2.448-4.958 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017.016z"/>
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate('/login')}
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    Login
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate('/signup')}
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    Sign Up
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate('/diagnosis')}
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    AI Diagnosis
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate('/dashboard')}
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    Dashboard
                  </motion.button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    Help Center
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    Contact Us
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    Privacy Policy
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    Terms of Service
                  </motion.a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
            <p className="text-zinc-400">
              © 2024 NiramoyAI. All rights reserved. | Built with ❤️ for better healthcare
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <ScrollTop />

      {/* AI Chatbot Dialog */}
      <AIChatbot
        open={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
