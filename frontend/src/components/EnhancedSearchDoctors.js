import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Chip,
  Avatar,
  Rating,
  Fade,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  Search,
  LocalHospital,
  Star,
  LocationOn,
  Phone,
  Email,
  Person,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ExitToApp,
  FilterList,
  Sort,
  Schedule,
  Verified,
  Language,
  CalendarToday,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePreventCrossRoleAccess } from '../hooks/useRoleProtection';
import { doctorAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedSearchDoctors = () => {
  // Prevent doctors and admins from accessing patient search
  usePreventCrossRoleAccess();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load doctors from backend API
  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      try {
        const response = await doctorAPI.getAllDoctors();
        if (response.data && response.data.success) {
          const doctorsData = response.data.data || [];
          setDoctors(doctorsData);
          setFilteredDoctors(doctorsData);
        } else {
          console.error('Failed to load doctors:', response.data?.message);
          setDoctors([]);
          setFilteredDoctors([]);
        }
      } catch (error) {
        console.error('Error loading doctors:', error);
        setDoctors([]);
        setFilteredDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const specialties = [
    'All Specialties',
    'Cardiologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic Surgeon',
    'Gynecologist',
    'Dermatologist',
    'Psychiatrist',
    'General Medicine',
  ];

  const locations = [
    'All Locations',
    'Dhaka Medical College Hospital',
    'Square Hospital',
    'Apollo Hospital',
    'United Hospital',
    'Labaid Hospital',
    'Popular Medical Center',
  ];

  // Enhanced search with backend API integration
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim() && !specialty && !location && !availableOnly) {
        // No search filters, show all doctors
        setFilteredDoctors(doctors);
        return;
      }

      setLoading(true);
      try {
        let searchResults = [];
        
        if (searchTerm.trim()) {
          // Use backend API search
          const response = await doctorAPI.searchDoctors(searchTerm);
          if (response.data && response.data.success) {
            searchResults = response.data.data || [];
          } else {
            throw new Error('API search failed');
          }
        } else {
          // Use local filtering when no search term
          searchResults = doctors;
        }

        // Apply additional filters locally
        let filtered = searchResults.filter(doctor => {
          const matchesSpecialty = !specialty || specialty === 'All Specialties' || doctor.specialty === specialty;
          const matchesLocation = !location || location === 'All Locations' || doctor.location === location;
          const matchesAvailability = !availableOnly || doctor.available;
          return matchesSpecialty && matchesLocation && matchesAvailability;
        });

        // Sort results
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return (b.rating || 0) - (a.rating || 0);
            case 'experience':
              return parseInt(b.experience || '0') - parseInt(a.experience || '0');
            case 'fee':
              return (a.consultationFee || 0) - (b.consultationFee || 0);
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });

        setFilteredDoctors(filtered);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to local filtering
        let filtered = doctors.filter(doctor => {
          const matchesSearch = !searchTerm.trim() || (
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doctor.specialty && doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (doctor.location && doctor.location.toLowerCase().includes(searchTerm.toLowerCase()))
          );
          const matchesSpecialty = !specialty || specialty === 'All Specialties' || doctor.specialty === specialty;
          const matchesLocation = !location || location === 'All Locations' || doctor.location === location;
          const matchesAvailability = !availableOnly || doctor.available;
          return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability;
        });

        // Sort results
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return (b.rating || 0) - (a.rating || 0);
            case 'experience':
              return parseInt(b.experience || '0') - parseInt(a.experience || '0');
            case 'fee':
              return (a.consultationFee || 0) - (b.consultationFee || 0);
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });

        setFilteredDoctors(filtered);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, doctors, specialty, location, sortBy, availableOnly]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setDialogOpen(true);
  };

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setDialogOpen(true);
  };

  const drawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {user?.email}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}
          >
            NiramoyAI
          </Typography>
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'primary.main' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button onClick={handleLogout} color="error">
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawerContent}
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '3rem' },
                textAlign: 'center'
              }}
            >
              Find Your Doctor
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center',
                opacity: 0.9,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Search and book appointments with qualified healthcare professionals
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Search and Filters */}
      <Container maxWidth="lg" sx={{ mt: -3, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card elevation={8} sx={{ borderRadius: 3, p: 3 }}>
            <Grid container spacing={3}>
              {/* Search Bar */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search doctors by name, specialty, or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Specialty Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Specialty</InputLabel>
                  <Select
                    value={specialty}
                    label="Specialty"
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    {specialties.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Location Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={location}
                    label="Location"
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    {locations.map((loc) => (
                      <MenuItem key={loc} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Sort By */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="experience">Experience</MenuItem>
                    <MenuItem value="fee">Consultation Fee</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Available Only"
                onClick={() => setAvailableOnly(!availableOnly)}
                variant={availableOnly ? 'filled' : 'outlined'}
                color="primary"
              />
              <Chip
                label={`${filteredDoctors.length} doctors found`}
                variant="outlined"
              />
            </Box>
          </Card>
        </motion.div>
      </Container>

      {/* Results */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="80%" height={24} />
                        <Skeleton variant="text" width="60%" height={20} />
                      </Box>
                    </Box>
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <AnimatePresence>
            <Grid container spacing={3}>
              {filteredDoctors.map((doctor, index) => (
                <Grid item xs={12} md={6} lg={4} key={doctor.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 6,
                        },
                      }}
                      onClick={() => handleViewProfile(doctor)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        {/* Doctor Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              mr: 2,
                              bgcolor: 'primary.main',
                            }}
                          >
                            <Person />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                {doctor.name}
                              </Typography>
                              {doctor.verified && (
                                <Verified color="primary" fontSize="small" />
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Rating value={doctor.rating || 0} readOnly size="small" />
                              <Typography variant="body2" color="text.secondary">
                                {doctor.rating || 'No rating'} {doctor.reviews ? `(${doctor.reviews} reviews)` : ''}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Specialty */}
                        <Chip
                          label={doctor.specialty || 'General Medicine'}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ mb: 2 }}
                        />

                        {/* Location */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{doctor.location || 'Location not specified'}</Typography>
                        </Box>

                        {/* Experience */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Schedule fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{doctor.experience || 'Experience not specified'}</Typography>
                        </Box>

                        {/* Languages */}
                        {doctor.languages && doctor.languages.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Language fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {doctor.languages.join(', ')}
                            </Typography>
                          </Box>
                        )}

                        {/* Consultation Fee */}
                        {doctor.consultationFee && (
                          <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Consultation Fee: ৳{doctor.consultationFee}
                          </Typography>
                        )}

                        {/* Status and Next Available */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip
                            label={doctor.available ? 'Available' : 'Busy'}
                            size="small"
                            color={doctor.available ? 'success' : 'error'}
                          />
                          {doctor.nextAvailable && (
                            <Chip
                              label={`Next: ${doctor.nextAvailable}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        {/* Action Buttons */}
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Button
                              fullWidth
                              variant="outlined"
                              size="small"
                              href={doctor.phone ? `tel:${doctor.phone}` : '#'}
                              onClick={(e) => e.stopPropagation()}
                              disabled={!doctor.phone}
                            >
                              Call
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              fullWidth
                              variant="contained"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookAppointment(doctor);
                              }}
                              disabled={!doctor.available}
                            >
                              Book
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LocalHospital sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No doctors found matching your criteria
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        )}
      </Container>

      {/* Doctor Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedDoctor && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Doctor Profile</Typography>
              <IconButton onClick={() => setDialogOpen(false)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mr: 3,
                    bgcolor: 'primary.main',
                  }}
                >
                  <Person sx={{ fontSize: 50 }} />
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h5">{selectedDoctor.name}</Typography>
                    {selectedDoctor.verified && (
                      <Verified color="primary" />
                    )}
                  </Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {selectedDoctor.specialization} 
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedDoctor.rating && (
                      <>
                        <Rating value={selectedDoctor.rating} readOnly />
                        <Typography variant="body1">
                          {selectedDoctor.rating} {selectedDoctor.reviews ? `(${selectedDoctor.reviews} reviews)` : ''}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography>{selectedDoctor.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography>{selectedDoctor.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography>{selectedDoctor.email}</Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Professional Details</Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Experience:</strong> {selectedDoctor.experience || 'Not specified'}
                    </Typography>
                    {selectedDoctor.education && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Education:</strong> {selectedDoctor.education}
                      </Typography>
                    )}
                    {selectedDoctor.languages && selectedDoctor.languages.length > 0 && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Languages:</strong> {selectedDoctor.languages.join(', ')}
                      </Typography>
                    )}
                    {selectedDoctor.consultationFee && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Consultation Fee:</strong> ৳{selectedDoctor.consultationFee}
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>About</Typography>
                    <Typography variant="body2" paragraph>
                      {selectedDoctor.about || 'No information available'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Achievements</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedDoctor.achievements && selectedDoctor.achievements.length > 0 ? (
                        selectedDoctor.achievements.map((achievement, index) => (
                          <Chip
                            key={index}
                            label={achievement}
                            variant="outlined"
                            color="primary"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No achievements listed
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Phone />}
                href={`tel:${selectedDoctor.phone}`}
              >
                Call Now
              </Button>
              <Button
                variant="contained"
                startIcon={<CalendarToday />}
                disabled={!selectedDoctor.available}
                onClick={() => {
                  setDialogOpen(false);
                  alert('Appointment booking feature coming soon!');
                }}
              >
                Book Appointment
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default EnhancedSearchDoctors;
