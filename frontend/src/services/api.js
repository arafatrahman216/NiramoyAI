import axios from 'axios';


//For Deployment
// const API_BASE_URL = 'https://niramoyai.up.railway.app/api';

// For local development
const API_BASE_URL = 'http://localhost:8080/api';


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
  sendMessage: (message, chatId, mode = 'explain', contextData = null) => {
    const payload = { 
      message, 
      chatId: chatId.toString(), 
      mode 
    };
    
    //CONTEXT: Include previous messages and visit context if available
    if (contextData) {
      if (contextData.previousMessages && contextData.previousMessages.length > 0) {
        const messageHistory = contextData.previousMessages
          .map((msg) => {
            //CONTEXT: Safe parsing of message properties
            const role = (msg.role || 'user').toString().toUpperCase();
            const content = (msg.content || msg.text || msg.message || '').toString().trim();
            return content ? `${role}: ${content}` : null;
          })
          .filter(Boolean) //CONTEXT: Remove empty messages
          .join('\n');

        if (messageHistory) {
          payload.message = `Previous conversation context:\n${messageHistory}\n\nCurrent query: ${message}`;
        }
      }

      console.log(payload);

      //CONTEXT: Include visit context information
      // if (contextData.visitContext) {
      //   const visitInfo = typeof contextData.visitContext === 'string' 
      //     ? contextData.visitContext 
      //     : JSON.stringify(contextData.visitContext);
      //   payload.message = `Visit context: ${visitInfo}\n\n${payload.message}`;
      // }
    }
    
    return api.post('/user/chat', payload);
  },
  
  // Send message with attachment to AI chatbot
  sendMessageWithAttachment: (message, chatId, attachment, mode = 'explain', contextData = null) => {
    const formData = new FormData();
    formData.append('message', message || '');
    formData.append('chatId', chatId.toString());
    formData.append('mode', mode);
    if (attachment) {
      formData.append('attachment', attachment);
    }
    
    //CONTEXT: Include previous messages and visit context as JSON strings
    // if (contextData) {
    //   if (contextData.previousMessages && contextData.previousMessages.length > 0) {
    //     formData.append('previousMessages', JSON.stringify(contextData.previousMessages));
    //   }
    //   if (contextData.visitContext) {
    //     formData.append('visitContext', JSON.stringify(contextData.visitContext));
    //   }
    // }
    
    return api.post('/user/chat-attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
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

  getRecentVisits : () => api.get('/user/recent-visits'),

  getMedicines : () => api.get('/user/medicines'),

  deleteMedicine : (id) => api.delete(`/user/medicines/${id}`),

  //CONTEXT: Fetch detailed visit information by visit ID
  getVisitDetails: (visitId) => api.get(`/user/visit/${visitId}`)

};

// Text-to-Speech API
export const ttsAPI = {
  generateSpeech: (text) => {
    console.log(text.length);
    text = text.replace(/'/g, "\\'").replace(/"/g, '\\"');
    return api.post('/user/tts', text, {
      responseType: 'blob', // Important: tells axios to expect binary data
      headers: {
        'Content-Type': 'text/plain' // Send as plain text, not JSON
      }
    })
  }
};



export const sharedProfileAPI = {
  getSharedProfile: (encryptedId) => 
    api.post('/public/shared', { encryptedId: encryptedId }),

  getShareableLink: () =>
    api.get('/user/profile/share')

};



export default api;
