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
  Avatar,
  Grid,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  LocalHospital,
  Person,
  ExitToApp,
  Event,
  People,
  Star,
  TrendingUp,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      
      // Fetch doctor profile
      const profileResponse = await axios.get(`${API_BASE_URL}/doctor/profile`);
      setDoctorProfile(profileResponse.data.doctor);

      // Fetch dashboard stats
      const statsResponse = await axios.get(`${API_BASE_URL}/doctor/dashboard/stats`);
      setStats(statsResponse.data.stats);

      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const appointmentsResponse = await axios.get(`${API_BASE_URL}/doctor/appointments?startDate=${today}&endDate=${today}`);
      setAppointments(appointmentsResponse.data.appointments);

    } catch (err) {
      setError('Failed to load doctor dashboard data');
      console.error('Error fetching doctor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/doctor/login');
  };

  const handleProfileClick = () => {
    navigate('/doctor/profile');
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      case 'NO_SHOW': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
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
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <LocalHospital sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
              NiramoyAI - Doctor Portal
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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome back, Dr. {user?.firstName}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's your medical practice overview for today
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Doctor Info Card */}
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
                  {user?.name?.charAt(0)}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Dr. {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {doctorProfile?.specialization}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {doctorProfile?.degree}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {doctorProfile?.hospitalName}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={doctorProfile?.available ? 'Available' : 'Not Available'} 
                    color={doctorProfile?.available ? 'success' : 'error'} 
                    size="small" 
                  />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star sx={{ color: 'gold', mr: 1 }} />
                  <Typography variant="body2">
                    {doctorProfile?.rating || 0} ({doctorProfile?.totalReviews || 0} reviews)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Event sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    {stats?.todayAppointments || 0}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Today's Appointments
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Schedule sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h4" color="secondary.main" gutterBottom>
                    {stats?.upcomingAppointments || 0}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Upcoming Appointments
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" color="success.main" gutterBottom>
                    {stats?.totalCompletedAppointments || 0}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Patients Treated
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" color="warning.main" gutterBottom>
                    {doctorProfile?.experience || 0}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Years of Experience
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Today's Appointments */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Today's Appointments
                </Typography>
                {appointments.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Time</TableCell>
                          <TableCell>Patient</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Symptoms</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>{formatTime(appointment.appointmentTime)}</TableCell>
                            <TableCell>
                              {appointment.patient?.firstName} {appointment.patient?.lastName}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={appointment.consultationType} 
                                size="small" 
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={appointment.status} 
                                size="small" 
                                color={getStatusColor(appointment.status)}
                              />
                            </TableCell>
                            <TableCell>
                              {appointment.symptoms ? 
                                (appointment.symptoms.length > 50 ? 
                                  appointment.symptoms.substring(0, 50) + '...' : 
                                  appointment.symptoms
                                ) : '-'
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No appointments scheduled for today
                  </Typography>
                )}
              </CardContent>
            </Card>
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
                      onClick={() => navigate('/doctor/appointments')}
                    >
                      View All Appointments
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{ py: 2, textTransform: 'none' }}
                      onClick={() => navigate('/doctor/schedule')}
                    >
                      Manage Schedule
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{ py: 2, textTransform: 'none' }}
                      onClick={() => navigate('/doctor/patients')}
                    >
                      Patient Records
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{ py: 2, textTransform: 'none' }}
                      onClick={() => navigate('/doctor/profile')}
                    >
                      Update Profile
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

export default DoctorDashboard;

