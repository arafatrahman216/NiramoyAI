import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  VideoCall,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { appointmentAPI } from '../services/api';

const BookAppointment = ({ open, onClose, doctor, onSuccess }) => {
  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: null,
    appointmentTime: '',
    symptoms: '',
    consultationType: 'IN_PERSON',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (appointmentData.appointmentDate && doctor) {
      fetchAvailableSlots();
    }
  }, [appointmentData.appointmentDate, doctor]);

  const fetchAvailableSlots = async () => {
    setSlotsLoading(true);
    try {
      const dateString = appointmentData.appointmentDate ? appointmentData.appointmentDate.toISOString().split('T')[0] : '';
      const response = await appointmentAPI.getAvailableTimeSlots(doctor.id, dateString);
      if (response.data.success) {
        setAvailableSlots(response.data.availableSlots);
      } else {
        setError('Failed to fetch available time slots');
        // Provide default slots if API fails
        const defaultSlots = [
          '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00',
          '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00'
        ];
        setAvailableSlots(defaultSlots);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setError('Failed to fetch available time slots');
      // Provide default slots if API fails
      const defaultSlots = [
        '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00',
        '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00'
      ];
      setAvailableSlots(defaultSlots);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!appointmentData.appointmentDate || !appointmentData.appointmentTime) {
      setError('Please select date and time');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const bookingData = {
        doctorId: doctor.id,
        appointmentDate: appointmentData.appointmentDate ? appointmentData.appointmentDate.toISOString().split('T')[0] : '',
        appointmentTime: appointmentData.appointmentTime,
        symptoms: appointmentData.symptoms,
        consultationType: appointmentData.consultationType,
      };

      const response = await appointmentAPI.bookAppointment(bookingData);

      if (response.data.success) {
        setSuccess('Appointment booked successfully!');
        setTimeout(() => {
          onSuccess && onSuccess(response.data.appointment);
          handleClose();
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAppointmentData({
      appointmentDate: null,
      appointmentTime: '',
      symptoms: '',
      consultationType: 'IN_PERSON',
    });
    setAvailableSlots([]);
    setError('');
    setSuccess('');
    onClose();
  };

  const handleInputChange = (field, value) => {
    setAppointmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (!doctor) return null;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday color="primary" />
            <Typography variant="h6">Book Appointment</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
          )}
          {/* Doctor Info */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6">{doctor.name}</Typography>
            <Typography variant="body2" color="text.secondary">{doctor.specialty}</Typography>
            <Typography variant="body2" color="text.secondary">{doctor.location}</Typography>
            {doctor.consultationFee && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Consultation Fee: ৳{doctor.consultationFee}
              </Typography>
            )}
          </Box>
          <Grid container spacing={3}>
            {/* Date Selection */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Appointment Date"
                value={appointmentData.appointmentDate}
                onChange={(newValue) => handleInputChange('appointmentDate', newValue)}
                shouldDisableDate={isDateDisabled}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            {/* Consultation Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom>Consultation Type</Typography>
                <RadioGroup
                  value={appointmentData.consultationType}
                  onChange={(e) => handleInputChange('consultationType', e.target.value)}
                  row
                >
                  <FormControlLabel
                    value="IN_PERSON"
                    control={<Radio />}
                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LocationOn fontSize="small" />In Person</Box>}
                  />
                  <FormControlLabel
                    value="ONLINE"
                    control={<Radio />}
                    label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><VideoCall fontSize="small" />Online</Box>}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            {/* Time Slots */}
            {appointmentData.appointmentDate && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Available Time Slots</Typography>
                {slotsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>
                ) : availableSlots.length > 0 ? (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {availableSlots.map((slot) => (
                      <Chip
                        key={slot}
                        label={slot}
                        onClick={() => handleInputChange('appointmentTime', slot)}
                        color={appointmentData.appointmentTime === slot ? 'primary' : 'default'}
                        variant={appointmentData.appointmentTime === slot ? 'filled' : 'outlined'}
                        icon={<AccessTime />}
                        clickable
                      />
                    ))}
                  </Box>
                ) : (
                  <Alert severity="info">No available time slots for the selected date</Alert>
                )}
              </Grid>
            )}
            {/* Symptoms */}
            <Grid item xs={12}>
              <TextField
                label="Symptoms / Reason for visit"
                multiline
                rows={3}
                fullWidth
                value={appointmentData.symptoms}
                onChange={(e) => handleInputChange('symptoms', e.target.value)}
                placeholder="Please describe your symptoms or reason for the appointment..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !appointmentData.appointmentDate || !appointmentData.appointmentTime}
            startIcon={loading ? <CircularProgress size={20} /> : <CalendarToday />}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default BookAppointment;
