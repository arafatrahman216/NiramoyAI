import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Avatar,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  ArrowBack,
  Edit,
  Save,
  Cancel,
  LocalHospital
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../services/api';
import axios from 'axios';

const DoctorProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/doctor/profile`);

      if (response.data.success) {
        const profile = response.data.doctor;
        console.log('Fetched doctor profile:', profile);
        setDoctorProfile(profile);
        setEditData({
          specialization: profile.specialization || '',
          qualification: profile.degree || '',
          experienceYears: profile.experience || 0,
          consultationFee: profile.consultationFee || 0,
          hospitalAffiliation: profile.hospitalName || '',
          phoneNumber: profile.phoneNumber || '',
          aboutDoctor: profile.about || '',
          isAvailable: profile.isAvailable || true
        });
      }
    } catch (err) {
      setError('Failed to load doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/doctor/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/doctor/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.patch(`${API_BASE_URL}/doctor/profile`, editData);

      if (response.data.success) {
        setDoctorProfile(response.data.doctor);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (doctorProfile) {
      setEditData({
        specialization: doctorProfile.specialization || '',
        qualification: doctorProfile.degree || '',
        experienceYears: doctorProfile.experience || 0,
        consultationFee: doctorProfile.consultationFee || 0,
        hospitalAffiliation: doctorProfile.hospitalName || '',
        phoneNumber: doctorProfile.phoneNumber || '',
        aboutDoctor: doctorProfile.about || '',
        isAvailable: doctorProfile.isAvailable || true
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading && !doctorProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
            <LocalHospital sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
              NiramoyAI - Doctor Portal
            </Typography>
          </Box>
          <Button
            onClick={handleLogout}
            color="error"
            sx={{ textTransform: 'none' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Doctor Profile Settings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your professional information
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* Profile Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mr: 3,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem'
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  Dr. {user?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  @{user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  License: {doctorProfile?.licenseNumber}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={doctorProfile?.isVerified ? 'Verified' : 'Pending Verification'} 
                    color={doctorProfile?.isVerified ? 'success' : 'warning'} 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={doctorProfile?.available ? 'Available' : 'Not Available'} 
                    color={doctorProfile?.available ? 'success' : 'error'} 
                    size="small" 
                  />
                </Box>
              </Box>
              <Box>
                {!isEditing ? (
                  <Button
                    startIcon={<Edit />}
                    variant="outlined"
                    onClick={handleEdit}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<Save />}
                      variant="contained"
                      onClick={handleSave}
                      disabled={loading}
                      sx={{ textTransform: 'none' }}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                    <Button
                      startIcon={<Cancel />}
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{ textTransform: 'none' }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Profile Details */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  name="specialization"
                  value={isEditing ? editData.specialization : doctorProfile?.specialization || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Experience Years"
                  name="experienceYears"
                  type="number"
                  value={isEditing ? editData.experienceYears : doctorProfile?.experience || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Qualification"
                  name="qualification"
                  value={isEditing ? editData.qualification : doctorProfile?.degree || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Consultation Fee (৳)"
                  name="consultationFee"
                  type="number"
                  value={isEditing ? editData.consultationFee : doctorProfile?.consultationFee || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={isEditing ? editData.phoneNumber : doctorProfile?.phoneNumber || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Hospital Affiliation"
                  name="hospitalAffiliation"
                  value={isEditing ? editData.hospitalAffiliation : doctorProfile?.hospitalName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="About Doctor"
                  name="aboutDoctor"
                  value={isEditing ? editData.aboutDoctor : doctorProfile?.about || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder="Brief description about your expertise, approach to treatment, etc."
                />
              </Grid>
              {isEditing && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Availability Status</InputLabel>
                    <Select
                      name="isAvailable"
                      value={editData.isAvailable}
                      onChange={handleInputChange}
                      label="Availability Status"
                    >
                      <MenuItem value={true}>Available</MenuItem>
                      <MenuItem value={false}>Not Available</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {/* Statistics */}
            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                Profile Statistics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {doctorProfile?.rating || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rating
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary.main">
                      {doctorProfile?.totalReviews || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reviews
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {doctorProfile?.experience || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Years Experience
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      ৳{doctorProfile?.consultationFee || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Consultation Fee
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DoctorProfile;
