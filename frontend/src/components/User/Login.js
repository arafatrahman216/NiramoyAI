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
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { redirectBasedOnRole } from '../../utils/roleRedirect';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, logout, loading, error } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      const success = await login(username, password);
      if (success) {
        // Get user data and check if admin
        const userData = JSON.parse(localStorage.getItem('user'));
        
        // Block admin users from normal login
        if (userData.role && userData.role === 'ADMIN') {
          // Log them out immediately
          logout();
          alert('Admin users must use the Admin Portal to login.');
          return;
        }
        
        redirectBasedOnRole(userData, navigate);
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
          maxWidth: 440,
          backgroundColor: "#171717", // Dark card background
          border: "1px solid #404040", // Gray border
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          borderRadius: 3
        }}>
          <CardContent sx={{ p: 4, backgroundColor: "#18181b" }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff', fontWeight: 600 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: '#e5e5e5' }}>
                Sign in to your NiramoyAI account
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
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                disabled={loading || !username.trim() || !password.trim()}
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
                  'Sign In'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#e5e5e5' }}>
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/signup"
                    underline="none"
                    sx={{ fontWeight: 600, color: '#10b981', '&:hover': { color: '#059669' } }}
                  >
                    Sign up
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ color: '#e5e5e5', mt: 1 }}>
                  Administrator?{' '}
                  <Link
                    component={RouterLink}
                    to="/admin/login"
                    underline="none"
                    sx={{ fontWeight: 600, color: '#10b981', '&:hover': { color: '#059669' } }}
                  >
                    Admin Portal
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

export default Login;
