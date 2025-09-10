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
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    adminKey: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const { adminLogin, loading, error } = useAuth();
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
    
    const success = await adminLogin(formData.username, formData.password, formData.adminKey);
    if (success) {
      navigate('/admin/dashboard');
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
      <Container component="main" maxWidth="sm">
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
                Admin Portal
              </Typography>
              <Typography variant="body1" sx={{ color: '#e5e5e5' }} textAlign="center">
                Sign in to access the admin dashboard
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Admin Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                sx={darkTextFieldStyle}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
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

              <TextField
                margin="normal"
                required
                fullWidth
                name="adminKey"
                label="Admin Key"
                type={showAdminKey ? 'text' : 'password'}
                id="adminKey"
                value={formData.adminKey}
                onChange={handleChange}
                variant="outlined"
                helperText="Contact system administrator for admin key"
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
                {loading ? 'Signing In...' : 'Sign In as Admin'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#e5e5e5' }}>
                  Need admin access?{' '}
                  <Link
                    to="/admin/register"
                    style={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Register as Admin
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ color: '#e5e5e5', mt: 1 }}>
                  <Link
                    to="/login"
                    style={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Back to User Login
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

export default AdminLogin;
