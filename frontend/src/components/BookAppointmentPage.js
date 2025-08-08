import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  Star,
} from '@mui/icons-material';
import { appointmentAPI, doctorAPI } from '../services/api';

const BookAppointmentPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [consultationType, setConsultationType] = useState('IN_PERSON');
  const [symptoms, setSymptoms] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, appointmentDate]);

  useEffect(() => {
    if (selectedDoctor) {
      const doctor = doctors.find(d => d.id === parseInt(selectedDoctor));
      setDoctorDetails(doctor);
    }
  }, [selectedDoctor, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors();
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors');
    }
  };

  const fetchAvailableSlots = async () => {
    setSlotsLoading(true);
    try {
      const response = await appointmentAPI.getAvailableTimeSlots(selectedDoctor, appointmentDate);
      if (response.data.success) {
        setAvailableSlots(response.data.availableSlots || []);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
      // Generate some default slots if API fails
      const defaultSlots = [
        '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00',
        '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00'
      ];
      setAvailableSlots(defaultSlots);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const appointmentData = {
        doctorId: parseInt(selectedDoctor),
        appointmentDate,
        appointmentTime,
        consultationType,
        symptoms
      };

      const response = await appointmentAPI.bookAppointment(appointmentData);
      if (response.data.success) {
        setSuccess('Appointment booked successfully!');
        // Reset form
        setSelectedDoctor('');
        setDoctorDetails(null);
        setAppointmentDate('');
        setAppointmentTime('');
        setSymptoms('');
        setAvailableSlots([]);
      } else {
        setError(response.data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSlot = (timeString) => {
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return timeString;
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Book Appointment
      </Typography>

      <Grid container spacing={4}>
        {/* Main Booking Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Doctor</InputLabel>
                    <Select
                      value={selectedDoctor}
                      label="Select Doctor"
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      {doctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {doctor.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1">
                                Dr. {doctor.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {doctor.specialization}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Appointment Date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: today }}
                    InputProps={{
                      startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Appointment Time</InputLabel>
                    <Select
                      value={appointmentTime}
                      label="Appointment Time"
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      disabled={!selectedDoctor || !appointmentDate}
                      startAdornment={<AccessTime sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      {slotsLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Loading slots...
                        </MenuItem>
                      ) : availableSlots.length === 0 ? (
                        <MenuItem disabled>No available slots</MenuItem>
                      ) : (
                        availableSlots.map((slot) => (
                          <MenuItem key={slot} value={slot}>
                            {formatTimeSlot(slot)}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Consultation Type</FormLabel>
                    <RadioGroup
                      row
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value)}
                    >
                      <FormControlLabel
                        value="IN_PERSON"
                        control={<Radio />}
                        label="In Person"
                      />
                      <FormControlLabel
                        value="ONLINE"
                        control={<Radio />}
                        label="Online"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Symptoms / Reason for Visit"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Please describe your symptoms or reason for the appointment..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleBookAppointment}
                    disabled={loading || !selectedDoctor || !appointmentDate || !appointmentTime}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1 }} />
                        Booking...
                      </>
                    ) : (
                      'Book Appointment'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Doctor Details Sidebar */}
        <Grid item xs={12} md={4}>
          {doctorDetails && (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
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
                    {doctorDetails.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    Dr. {doctorDetails.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {doctorDetails.specialization}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <Star sx={{ color: 'gold', mr: 0.5 }} />
                    <Typography variant="body2">
                      {doctorDetails.rating || '4.5'} ({doctorDetails.reviews || '120'} reviews)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Experience
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctorDetails.experience || '10+ years'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Education
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctorDetails.education || 'MBBS, MD'}
                  </Typography>
                </Box>

                {doctorDetails.achievements && doctorDetails.achievements.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Specialties
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {doctorDetails.achievements.map((achievement, index) => (
                        <Chip 
                          key={index}
                          label={achievement}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Consultation Fee
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ৳{doctorDetails.consultationFee || '500'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookAppointmentPage;
