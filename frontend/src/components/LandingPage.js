import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { doctorAPI, symptomsAPI } from '../services/api';
import hospitalsDatasetRaw from '../utils/all_hospitals_incremental_1755095601280.json';
import testCentersCsv from '../utils/test_centers.csv';
import { HospitalSearchInput, HospitalSearchResults } from './HospitalSearch';
import NearbyHospitalsMap from './HospitalMap/NearbyHospitalsMap';
import LanguageSwitcher from './LanguageSwitcher';

const getHospitalDisplayName = (item) => {
  if (!item) return '';

  if (typeof item.name === 'string' && item.name.trim()) {
    return item.name.trim();
  }

  if (typeof item.hospital === 'string' && item.hospital.trim()) {
    return item.hospital.trim();
  }

  if (typeof item?.doctor?.hospitalName === 'string' && item?.doctor?.hospitalName.trim()) {
    return item.doctor.hospitalName.trim();
  }

  return '';
};

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
  const { t } = useTranslation();
  
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
  const [hospitalSearchTerm, setHospitalSearchTerm] = useState('');
  const [hospitalPage, setHospitalPage] = useState(1);
  const [testCenterPage, setTestCenterPage] = useState(1);
  const [testCenterSort, setTestCenterSort] = useState('default');
  const hospitalsPerPage = 9;
  const testCentersPerPage = 9;
  
  const hospitalsDataset = useMemo(() => {
    const formatFeeRange = (value) => {
      if (!value) return 'Fee range unavailable';
      const trimmed = value.trim();
      if (!trimmed || trimmed.toLowerCase().includes('n/a')) {
        return 'Fee range unavailable';
      }

      const withoutCurrency = trimmed.replace(/৳/g, '').replace(/Taka/gi, '').trim();
      const parts = withoutCurrency
        .split('-')
        .map((part) => part.trim())
        .filter(Boolean);

      const sanitize = (part) => {
        if (!part) return null;
        const numeric = part.replace(/[^0-9.]/g, '');
        if (!numeric) return null;
        return `৳${numeric}`;
      };

      if (parts.length === 0) {
        return 'Fee range unavailable';
      }

      if (parts.length === 1) {
        const valueLabel = sanitize(parts[0]);
        return valueLabel || 'Fee range unavailable';
      }

      const minLabel = sanitize(parts[0]);
      const maxLabel = sanitize(parts[1]);

      if (minLabel && maxLabel) {
        return `${minLabel} – ${maxLabel}`;
      }

      return minLabel || maxLabel || 'Fee range unavailable';
    };

    return (hospitalsDatasetRaw || [])
      .filter((hospital) => hospital && hospital.name)
      .map((hospital, index) => {
        const feeRangeDisplay = formatFeeRange(hospital.feeRange);
        return {
          id: hospital.id || `hospital-${index}`,
          name: hospital.name.trim(),
          location: hospital.location?.trim() || 'Location not specified',
          email: hospital.email?.trim() || 'Not provided',
          profileUrl: hospital.profileurl || '#',
          feeRange: feeRangeDisplay,
        };
      });
  }, []);

  const parseTestCentersCsv = (csvText) => {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length <= 1) {
      return [];
    }

    const [, ...rows] = lines;
    return rows.map((line, index) => {
      const firstComma = line.indexOf(',');
      const secondComma = firstComma !== -1 ? line.indexOf(',', firstComma + 1) : -1;
      const thirdComma = secondComma !== -1 ? line.indexOf(',', secondComma + 1) : -1;

      if (firstComma === -1 || secondComma === -1 || thirdComma === -1) {
        return null;
      }

      const hospitalName = line.slice(0, firstComma).trim();
      const testName = line.slice(firstComma + 1, secondComma).trim();
      const category = line.slice(secondComma + 1, thirdComma).trim();
      const price = line.slice(thirdComma + 1).trim();

      const normalizedCategory = category || '';
      const numericPrice = price.replace(/[^0-9.]/g, '');
      const costLabel = numericPrice ? `৳${numericPrice}` : 'Price unavailable';

      return {
        id: `test-center-${index}`,
        name: hospitalName || 'Unknown Test Center',
        testName: testName || 'Test name unavailable',
        category: normalizedCategory,
        cost: costLabel,
        priceValue: numericPrice ? Number(numericPrice) : null,
        searchHospital: (hospitalName || '').toLowerCase(),
        searchTest: (testName || '').toLowerCase(),
      };
    }).filter(Boolean);
  };

  const buildUniqueHospitalSummaries = React.useCallback((centers) => {
    const summaryMap = new Map();

    centers.forEach((center) => {
      const key = center.name?.trim().toLowerCase();
      if (!key) return;

      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          name: center.name.trim(),
          testCount: 0,
          categories: new Set(),
        });
      }

      const summary = summaryMap.get(key);
      summary.testCount += 1;
      if (center.category) {
        summary.categories.add(center.category);
      }
    });

    return Array.from(summaryMap.values()).map((summary, index) => ({
      id: `unique-hospital-${index}`,
      name: summary.name,
      uniqueHospital: true,
      testCount: summary.testCount,
      categories: Array.from(summary.categories).slice(0, 4),
    }));
  }, []);

  const filteredHospitals = useMemo(() => {
    const term = hospitalSearchTerm.trim().toLowerCase();
    if (!term) {
      return hospitalsDataset;
    }

    return hospitalsDataset.filter((hospital) =>
      hospital.name.toLowerCase().includes(term) ||
      hospital.location.toLowerCase().includes(term)
    );
  }, [hospitalSearchTerm, hospitalsDataset]);

  const visibleHospitals = useMemo(() => {
    return filteredHospitals.slice(0, hospitalPage * hospitalsPerPage);
  }, [filteredHospitals, hospitalPage, hospitalsPerPage]);

  const hasMoreHospitals = visibleHospitals.length < filteredHospitals.length;
  const totalHospitals = filteredHospitals.length;
  const sortedTestCenterResults = useMemo(() => {
    if (searchType !== 'testCenters') return [];

    if (testCenterSort === 'default') {
      return filteredResults;
    }

    const copy = [...filteredResults];

    if (testCenterSort === 'nameAsc') {
      return copy.sort((a, b) =>
        getHospitalDisplayName(a).localeCompare(getHospitalDisplayName(b))
      );
    }

    if (testCenterSort === 'priceLowHigh' || testCenterSort === 'priceHighLow') {
      const isAscending = testCenterSort === 'priceLowHigh';

      copy.sort((a, b) => {
        const ascendingFallback = isAscending ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        const aPrice = a.priceValue ?? ascendingFallback;
        const bPrice = b.priceValue ?? ascendingFallback;

        if (aPrice === bPrice) {
          return getHospitalDisplayName(a).localeCompare(getHospitalDisplayName(b));
        }

        return isAscending ? aPrice - bPrice : bPrice - aPrice;
      });

      return copy;
    }

    return copy;
  }, [filteredResults, searchType, testCenterSort]);

  const visibleTestCenters = useMemo(() => {
    if (searchType !== 'testCenters') return [];
    return sortedTestCenterResults.slice(0, testCenterPage * testCentersPerPage);
  }, [sortedTestCenterResults, searchType, testCenterPage, testCentersPerPage]);

  const hasMoreTestCenters =
    searchType === 'testCenters' && visibleTestCenters.length < sortedTestCenterResults.length;
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadTestCenters = async () => {
      try {
        const response = await fetch(testCentersCsv);
        const text = await response.text();
        if (!isMounted) return;
        const parsedTestCenters = parseTestCentersCsv(text);
        setTestCenters(parsedTestCenters);
      } catch (err) {
        console.error('Failed to load test centers CSV:', err);
      }
    };

    loadTestCenters();

    return () => {
      isMounted = false;
    };
  }, []);

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
      if (searchType === 'symptoms' || searchType === 'hospitals') return; // Hospitals use local dataset

      setLoading(true);
      setError(null);

      try {
        if (searchType === 'doctors') {
          const response = await doctorAPI.getAllDoctors();
          const doctorsData = response.data?.data || response.data || [];
          setDoctors(doctorsData);
          setFilteredResults(doctorsData);
        } else if (searchType === 'testCenters') {
          setFilteredResults(testCenters);
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
  }, [searchType, testCenters]);

  // Search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (searchType === 'symptoms' || searchType === 'hospitals') return; // Hospitals handled locally
      
      if (!searchTerm.trim()) {
        if (searchType === 'testCenters') {
          const uniqueHospitals = buildUniqueHospitalSummaries(testCenters);
          setFilteredResults(uniqueHospitals);
          setTestCenterPage(1);
        } else {
          const results = searchType === 'doctors' ? doctors : testCenters;
          setFilteredResults(results);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let searchResults = [];
        
        if (searchType === 'doctors') {
          if (searchTerm == null || searchTerm.trim() == "") return;
          const response = await doctorAPI.searchDoctors(searchTerm);
          if (response.data && response.data) {
            searchResults = response.data || [];
          }
        } else {
          const normalizedTerm = searchTerm.trim().toLowerCase();
          const centers = testCenters;
          const uniqueRecords = new Map();

          centers.forEach((center) => {
            if (
              center.searchHospital.includes(normalizedTerm) ||
              center.searchTest.includes(normalizedTerm)
            ) {
              const key = `${center.searchHospital}|${center.searchTest}`;
              if (!uniqueRecords.has(key)) {
                uniqueRecords.set(key, center);
              }
            }
          });

          searchResults = Array.from(uniqueRecords.values());
          setTestCenterPage(1);
        }

        setFilteredResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setError(
          searchType === 'doctors'
            ? 'Search failed. Please check if the backend server is running.'
            : 'Search failed. Please try again.'
        );
        setFilteredResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType, doctors, testCenters, buildUniqueHospitalSummaries]);

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
    setHospitalSearchTerm('');
    setHospitalPage(1);
    setTestCenterPage(1);
    setTestCenterSort('default');
  };

  const handleHospitalSearchChange = (value) => {
    setHospitalSearchTerm(value);
    setHospitalPage(1);
  };

  const handleLoadMoreHospitals = () => {
    setHospitalPage((prev) => prev + 1);
  };

  const handleLoadMoreTestCenters = () => {
    setTestCenterPage((prev) => prev + 1);
  };

  const handleTestCenterSortChange = (value) => {
    setTestCenterSort(value);
    setTestCenterPage(1);
  };

  const handleContactClick = (item) => {
    if (searchType === 'testCenters') {
      const hospitalName = getHospitalDisplayName(item);
      if (hospitalName) {
        setSearchTerm(hospitalName);
        setTestCenterPage(1);
      }
      return;
    }

    navigate(isLoggedIn ? '/dashboard' : '/login');
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
              {t('navigation.logo')}
            </motion.div>
            
            <div className="flex items-center space-x-6">
              {isLoggedIn && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 text-zinc-300 hover:text-white transition-all duration-200 font-medium rounded-lg border border-transparent hover:border-zinc-700 bg-transparent hover:bg-zinc-800/50"
                  onClick={() => navigate('/diagnosis')}
                >
                  {t('navigation.diagnosis')}
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
                    <span>{t('navigation.profile')}</span>
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
                        {t('navigation.dashboard')}
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200 rounded-lg font-medium"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/profile');
                        }}
                      >
                        {t('navigation.profile')}
                      </button>
                      <hr className="border-zinc-700 my-2" />
                      <button
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200 rounded-lg font-medium"
                        onClick={handleLogout}
                      >
                        {t('common.logout')}
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
                    {t('navigation.login')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200"
                    onClick={() => navigate('/signup')}
                  >
                    {t('navigation.signup')}
                  </motion.button>
                </div>
              )}

              {/* Language Switcher */}
              <LanguageSwitcher />
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
                {t('hero.title')}
                <br />
                {t('hero.titleSecond')}
              </h1>
              <p className="text-xl text-zinc-400 mb-8 leading-relaxed font-medium" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', lineHeight: '1.5'}}>
                {t('hero.description')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-semibold transition-all duration-200 text-lg shadow-xl hover:shadow-2xl animate-float"
                  onClick={() => navigate(isLoggedIn ? '/diagnosis' : '/signup')}
                >
                  {isLoggedIn ? t('buttons.startDiagnosis') : t('buttons.getStarted')}
                </motion.button>
              </div>
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
              {t('search.title')}
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
                {t('search.symptoms')}
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
                {t('search.doctors')}
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
                {t('search.testCenters')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 border ${
                  searchType === 'hospitals'
                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg'
                    : 'border-emerald-500/40 bg-zinc-900/60 text-emerald-300 hover:bg-zinc-800/80 hover:text-emerald-200'
                }`}
                onClick={() => handleSearchTypeChange('hospitals')}
              >
                {t('search.hospitals')}
              </motion.button>
            </div>

            {/* Search Input */}
            {searchType === 'symptoms' ? (
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    className="w-full p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none resize-none transition-all duration-200"
                    rows="4"
                    placeholder={t('search.symptomPlaceholder')}
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
                      {t('search.findingDoctors')}
                    </div>
                  ) : (
                    t('search.findDoctorsButton')
                  )}
                </motion.button>
              </div>
            ) : searchType === 'hospitals' ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200"
                  placeholder={t('search.hospitalPlaceholder')}
                  value={hospitalSearchTerm}
                  onChange={(e) => handleHospitalSearchChange(e.target.value)}
                />
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
                  placeholder={searchType === 'doctors' ? t('search.doctorPlaceholder') : t('search.testCenterPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            {searchType === 'testCenters' && (
              <div className="mt-4 flex justify-end">
                <label className="text-sm text-zinc-400 flex items-center gap-3">
                  <span>{t('search.sortBy')}</span>
                  <select
                    className="bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none"
                    value={testCenterSort}
                    onChange={(e) => handleTestCenterSortChange(e.target.value)}
                  >
                    <option value="default">{t('search.sortDefault')}</option>
                    <option value="priceLowHigh">{t('search.sortPriceLow')}</option>
                    <option value="priceHighLow">{t('search.sortPriceHigh')}</option>
                    <option value="nameAsc">{t('search.sortName')}</option>
                  </select>
                </label>
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
            {searchType === 'symptoms'
              ? t('results.recommendedDoctors')
              : searchType === 'doctors'
              ? t('results.availableDoctors')
              : searchType === 'hospitals'
              ? t('results.hospitals')
              : t('results.testCenters')}
          </motion.h2>

          {searchType === 'hospitals' ? (
            <>
              <HospitalSearchResults
                hospitals={visibleHospitals}
                hasMore={hasMoreHospitals}
                onLoadMore={handleLoadMoreHospitals}
              />
              <NearbyHospitalsMap />
            </>
          ) : (
            <>
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(searchType === 'testCenters' ? visibleTestCenters : filteredResults).map((item, index) => {
                      const isTestCenterCard = searchType === 'testCenters';
                      const primaryButtonLabel = isTestCenterCard ? t('buttons.viewTests') : t('buttons.contact');

                      return (
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

                      {searchType === 'testCenters' && item.uniqueHospital && (
                        <div className="bg-purple-900/10 border border-purple-700/30 rounded-lg p-3 mb-4 text-sm text-purple-200">
                          <p className="font-semibold text-purple-300">
                            {item.testCount} diagnostic test{item.testCount === 1 ? '' : 's'} available
                          </p>
                          {item.categories && item.categories.length > 0 && (
                            <p className="mt-1 text-purple-200">
                              Popular categories: <span className="text-white">{item.categories.join(', ')}</span>
                            </p>
                          )}
                        </div>
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
                            {item.category && (
                              <div className="col-span-2 flex items-center">
                                <span className="text-gray-400">🏷️ Category:</span>
                                <span className="text-white ml-1">{item.category}</span>
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
                          onClick={() => handleContactClick(item)}
                        >
                          {primaryButtonLabel}
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
                      );
                    })}
                  </div>
                  {searchType === 'testCenters' && hasMoreTestCenters && (
                    <div className="mt-8 flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLoadMoreTestCenters}
                        className="px-6 py-3 border border-emerald-500/50 text-emerald-300 rounded-xl font-semibold hover:bg-emerald-500/10 transition-all"
                      >
                        {t('buttons.loadMore', { type: t('search.testCenters') })}
                      </motion.button>
                    </div>
                  )}
                </>
              )}

              {!loading && filteredResults.length === 0 && (searchTerm || symptomsQuery) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                    {searchType === 'symptoms' ? t('results.noDoctorsFound') : searchType === 'doctors' ? t('results.noDoctorsFound') : searchType === 'hospitals' ? t('results.noHospitalsFound') : t('results.noTestCentersFound')}
                  </h3>
                  <p className="text-zinc-500">
                    {t('results.tryAdjustingSearch')}
                  </p>
                </motion.div>
              )}
            </>
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
              {t('features.title')}
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: t('features.feature1Title'),
                description: t('features.feature1Desc'),
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: t('features.feature2Title'),
                description: t('features.feature2Desc'),
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                title: t('features.feature3Title'),
                description: t('features.feature3Desc'),
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
            <h3 className="text-2xl font-bold text-white text-center mb-8">{t('features.advancedTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: t('features.chatbotTitle'),
                  description: t('features.chatbotDesc'),
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )
                },
                {
                  title: t('features.dashboardTitle'),
                  description: t('features.dashboardDesc'),
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: t('features.doctorPortalTitle'),
                  description: t('features.doctorPortalDesc'),
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  title: t('features.costTitle'),
                  description: t('features.costDesc'),
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
            <h3 className="text-2xl font-bold text-white mb-8">{t('features.technologyTitle')}</h3>
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
                {t('footer.brand')}
              </h3>
              <p className="text-zinc-400 mb-6 max-w-md" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
                {t('footer.description')}
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
              <h4 className="text-white font-semibold mb-4" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>{t('footer.services')}</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.aiDiagnosis')}</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.doctorSearch')}</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.testCenters')}</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.healthAnalytics')}</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>{t('footer.company')}</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.aboutUs')}</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.termsOfService')}</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">{t('footer.contact')}</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-500 text-sm" style={{fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors">{t('footer.terms')}</a>
              <a href="#" className="text-zinc-500 hover:text-emerald-400 text-sm transition-colors">{t('footer.security')}</a>
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
