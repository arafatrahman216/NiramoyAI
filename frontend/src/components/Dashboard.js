import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Person, 
  ExitToApp,
  HealthAndSafety,
  AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
  };

  // Check if user is admin
  const isAdmin = user?.roles && user.roles.includes('ROLE_ADMIN');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
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
            Welcome back, {user?.firstName}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's your healthcare dashboard overview
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* User Info Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  @{user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                {user?.phoneNumber && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user.phoneNumber}
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={user?.status || 'Active'} 
                    color="success" 
                    size="small" 
                  />
                </Box>
                {user?.roles && user.roles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {user.roles.map((role, index) => (
                      <Chip 
                        key={index}
                        label={role.replace('ROLE_', '')} 
                        variant="outlined" 
                        size="small" 
                        sx={{ 
                          mr: 1, 
                          mb: 1,
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
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    0
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Health Records
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary.main" gutterBottom>
                    0
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Appointments
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    0
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Medications
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    0
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Reminders
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{ py: 2, textTransform: 'none' }}
                      onClick={() => navigate('/search-doctors')}
                    >
                      Find Doctors
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{ py: 2, textTransform: 'none' }}
                    >
                      Add Health Record
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{ py: 2, textTransform: 'none' }}
                    >
                      Schedule Appointment
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{ py: 2, textTransform: 'none' }}
                    >
                      View Reports
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{ py: 2, textTransform: 'none' }}
                    >
                      AI Analysis
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
