import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Rating,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Search,
  LocationOn,
  Phone,
  Star,
  HealthAndSafety,
  ArrowBack,
  ExitToApp,
  Person
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchDoctors = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSpecializations();
    fetchTopRatedDoctors();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/doctors/specializations');
      if (response.data.success) {
        setSpecializations(response.data.specializations);
      }
    } catch (err) {
      console.error('Error fetching specializations:', err);
    }
  };

  const fetchTopRatedDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/doctors/top-rated');
      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('query', searchQuery.trim());
      }
      if (selectedSpecialization) {
        params.append('specialization', selectedSpecialization);
      }

      const response = await axios.get(`http://localhost:8080/api/doctors/search?${params.toString()}`);
      
      if (response.data.success) {
        setDoctors(response.data.doctors);
      } else {
        setError('No doctors found');
      }
    } catch (err) {
      setError('Error searching doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialization('');
    fetchTopRatedDoctors();
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mr: 2, textTransform: 'none' }}
          >
            Back to Dashboard
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <HealthAndSafety sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
              NiramoyAI
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<Person />}
              onClick={handleProfileClick}
              sx={{ textTransform: 'none' }}
            >
              Profile
            </Button>
            <Button
              startIcon={<ExitToApp />}
              onClick={handleLogout}
              color="error"
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Find a Doctor
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Search for qualified doctors and book appointments
          </Typography>
        </Box>

        {/* Search Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search doctors"
                  placeholder="Doctor name, hospital, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    label="Specialization"
                  >
                    <MenuItem value="">All Specializations</MenuItem>
                    {specializations.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleClearFilters}
                  sx={{ textTransform: 'none' }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {loading ? 'Searching...' : `Found ${doctors.length} doctor(s)`}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {doctors.map((doctor) => (
              <Grid item xs={12} md={6} lg={4} key={doctor.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          mr: 2,
                          bgcolor: 'primary.main',
                          fontSize: '1.5rem'
                        }}
                      >
                        {doctor.user?.firstName?.charAt(0)}{doctor.user?.lastName?.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                        </Typography>
                        <Chip 
                          label={doctor.specialization} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      {doctor.isVerified && (
                        <Chip 
                          label="Verified" 
                          size="small" 
                          color="success"
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {doctor.qualification}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {doctor.experienceYears} years of experience
                    </Typography>

                    {doctor.hospitalAffiliation && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.hospitalAffiliation}
                        </Typography>
                      </Box>
                    )}

                    {doctor.user?.phoneNumber && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.user.phoneNumber}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating 
                        value={parseFloat(doctor.rating) || 0} 
                        readOnly 
                        size="small" 
                        precision={0.1}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({doctor.totalReviews} reviews)
                      </Typography>
                    </Box>

                    {doctor.aboutDoctor && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {doctor.aboutDoctor.length > 100 
                          ? doctor.aboutDoctor.substring(0, 100) + '...' 
                          : doctor.aboutDoctor
                        }
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="h6" color="primary.main">
                        ৳{doctor.consultationFee}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleBookAppointment(doctor.id)}
                        disabled={!doctor.isAvailable}
                        sx={{ textTransform: 'none' }}
                      >
                        {doctor.isAvailable ? 'Book Appointment' : 'Not Available'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && doctors.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No doctors found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchDoctors;
