import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';


// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds timeout for AI processing
});

// Add request interceptor to include auth token and debug logging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug logging for all API requests
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  // console.log(`📤 Request data:`, config.data);
  // console.log(`📋 Request headers:`, config.headers);
  
  return config;
});

// Add response interceptor for debug logging
api.interceptors.response.use(
  (response) => {
    // Success response logging
    console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log(`📥 Response data:`, response.data);
    return response;
  },
  (error) => {
    // Error response logging
    console.error(`❌ API Error: ${error.response?.status || 'Network Error'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.error(`📥 Error response:`, error.response?.data);
    console.error(`🔥 Full error:`, error);
    return Promise.reject(error);
  }
);

export { API_BASE_URL };





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

  getPatientInfo : (id) => api.post('/doctor/patient', {"id": id}),
  
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
  sendMessage: (message, chatId, mode = 'explain') => 
    api.post('/user/chat', { message, chatId: chatId.toString(), mode }),
  
  // Get conversation history
  getConversation: (conversationId) => 
    api.get(`/chatbot/conversation/${conversationId}`),
  
  // Start new conversation
  startConversation: () => 
    api.post('/user/start-conversation'),

  // Get user's chat sessions
  getChatSessions: () => 
    api.get('/user/chat-sessions'),

  getVoiceMessage : (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    return api.post('/user/audio', formData);
  },

  // Get messages for a specific chat
  getMessages: (chatId) => 
    api.post('/user/message', { chatId: chatId.toString() }),
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







// Diagnosis Interface Job
export const agentAPI = {

  searchAPI: (query) => 
    api.post('/agent/search', { query })
  

};


//Patient submission end API
export const patientAPI = {
  submitHealthData: (healthData) =>
    api.post('/user/health-profile', healthData),
}


//Diagnosis interface API
export const diagnosisAPI = { 
  uploadVisitData: (visitData) =>
    api.post('/user/upload-visit', visitData),

}

// Symptoms-based doctor search API
export const symptomsAPI = {
  searchDoctorsBySymptoms: (query) =>
    api.post('/public/query', { query }),
};




export const userInfoAPI = {
  getUserProfile: () => api.get('/user/profile'),

  updateUserProfile: (editData) => api.patch('/user/profile', editData) ,

  uploadProfilePic : (formData ) => api.post('/upload/image', formData),

  getDashboardData: () => api.get('/user/dashboard'),

  getHealthLog : ()=> api.get('/user/health-log'),

  getRecentVisits : () => api.get('/user/recent-visits')

};

// Text-to-Speech API
export const ttsAPI = {
  generateSpeech: (text) => {
    console.log(text.length);
    return api.post('/user/tts', text, {
      responseType: 'blob', // Important: tells axios to expect binary data
      headers: {
        'Content-Type': 'text/plain' // Send as plain text, not JSON
      }
    })
  }
};

export default api;
