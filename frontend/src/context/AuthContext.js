import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// const API_BASE_URL = 'https://niramoyai.up.railway.app/api/auth';

// Local Host
const API_BASE_URL = 'http://localhost:8080/api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading = true
  const [error, setError] = useState(null);

  // Configure axios defaults and check if user is already logged in when the app starts
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // Set axios authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false); // Authentication check complete
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login for:', username);
      
      const response = await axios.post(`${API_BASE_URL}/login`, {
        usernameOrEmail: username,
        password,
      });

      if (response.data.success) {
        const { jwt: token, user: userData } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set axios authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(userData);
        return true;
      } else {
        setError(response.data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, userData);

      if (response.data.success) {
        const { token, user: newUser } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Set axios authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(newUser);
        return true;
      } else {
        setError(response.data.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    setError(null);
  };

  const adminLogin = async (username, password, adminKey) => {
    setLoading(true);
    setError(null);
    
    try {
      // First try regular login to check credentials
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });

      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Check if user has admin role
        if (userData.role && userData.role === 'ADMIN') {
          // Store token and user data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Set axios authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          setUser(userData);
          return true;
        } else {
          setError('Access denied: Admin privileges required');
          return false;
        }
      } else {
        setError(response.data.message || 'Admin login failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Admin login failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adminRegister = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/register`, userData);

      if (response.data.success) {
        const { token, user: newUser } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Set axios authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(newUser);
        return true;
      } else {
        setError(response.data.message || 'Admin registration failed');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Admin registration failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    signup,
    adminLogin,
    adminRegister,
    logout,
    updateUser,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
