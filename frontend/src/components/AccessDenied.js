import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Lock, Home, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccessDenied = ({ message, redirectTo, redirectLabel }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRedirect = () => {
    // COMMENTED OUT - Access denied redirects temporarily disabled
    /*
    if (redirectTo) {
      navigate(redirectTo);
    } else if (user?.role==='ADMIN') {
      navigate('/admin/dashboard');
    } else if (user?.role==='DOCTOR') {
      navigate('/doctor/dashboard');
    } else {
      navigate('/dashboard');
    }
    */
    
    // Temporarily disabled - no redirects
    console.log('Access denied redirect disabled');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
        }}
      >
        <Lock
          sx={{
            fontSize: 80,
            color: 'error.main',
            mb: 3,
          }}
        />
        
        <Typography variant="h4" gutterBottom color="error">
          Access Denied
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
          {message || 'You do not have permission to access this page.'}
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
          {user?.roles?.includes('ROLE_DOCTOR') && 
            'As a doctor, you can only access the doctor dashboard and related pages.'
          }
          {user?.roles?.includes('ROLE_ADMIN') && 
            'As an admin, you can only access the admin dashboard and related pages.'
          }
          {!user?.roles?.includes('ROLE_DOCTOR') && !user?.roles?.includes('ROLE_ADMIN') && 
            'As a patient, you can only access patient dashboard and related pages.'
          }
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={handleRedirect}
            size="large"
          >
            {redirectLabel || 'Go to Dashboard'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            size="large"
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AccessDenied;
