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
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  LocationOn,
  VideoCall,
  Edit,
  Refresh,
  LocalHospital,
  Phone,
  Email,
  CheckCircle,
  Cancel,
  Schedule,
} from '@mui/icons-material';
import { appointmentAPI } from '../services/api';
import { format, isToday, parseISO } from 'date-fns';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editDialog, setEditDialog] = useState({ open: false, appointment: null });
  const [updating, setUpdating] = useState(false);
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchTodayAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getDoctorAppointments();
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
    }
  };

  const fetchTodayAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await appointmentAPI.getTodaysAppointments();
      if (response.data.success) {
        setTodayAppointments(response.data.data);
      } else {
        setError('Failed to fetch today\'s appointments');
      }
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      setError('Failed to fetch today\'s appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const updateData = {
        status: newStatus,
        ...(prescription && { prescription }),
        ...(notes && { notes })
      };

      const response = await appointmentAPI.updateAppointmentStatus(
        editDialog.appointment.id, 
        updateData
      );

      if (response.data.success) {
        await fetchAppointments();
        await fetchTodayAppointments();
        setEditDialog({ open: false, appointment: null });
        setPrescription('');
        setNotes('');
        setNewStatus('');
      } else {
        setError('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment');
    } finally {
      setUpdating(false);
    }
  };

  const openEditDialog = (appointment) => {
    setEditDialog({ open: true, appointment });
    setNewStatus(appointment.status);
    setPrescription(appointment.prescription || '');
    setNotes(appointment.notes || '');
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

  const AppointmentCard = ({ appointment, showActions = true }) => (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {appointment.patient.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointment.patient.email}
              </Typography>
              {appointment.patient.phoneNumber && (
                <Typography variant="body2" color="text.secondary">
                  {appointment.patient.phoneNumber}
                </Typography>
              )}
            </Box>
          </Box>
          <Chip
            label={appointment.status}
            color={getStatusColor(appointment.status)}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
          </Grid>

          <Grid item xs={12} sm={6}>
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
          </Grid>
        </Grid>

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
              Notes:
            </Typography>
            <Typography variant="body2">
              {appointment.notes}
            </Typography>
          </Box>
        )}

        {showActions && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              onClick={() => openEditDialog(appointment)}
            >
              Update
            </Button>
            {appointment.status === 'SCHEDULED' && (
              <>
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => {
                    setEditDialog({ open: true, appointment });
                    setNewStatus('COMPLETED');
                    setPrescription(appointment.prescription || '');
                    setNotes(appointment.notes || '');
                  }}
                >
                  Complete
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => {
                    setEditDialog({ open: true, appointment });
                    setNewStatus('CANCELLED');
                    setPrescription(appointment.prescription || '');
                    setNotes(appointment.notes || '');
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );

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
          onClick={() => {
            fetchAppointments();
            fetchTodayAppointments();
          }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab 
            label={`Today's Appointments (${todayAppointments.length})`} 
            icon={<Schedule />} 
            iconPosition="start"
          />
          <Tab 
            label={`Upcoming (${getUpcomingAppointments().length})`} 
            icon={<CalendarToday />} 
            iconPosition="start"
          />
          <Tab 
            label={`Past (${getPastAppointments().length})`} 
            icon={<LocalHospital />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Today's Appointments Tab */}
      {tabValue === 0 && (
        <Box>
          {todayAppointments.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Schedule sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No appointments today
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You have no scheduled appointments for today
                </Typography>
              </CardContent>
            </Card>
          ) : (
            todayAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </Box>
      )}

      {/* Upcoming Appointments Tab */}
      {tabValue === 1 && (
        <Box>
          {getUpcomingAppointments().length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <CalendarToday sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No upcoming appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You have no scheduled upcoming appointments
                </Typography>
              </CardContent>
            </Card>
          ) : (
            getUpcomingAppointments().map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </Box>
      )}

      {/* Past Appointments Tab */}
      {tabValue === 2 && (
        <Box>
          {getPastAppointments().length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <LocalHospital sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No past appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You have no completed or past appointments
                </Typography>
              </CardContent>
            </Card>
          ) : (
            getPastAppointments().map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                showActions={false}
              />
            ))
          )}
        </Box>
      )}

      {/* Edit/Update Appointment Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, appointment: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="NO_SHOW">No Show</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Prescription"
              multiline
              rows={3}
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Enter prescription details..."
            />

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter consultation notes..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, appointment: null })}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained"
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorAppointments;
