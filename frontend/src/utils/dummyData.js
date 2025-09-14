// src/utils/dummyData.js
// Centralized dummy/fallback data for the entire application

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
    { healthLogId: 1, date: '2025-09-01', time: '09:00', level: 105 },
    { healthLogId: 2, date: '2025-09-03', time: '14:30', level: 112 },
    { healthLogId: 3, date: '2025-09-05', time: '11:15', level: 98 },
    { healthLogId: 4, date: '2025-09-07', time: '16:45', level: 108 },
    { healthLogId: 5, date: '2025-09-09', time: '10:20', level: 102 },
    { healthLogId: 6, date: '2025-09-11', time: '08:30', level: 95 }
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
    { healthLogId: 1, date: '2025-09-01', time: '09:00', level: 105 },
    { healthLogId: 2, date: '2025-09-03', time: '14:30', level: 112 },
    { healthLogId: 3, date: '2025-09-05', time: '11:15', level: 98 },
    { healthLogId: 4, date: '2025-09-07', time: '16:45', level: 108 },
    { healthLogId: 5, date: '2025-09-09', time: '10:20', level: 102 },
    { healthLogId: 6, date: '2025-09-11', time: '08:30', level: 95 }
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
    id: 1,
    date: '2025-09-10',
    time: '10:00 AM',
    type: 'routine',
    doctor: 'Dr. Emily Rodriguez',
    department: 'Internal Medicine',
    location: 'Room 301A',
    reason: 'Quarterly diabetes checkup',
    chiefComplaint: 'Routine diabetes management and glucose monitoring',
    diagnosis: 'Type 2 Diabetes - Well Controlled',
    treatment: 'Continue current medication regimen',
    notes: 'Patient showing excellent glucose control. HbA1c improved from last visit.',
    vitals: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      weight: 185
    },
    procedures: ['Blood glucose test', 'HbA1c test'],
    prescriptions: [
      {
        medication: 'Metformin 500mg',
        instruction: 'Take twice daily with meals'
      }
    ],
    labsOrdered: ['HbA1c', 'Lipid Panel', 'Kidney Function'],
    duration: '45 minutes',
    cost: '$150',
    status: 'completed',
    followUp: 'Schedule follow-up in 3 months (2025-12-10)'
  },
  {
    id: 2,
    date: '2025-08-15',
    time: '2:30 PM',
    type: 'routine',
    doctor: 'Dr. Michael Chen',
    department: 'Cardiology',
    location: 'Cardiology Wing B',
    reason: 'Annual cardiac screening',
    chiefComplaint: 'Routine cardiac health assessment and hypertension monitoring',
    diagnosis: 'Hypertension - Stable',
    treatment: 'Continue Lisinopril, lifestyle modifications',
    notes: 'Blood pressure well controlled. ECG normal. Recommend continued exercise.',
    vitals: {
      bloodPressure: '125/82',
      heartRate: 75,
      temperature: 98.4,
      weight: 187
    },
    procedures: ['ECG', 'Echocardiogram'],
    prescriptions: [
      {
        medication: 'Lisinopril 10mg',
        instruction: 'Take once daily in the morning'
      }
    ],
    labsOrdered: ['Lipid Panel', 'BNP'],
    duration: '60 minutes',
    cost: '$250',
    status: 'completed',
    followUp: 'Annual follow-up scheduled for 2026-02-15'
  },
  {
    id: 3,
    date: '2025-07-20',
    time: '11:15 AM',
    type: 'urgent',
    doctor: 'Dr. Sarah Johnson',
    department: 'Emergency Medicine',
    location: 'ER Bay 3',
    reason: 'Acute respiratory symptoms',
    chiefComplaint: 'Cough, fever, and difficulty breathing for 3 days',
    diagnosis: 'Upper Respiratory Infection',
    treatment: 'Antibiotics prescribed, rest, fluids',
    notes: 'Chest X-ray clear. Prescribed 10-day course of Amoxicillin.',
    vitals: {
      bloodPressure: '130/85',
      heartRate: 82,
      temperature: 100.2,
      weight: 186
    },
    procedures: ['Chest X-ray', 'Throat culture'],
    prescriptions: [
      {
        medication: 'Amoxicillin 500mg',
        instruction: 'Take 3 times daily for 10 days'
      },
      {
        medication: 'Ibuprofen 400mg',
        instruction: 'As needed for fever and pain'
      }
    ],
    labsOrdered: ['CBC', 'CRP'],
    duration: '30 minutes',
    cost: '$200',
    status: 'completed',
    followUp: 'Return if symptoms worsen or persist beyond 10 days'
  },
  {
    id: 4,
    date: '2025-06-05',
    time: '9:00 AM',
    type: 'follow-up',
    doctor: 'Dr. Emily Rodriguez',
    department: 'Internal Medicine',
    location: 'Room 301A',
    reason: 'Diabetes management follow-up',
    chiefComplaint: 'Follow-up for diabetes management and medication adjustment',
    diagnosis: 'Type 2 Diabetes',
    treatment: 'Metformin dosage adjustment',
    notes: 'HbA1c slightly elevated. Increased Metformin to 500mg twice daily.',
    vitals: {
      bloodPressure: '128/84',
      heartRate: 78,
      temperature: 98.5,
      weight: 188
    },
    procedures: ['Blood glucose monitoring'],
    prescriptions: [
      {
        medication: 'Metformin 500mg',
        instruction: 'Take twice daily with meals (increased dose)'
      }
    ],
    labsOrdered: ['HbA1c', 'Fasting glucose'],
    duration: '30 minutes',
    cost: '$125',
    status: 'completed',
    followUp: 'Follow-up in 3 months (2025-09-05)'
  },
  {
    id: 5,
    date: '2025-05-12',
    time: '3:45 PM',
    type: 'specialist',
    doctor: 'Dr. Lisa Park',
    department: 'Endocrinology',
    location: 'Specialty Clinic 2B',
    reason: 'Diabetes specialist consultation',
    chiefComplaint: 'Comprehensive diabetes evaluation and management optimization',
    diagnosis: 'Type 2 Diabetes - Needs Optimization',
    treatment: 'Comprehensive diabetes education, meal planning',
    notes: 'Extensive review of diabetes management. Patient enrolled in diabetes education program.',
    vitals: {
      bloodPressure: '132/88',
      heartRate: 80,
      temperature: 98.3,
      weight: 190
    },
    procedures: ['Comprehensive metabolic panel', 'Diabetic foot exam'],
    prescriptions: [
      {
        medication: 'Metformin 500mg',
        instruction: 'Continue twice daily with meals'
      },
      {
        medication: 'Glipizide 5mg',
        instruction: 'Take once daily before breakfast'
      }
    ],
    labsOrdered: ['HbA1c', 'Microalbumin', 'Lipid Panel'],
    duration: '90 minutes',
    cost: '$300',
    status: 'completed',
    followUp: 'Return in 3 months for comprehensive review (2025-08-12)'
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

// Recent Visits Data (for User Dashboard)
export const fallbackRecentUserVisits = [
  { date: '2025-09-10', doctor: 'Dr. Emily Rodriguez', reason: 'Diabetes checkup' },
  { date: '2025-08-15', doctor: 'Dr. Michael Chen', reason: 'Cardiac screening' }
];

// Recent Visits Data (for Doctor Dashboard)
export const fallbackRecentDoctorVisits = [
  {
    id: 1,
    patientName: 'Alice Johnson',
    date: '2025-09-11',
    diagnosis: 'Hypertension follow-up',
    status: 'completed'
  },
  {
    id: 2,
    patientName: 'Bob Smith',
    date: '2025-09-11',
    diagnosis: 'Type 2 Diabetes monitoring',
    status: 'completed'
  },
  {
    id: 3,
    patientName: 'Carol Davis',
    date: '2025-09-10',
    diagnosis: 'Annual physical examination',
    status: 'completed'
  },
  {
    id: 4,
    patientName: 'David Wilson',
    date: '2025-09-10',
    diagnosis: 'Chest pain evaluation',
    status: 'completed'
  }
];

// Doctor Dashboard Stats
export const fallbackStats = {
  todayAppointments: 8,
  totalPatients: 156,
  completedToday: 3,
  pendingReports: 12
};
