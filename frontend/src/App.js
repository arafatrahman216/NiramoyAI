import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CircularProgress, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavigationGuard from './components/NavigationGuard';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import DoctorLogin from './components/DoctorLogin';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorProfile from './components/DoctorProfile';
import SearchDoctors from './components/SearchDoctors';
import EnhancedSearchDoctors from './components/EnhancedSearchDoctors';
import BookAppointment from './components/BookAppointment';
import BookAppointmentPage from './components/BookAppointmentPage';
import PatientAppointments from './components/PatientAppointments';
import DoctorAppointments from './components/DoctorAppointments';
import DoctorSchedule from './components/DoctorSchedule';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      dark: '#1d4ed8',
      light: '#3b82f6',
    },
    secondary: {
      main: '#7c3aed',
      dark: '#6d28d9',
      light: '#8b5cf6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '10px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PatientRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user is a doctor - redirect to doctor dashboard
  if (user.roles?.includes('ROLE_DOCTOR')) {
    return <Navigate to="/doctor/dashboard" />;
  }
  
  // Check if user is an admin - redirect to admin dashboard
  if (user.roles?.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // Allow only patients (users without special roles) to access patient routes
  return <>{children}</>;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/admin/login" />;
  }
  
  // Check if user is a doctor - redirect to doctor dashboard
  if (user.roles?.includes('ROLE_DOCTOR')) {
    return <Navigate to="/doctor/dashboard" />;
  }
  
  // Check if user is a patient - redirect to patient dashboard
  if (!user.roles?.includes('ROLE_ADMIN') && !user.roles?.includes('ROLE_DOCTOR')) {
    return <Navigate to="/dashboard" />;
  }
  
  // Allow only admins to access admin routes
  return user.roles?.includes('ROLE_ADMIN') ? 
    <>{children}</> : 
    <Navigate to="/admin/login" />;
};

const DoctorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/doctor/login" />;
  }
  
  // Check if user is an admin - redirect to admin dashboard
  if (user.roles?.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // Check if user is a patient - redirect to patient dashboard
  if (!user.roles?.includes('ROLE_DOCTOR') && !user.roles?.includes('ROLE_ADMIN')) {
    return <Navigate to="/dashboard" />;
  }
  
  // Allow only doctors to access doctor routes
  return user.roles?.includes('ROLE_DOCTOR') ? 
    <>{children}</> : 
    <Navigate to="/doctor/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // If user is authenticated, redirect based on their role
  if (user) {
    if (user.roles?.includes('ROLE_ADMIN')) {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.roles?.includes('ROLE_DOCTOR')) {
      return <Navigate to="/doctor/dashboard" />;
    } else {
      // Regular patient user
      return <Navigate to="/dashboard" />;
    }
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <NavigationGuard />
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route
                path="/admin/login"
                element={
                  <PublicRoute>
                    <AdminLogin />
                  </PublicRoute>
                }
              />
              <Route
                path="/admin/register"
                element={
                  <PublicRoute>
                    <AdminRegister />
                  </PublicRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PatientRoute>
                    <Dashboard />
                  </PatientRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PatientRoute>
                    <Profile />
                  </PatientRoute>
                }
              />
              <Route
                path="/search-doctors"
                element={
                  <PatientRoute>
                    <EnhancedSearchDoctors />
                  </PatientRoute>
                }
              />
              <Route
                path="/book-appointment"
                element={
                  <PatientRoute>
                    <BookAppointmentPage />
                  </PatientRoute>
                }
              />
              <Route
                path="/my-appointments"
                element={
                  <PatientRoute>
                    <PatientAppointments />
                  </PatientRoute>
                }
              />
              <Route
                path="/doctor/login"
                element={
                  <PublicRoute>
                    <DoctorLogin />
                  </PublicRoute>
                }
              />
              <Route
                path="/doctor/dashboard"
                element={
                  <DoctorRoute>
                    <DoctorDashboard />
                  </DoctorRoute>
                }
              />
              <Route
                path="/doctor/profile"
                element={
                  <DoctorRoute>
                    <DoctorProfile />
                  </DoctorRoute>
                }
              />
              <Route
                path="/doctor/appointments"
                element={
                  <DoctorRoute>
                    <DoctorAppointments />
                  </DoctorRoute>
                }
              />
              <Route
                path="/doctor/schedule"
                element={
                  <DoctorRoute>
                    <DoctorSchedule />
                  </DoctorRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
