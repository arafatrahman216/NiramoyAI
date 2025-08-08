import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Chip,
  Avatar,
  Rating,
  Fade,
  Slide,
  Zoom,
  AppBar,
  Toolbar,
  IconButton,
  useScrollTrigger,
  Fab,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  LocalHospital,
  Science,
  Star,
  LocationOn,
  Phone,
  Email,
  KeyboardArrowUp,
  Person,
  Login as LoginIcon,
  PersonAdd,
  SmartToy,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doctorAPI, testCenterAPI } from '../services/api';
import AIChatbot, { ChatbotButton } from './AIChatbot';

// Scroll to top component
function ScrollTop({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('doctors'); // 'doctors' or 'testCenters'
  const [doctors, setDoctors] = useState([]);
  const [testCenters, setTestCenters] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const navigate = useNavigate();

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (searchType === 'doctors') {
          const response = await doctorAPI.getAllDoctors();
          const doctorsData = response.data?.data || response.data || [];
          console.log('Doctors API response:', response.data);
          setDoctors(doctorsData);
          setFilteredResults(doctorsData);
        } else {
          const response = await testCenterAPI.getAllTestCenters();
          const testCentersData = response.data?.data || response.data || [];
          console.log('Test Centers API response:', response.data);
          setTestCenters(testCentersData);
          setFilteredResults(testCentersData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError(`Failed to load ${searchType}. Please check if the backend server is running.`);
        // Clear results when API fails
        setFilteredResults([]);
        if (searchType === 'doctors') {
          setDoctors([]);
        } else {
          setTestCenters([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchType]);

  // Search functionality with API integration
  useEffect(() => {
    const performSearch = async () => {
      // If no search term, show all results
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
          const response = await doctorAPI.searchDoctors(searchTerm);
          if (response.data && response.data.success) {
            searchResults = response.data.data || [];
          } else {
            throw new Error('Doctor search API failed');
          }
        } else {
          const response = await testCenterAPI.searchTestCenters(searchTerm);
          if (response.data && response.data.success) {
            searchResults = response.data.data || [];
          } else {
            throw new Error('Test center search API failed');
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

    // Debounce search to avoid too many API calls
    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType, doctors, testCenters]);

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchTerm('');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}
          >
            NiramoyAI
          </Typography>
          <Button
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{ mr: 1 }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                >
                  Find the Best
                  <br />
                  Healthcare Near You
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Search for qualified doctors and accredited test centers.
                  Your health journey starts here.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                    onClick={() => navigate('/signup')}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<SmartToy />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                    }}
                    onClick={() => setChatbotOpen(true)}
                  >
                    Ask AI Assistant
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <LocalHospital sx={{ fontSize: 120, opacity: 0.7 }} />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* Search Section */}
      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>
        <Fade in timeout={1000}>
          <Card elevation={8} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Search Healthcare Providers
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
                  <Chip
                    icon={<LocalHospital />}
                    label="Doctors"
                    onClick={() => handleSearchTypeChange('doctors')}
                    variant={searchType === 'doctors' ? 'filled' : 'outlined'}
                    color="primary"
                    sx={{ fontSize: '1rem', py: 2 }}
                  />
                  <Chip
                    icon={<Science />}
                    label="Test Centers"
                    onClick={() => handleSearchTypeChange('testCenters')}
                    variant={searchType === 'testCenters' ? 'filled' : 'outlined'}
                    color="primary"
                    sx={{ fontSize: '1rem', py: 2 }}
                  />
                </Box>
              </Box>

              <TextField
                fullWidth
                placeholder={`Search ${searchType === 'doctors' ? 'doctors by name, specialty, or location' : 'test centers by name, services, or location'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '1.1rem',
                  },
                }}
              />
            </CardContent>
          </Card>
        </Fade>
      </Container>

      {/* Results Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          {searchType === 'doctors' ? 'Available Doctors' : 'Test Centers'}
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredResults.map((item, index) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Slide
                direction="up"
                in
                timeout={500 + index * 100}
                style={{ transformOrigin: '0 0 0' }}
              >
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          mr: 2,
                          bgcolor: 'primary.main',
                        }}
                      >
                        {searchType === 'doctors' ? (
                          <Person />
                        ) : (
                          <LocalHospital />
                        )}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {item.name}
                        </Typography>
                        {item.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={item.rating} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              {item.rating}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {searchType === 'doctors' ? (
                      <>
                        {item.specialty && (
                          <Chip
                            label={item.specialty}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        )}
                        {item.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{item.location}</Typography>
                          </Box>
                        )}
                        {item.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{item.phone}</Typography>
                          </Box>
                        )}
                        {item.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{item.email}</Typography>
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {item.experience && (
                            <Chip
                              label={`${item.experience} exp`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          <Chip
                            label={item.available ? 'Available' : 'Busy'}
                            size="small"
                            color={item.available ? 'success' : 'error'}
                          />
                        </Box>
                      </>
                    ) : (
                      <>
                        {item.services && item.services.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            {item.services.map((service, index) => (
                              <Chip
                                key={`${service}-${index}`}
                                label={service}
                                size="small"
                                variant="outlined"
                                sx={{ m: 0.25 }}
                              />
                            ))}
                          </Box>
                        )}
                        {item.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{item.location}</Typography>
                          </Box>
                        )}
                        {item.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{item.phone}</Typography>
                          </Box>
                        )}
                        {item.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{item.email}</Typography>
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {item.openHours && (
                            <Chip
                              label={item.openHours}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {item.accredited && (
                            <Chip
                              label="Accredited"
                              size="small"
                              color="success"
                            />
                          )}
                        </Box>
                      </>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => navigate('/signup')}
                    >
                      Contact {searchType === 'doctors' ? 'Doctor' : 'Center'}
                    </Button>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
        )}

        {!loading && filteredResults.length === 0 && searchTerm && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No {searchType} found matching your search.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search terms or browse all {searchType}.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
            Why Choose NiramoyAI?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <LocalHospital sx={{ fontSize: 48 }} />,
                title: 'Verified Doctors',
                description: 'All doctors are verified and licensed professionals with proven track records.',
              },
              {
                icon: <Science sx={{ fontSize: 48 }} />,
                title: 'Accredited Centers',
                description: 'Partner with only accredited test centers for accurate and reliable results.',
              },
              {
                icon: <Star sx={{ fontSize: 48 }} />,
                title: 'Quality Care',
                description: 'Access to high-quality healthcare services with patient satisfaction guarantee.',
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      bgcolor: 'transparent',
                      height: '100%',
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            NiramoyAI
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.8 }}>
            Your trusted healthcare companion. Find the best doctors and test centers near you.
          </Typography>
        </Container>
      </Box>

      {/* Scroll to top */}
      <ScrollTop>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>

      {/* Floating AI Chatbot Button */}
      <ChatbotButton onClick={() => setChatbotOpen(true)} />

      {/* AI Chatbot Dialog */}
      <AIChatbot
        open={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
      />
    </Box>
  );
};

export default LandingPage;
