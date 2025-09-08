import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Html } from '@mui/icons-material';

// Component to prevent unauthorized navigation
const NavigationGuard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
useEffect(() => {
  if (!loading && user) {
    const currentPath = location.pathname;
    console.log(`User role: ${user.role}, Current path: ${currentPath}`);
    

    // Define route permissions
    const patientRoutes = ['/dashboard', '/profile', '/search-doctors'];
    const doctorRoutes = ['/doctor/dashboard', '/doctor/profile'];
    const adminRoutes = ['/admin/dashboard', '/admin/register'];

    if (user.role === 'DOCTOR') {
      if (
        patientRoutes.some(route => currentPath === route) ||
        adminRoutes.some(route => currentPath === route)
      ) {
        if (currentPath !== '/doctor/dashboard') {
          console.warn('Doctor attempted to access unauthorized route:', currentPath);
          navigate('/login', { replace: true });
          
        }
      }
    } else if (user.role === 'ADMIN') {
      if (
        patientRoutes.some(route => currentPath === route) ||
        doctorRoutes.some(route => currentPath === route)
      ) {
        if (currentPath !== '/admin/dashboard') {
          console.warn('Admin attempted to access unauthorized route:', currentPath);
          navigate('/login', { replace: true });
        }
      }
    } else {
      if (
        doctorRoutes.some(route => currentPath === route) ||
        adminRoutes.some(route => currentPath === route)
      ) {
        if (currentPath !== '/dashboard') {
          console.warn('Patient attempted to access unauthorized route:', currentPath);
          navigate('/login', { replace: true });
        }
      }
    }
  }
}, [user, loading, location.pathname, navigate]);

  return null; // This component doesn't render anything
};

export default NavigationGuard;
