import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Edit,
  Save,
  X,
  Stethoscope,
  User,
  LogOut,
  Star,
  MessageSquare,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../services/api';
import axios from 'axios';

const DoctorProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/doctor/profile`);

      if (response.data.success) {
        const profile = response.data.doctor;
        console.log('Fetched doctor profile:', profile);
        
        setDoctorProfile({
          ...profile,
          ['isAvailable']: profile.available !== undefined ? profile.available : true
        } );
        setEditData({
          specialization: profile.specialization || '',
          qualification: profile.degree || '',
          experienceYears: profile.experience || 0,
          consultationFee: profile.consultationFee || 0,
          hospitalAffiliation: profile.hospitalName || '',
          phoneNumber: profile.phoneNumber || '',
          aboutDoctor: profile.about || '',
          isAvailable: profile.isAvailable || true
        });
      }
    } catch (err) {
      setError('Failed to load doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/doctor/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/doctor/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.patch(`${API_BASE_URL}/doctor/profile`, editData);

      if (response.data.success) {
        const profile = {
          ...doctorProfile,
          ['specialization']: editData.specialization,
          ['degree']: editData.qualification,
          ['experience']: editData.experienceYears,
          ['consultationFee']: editData.consultationFee,
          ['hospitalName']: editData.hospitalAffiliation,
          ['phoneNumber']: editData.phoneNumber,
          ['about']: editData.aboutDoctor,
          ['isAvailable']: editData.isAvailable

        }

        setDoctorProfile(profile);
        console.log('Profile updated successfully:', editData);
        console.log('Server response:', profile);

        setSuccess('Profile updated successfully!');
        setIsEditing(false);
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
    if (doctorProfile) {
      setEditData({
        specialization: doctorProfile.specialization || '',
        qualification: doctorProfile.degree || '',
        experienceYears: doctorProfile.experience || 0,
        consultationFee: doctorProfile.consultationFee || 0,
        hospitalAffiliation: doctorProfile.hospitalName || '',
        phoneNumber: doctorProfile.phoneNumber || '',
        aboutDoctor: doctorProfile.about || '',
        isAvailable: doctorProfile.isAvailable || true
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading && !doctorProfile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={handleBack}
              className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            
            <div className="flex items-center">
              <Stethoscope className="w-6 h-6 text-emerald-400 mr-2" />
              <span className="text-xl font-bold text-white">NiramoyAI - Doctor Portal</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Doctor Profile Settings</h1>
          <p className="text-gray-400">Manage your professional information</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
          <div className="p-8">
            {/* Profile Header */}
            <div className="flex items-start mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mr-6">
                {user?.name?.charAt(0)}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">Dr. {user?.name}</h2>
                <p className="text-emerald-400 font-medium mb-1">@{user?.username}</p>
                <p className="text-gray-400 mb-1">{user?.email}</p>
                <p className="text-gray-400 mb-3">License: {doctorProfile?.licenseNumber}</p>
                
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    doctorProfile?.isVerified 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {doctorProfile?.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    doctorProfile?.isAvailable 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {doctorProfile?.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                    >
                      {loading ? (
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={isEditing ? editData.specialization : doctorProfile?.specialization || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Experience Years</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={isEditing ? editData.experienceYears : doctorProfile?.experience || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Qualification</label>
                <textarea
                  name="qualification"
                  rows="2"
                  value={isEditing ? editData.qualification : doctorProfile?.degree || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Consultation Fee (৳)</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={isEditing ? editData.consultationFee : doctorProfile?.consultationFee || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={isEditing ? editData.phoneNumber : doctorProfile?.phoneNumber || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Hospital Affiliation</label>
                <input
                  type="text"
                  name="hospitalAffiliation"
                  value={isEditing ? editData.hospitalAffiliation : doctorProfile?.hospitalName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">About Doctor</label>
                <textarea
                  name="aboutDoctor"
                  rows="4"
                  value={isEditing ? editData.aboutDoctor : doctorProfile?.about || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Brief description about your expertise, approach to treatment, etc."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
              </div>
              
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Availability Status</label>
                  <select
                    name="isAvailable"
                    value={editData.isAvailable}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value={true}>Available</option>
                    <option value={false}>Not Available</option>
                  </select>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="pt-8 border-t border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Profile Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-lg mx-auto mb-2">
                    <Star className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mb-1">
                    {doctorProfile?.rating || 0}
                  </div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-2">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {doctorProfile?.totalReviews || 0}
                  </div>
                  <div className="text-sm text-gray-400">Reviews</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-2">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {doctorProfile?.experience || 0}
                  </div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg mx-auto mb-2">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    ৳{doctorProfile?.consultationFee || 0}
                  </div>
                  <div className="text-sm text-gray-400">Consultation Fee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
