// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Login from './components/User/Login';
// import Signup from './components/User/Signup';
// import Dashboard from './components/User/Dashboard';
// import Profile from './components/User/Profile';
// import DoctorSignup from './components/Doctor/DoctorSignup';

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#2563eb',
//       dark: '#1d4ed8',
//       light: '#3b82f6',
//     },
//     secondary: {
//       main: '#7c3aed',
//       dark: '#6d28d9',
//       light: '#8b5cf6',
//     },
//     background: {
//       default: '#f8fafc',
//       paper: '#ffffff',
//     },
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 600,
//     },
//     h5: {
//       fontWeight: 600,
//     },
//   },
//   shape: {
//     borderRadius: 12,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//           fontWeight: 600,
//           fontSize: '0.95rem',
//           padding: '10px 24px',
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: '12px',
//           },
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
//         },
//       },
//     },
//   },
// });

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { user } = useAuth();
//   return user ? <>{children}</> : <Navigate to="/login" />;
// };

// const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { user } = useAuth();
//   return !user ? <>{children}</> : <Navigate to="/dashboard" />;
// };

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AuthProvider>
//         <Router>
//           <div className="App">
//             <Routes>
//               <Route path="/" element={<Navigate to="/dashboard" />} />
//               <Route
//                 path="/login"
//                 element={
//                   <PublicRoute>
//                     <Login />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path="/signup"
//                 element={
//                   <PublicRoute>
//                     <Signup />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path='/doctor/signup'
//                 element={
//                   <PublicRoute>
//                     <DoctorSignup />
//                   </PublicRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute>
//                     <Dashboard />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/profile"
//                 element={
//                   <ProtectedRoute>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//           </div>
//         </Router>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

const App = () => {
  return null;
}

export default App;


// dummy App component to avoid errors during import in other files