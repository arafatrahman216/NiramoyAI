import React, { useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Activity,
  Home,
  LogOut,
  Shield
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  const handleEdit = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_BASE_URL}/user/profile`, editData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      if (response.data.success) {
        const updatedUserData = response.data.user;
        updateUser(updatedUserData);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        setEditData({
          name: updatedUserData.name || '',
          email: updatedUserData.email || '',
          phoneNumber: updatedUserData.phoneNumber || '',
        });
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-emerald-400 mr-2" />
              <span className="text-xl font-bold text-white">NiramoyAI</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center px-3 py-2 text-emerald-400 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg mr-6">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                <p className="text-emerald-400 text-lg">@{user?.username}</p>
                <div className="flex items-center mt-2 space-x-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    {user?.status || 'ACTIVE'}
                  </span>
                  {user?.role && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={isEditing ? editData.name : user?.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  isEditing 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:outline-none' 
                    : 'bg-gray-700/50 border-gray-600 text-gray-300 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={isEditing ? editData.email : user?.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  isEditing 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:outline-none' 
                    : 'bg-gray-700/50 border-gray-600 text-gray-300 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={isEditing ? editData.phoneNumber : user?.phoneNumber || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  isEditing 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:outline-none' 
                    : 'bg-gray-700/50 border-gray-600 text-gray-300 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Username */}
            <div>
              <label className="flex items-center text-gray-300 mb-2">
                <User className="w-4 h-4 mr-2" />
                Username
              </label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg border bg-gray-700/50 border-gray-600 text-gray-400 cursor-not-allowed"
              />
              <p className="text-gray-500 text-sm mt-1">Username cannot be changed</p>
            </div>

            {/* Member Since */}
            <div className="md:col-span-2">
              <label className="flex items-center text-gray-300 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Member Since
              </label>
              <input
                type="text"
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                disabled
                className="w-full px-4 py-3 rounded-lg border bg-gray-700/50 border-gray-600 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>Note:</strong> Some changes may require email verification.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
