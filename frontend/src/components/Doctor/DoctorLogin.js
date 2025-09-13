import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  HealthAndSafety,
  LocalHospital
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { redirectBasedOnRole, hasRole } from '../../utils/roleRedirect';

const DoctorLogin = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Dark theme styles for form inputs
  const darkTextFieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#27272a',
      color: '#ffffff',
      '& fieldset': { borderColor: '#3f3f46' },
      '&:hover fieldset': { borderColor: '#10b981' },
      '&.Mui-focused fieldset': { borderColor: '#10b981' },
    },
    '& .MuiInputLabel-root': { color: '#a1a1aa' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
    '& .MuiSelect-icon': { color: '#a1a1aa' },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.username.trim() || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        // Check if user has doctor role
        const userData = JSON.parse(localStorage.getItem('user'));
        if (hasRole(userData, 'DOCTOR')) {
          navigate('/doctor/dashboard');
        } else {
          setLocalError('Access denied: Doctor privileges required');
        }
      }
    } catch (err) {
      setLocalError('Login failed. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: "#0a0a0a", // Dark background like SearchInput
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            backgroundColor: "#171717", // Dark card background
            border: "1px solid #404040", // Gray border
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              background: "#27272a", // Dark header background
              p: 4,
              textAlign: 'center'
            }}
          >
            <LocalHospital sx={{ fontSize: 48, color: "#10b981", mb: 2 }} />
            <Typography variant="h4" component="h1" sx={{ color: "#ffffff", fontWeight: 600 }}>
              Doctor Portal
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#e5e5e5", mt: 1 }}>
              Access your medical practice dashboard
            </Typography>
          </Box>

          <CardContent sx={{ p: 4, backgroundColor: "#18181b" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <HealthAndSafety sx={{ mr: 2, color: "#10b981" }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#10b981" }}>
                NiramoyAI
              </Typography>
            </Box>

            {(error || localError) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {localError || error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username or Email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                autoFocus
                sx={darkTextFieldStyle}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                sx={darkTextFieldStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
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
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  backgroundColor: '#10b981',
                  '&:hover': {
                    backgroundColor: '#059669',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: "#e5e5e5" }}>
                  Need access to doctor portal?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/doctor/signup')}
                    sx={{ textDecoration: 'none', color: "#10b981", "&:hover": { color: "#059669" } }}
                  >
                    Doctor Sign Up
                  </Link>
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: "#e5e5e5" }}>
                  Patient?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/login')}
                    sx={{ textDecoration: 'none', color: "#10b981", "&:hover": { color: "#059669" } }}
                  >
                    Patient Login
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DoctorLogin;
