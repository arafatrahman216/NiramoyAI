import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Hook to protect components based on user roles
export const useRoleProtection = (allowedRoles = [], redirectOnFail = true) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && redirectOnFail) {
      // Check if user has any of the allowed roles
      const hasPermission = allowedRoles.length === 0 || 
        allowedRoles.some(role => user.role === role);

      if (!hasPermission) {
        // Redirect based on user role
        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else if (user.role === 'DOCTOR') {
          navigate('/doctor/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, loading, allowedRoles, redirectOnFail, navigate]);

  return {
    user,
    loading,
    hasPermission: !loading && user && (
      allowedRoles.length === 0 || 
      allowedRoles.some(role => user.role === role)
    ),
  };
};

// Hook to check if user has specific role
export const useHasRole = (role) => {
  const { user } = useAuth();
  return user?.role === role;
};

// Hook to get user role type
export const useUserRole = () => {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return 'admin';
  } else if (user?.role === 'DOCTOR') {
    return 'doctor';
  } else if (user) {
    return 'patient';
  }
  
  return null;
};

// Hook to prevent cross-role access in components
export const usePreventCrossRoleAccess = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const currentPath = window.location.pathname;
      
      // Doctor trying to access patient routes
      if (user.role === 'DOCTOR') {
        if (currentPath.startsWith('/dashboard') || 
            currentPath.startsWith('/profile') || 
            currentPath.startsWith('/search-doctors')) {
          navigate('/doctor/dashboard', { replace: true });
          return;
        }
      }
      
      // Admin trying to access patient or doctor routes
      if (user.role === 'ADMIN') {
        if (currentPath.startsWith('/dashboard') || 
            currentPath.startsWith('/profile') || 
            currentPath.startsWith('/search-doctors') ||
            currentPath.startsWith('/doctor/dashboard') ||
            currentPath.startsWith('/doctor/profile')) {
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      }
      
      // Patient trying to access admin or doctor routes
      if (user.role !== 'ADMIN' && user.role !== 'DOCTOR') {
        if (currentPath.startsWith('/admin/') || 
            currentPath.startsWith('/doctor/')) {
          navigate('/dashboard', { replace: true });
          return;
        }
      }
    }
  }, [user, loading, navigate]);

  return { user, loading };
};
