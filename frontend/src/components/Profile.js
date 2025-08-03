import React, { useState } from 'react';
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
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { 
  ArrowBack,
  Edit,
  Save,
  Cancel,
  HealthAndSafety,
  AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
  };

  // Check if user is admin
  const isAdmin = user?.roles && user.roles.includes('ROLE_ADMIN');

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
      const response = await axios.put('http://localhost:8080/api/user/profile', editData);
      
      if (response.data.success) {
        // Update the user data in auth context and localStorage
        const updatedUserData = response.data.user;
        updateUser(updatedUserData);
        
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Update editData with the new data
        setEditData({
          firstName: updatedUserData.firstName || '',
          lastName: updatedUserData.lastName || '',
          email: updatedUserData.email || '',
          phoneNumber: updatedUserData.phoneNumber || '',
        });
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
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
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
            {isAdmin && (
              <Button
                startIcon={<AdminPanelSettings />}
                onClick={handleAdminDashboard}
                variant="contained"
                color="secondary"
                sx={{ textTransform: 'none' }}
              >
                Admin Dashboard
              </Button>
            )}
            <Button
              onClick={handleLogout}
              color="error"
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Profile Settings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your account information
          </Typography>
        </Box>

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
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  @{user?.username}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={user?.status || 'Active'} 
                    color="success" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  {user?.roles && user.roles.map((role, index) => (
                    <Chip 
                      key={index}
                      label={role.replace('ROLE_', '')} 
                      variant="outlined" 
                      size="small" 
                      sx={{ 
                        mr: 1,
                        cursor: role === 'ROLE_ADMIN' ? 'pointer' : 'default',
                        '&:hover': role === 'ROLE_ADMIN' ? {
                          backgroundColor: 'secondary.light',
                          color: 'red'
                        } : {}
                      }}
                      color={role === 'ROLE_ADMIN' ? 'secondary' : 'default'}
                      onClick={role === 'ROLE_ADMIN' ? handleAdminDashboard : undefined}
                    />
                  ))}
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
                      {loading ? <CircularProgress size={16} /> : 'Save'}
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

            <Divider sx={{ mb: 4 }} />

            {/* Success/Error Messages */}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Profile Form */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={isEditing ? editData.firstName : user?.firstName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={isEditing ? editData.lastName : user?.lastName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={isEditing ? editData.email : user?.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={isEditing ? editData.phoneNumber : user?.phoneNumber || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={user?.username || ''}
                  disabled
                  variant="filled"
                  helperText="Username cannot be changed"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Member Since"
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  disabled
                  variant="filled"
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Alert severity="info" sx={{ mt: 3 }}>
                Note: Some changes may require email verification.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Profile;
