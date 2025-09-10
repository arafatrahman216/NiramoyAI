/**
 * Utility function to redirect users based on their roles after login/signup
 * @param {Object} user - User object containing roles array
 * @param {Function} navigate - React Router navigate function
 * @returns {string} - The redirect path
 */
export const redirectBasedOnRole = (user, navigate) => {
  // COMMENTED OUT - Role-based redirects temporarily disabled
  /*
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    // Default to user dashboard if no roles found
    navigate('/dashboard');
    return '/dashboard';
  }

  // Priority order: Admin > Doctor > User
  // If user has multiple roles, redirect to highest priority role

  if (user.role===  'ADMIN' ) {
    navigate('/admin/dashboard');
    return '/admin/dashboard';
  }
  
  if (user.role=='DOCTOR') {
    navigate('/doctor/dashboard');
    return '/doctor/dashboard';
  }
  
  if (user.role==='PATIENT') {
    navigate('/dashboard');
    return '/dashboard';
  }

  // Default fallback
  navigate('/dashboard');
  return '/dashboard';
  */
  
  // Temporarily disabled - no redirects
  console.log('Role-based redirect disabled');
  return null;
};

/**
 * Get the appropriate dashboard path for a user without navigating
 * @param {Object} user - User object containing roles array
 * @returns {string} - The dashboard path
 */
export const getDashboardPath = (user) => {
  if (!user || !user.role ) {
    return '/dashboard';
  }

  if (user.role==='ADMIN' ) {
    return '/admin/dashboard';
  }
  
  if (user.role==='DOCTOR') {
    return '/doctor/dashboard';
  }
  
  if (user.role==='USER') {
    return '/dashboard';
  }

  return '/dashboard';
};

/**
 * Check if user has specific role
 * @param {Object} user - User object containing roles array
 * @param {string} role - Role to check for
 * @returns {boolean} - Whether user has the role
 */
export const hasRole = (user, role) => {
  return user && user.role && user.role===role;
};
