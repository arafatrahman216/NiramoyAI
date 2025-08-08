import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  LocationOn,
  VideoCall,
  Cancel,
  Refresh,
  LocalHospital,
} from '@mui/icons-material';
import { appointmentAPI } from '../services/api';
import { format } from 'date-fns';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialog, setCancelDialog] = useState({ open: false, appointmentId: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await appointmentAPI.getPatientAppointments();
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    setCancelling(true);
    try {
      const response = await appointmentAPI.cancelAppointment(cancelDialog.appointmentId);
      if (response.data.success) {
        await fetchAppointments(); // Refresh the list
        setCancelDialog({ open: false, appointmentId: null });
      } else {
        setError('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'NO_SHOW':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (timeString) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  const canCancelAppointment = (appointment) => {
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
    const now = new Date();
    const hoursDiff = (appointmentDateTime - now) / (1000 * 60 * 60);
    
    return appointment.status === 'SCHEDULED' && hoursDiff > 24; // Can cancel if more than 24 hours away
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(`${apt.appointmentDate}T${apt.appointmentTime}`);
      return aptDate >= now && apt.status === 'SCHEDULED';
    }).sort((a, b) => new Date(`${a.appointmentDate}T${a.appointmentTime}`) - new Date(`${b.appointmentDate}T${b.appointmentTime}`));
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(`${apt.appointmentDate}T${apt.appointmentTime}`);
      return aptDate < now || apt.status !== 'SCHEDULED';
    }).sort((a, b) => new Date(`${b.appointmentDate}T${b.appointmentTime}`) - new Date(`${a.appointmentDate}T${a.appointmentTime}`));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Appointments
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchAppointments}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {appointments.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <LocalHospital sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No appointments found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You haven't booked any appointments yet
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Upcoming Appointments */}
          {getUpcomingAppointments().length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Upcoming Appointments
              </Typography>
              <Grid container spacing={3}>
                {getUpcomingAppointments().map((appointment) => (
                  <Grid item xs={12} md={6} key={appointment.id}>
                    <Card elevation={2}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {appointment.doctor.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {appointment.doctor.specialization}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatDate(appointment.appointmentDate)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatTime(appointment.appointmentTime)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          {appointment.consultationType === 'IN_PERSON' ? (
                            <LocationOn fontSize="small" color="action" />
                          ) : (
                            <VideoCall fontSize="small" color="action" />
                          )}
                          <Typography variant="body2">
                            {appointment.consultationType === 'IN_PERSON' ? 'In Person' : 'Online'}
                          </Typography>
                        </Box>

                        {appointment.symptoms && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Symptoms:
                            </Typography>
                            <Typography variant="body2">
                              {appointment.symptoms}
                            </Typography>
                          </Box>
                        )}

                        {appointment.consultationFee && (
                          <Typography variant="body2" color="primary" gutterBottom>
                            Fee: ৳{appointment.consultationFee}
                          </Typography>
                        )}

                        {canCancelAppointment(appointment) && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => setCancelDialog({ open: true, appointmentId: appointment.id })}
                            sx={{ mt: 1 }}
                          >
                            Cancel
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Past Appointments */}
          {getPastAppointments().length > 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Past Appointments
              </Typography>
              <Grid container spacing={3}>
                {getPastAppointments().map((appointment) => (
                  <Grid item xs={12} md={6} key={appointment.id}>
                    <Card elevation={1} sx={{ opacity: 0.8 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'grey.400' }}>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {appointment.doctor.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {appointment.doctor.specialization}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatDate(appointment.appointmentDate)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatTime(appointment.appointmentTime)}
                          </Typography>
                        </Box>

                        {appointment.prescription && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Prescription:
                            </Typography>
                            <Typography variant="body2">
                              {appointment.prescription}
                            </Typography>
                          </Box>
                        )}

                        {appointment.notes && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Doctor's Notes:
                            </Typography>
                            <Typography variant="body2">
                              {appointment.notes}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, appointmentId: null })}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, appointmentId: null })}>
            Keep Appointment
          </Button>
          <Button 
            onClick={handleCancelAppointment} 
            color="error" 
            variant="contained"
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientAppointments;
