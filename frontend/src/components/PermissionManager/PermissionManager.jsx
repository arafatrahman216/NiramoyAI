import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';
import './PermissionManager.css';

const PermissionManager = () => {
  const { encryptedData } = useParams();
  const navigate = useNavigate();
  
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/user/link/${encryptedData}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.success) {
          setDoctorData(response.data.doctorData);
        } else {
          setError(response.data.message || 'Failed to load doctor information');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading doctor information');
      } finally {
        setLoading(false);
      }
    };

    if (encryptedData) {
      fetchDoctorData();
    }
  }, [encryptedData]);

  const handleGrantAccess = async () => {
    if (!doctorData?.doctorId) {
      setError('Doctor information is missing');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        doctorId: doctorData.doctorId,
        permission: true
      };

      const response = await axios.post(
        `${API_BASE_URL}/user/permission`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setTimeout(() => {
          navigate('/dashboard', { 
            state: { message: 'Permissions granted successfully!' } 
          });
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to grant permissions');
        setSubmitting(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error granting permissions');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pm-container pm-loading">
        <div className="pm-spinner">
          <Loader size={48} className="pm-spinner-icon" />
          <p>Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (error && !doctorData) {
    return (
      <div className="pm-container">
        <div className="pm-error-card">
          <AlertCircle size={48} />
          <h2>Unable to Load</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="pm-btn pm-btn-primary">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pm-container">
      {submitting && (
        <div className="pm-success-overlay">
          <div className="pm-success-card">
            <Loader size={48} className="pm-success-spinner" />
            <p>Granting access...</p>
          </div>
        </div>
      )}

      {doctorData && (
        <div className="pm-card">
          <div className="pm-doctor-header">
            <div className="pm-doctor-avatar">
              {doctorData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="pm-doctor-info">
              <h2>{doctorData.name}</h2>
              <p className="pm-spec">{doctorData.specialization}</p>
              <p className="pm-hospital">{doctorData.hospital}</p>
              <p className="pm-exp">{doctorData.experience} years • {doctorData.degree}</p>
            </div>
          </div>

          {error && (
            <div className="pm-error-message">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <div className="pm-button-group">
            <button 
              onClick={() => navigate('/')}
              className="pm-btn pm-btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              onClick={handleGrantAccess}
              className="pm-btn pm-btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size={18} className="pm-btn-spinner" />
                  Granting...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Grant Access
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManager;
