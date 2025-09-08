import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  RadioGroup,
  Radio,
} from '@mui/material';
import {
  Schedule,
  Add,
  Edit,
  Delete,
  AccessTime,
  CalendarToday,
  Refresh,
  Save,
  PersonAdd,
  Person,
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { appointmentAPI } from '../../services/api';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scheduleDialog, setScheduleDialog] = useState({ open: false, editing: null });
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [appointmentDialog, setAppointmentDialog] = useState({ open: false });
  
  // Form states for schedule
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [consultationDuration, setConsultationDuration] = useState(30);
  const [maxPatientsPerSlot, setMaxPatientsPerSlot] = useState(1);
  const [consultationFee, setConsultationFee] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // Form states for appointment creation
  const [patientIdentifier, setPatientIdentifier] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [consultationType, setConsultationType] = useState('IN_PERSON');
  const [appointmentStatus, setAppointmentStatus] = useState('SCHEDULED');

  const daysOfWeek = [
    { value: 'MONDAY', label: 'Monday' },
    { value: 'TUESDAY', label: 'Tuesday' },
    { value: 'WEDNESDAY', label: 'Wednesday' },
    { value: 'THURSDAY', label: 'Thursday' },
    { value: 'FRIDAY', label: 'Friday' },
    { value: 'SATURDAY', label: 'Saturday' },
    { value: 'SUNDAY', label: 'Sunday' },
  ];

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await appointmentAPI.getDoctorSchedule();
      if (response.data.success) {
        setSchedule(response.data.data);
      } else {
        setError('Failed to fetch schedule');
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  const openScheduleDialog = (scheduleItem = null) => {
    if (scheduleItem) {
      // Editing existing schedule
      setSelectedDays([scheduleItem.dayOfWeek]);
      setStartTime(new Date(`2000-01-01T${scheduleItem.startTime}`));
      setEndTime(new Date(`2000-01-01T${scheduleItem.endTime}`));
      setConsultationDuration(scheduleItem.consultationDuration || 30);
      setMaxPatientsPerSlot(scheduleItem.maxPatientsPerSlot || 1);
      setConsultationFee(scheduleItem.consultationFee || '');
      setIsAvailable(scheduleItem.isAvailable);
      setScheduleDialog({ open: true, editing: scheduleItem });
    } else {
      // Adding new schedule
      resetForm();
      setScheduleDialog({ open: true, editing: null });
    }
  };

  const resetForm = () => {
    setSelectedDays([]);
    setStartTime(null);
    setEndTime(null);
    setConsultationDuration(30);
    setMaxPatientsPerSlot(1);
    setConsultationFee('');
    setIsAvailable(true);
  };

  const handleDayChange = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleCreateAppointment = async () => {
    setSaving(true);
    setError('');

    try {
      const appointmentData = {
        patientIdentifier,
        appointmentDate,
        appointmentTime,
        symptoms,
        consultationType,
        status: appointmentStatus
      };

      const response = await appointmentAPI.createAppointmentForPatient(appointmentData);
      
      if (response.data.success) {
        // Reset form
        setPatientIdentifier('');
        setAppointmentDate('');
        setAppointmentTime('');
        setSymptoms('');
        setConsultationType('IN_PERSON');
        setAppointmentStatus('SCHEDULED');
        
        alert('Appointment created successfully!');
      } else {
        setError(response.data.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError(error.response?.data?.message || 'Failed to create appointment');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!startTime || !endTime || selectedDays.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const scheduleData = {
        daysOfWeek: selectedDays,
        startTime: format(startTime, 'HH:mm:ss'),
        endTime: format(endTime, 'HH:mm:ss'),
        consultationDuration,
        maxPatientsPerSlot,
        consultationFee: parseFloat(consultationFee) || 0,
        isAvailable
      };

      let response;
      if (scheduleDialog.editing) {
        // Update existing schedule
        response = await appointmentAPI.updateDoctorSchedule(scheduleDialog.editing.id, scheduleData);
      } else {
        // Create new schedule
        response = await appointmentAPI.createDoctorSchedule(scheduleData);
      }

      if (response.data.success) {
        await fetchSchedule();
        setScheduleDialog({ open: false, editing: null });
        resetForm();
      } else {
        setError('Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      setError('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await appointmentAPI.deleteDoctorSchedule(scheduleId);
      if (response.data.success) {
        await fetchSchedule();
      } else {
        setError('Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setError('Failed to delete schedule');
    }
  };

  const formatTime = (timeString) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  const groupScheduleByDay = () => {
    const grouped = {};
    daysOfWeek.forEach(day => {
      grouped[day.value] = schedule.filter(s => s.dayOfWeek === day.value);
    });
    return grouped;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Doctor Management
        </Typography>

        <Card sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="My Schedule" 
              icon={<Schedule />} 
              iconPosition="start"
            />
            <Tab 
              label="Create Appointment" 
              icon={<PersonAdd />} 
              iconPosition="start"
            />
          </Tabs>

          {/* Schedule Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  My Schedule
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchSchedule}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => openScheduleDialog()}
                  >
                    Add Schedule
                  </Button>
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {schedule.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <Schedule sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No schedule configured
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Set up your availability schedule to allow patients to book appointments
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => openScheduleDialog()}
                    >
                      Add Schedule
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {daysOfWeek.map((day) => {
                    const daySchedules = groupScheduleByDay()[day.value] || [];
                    return (
                      <Grid item xs={12} md={6} lg={4} key={day.value}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {day.label}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            {daySchedules.length === 0 ? (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                No schedule set
                              </Typography>
                            ) : (
                              <List dense>
                                {daySchedules.map((scheduleItem) => (
                                  <ListItem key={scheduleItem.id} divider>
                                    <ListItemText
                                      primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <AccessTime fontSize="small" />
                                          <Typography variant="body2">
                                            {formatTime(scheduleItem.startTime)} - {formatTime(scheduleItem.endTime)}
                                          </Typography>
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="caption" display="block">
                                      Duration: {scheduleItem.consultationDuration}min
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      Fee: ৳{scheduleItem.consultationFee || 0}
                                    </Typography>
                                    <Typography 
                                      variant="caption" 
                                      display="block"
                                      color={scheduleItem.isAvailable ? 'success.main' : 'error.main'}
                                    >
                                      {scheduleItem.isAvailable ? 'Available' : 'Unavailable'}
                                    </Typography>
                                  </Box>
                                }
                              />
                              <ListItemSecondaryAction>
                                <IconButton 
                                  size="small" 
                                  onClick={() => openScheduleDialog(scheduleItem)}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteSchedule(scheduleItem.id)}
                                >
                                  <Delete />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    )}

    {/* Create Appointment Tab */}
    {tabValue === 1 && (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create Appointment for Patient
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create an appointment for a patient by entering their username or email
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Patient Username or Email"
              value={patientIdentifier}
              onChange={(e) => setPatientIdentifier(e.target.value)}
              placeholder="Enter patient's username or email"
              helperText="Patient must be registered in the system"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Appointment Date"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ 
                min: new Date().toISOString().split('T')[0] 
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Appointment Time"
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Consultation Type</InputLabel>
              <Select
                value={consultationType}
                label="Consultation Type"
                onChange={(e) => setConsultationType(e.target.value)}
              >
                <MenuItem value="IN_PERSON">In Person</MenuItem>
                <MenuItem value="ONLINE">Online</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={appointmentStatus}
                label="Status"
                onChange={(e) => setAppointmentStatus(e.target.value)}
              >
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Symptoms / Notes"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Patient symptoms, notes, or reason for appointment..."
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonAdd />}
              onClick={handleCreateAppointment}
              disabled={saving || !patientIdentifier || !appointmentDate || !appointmentTime}
              fullWidth
            >
              {saving ? 'Creating...' : 'Create Appointment'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )}
  </Card>

        {/* Schedule Dialog */}
        <Dialog 
          open={scheduleDialog.open} 
          onClose={() => setScheduleDialog({ open: false, editing: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {scheduleDialog.editing ? 'Edit Schedule' : 'Add Schedule'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Select Days
              </Typography>
              <FormGroup row sx={{ mb: 3 }}>
                {daysOfWeek.map((day) => (
                  <FormControlLabel
                    key={day.value}
                    control={
                      <Checkbox
                        checked={selectedDays.includes(day.value)}
                        onChange={() => handleDayChange(day.value)}
                      />
                    }
                    label={day.label}
                  />
                ))}
              </FormGroup>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={setStartTime}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePicker
                    label="End Time"
                    value={endTime}
                    onChange={setEndTime}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Consultation Duration (minutes)</InputLabel>
                    <Select
                      value={consultationDuration}
                      label="Consultation Duration (minutes)"
                      onChange={(e) => setConsultationDuration(e.target.value)}
                    >
                      <MenuItem value={15}>15 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={45}>45 minutes</MenuItem>
                      <MenuItem value={60}>60 minutes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Patients per Slot"
                    type="number"
                    value={maxPatientsPerSlot}
                    onChange={(e) => setMaxPatientsPerSlot(parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1, max: 10 }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Consultation Fee (৳)"
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
                inputProps={{ min: 0, step: 50 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                  />
                }
                label="Available for appointments"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScheduleDialog({ open: false, editing: null })}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSchedule} 
              variant="contained"
              disabled={saving}
              startIcon={<Save />}
            >
              {saving ? 'Saving...' : 'Save Schedule'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default DoctorSchedule;
