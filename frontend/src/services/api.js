import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Doctor API endpoints
export const doctorAPI = {
  // Get all doctors (public endpoint for landing page)
  getAllDoctors: () => api.get('/public/doctors'),
  
  // Get doctors by specialty
  getDoctorsBySpecialty: (specialty) => api.get(`/public/doctors/specialty/${specialty}`),
  
  // Search doctors
  searchDoctors: (query) => api.get(`/public/doctors/search?q=${encodeURIComponent(query)}`),
  
  // Get doctor details
  getDoctorById: (id) => api.get(`/public/doctors/${id}`),
  
};

// Test Centers API endpoints
export const testCenterAPI = {
  // Get all test centers
  getAllTestCenters: () => api.get('/public/test-centers'),
  
  // Search test centers
  searchTestCenters: (query) => api.get(`/public/test-centers/search?q=${encodeURIComponent(query)}`),
  
  // Get test center by id
  getTestCenterById: (id) => api.get(`/public/test-centers/${id}`),
};

// AI Chatbot API endpoints
export const chatbotAPI = {
  // Send message to AI chatbot
  sendMessage: (message, conversationId = null) => 
    api.post('/chatbot/message', { message, conversationId }),
  
  // Get conversation history
  getConversation: (conversationId) => 
    api.get(`/chatbot/conversation/${conversationId}`),
  
  // Start new conversation
  startConversation: () => 
    api.post('/chatbot/conversation/start'),
};

// Appointment API endpoints
export const appointmentAPI = {
  // Book a new appointment (Patient)
  bookAppointment: (appointmentData) => 
    api.post('/appointments/book', appointmentData),
  
  // Get patient's appointments
  getPatientAppointments: () => 
    api.get('/appointments/patient/my-appointments'),
  
  // Get doctor's appointments
  getDoctorAppointments: () => 
    api.get('/appointments/doctor/my-appointments'),
  
  // Get today's appointments for doctor
  getTodaysAppointments: () => 
    api.get('/appointments/doctor/today'),
  
  // Get doctor's schedule
  getDoctorSchedule: () => 
    api.get('/appointments/doctor/schedule'),
  
  // Create doctor schedule
  createDoctorSchedule: (scheduleData) => 
    api.post('/appointments/doctor/schedule', scheduleData),
  
  // Update doctor schedule
  updateDoctorSchedule: (scheduleId, scheduleData) => 
    api.put(`/appointments/doctor/schedule/${scheduleId}`, scheduleData),
  
  // Delete doctor schedule
  deleteDoctorSchedule: (scheduleId) => 
    api.delete(`/appointments/doctor/schedule/${scheduleId}`),
  
  // Update appointment status
  updateAppointmentStatus: (appointmentId, statusData) => 
    api.put(`/appointments/${appointmentId}/status`, statusData),
  
  // Cancel appointment
  cancelAppointment: (appointmentId) => 
    api.put(`/appointments/${appointmentId}/cancel`),
  
  // Get available time slots for a doctor
  getAvailableTimeSlots: (doctorId, date) => 
    api.get(`/appointments/doctor/${doctorId}/available-slots?date=${date}`),
  
  // Doctor creates appointment for patient
  createAppointmentForPatient: (appointmentData) =>
    api.post('/appointments/doctor/create-appointment', appointmentData),
};



export default api;
