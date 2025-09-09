import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { redirectBasedOnRole } from '../../utils/roleRedirect';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    adminKey: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const { adminRegister, loading, error } = useAuth();
  const navigate = useNavigate();

  // Dark theme styles for form inputs
  const darkTextFieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#27272a',
      color: '#ffffff',
      borderRadius: '8px',
      transition: 'all 0.2s ease-in-out',
      '& fieldset': { 
        borderColor: '#3f3f46',
        borderWidth: '1.5px'
      },
      '&:hover fieldset': { 
        borderColor: '#10b981',
        borderWidth: '1.5px'
      },
      '&.Mui-focused fieldset': { 
        borderColor: '#10b981',
        borderWidth: '2px',
        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
      },
    },
    '& .MuiInputLabel-root': { 
      color: '#a1a1aa',
      fontWeight: 500
    },
    '& .MuiInputLabel-root.Mui-focused': { 
      color: '#10b981',
      fontWeight: 600
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: '#a1a1aa'
    },
    '& .MuiInputBase-input': {
      padding: '14px 16px'
    },
    '& .MuiFormHelperText-root': {
      color: '#a1a1aa'
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await adminRegister(formData);
    if (success) {
      // Get user data and redirect based on role
      const userData = JSON.parse(localStorage.getItem('user'));
      redirectBasedOnRole(userData, navigate);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: "#0a0a0a", // Dark background
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 2,
      }}
    >
      <Container component="main" maxWidth="md">
        <Card sx={{
          backgroundColor: "#171717", // Dark card background
          border: "1px solid #404040", // Gray border
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          borderRadius: 3
        }}>
          <CardContent sx={{ p: 4, backgroundColor: "#18181b" }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <AdminPanelSettings
                sx={{
                  fontSize: 48,
                  color: '#10b981',
                  mb: 2,
                }}
              />
              <Typography component="h1" variant="h4" sx={{ color: '#ffffff', fontWeight: 600 }} gutterBottom>
                Admin Registration
              </Typography>
              <Typography variant="body1" sx={{ color: '#e5e5e5' }} textAlign="center">
                Create an admin account to manage the system
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {/* Personal Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: "#e5e5e5", mb: 3, fontWeight: 600, borderBottom: "1px solid #3f3f46", pb: 1 }}>
                  Personal Information
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Name Fields */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                      value={formData.firstName}
                      onChange={handleChange}
                      variant="outlined"
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      variant="outlined"
                      sx={darkTextFieldStyle}
                    />
                  </Grid>

                  {/* Contact Information */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="phoneNumber"
                      label="Phone Number"
                      name="phoneNumber"
                      autoComplete="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      variant="outlined"
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Account Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: "#e5e5e5", mb: 3, fontWeight: 600, borderBottom: "1px solid #3f3f46", pb: 1 }}>
                  Account Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Admin Username"
                      name="username"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleChange}
                      variant="outlined"
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      variant="outlined"
                      sx={darkTextFieldStyle}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#a1a1aa' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Admin Verification Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: "#e5e5e5", mb: 3, fontWeight: 600, borderBottom: "1px solid #3f3f46", pb: 1 }}>
                  Admin Verification
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="adminKey"
                      label="Admin Key"
                      type={showAdminKey ? 'text' : 'password'}
                      id="adminKey"
                      value={formData.adminKey}
                      onChange={handleChange}
                      variant="outlined"
                      helperText="Contact system administrator for admin key (default: admin123)"
                      sx={darkTextFieldStyle}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle admin key visibility"
                              onClick={() => setShowAdminKey(!showAdminKey)}
                              edge="end"
                              sx={{ color: '#a1a1aa' }}
                            >
                              {showAdminKey ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5,
                  backgroundColor: "#10b981",
                  color: "#ffffff",
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#059669",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)"
                  },
                  "&:disabled": {
                    backgroundColor: "#3f3f46",
                    color: "#71717a",
                  },
                  transition: "all 0.2s ease-in-out"
                }}
                disabled={loading}
                size="large"
              >
                {loading ? 'Creating Account...' : 'Register as Admin'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#e5e5e5' }}>
                  Already have an admin account?{' '}
                  <Link
                    to="/admin/login"
                    style={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ color: '#e5e5e5', mt: 1 }}>
                  <Link
                    to="/signup"
                    style={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Register as User Instead
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminRegister;
