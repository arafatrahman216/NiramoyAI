import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Clock, Users, Award, Heart, MessageCircle, Calendar } from 'lucide-react';
import './DoctorProfile.css';

/**
 * DoctorProfile Component
 * Displays detailed doctor profile with tabs for about, availability, reviews, and contact
 */
const DoctorProfile = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    // Fetch doctor data - replace with actual API call
    const fetchDoctorProfile = async () => {
      try {
        // Mock data - replace with actual API call
        const mockDoctor = {
          id: doctorId,
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiologist',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
          rating: 4.8,
          reviews: 324,
          experience: 12,
          patients: 5200,
          fee: 500,
          currency: 'BDT',
          location: 'Dhaka Medical Center, Gulshan, Dhaka',
          phone: '+880-1234-567890',
          email: 'sarah.johnson@niramoyal.com',
          availability: [
            { day: 'Monday - Friday', time: '10:00 AM - 6:00 PM' },
            { day: 'Saturday', time: '10:00 AM - 2:00 PM' },
            { day: 'Sunday', time: 'Closed' }
          ],
          qualifications: [
            'MBBS - University of Dhaka',
            'MD Cardiology - National Institute of Cardiovascular Diseases',
            'Fellowship - American College of Cardiology'
          ],
          specialties: ['Hypertension', 'Arrhythmia', 'Heart Failure', 'Coronary Artery Disease'],
          bio: 'Dr. Sarah Johnson is a highly experienced Cardiologist with over 12 years of practice. She specializes in managing complex cardiac conditions and has helped thousands of patients achieve optimal heart health.',
          languages: ['Bengali', 'English', 'Hindi'],
          awards: [
            'Best Cardiologist Award 2022',
            'Excellence in Patient Care 2021',
            'Innovation in Cardiac Treatment 2023'
          ],
          recentReviews: [
            {
              patient: 'Karim Ahmed',
              rating: 5,
              date: '2 weeks ago',
              comment: 'Excellent doctor! Very professional and caring. Highly recommended.'
            },
            {
              patient: 'Fatima Khan',
              rating: 5,
              date: '1 month ago',
              comment: 'Dr. Sarah explained everything clearly. She is very thorough in her examination.'
            },
            {
              patient: 'Rajesh Patel',
              rating: 4,
              date: '2 months ago',
              comment: 'Great experience overall. Felt heard and understood.'
            }
          ]
        };
        setDoctor(mockDoctor);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  const handleBookAppointment = () => {
    setBookingOpen(true);
  };

  if (loading) {
    return (
      <div className="doctor-profile loading">
        <div className="spinner"></div>
        <p>Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile error">
        <p>Doctor profile not found</p>
      </div>
    );
  }

  return (
    <div className="doctor-profile-container">
      {/* NiramoyAI Header */}
      <div className="niramoy-header">
        <div className="niramoy-header-content">
          <div className="niramoy-logo-section" onClick={() => navigate('/')}>
            <div className="niramoy-logo">🏥</div>
            <div className="niramoy-branding">
              <h1 className="niramoy-title">NiramoyAI</h1>
              <p className="niramoy-subtitle">Healthcare Intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="doctor-hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="doctor-image-section">
            <img src={doctor.image} alt={doctor.name} className="doctor-avatar" />
            <div className="rating-badge">
              <Star className="star-icon" size={16} fill="currentColor" />
              <span>{doctor.rating}</span>
              <span className="reviews-count">({doctor.reviews})</span>
            </div>
          </div>

          <div className="doctor-info-section">
            <h1 className="doctor-name">{doctor.name}</h1>
            <p className="doctor-specialty">{doctor.specialty}</p>
            <p className="doctor-bio-short">{doctor.experience}+ Years Experience</p>

            <div className="quick-stats">
              <div className="stat-item">
                <Users size={18} />
                <div>
                  <p className="stat-value">{doctor.patients.toLocaleString()}</p>
                  <p className="stat-label">Patients</p>
                </div>
              </div>
              <div className="stat-item">
                <Award size={18} />
                <div>
                  <p className="stat-value">{doctor.experience}+</p>
                  <p className="stat-label">Years</p>
                </div>
              </div>
              <div className="stat-item">
                <Heart size={18} />
                <div>
                  <p className="stat-value">{doctor.rating}</p>
                  <p className="stat-label">Rating</p>
                </div>
              </div>
            </div>

            <button className="book-btn" onClick={handleBookAppointment}>
              <Calendar size={18} />
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="doctor-content">
        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button
              className={`tab ${activeTab === 'availability' ? 'active' : ''}`}
              onClick={() => setActiveTab('availability')}
            >
              Availability
            </button>
            <button
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="about-tab">
              <div className="section">
                <h2>About Dr. {doctor.name.split(' ')[1]}</h2>
                <p className="bio-text">{doctor.bio}</p>
              </div>

              <div className="section">
                <h3>Qualifications</h3>
                <div className="qualifications-list">
                  {doctor.qualifications.map((qual, index) => (
                    <div key={index} className="qualification-item">
                      <Award size={18} className="qual-icon" />
                      <p>{qual}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <h3>Specialties</h3>
                <div className="specialties-grid">
                  {doctor.specialties.map((specialty, index) => (
                    <div key={index} className="specialty-badge">
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <h3>Languages</h3>
                <div className="languages-list">
                  {doctor.languages.map((lang, index) => (
                    <span key={index} className="language-tag">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {doctor.awards && doctor.awards.length > 0 && (
                <div className="section">
                  <h3>Awards & Recognition</h3>
                  <div className="awards-list">
                    {doctor.awards.map((award, index) => (
                      <div key={index} className="award-item">
                        <Award size={16} className="award-icon" />
                        <p>{award}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="availability-tab">
              <div className="section">
                <h2>Availability</h2>
                <div className="availability-list">
                  {doctor.availability.map((slot, index) => (
                    <div key={index} className="availability-item">
                      <Clock size={20} className="time-icon" />
                      <div className="availability-text">
                        <p className="day">{slot.day}</p>
                        <p className="time">{slot.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="consultation-fee">
                <h3>Consultation Fee</h3>
                <div className="fee-display">
                  <span className="amount">{doctor.fee}</span>
                  <span className="currency">{doctor.currency}</span>
                </div>
                <p className="fee-note">First consultation may have additional charges</p>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <div className="section">
                <h2>Patient Reviews</h2>
                <div className="overall-rating">
                  <div className="rating-circle">
                    <p className="rating-number">{doctor.rating}</p>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(doctor.rating) ? 'filled' : ''}
                          fill={i < Math.floor(doctor.rating) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-count">Based on {doctor.reviews} reviews</p>
                </div>
              </div>

              <div className="reviews-list">
                {doctor.recentReviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <h4>{review.patient}</h4>
                        <p className="review-date">{review.date}</p>
                      </div>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'filled' : ''}
                            fill={i < review.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="contact-tab">
              <div className="section">
                <h2>Contact Information</h2>
                <div className="contact-items">
                  <div className="contact-item">
                    <MapPin size={20} className="contact-icon" />
                    <div className="contact-text">
                      <p className="contact-label">Address</p>
                      <p className="contact-value">{doctor.location}</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <Phone size={20} className="contact-icon" />
                    <div className="contact-text">
                      <p className="contact-label">Phone</p>
                      <a href={`tel:${doctor.phone}`} className="contact-value">
                        {doctor.phone}
                      </a>
                    </div>
                  </div>

                  <div className="contact-item">
                    <Mail size={20} className="contact-icon" />
                    <div className="contact-text">
                      <p className="contact-label">Email</p>
                      <a href={`mailto:${doctor.email}`} className="contact-value">
                        {doctor.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-primary" onClick={handleBookAppointment}>
                  <Calendar size={18} />
                  Book Appointment
                </button>
                <button className="btn-secondary">
                  <MessageCircle size={18} />
                  Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingOpen && (
        <div className="booking-modal-overlay" onClick={() => setBookingOpen(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book an Appointment</h2>
              <button className="close-btn" onClick={() => setBookingOpen(false)}>×</button>
            </div>
            <div className="modal-content">
              <form>
                <div className="form-group">
                  <label>Select Date</label>
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>Select Time</label>
                  <select required>
                    <option value="">Choose a time slot</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Reason for Visit</label>
                  <textarea placeholder="Briefly describe your concern..." required></textarea>
                </div>
                <button type="submit" className="submit-btn">Confirm Booking</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
