import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Lock, 
  Email, 
  Phone 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { redirectBasedOnRole } from '../../utils/roleRedirect';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signup, login, logout, loading, error } = useAuth();
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim() && 
        formData.email.trim() && formData.username.trim() && 
        formData.password.trim()) {
      const success = await signup(formData);
      if (success) {
        // Auto-login after successful signup
        alert('Account created successfully! Logging you in...');
        const loginSuccess = await login(formData.username, formData.password);
        if (loginSuccess) {
          // The login function will automatically show onboarding modal for new users
          navigate('/', { replace: true });
        } else {
          // If auto-login fails, redirect to login page
          navigate('/login', { replace: true });
        }
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: "#0a0a0a", // Dark background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ 
          width: '100%', 
          maxWidth: 480,
          backgroundColor: "#171717", // Dark card background
          border: "1px solid #404040", // Gray border
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          borderRadius: 3
        }}>
          <CardContent sx={{ p: 4, backgroundColor: "#18181b" }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff', fontWeight: 600 }}>
                Create Account
              </Typography>
              <Typography variant="body1" sx={{ color: '#e5e5e5' }}>
                Join NiramoyAI to get started
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    type='text'
                    value={formData.name}
                    margin="normal"
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    sx={darkTextFieldStyle}
                  />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
                sx={darkTextFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#a1a1aa' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
                sx={darkTextFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#a1a1aa' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                margin="normal"
                disabled={loading}
                sx={darkTextFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: '#a1a1aa' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                disabled={loading}
                sx={darkTextFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#a1a1aa' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={loading}
                        sx={{ color: '#a1a1aa' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !formData.name.trim() || !formData.email.trim() || !formData.username.trim() || !formData.password.trim()}
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
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#e5e5e5' }}>
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    underline="none"
                    sx={{ fontWeight: 600, color: '#10b981', '&:hover': { color: '#059669' } }}
                  >
                    Sign in
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

export default Signup;
