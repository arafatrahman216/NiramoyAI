import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Component to prevent unauthorized navigation
const NavigationGuard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      const currentPath = location.pathname;

      // Define route permissions
      const patientRoutes = ['/dashboard', '/profile', '/search-doctors'];
      const doctorRoutes = ['/doctor/dashboard', '/doctor/profile'];
      const adminRoutes = ['/admin/dashboard', '/admin/register'];

      // Check for unauthorized access attempts
      if (user.roles?.includes('ROLE_DOCTOR')) {
        // Doctor trying to access patient or admin routes
        if (patientRoutes.some(route => currentPath.startsWith(route)) ||
            adminRoutes.some(route => currentPath.startsWith(route))) {
          console.warn('Doctor attempted to access unauthorized route:', currentPath);
          navigate('/doctor/dashboard', { replace: true });
          return;
        }
      } else if (user.roles?.includes('ROLE_ADMIN')) {
        // Admin trying to access patient or doctor routes
        if (patientRoutes.some(route => currentPath.startsWith(route)) ||
            doctorRoutes.some(route => currentPath.startsWith(route))) {
          console.warn('Admin attempted to access unauthorized route:', currentPath);
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } else {
        // Patient trying to access doctor or admin routes
        if (doctorRoutes.some(route => currentPath.startsWith(route)) ||
            adminRoutes.some(route => currentPath.startsWith(route))) {
          console.warn('Patient attempted to access unauthorized route:', currentPath);
          navigate('/dashboard', { replace: true });
          return;
        }
      }
    }
  }, [user, loading, location.pathname, navigate]);

  return null; // This component doesn't render anything
};

export default NavigationGuard;
