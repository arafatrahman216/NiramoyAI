// src/utils/dummyData.js
// Centralized dummy/fallback data for the entire application
//
// CURRENT ACTIVE EXPORTS (use these for new components):
// - Dashboard Fallback Data:
//   * fallbackDashboardUser, fallbackDashboardVitals, fallbackDashboardVisits, fallbackDashboardProfile (Patient)
//   * fallbackDoctorAppointments, fallbackDoctorRecentVisits, fallbackDoctorStats, fallbackDoctorDashboardProfile (Doctor)
//
// DEPRECATED EXPORTS (kept for backward compatibility):
//   * fallbackRecentUserVisits, fallbackRecentDoctorVisits, fallbackStats
//
// COMPREHENSIVE DATA (organized by feature):
//   * User Profile, Health Vitals, Health Logs, Prescriptions, Test Reports, Visit Timeline, etc.

// User Profile Data
export const fallbackUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  role: 'patient'
};

// Patient Data
export const fallbackPatient = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-0123',
  dateOfBirth: '1985-06-15',
  gender: 'Male',
  address: '123 Main St, Anytown, ST 12345',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+1-555-0124',
    relationship: 'Spouse'
  },
  medicalHistory: {
    allergies: ['Penicillin', 'Shellfish'],
    chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
    bloodType: 'O+'
  },
  insurance: {
    provider: 'HealthCare Plus',
    policyNumber: 'HCP-123456789',
    groupNumber: 'GRP-001'
  }
};

// Doctor Profile Data
export const fallbackDoctorProfile = {
  id: 1,
  name: 'Dr. Emily Rodriguez',
  email: 'emily.rodriguez@hospital.com',
  phone: '+1-555-0199',
  specialization: 'Internal Medicine',
  experience: 12,
  education: 'MD from Johns Hopkins University',
  license: 'MD12345',
  department: 'Internal Medicine',
  hospital: 'City General Hospital',
  bio: 'Experienced internal medicine physician with expertise in diabetes management and preventive care.',
  profilePicture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
};

// Health Vitals Data
export const fallbackVitals = {
  bloodPressure: [
    { healthLogId: 1, date: '2025-09-01', time: '09:00', systolic: 125, diastolic: 82 },
    { healthLogId: 2, date: '2025-09-03', time: '14:30', systolic: 128, diastolic: 85 },
    { healthLogId: 3, date: '2025-09-05', time: '11:15', systolic: 122, diastolic: 79 },
    { healthLogId: 4, date: '2025-09-07', time: '16:45', systolic: 120, diastolic: 80 },
    { healthLogId: 5, date: '2025-09-09', time: '10:20', systolic: 118, diastolic: 78 },
    { healthLogId: 6, date: '2025-09-11', time: '08:30', systolic: 120, diastolic: 80 }
  ],
  heartRate: [
    { healthLogId: 1, date: '2025-09-01', time: '09:00', rate: 75 },
    { healthLogId: 2, date: '2025-09-03', time: '14:30', rate: 78 },
    { healthLogId: 3, date: '2025-09-05', time: '11:15', rate: 72 },
    { healthLogId: 4, date: '2025-09-07', time: '16:45', rate: 74 },
    { healthLogId: 5, date: '2025-09-09', time: '10:20', rate: 70 },
    { healthLogId: 6, date: '2025-09-11', time: '08:30', rate: 72 }
  ],
  temperature: [
    { healthLogId: 1, date: '2025-09-01', time: '09:00', temp: 98.4 },
    { healthLogId: 2, date: '2025-09-03', time: '14:30', temp: 98.6 },
    { healthLogId: 3, date: '2025-09-05', time: '11:15', temp: 98.2 },
    { healthLogId: 4, date: '2025-09-07', time: '16:45', temp: 98.5 },
    { healthLogId: 5, date: '2025-09-09', time: '10:20', temp: 98.3 },
    { healthLogId: 6, date: '2025-09-11', time: '08:30', temp: 98.6 }
  ],
  bloodSugar: [
    { healthLogId: 1, date: '2025-09-01', time: '09:00', sugar: 105 },
    { healthLogId: 2, date: '2025-09-03', time: '14:30', sugar: 112 },
    { healthLogId: 3, date: '2025-09-05', time: '11:15', sugar: 98 },
    { healthLogId: 4, date: '2025-09-07', time: '16:45', sugar: 108 },
    { healthLogId: 5, date: '2025-09-09', time: '10:20', sugar: 102 },
    { healthLogId: 6, date: '2025-09-11', time: '08:30', sugar: 95 }
  ],
  stressLevel: [
    { healthLogId: 1, date: '2025-09-01', time: '09:00', level: 3 },
    { healthLogId: 2, date: '2025-09-03', time: '14:30', level: 5 },
    { healthLogId: 3, date: '2025-09-05', time: '11:15', level: 2 },
    { healthLogId: 4, date: '2025-09-07', time: '16:45', level: 4 },
    { healthLogId: 5, date: '2025-09-09', time: '10:20', level: 3 },
    { healthLogId: 6, date: '2025-09-11', time: '08:30', level: 2 }
  ],
  diabetes: [
    { healthLogId: 1, date: '2025-09-01', time: '09:00', sugar: 105 },
    { healthLogId: 2, date: '2025-09-03', time: '14:30', sugar: 112 },
    { healthLogId: 3, date: '2025-09-05', time: '11:15', sugar: 98 },
    { healthLogId: 4, date: '2025-09-07', time: '16:45', sugar: 108 },
    { healthLogId: 5, date: '2025-09-09', time: '10:20', sugar: 102 },
    { healthLogId: 6, date: '2025-09-11', time: '08:30', sugar: 95 }
  ]
};

// Health Profile Data
export const fallbackProfile = {
  weight: 185,
  height: 180,
  bmi: 28.7,
  bloodType: 'O+',
  allergies: ['Penicillin', 'Shellfish'],
  chronicConditions: ['Type 2 Diabetes', 'Hypertension']
};

// Health Logs Data
export const fallbackHealthLogs = [
  {
    healthLogId: 1,
    date: '2025-09-11',
    time: '08:30',
    severity: 'normal',
    vitals: {
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 72,
      temperature: 98.6,
      weight: 185,
      bloodSugar: 95,
      oxygenSaturation: 98,
      stressLevel: 2
    },
    notes: 'Morning routine checkup. Feeling well, good energy levels.',
    symptoms: [],
    mood: 'Good'
  },
  {
    healthLogId: 2,
    date: '2025-09-09',
    time: '10:20',
    severity: 'normal',
    vitals: {
      bloodPressure: { systolic: 118, diastolic: 78 },
      heartRate: 70,
      temperature: 98.3,
      weight: 184,
      bloodSugar: 102,
      oxygenSaturation: 97,
      stressLevel: 3
    },
    notes: 'Post-exercise measurements. Completed 30-minute walk.',
    symptoms: [],
    mood: 'Energetic'
  },
  {
    healthLogId: 3,
    date: '2025-09-07',
    time: '16:45',
    severity: 'moderate',
    vitals: {
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 74,
      temperature: 98.5,
      weight: 185,
      bloodSugar: 108,
      oxygenSaturation: 98,
      stressLevel: 4
    },
    notes: 'Evening measurement after work. Slightly elevated stress.',
    symptoms: ['Mild headache'],
    mood: 'Tired'
  },
  {
    healthLogId: 4,
    date: '2025-09-05',
    time: '11:15',
    severity: 'normal',
    vitals: {
      bloodPressure: { systolic: 122, diastolic: 79 },
      heartRate: 72,
      temperature: 98.2,
      weight: 183,
      bloodSugar: 98,
      oxygenSaturation: 99,
      stressLevel: 2
    },
    notes: 'Mid-day checkup. Excellent glucose control today.',
    symptoms: [],
    mood: 'Excellent'
  },
  {
    healthLogId: 5,
    date: '2025-09-03',
    time: '14:30',
    severity: 'moderate',
    vitals: {
      bloodPressure: { systolic: 128, diastolic: 85 },
      heartRate: 78,
      temperature: 98.6,
      weight: 186,
      bloodSugar: 112,
      oxygenSaturation: 97,
      stressLevel: 5
    },
    notes: 'Afternoon reading. Blood pressure slightly elevated.',
    symptoms: ['Anxiety'],
    mood: 'Anxious'
  },
  {
    healthLogId: 6,
    date: '2025-09-01',
    time: '09:00',
    severity: 'normal',
    vitals: {
      bloodPressure: { systolic: 125, diastolic: 82 },
      heartRate: 75,
      temperature: 98.4,
      weight: 185,
      bloodSugar: 105,
      oxygenSaturation: 98,
      stressLevel: 3
    },
    notes: 'Weekly monitoring appointment. All parameters stable.',
    symptoms: [],
    mood: 'Stable'
  }
];

// Prescriptions Data
export const fallbackPrescriptions = [
  {
    id: 1,
    date: '2025-09-11',
    prescribedBy: 'Dr. Sarah Johnson',
    status: 'active',
    patientId: 1,
    diagnosis: 'Hypertension and Type 2 Diabetes',
    symptoms: 'Patient complaints of occasional headaches and fatigue',
    medicines: [
      {
        id: 1,
        name: 'Lisinopril',
        type: 'tab',
        morning: true,
        noon: false,
        evening: false,
        night: false,
        dose: '1 tablet',
        duration: '30 days',
        purpose: 'High blood pressure',
        instructions: 'Take with or without food. Monitor blood pressure regularly.'
      },
      {
        id: 2,
        name: 'Metformin',
        type: 'tab',
        morning: true,
        noon: false,
        evening: true,
        night: false,
        dose: '1 tablet',
        duration: '90 days',
        purpose: 'Type 2 diabetes',
        instructions: 'Take with meals to reduce stomach upset.'
      }
    ],
    tests: ['Blood Sugar (Fasting)', 'Blood Pressure Monitoring', 'HbA1c'],
    advice: 'Maintain regular exercise, low-sodium diet, and monitor blood pressure daily.',
    followUpDate: '2025-10-11',
    customInstructions: 'Check blood pressure daily and maintain log book.'
  },
  {
    id: 2,
    date: '2025-09-05',
    prescribedBy: 'Dr. Emily Rodriguez',
    status: 'active',
    patientId: 1,
    diagnosis: 'Bacterial Upper Respiratory Infection',
    symptoms: 'Cough, fever, and throat pain for 3 days',
    medicines: [
      {
        id: 1,
        name: 'Amoxicillin',
        type: 'cap',
        morning: true,
        noon: true,
        evening: true,
        night: false,
        dose: '1 capsule',
        duration: '7 days',
        purpose: 'Bacterial infection',
        instructions: 'Complete entire course even if feeling better.'
      },
      {
        id: 2,
        name: 'Paracetamol',
        type: 'tab',
        morning: false,
        noon: false,
        evening: false,
        night: false,
        dose: '1 tablet',
        duration: '5 days',
        purpose: 'Fever and pain',
        instructions: 'Take as needed for fever or pain. Maximum 4 tablets per day.'
      }
    ],
    tests: ['Complete Blood Count (CBC)', 'Throat Culture'],
    advice: 'Take adequate rest, drink plenty of fluids, and avoid cold drinks.',
    followUpDate: '2025-09-12',
    customInstructions: 'Return if symptoms worsen or fever persists after 3 days.'
  },
  {
    id: 3,
    date: '2025-08-28',
    prescribedBy: 'Dr. Michael Chen',
    status: 'completed',
    patientId: 1,
    diagnosis: 'Acid Reflux (GERD)',
    symptoms: 'Heartburn after meals, chest discomfort',
    medicines: [
      {
        id: 1,
        name: 'Omeprazole',
        type: 'cap',
        morning: true,
        noon: false,
        evening: false,
        night: false,
        dose: '1 capsule',
        duration: '30 days',
        purpose: 'Acid reflux',
        instructions: 'Take 30 minutes before breakfast on empty stomach.'
      }
    ],
    tests: ['Upper GI Endoscopy'],
    advice: 'Avoid spicy foods, caffeine, and late night meals. Eat smaller portions.',
    followUpDate: '2025-09-28',
    customInstructions: 'Maintain food diary to identify trigger foods.'
  }
];

// Test Reports Data
export const fallbackTestReports = [
  {
    id: 1,
    testName: 'Complete Blood Count (CBC)',
    testDateTime: '2025-09-10T09:30:00',
    summary: 'All blood cell counts within normal limits. No signs of infection, anemia, or bleeding disorders. White blood cells: 7.2 K/uL, Red blood cells: 4.5 M/uL, Hemoglobin: 14.2 g/dL.',
    urgency: 'normal',
    imageLinks: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop'
    ]
  },
  {
    id: 2,
    testName: 'Lipid Panel',
    testDateTime: '2025-09-10T09:30:00',
    summary: 'LDL cholesterol slightly elevated at 125 mg/dL (should be <100). Total cholesterol 195 mg/dL, HDL 45 mg/dL, Triglycerides 150 mg/dL. Recommend dietary modifications.',
    urgency: 'moderate',
    imageLinks: [
      'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=400&fit=crop'
    ]
  },
  {
    id: 3,
    testName: 'HbA1c (Glycated Hemoglobin)',
    testDateTime: '2025-09-08T11:15:00',
    summary: 'Diabetes well controlled with HbA1c at 6.8% (target <7.0%). Estimated average glucose 148 mg/dL. Continue current diabetes management plan.',
    urgency: 'normal',
    imageLinks: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop'
    ]
  },
  {
    id: 4,
    testName: 'Chest X-Ray',
    testDateTime: '2025-09-05T14:45:00',
    summary: 'Normal chest X-ray with clear lung fields and normal heart size. No acute cardiopulmonary abnormalities detected. Pleural spaces normal.',
    urgency: 'normal',
    imageLinks: [
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop'
    ]
  },
  {
    id: 5,
    testName: 'Electrocardiogram (ECG)',
    testDateTime: '2025-09-05T14:30:00',
    summary: 'Normal sinus rhythm at 95 bpm. No signs of acute cardiac ischemia, arrhythmia, or conduction abnormalities. QRS duration and QT interval within normal limits.',
    urgency: 'normal',
    imageLinks: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop'
    ]
  },
  {
    id: 6,
    testName: 'Comprehensive Metabolic Panel',
    testDateTime: '2025-08-28T10:00:00',
    summary: 'Fasting glucose elevated at 118 mg/dL (normal <100), consistent with diabetes diagnosis. Kidney function normal with creatinine 1.0 mg/dL and eGFR >60. Electrolytes balanced.',
    urgency: 'moderate',
    imageLinks: [
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop'
    ]
  }
];

// Visit Timeline Data
export const fallbackVisits = [
  {
    visitId: 1,
    appointmentDate: '2025-09-10T10:00:00.000Z',
    doctorName: 'Dr. Emily Rodriguez',
    symptoms: 'Routine diabetes management and glucose monitoring',
    prescription: 'Continue current medication regimen. Take Metformin 500mg twice daily with meals.',
    prescriptionFileUrl: 'https://example.com/prescriptions/prescription-1.pdf',
    testReportUrls: ['https://example.com/reports/hba1c-report-1.pdf', 'https://example.com/reports/lipid-panel-1.pdf'],
    medicines: [
      {
        medicineId: 1,
        medicineName: 'Metformin',
        doses: ['500mg'],
        frequency: ['08:00', '20:00'],
        instructions: 'Take twice daily with meals',
        type: 'Tablet',
        duration: '3 months'
      }
    ],
    healthLog: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      weight: 185,
      notes: 'Patient showing excellent glucose control. HbA1c improved from last visit.'
    }
  },
  {
    visitId: 2,
    appointmentDate: '2025-08-15T14:30:00.000Z',
    doctorName: 'Dr. Michael Chen',
    symptoms: 'Routine cardiac health assessment and hypertension monitoring',
    prescription: 'Continue Lisinopril, lifestyle modifications',
    prescriptionFileUrl: 'https://example.com/prescriptions/prescription-2.pdf',
    testReportUrls: ['https://example.com/reports/ecg-report-1.pdf', 'https://example.com/reports/echo-report-1.pdf'],
    medicines: [
      {
        medicineId: 2,
        medicineName: 'Lisinopril',
        doses: ['10mg'],
        frequency: ['09:00'],
        instructions: 'Take once daily in the morning',
        type: 'Tablet',
        duration: '1 year'
      }
    ],
    healthLog: {
      bloodPressure: '125/82',
      heartRate: 75,
      temperature: 98.4,
      weight: 187,
      notes: 'Blood pressure well controlled. ECG normal. Recommend continued exercise.'
    }
  },
  {
    visitId: 3,
    appointmentDate: '2025-07-20T11:15:00.000Z',
    doctorName: 'Dr. Sarah Johnson',
    symptoms: 'Cough, fever, and difficulty breathing for 3 days',
    prescription: 'Antibiotics prescribed, rest, fluids',
    prescriptionFileUrl: 'https://example.com/prescriptions/prescription-3.pdf',
    testReportUrls: ['https://example.com/reports/chest-xray-1.pdf', 'https://example.com/reports/throat-culture-1.pdf'],
    medicines: [
      {
        medicineId: 3,
        medicineName: 'Amoxicillin',
        doses: ['500mg'],
        frequency: ['08:00', '14:00', '20:00'],
        instructions: 'Take 3 times daily for 10 days',
        type: 'Capsule',
        duration: '10 days'
      },
      {
        medicineId: 4,
        medicineName: 'Ibuprofen',
        doses: ['400mg'],
        frequency: ['as needed'],
        instructions: 'As needed for fever and pain',
        type: 'Tablet',
        duration: 'As needed'
      }
    ],
    healthLog: {
      bloodPressure: '130/85',
      heartRate: 82,
      temperature: 100.2,
      weight: 186,
      notes: 'Chest X-ray clear. Prescribed 10-day course of Amoxicillin.'
    }
  },
  {
    visitId: 4,
    appointmentDate: '2025-06-05T09:00:00.000Z',
    doctorName: 'Dr. Emily Rodriguez',
    symptoms: 'Follow-up for diabetes management and medication adjustment',
    prescription: 'Metformin dosage adjustment - increased to 500mg twice daily',
    prescriptionFileUrl: 'https://example.com/prescriptions/prescription-4.pdf',
    testReportUrls: ['https://example.com/reports/hba1c-report-2.pdf', 'https://example.com/reports/glucose-report-1.pdf'],
    medicines: [
      {
        medicineId: 1,
        medicineName: 'Metformin',
        doses: ['500mg'],
        frequency: ['08:00', '20:00'],
        instructions: 'Take twice daily with meals (increased dose)',
        type: 'Tablet',
        duration: '3 months'
      }
    ],
    healthLog: {
      bloodPressure: '128/84',
      heartRate: 78,
      temperature: 98.5,
      weight: 188,
      notes: 'HbA1c slightly elevated. Increased Metformin to 500mg twice daily.'
    }
  },
  {
    visitId: 5,
    appointmentDate: '2025-05-12T15:45:00.000Z',
    doctorName: 'Dr. Lisa Park',
    symptoms: 'Comprehensive diabetes evaluation and management optimization',
    prescription: 'Comprehensive diabetes education, meal planning with dual therapy',
    prescriptionFileUrl: 'https://example.com/prescriptions/prescription-5.pdf',
    testReportUrls: ['https://example.com/reports/metabolic-panel-1.pdf', 'https://example.com/reports/microalbumin-1.pdf'],
    medicines: [
      {
        medicineId: 1,
        medicineName: 'Metformin',
        doses: ['500mg'],
        frequency: ['08:00', '20:00'],
        instructions: 'Continue twice daily with meals',
        type: 'Tablet',
        duration: '3 months'
      },
      {
        medicineId: 5,
        medicineName: 'Glipizide',
        doses: ['5mg'],
        frequency: ['07:30'],
        instructions: 'Take once daily before breakfast',
        type: 'Tablet',
        duration: '3 months'
      }
    ],
    healthLog: {
      bloodPressure: '132/88',
      heartRate: 80,
      temperature: 98.3,
      weight: 190,
      notes: 'Extensive review of diabetes management. Patient enrolled in diabetes education program.'
    }
  }
];

// Appointments Data (for Doctor Dashboard)
export const fallbackAppointments = [
  {
    id: 1,
    patientName: 'John Doe',
    time: '09:00 AM',
    type: 'Follow-up',
    status: 'confirmed',
    duration: 30,
    reason: 'Diabetes checkup'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    time: '10:30 AM',
    type: 'New Patient',
    status: 'confirmed',
    duration: 45,
    reason: 'Initial consultation'
  },
  {
    id: 3,
    patientName: 'Mike Johnson',
    time: '11:30 AM',
    type: 'Urgent',
    status: 'pending',
    duration: 20,
    reason: 'Chest pain evaluation'
  },
  {
    id: 4,
    patientName: 'Sarah Wilson',
    time: '02:00 PM',
    type: 'Follow-up',
    status: 'confirmed',
    duration: 30,
    reason: 'Hypertension monitoring'
  },
  {
    id: 5,
    patientName: 'Robert Brown',
    time: '03:30 PM',
    type: 'Physical',
    status: 'confirmed',
    duration: 60,
    reason: 'Annual physical exam'
  }
];

// Recent Visits Data (for User Dashboard) - DEPRECATED - Use fallbackDashboardVisits instead
export const fallbackRecentUserVisits = [
  { 
    appointmentDate: "2025-09-10", 
    doctorName: "Dr. Emily Rodriguez", 
    symptoms: "Diabetes checkup",
    prescription: "Continue current medications",
    prescriptionFileUrl: "https://via.placeholder.com/400x300/374151/f3f4f6?text=Prescription+Image"
  },
  { 
    appointmentDate: "2025-08-15", 
    doctorName: "Dr. Michael Chen", 
    symptoms: "Cardiac screening",
    prescription: "Annual follow-up scheduled for 2026-02-15",
    prescriptionFileUrl: "https://via.placeholder.com/400x300/374151/f3f4f6?text=Lab+Results"
  }
];

// Recent Visits Data (for Doctor Dashboard) - DEPRECATED - Use fallbackDoctorRecentVisits instead
export const fallbackRecentDoctorVisits = [
  {
    id: 1,
    patientName: 'Alice Johnson',
    visitDate: '2025-09-11',
    diagnosis: 'Hypertension follow-up',
    treatment: 'Continue current medication regimen',
    notes: 'Patient showing excellent blood pressure control. Continue lifestyle modifications.',
    status: 'completed'
  },
  {
    id: 2,
    patientName: 'Bob Smith',
    visitDate: '2025-09-11',
    diagnosis: 'Type 2 Diabetes monitoring',
    treatment: 'Metformin dosage adjustment',
    notes: 'HbA1c improved from last visit. Patient adhering well to diet plan.',
    status: 'completed'
  },
  {
    id: 3,
    patientName: 'Carol Davis',
    visitDate: '2025-09-10',
    diagnosis: 'Annual physical examination',
    treatment: 'Preventive care recommendations',
    notes: 'Overall health excellent. Recommended routine screenings.',
    status: 'completed'
  },
  {
    id: 4,
    patientName: 'David Wilson',
    visitDate: '2025-09-10',
    diagnosis: 'Chest pain evaluation',
    treatment: 'Further cardiac assessment recommended',
    notes: 'ECG normal, referred to cardiologist for stress test.',
    status: 'completed'
  }
];

// Doctor Dashboard Stats - DEPRECATED - Use fallbackDoctorStats instead
export const fallbackStats = {
  todayAppointments: 8,
  totalPatients: 156,
  completedToday: 3,
  pendingReports: 12
};

// Dashboard Fallback Data - Patient Dashboard
export const fallbackDashboardUser = {
  name: "John Doe",
  lastName: "Doe",
  username: "johndoe",
  email: "john@example.com",
  phoneNumber: "0123456789",
  role: "PATIENT",
  status: "Active",
};

export const fallbackDashboardVitals = {
  bloodPressure: [],
  diabetes: [],
  heartRate: [],
};

export const fallbackDashboardVisits = [];

export const fallbackDashboardProfile = {
  allergies: "...",
  bloodGroup: "...",
  height: "...",
  weight: "...",
  chronicDiseases: "...",
  systolic: "...",
  diastolic: "...",
  heartRate: "...",
  majorEvents : "...",
  majorHealthEvents: "...",
  lifestyle: "...",
};

// Dashboard Fallback Data - Doctor Dashboard
export const fallbackDoctorAppointments = [
  {
    id: 1,
    appointmentTime: "09:00:00",
    patient: {
      firstName: "John",
      lastName: "Doe"
    },
    consultationType: "REGULAR",
    status: "SCHEDULED",
    symptoms: "Chest pain and shortness of breath during physical activity"
  },
  {
    id: 2,
    appointmentTime: "10:30:00",
    patient: {
      firstName: "Sarah",
      lastName: "Johnson"
    },
    consultationType: "FOLLOW_UP",
    status: "SCHEDULED",
    symptoms: "Follow-up for diabetes management and blood sugar monitoring"
  },
  {
    id: 3,
    appointmentTime: "14:15:00",
    patient: {
      firstName: "Michael",
      lastName: "Brown"
    },
    consultationType: "EMERGENCY",
    status: "COMPLETED",
    symptoms: "Severe headache with nausea and dizziness"
  },
  {
    id: 4,
    appointmentTime: "16:00:00",
    patient: {
      firstName: "Emily",
      lastName: "Davis"
    },
    consultationType: "REGULAR",
    status: "CANCELLED",
    symptoms: "Regular checkup and blood pressure monitoring"
  },
  {
    id: 5,
    appointmentTime: "11:45:00",
    patient: {
      firstName: "James",
      lastName: "Wilson"
    },
    consultationType: "REGULAR",
    status: "SCHEDULED",
    symptoms: "Persistent cough and fever for the past week"
  },
  {
    id: 6,
    appointmentTime: "15:30:00",
    patient: {
      firstName: "Maria",
      lastName: "Garcia"
    },
    consultationType: "FOLLOW_UP",
    status: "SCHEDULED",
    symptoms: "Post-surgery follow-up and wound inspection"
  }
];

export const fallbackDoctorRecentVisits = [
  {
    id: 1,
    patientName: "Robert Wilson",
    visitDate: "2025-09-10",
    diagnosis: "Hypertension Stage 1",
    treatment: "Lisinopril 10mg daily, lifestyle modifications",
    notes: "Patient responded well to initial treatment. Blood pressure improved from 150/95 to 135/85."
  },
  {
    id: 2,
    patientName: "Lisa Anderson",
    visitDate: "2025-09-09",
    diagnosis: "Type 2 Diabetes Mellitus",
    treatment: "Metformin 500mg twice daily, dietary counseling",
    notes: "HbA1c levels decreased from 8.2% to 7.1%. Continue current medication."
  },
  {
    id: 3,
    patientName: "David Martinez",
    visitDate: "2025-09-08",
    diagnosis: "Acute Bronchitis",
    treatment: "Amoxicillin 500mg TID x 7 days, rest",
    notes: "Symptoms improving with antibiotic therapy. Follow up if no improvement in 3-4 days."
  },
  {
    id: 4,
    patientName: "Jennifer Taylor",
    visitDate: "2025-09-07",
    diagnosis: "Migraine with Aura",
    treatment: "Sumatriptan 50mg PRN, lifestyle modifications",
    notes: "Patient reports 70% reduction in migraine frequency with new medication regimen."
  },
  {
    id: 5,
    patientName: "Thomas Garcia",
    visitDate: "2025-09-06",
    diagnosis: "Gastroesophageal Reflux Disease",
    treatment: "Omeprazole 20mg daily, dietary changes",
    notes: "GERD symptoms well controlled. Patient educated on trigger foods to avoid."
  },
  {
    id: 6,
    patientName: "Amanda Rodriguez",
    visitDate: "2025-09-05",
    diagnosis: "Allergic Rhinitis",
    treatment: "Cetirizine 10mg daily, nasal spray",
    notes: "Seasonal allergies managed effectively. Patient advised to continue current regimen."
  },
  {
    id: 7,
    patientName: "Christopher Lee",
    visitDate: "2025-09-04",
    diagnosis: "Lower Back Pain",
    treatment: "Physical therapy, NSAIDs as needed",
    notes: "MRI shows no structural abnormalities. Patient responding well to conservative treatment."
  },
  {
    id: 8,
    patientName: "Patricia Moore",
    visitDate: "2025-09-03",
    diagnosis: "Anxiety Disorder",
    treatment: "Sertraline 25mg daily, therapy referral",
    notes: "Patient showing improvement with medication and counseling. Follow-up in 6 weeks."
  }
];

export const fallbackDoctorStats = {
  todayAppointments: 4,
  upcomingAppointments: 12,
  totalCompletedAppointments: 248,
  weeklyAppointments: 28
};

export const fallbackDoctorDashboardProfile = {
  specialization: "Internal Medicine",
  degree: "MD, MBBS",
  hospitalName: "City General Hospital",
  available: true,
  rating: 4.8,
  totalReviews: 156,
  experience: 12,
  licenseNumber: "MD12345"
};
