import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CircularProgress, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavigationGuard from './components/NavigationGuard';
import LandingPage from './components/LandingPage';
import Login from './components/User/Login';
import Signup from './components/User/Signup';
import Dashboard from './components/User/Dashboard';
import Profile from './components/User/Profile';
import AdminLogin from './components/Admin/AdminLogin';
import AdminRegister from './components/Admin/AdminRegister';
import AdminDashboard from './components/Admin/AdminDashboard';
import DoctorLogin from './components/Doctor/DoctorLogin';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import DoctorProfile from './components/Doctor/DoctorProfile';
import DoctorSignup from './components/Doctor/DoctorSignup';
import DoctorPatientView from './components/Doctor/DoctorPatientView';
import SearchDoctors from './components/SearchDoctors';
import EnhancedSearchDoctors from './components/EnhancedSearchDoctors';
import BookAppointment from './components/BookAppointment';
import HealthLogForm from './components/HealthLogInterface/HealthLogForm';
import BookAppointmentPage from './components/BookAppointmentPage';
import PatientAppointments from './components/PatientAppointments';
import DoctorAppointments from './components/Doctor/DoctorAppointments';
import DoctorSchedule from './components/Doctor/DoctorSchedule';
import DiagnosisInterface from './components/DiagnosisInterface/DiagnosisInterface';
import HealthDataForm from './components/HealthDataInterface/HealthDataForm'
import UpdatedHealthDataForm from './components/HealthDataInterface/UpdatedHealthDataForm'
import Timeline from './components/Timeline/Timeline';
import ExampleDashboardComponent from './components/HealthLogInterface/ExampleUsage';
import PatientProfile from './components/PatientProfile/PatientProfile';
import SharedProfile from './components/SharedProfile';
import PermissionManager from './components/PermissionManager';
import { default as UserDoctorProfile } from './components/User/DoctorProfile';
import AppWrapper from './components/AppWrapper';


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
  
  // Only show loading on initial auth check (user is null and loading is true)
  // Don't show loading screen during navigation after login/signup
  if (loading && user === null && !localStorage.getItem('token')) {
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
  
  // COMMENTED OUT - Protected route redirects temporarily disabled
  /*
  return user ? <>{children}</> : <Navigate to="/login" />;
  */
  
  // Allow access to all users temporarily
  return <>{children}</>;
};

const PatientRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Only show loading on initial auth check (user is null and loading is true)
  // Don't show loading screen during navigation after login/signup
  if (loading && user === null && !localStorage.getItem('token')) {
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
  
  // COMMENTED OUT - Route protection temporarily disabled
  /*
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user is a doctor - redirect to doctor dashboard
  if (user.role==='DOCTOR') {
    return <Navigate to="/doctor/dashboard" />;
  }
  
  // Check if user is an admin - redirect to admin dashboard
  if (user.role==='ADMIN') {
    return <Navigate to="/admin/dashboard" />;
  }
  */
  
  // Allow access to all users temporarily
  return <>{children}</>;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Only show loading on initial auth check (user is null and loading is true)
  // Don't show loading screen during navigation after login/signup
  if (loading && user === null && !localStorage.getItem('token')) {
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
  
  // COMMENTED OUT - Route protection temporarily disabled
  /*
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/admin/login" />;
  }
  
  // Check if user is a doctor - redirect to doctor dashboard
  if (user.role==='DOCTOR') {
    return <Navigate to="/doctor/dashboard" />;
  }
  
  // Check if user is a patient - redirect to patient dashboard
  if (!user.role==='PATIENT') {
    return <Navigate to="/dashboard" />;
  }
  
  // Allow only admins to access admin routes
  return user.role==='ADMIN' ? 
    <>{children}</> : 
    <Navigate to="/admin/login" />;
  */
  
  // Allow access to all users temporarily
  return <>{children}</>;
};

const DoctorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Only show loading on initial auth check (user is null and loading is true)
  // Don't show loading screen during navigation after login/signup
  if (loading && user === null && !localStorage.getItem('token')) {
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
  
  // COMMENTED OUT - Route protection temporarily disabled
  /*
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/doctor/login" />;
  }
  
  // Check if user is an admin - redirect to admin dashboard
  if (user.role==='ADMIN') {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // Check if user is a patient - redirect to patient dashboard
  if (!user.role==='DOCTOR') {
    return <Navigate to="/dashboard" />;
  }
  
  // Allow only doctors to access doctor routes
  return user.role==='DOCTOR' ? 
    <>{children}</> : 
    <Navigate to="/doctor/login" />;
  */
  
  // Allow access to all users temporarily
  return <>{children}</>;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Only show loading on initial auth check (user is null and loading is true)
  // Don't show loading screen during navigation after login/signup
  if (loading && user === null && !localStorage.getItem('token')) {
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
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <NavigationGuard />
          <AppWrapper>
            <div className="App">
              <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shared/profile/:encryptedId" element={<SharedProfile />} />
              <Route path="/link/:encryptedData" element={<PermissionManager />} />
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
                  path='/doctor/signup'
                  element={
                    <PublicRoute>
                      <DoctorSignup />
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
              <Route
                path="/patient/data"
                element={
                  <DoctorRoute>
                    <DoctorPatientView />
                  </DoctorRoute>
                }
              />
              <Route
                  path="/diagnosis"
                    element={
                        <PatientRoute>
                          <DiagnosisInterface />
                        </PatientRoute>
                    }
                />
                <Route 
                  path='/healthdataform'
                  element={
                    <PatientRoute>
                      <HealthDataForm />
                    </PatientRoute>
                  }
                />
                <Route 
                  path='/updatedHealthDataform'
                  element={
                    <PatientRoute>
                      <UpdatedHealthDataForm />
                    </PatientRoute>
                  }
                />
                <Route
                path='/healthlog'
                element={
                  <PatientRoute>
                    < HealthLogForm />
                  </PatientRoute>
                }
                />
                <Route 
                  path='/timeline'
                  element={
                    <PatientRoute>
                      <Timeline />
                    </PatientRoute>
                  }
                />

                <Route 
                path = '/doctor-profile'
                element = {
                  <PatientRoute>
                    <UserDoctorProfile />
                  </PatientRoute>
                }
                />


                <Route
                  path='/patient/profile'
                  element={
                    <PatientRoute>
                      <PatientProfile />
                    </PatientRoute>
                  }
                />

                {/* Example protected route */}
                <Route path="/test" element={
                  <PatientRoute>
                    
                  <ExampleDashboardComponent />
                  </PatientRoute>
                } />
            </Routes>
          </div>
          </AppWrapper>
        </Router>
      </AuthProvider>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* React Hot Toast for modern toast notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          // Define default options - slim and dark themed
          className: '',
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '6px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            minWidth: '320px',
            maxWidth: '400px',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: '#065f46',
              color: '#fff',
              border: '1px solid #10b981',
              borderRadius: '6px',
              padding: '12px 16px',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#7f1d1d',
              color: '#fff',
              border: '1px solid #dc2626',
              borderRadius: '6px',
              padding: '12px 16px',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.1), 0 4px 6px -2px rgba(220, 38, 38, 0.05)',
            },
          },
          loading: {
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
              borderRadius: '6px',
              padding: '12px 16px',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
