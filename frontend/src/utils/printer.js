// printer.js - Print utility functions for health profiles

/**
 * Prints a health profile with professional medical formatting
 * @param {Object} profile - User profile data
 * @param {Array} healthLogs - Array of health log entries
 */
export const printHealthProfile = (profile, healthLogs = []) => {
  // Validate data before printing
  if (!profile) {
    console.error('Profile data not available for printing');
    return;
  }

  // Ensure healthLogs is an array and filter out any invalid entries
  const validHealthLogs = Array.isArray(healthLogs) ? healthLogs.filter(log => log && typeof log === 'object') : [];

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Create print-friendly styles
  const printStyles = `
    <style>
      @media print {
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .no-print { display: none !important; }
        .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
        .print-section { margin-bottom: 25px; page-break-inside: avoid; }
        .print-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333; }
        .print-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
        .print-item { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .print-label { font-weight: bold; color: #555; font-size: 12px; }
        .print-value { color: #333; font-size: 14px; margin-top: 2px; }
        .print-vitals { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .print-vital-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .print-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
      }
    </style>
  `;

  // Generate print content
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Health Profile - ${profile?.name || 'Unknown'}</title>
        ${printStyles}
      </head>
      <body>
        <div class="print-header">
          <h1>Health Profile</h1>
          <h2>${profile?.name || 'Unknown Patient'}</h2>
          <p>Generated on: ${new Date().toDateString()}</p>
        </div>

        <div class="print-section">
          <div class="print-title">Personal Information</div>
          <div class="print-grid">
            <div class="print-item">
              <div class="print-label">Full Name</div>
              <div class="print-value">${profile?.name || 'N/A'}</div>
            </div>
            <div class="print-item">
              <div class="print-label">Age</div>
              <div class="print-value">${calculateAge(profile?.dateOfBirth)} years</div>
            </div>
            <div class="print-item">
              <div class="print-label">Gender</div>
              <div class="print-value">${profile?.gender || 'N/A'}</div>
            </div>
            <div class="print-item">
              <div class="print-label">Blood Type</div>
              <div class="print-value">${profile?.bloodType || 'N/A'}</div>
            </div>
            <div class="print-item">
              <div class="print-label">Location</div>
              <div class="print-value">${profile?.address || 'N/A'}</div>
            </div>
            <div class="print-item">
              <div class="print-label">Allergies</div>
              <div class="print-value">${profile?.allergies || 'None reported'}</div>
            </div>
          </div>
        </div>

        <div class="print-section">
          <div class="print-title">Current Vitals </div>
          <div class="print-vitals">
            <div class="print-vital-card">
              <div class="print-label">Blood Pressure</div>
              <div class="print-value">${profile?.bloodPressure || 'N/A'} mmHg</div>
            </div>
            <div class="print-vital-card">
              <div class="print-label">Heart Rate</div>
              <div class="print-value">${profile?.heartRate || 'N/A'} bpm</div>
            </div>
            <div class="print-vital-card">
              <div class="print-label">Height</div>
              <div class="print-value">${profile?.height || 'N/A'} cm</div>
            </div>
            <div class="print-vital-card">
              <div class="print-label">Weight</div>
              <div class="print-value">${profile?.weight || 'N/A'} lbs</div>
            </div>
          </div>
        </div>

        ${validHealthLogs.length > 0 ? `
          <div class="print-section">
            <div class="print-title">Recent Health Logs</div>
            ${validHealthLogs.slice(0, 5).map(log => `
              <div class="print-item" style="margin-bottom: 10px;">
                <div class="print-label">Date: ${new Date(log?.logDatetime).toDateString() || 'N/A'}</div>
                <div class="print-value"><strong>Symptoms:</strong> ${(log?.otherSymptoms && Array.isArray(log.otherSymptoms)) ? log.otherSymptoms.join(', ') : 'None reported'}</div>
                <div class="print-value"><strong>Notes:</strong> ${log?.notes || 'No notes'}</div>
                <div class="print-value"><strong>Stress Level:</strong> ${log?.stressLevel || 'N/A'}/10</div>
                <div class="print-value"><strong>BP :</strong> ${log?.stressbloodPressure || 'N/A'}</div>
                <div class="print-value"><strong> Heart Rate:</strong> ${log?.heartRate || 'N/A'} bpm</div>
                <div class="print-value"><strong> Temperature :</strong> ${log?.temperature || 'N/A'} degree F</div>
                <div class="print-value"><strong> Weight:</strong> ${log?.weight || 'N/A'} kg</div>
                <div class="print-value"><strong> Blood Sugar:</strong> ${log?.bloodSugar || 'N/A'} mg/dL</div>
                <div class="print-value"><strong> Oxygen Saturation:</strong> ${log?.oxygenSaturation || 'N/A'} %</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="print-footer">
          <p><strong>NiramoyAI Health Profile</strong></p>
          <p>This document contains basic health information and is for reference purposes only.</p>
          <p>For medical advice, please consult with a qualified healthcare professional.</p>
        </div>
      </body>
    </html>
  `;

  // Open print window
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Unable to open print window. Pop-up blocked?');
      return;
    }
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  } catch (error) {
    console.error('Error during printing:', error);
  }
};

/**
 * Prints a simplified version of the health profile
 * @param {Object} profile - User profile data
 */
export const printBasicProfile = (profile) => {
  if (!profile) {
    console.error('Profile data not available for printing');
    return;
  }

  const basicContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Basic Profile - ${profile?.name || 'Unknown'}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .info { margin-bottom: 10px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Basic Health Profile</h1>
          <h2>${profile?.name || 'Unknown Patient'}</h2>
        </div>
        <div class="info"><span class="label">Name:</span> ${profile?.name || 'N/A'}</div>
        <div class="info"><span class="label">Gender:</span> ${profile?.gender || 'N/A'}</div>
        <div class="info"><span class="label">Blood Type:</span> ${profile?.bloodType || 'N/A'}</div>
        <div class="info"><span class="label">Allergies:</span> ${profile?.allergies || 'None reported'}</div>
        <div class="info"><span class="label">Generated:</span> ${new Date().toLocaleDateString()}</div>
      </body>
    </html>
  `;

  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Unable to open print window. Pop-up blocked?');
      return;
    }
    
    printWindow.document.write(basicContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  } catch (error) {
    console.error('Error during printing:', error);
  }
};

/**
 * Converts visit data into natural language summaries
 * @param {Array} visits - Array of visit data
 * @returns {Array} Array of formatted visit summaries
 */
const generateVisitSummaries = (visits = []) => {
  if (!Array.isArray(visits) || visits.length === 0) {
    return ['No recent visits recorded.'];
  }

  return visits.map((visit, index) => {
    const visitDate = visit.appointmentDate || visit.visitDate || 'Unknown date';
    const doctor = visit.doctor || visit.doctorName || 'Unknown doctor';
    const symptoms = Array.isArray(visit.symptoms) ? visit.symptoms : (visit.symptoms ? [visit.symptoms] : []);
    const diagnosis = visit.prescription || visit.condition || 'Not specified';

    let summary = `Visit ${index + 1}: On ${visitDate}, the patient consulted with ${doctor} `;
    
    if (symptoms.length > 0) {
      summary += `The patient presented with symptoms including ${symptoms.join(', ')}. `;
    }
    
    if (diagnosis && diagnosis !== 'Not specified') {
      summary += `The diagnosis was ${diagnosis}. `;
    }

    return summary;
  });
};

/**
 * Prints a comprehensive medical summary with selected sections
 * @param {Object} printData - Object containing selected data sections
 */
export const printMedicalSummary = (printData) => {
  const { userProfile, healthProfile, visitSummaries } = printData;

  if (!userProfile && !healthProfile && !visitSummaries) {
    console.error('No data selected for printing');
    return;
  }

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Compact, elegant medical report styles - 1-2 page design
  const printStyles = `
    <style>
      @media print {
        * { box-sizing: border-box; }
        body { 
          margin: 0; 
          padding: 15px; 
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; 
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          background: #fff;
        }
        .report-container {
          max-width: 100%;
          margin: 0 auto;
          background: white;
        }
        .header { 
          background: linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transform: translate(30px, -30px);
        }
        .header h1 { 
          margin: 0 0 5px 0; 
          font-size: 24px; 
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        .header p { 
          margin: 0; 
          opacity: 0.9; 
          font-size: 14px;
          position: relative;
          z-index: 1;
        }
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .section {
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
          page-break-inside: avoid;
        }
        .section-header {
          background: linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 100%);
          padding: 12px 16px;
          border-bottom: 2px solid #4F46E5;
          margin: 0;
        }
        .section-title {
          color: #4F46E5;
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .section-content {
          padding: 16px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 10px;
          color: #6B7280;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .info-value {
          font-size: 13px;
          color: #111827;
          font-weight: 500;
        }
        .vitals-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }
        .vital-card {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
          position: relative;
        }
        .vital-label {
          font-size: 9px;
          opacity: 0.9;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .vital-value {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .vital-unit {
          font-size: 9px;
          opacity: 0.8;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .visits-section {
          margin-top: 20px;
        }
        .visit-item {
          background: #F8FAFC;
          border-left: 4px solid #4F46E5;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 0 4px 4px 0;
        }
        .visit-date {
          font-size: 11px;
          color: #4F46E5;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .visit-summary {
          font-size: 12px;
          line-height: 1.4;
          color: #374151;
        }
        .emergency-contact {
          background: linear-gradient(90deg, #FEF2F2 0%, #FEE2E2 100%);
          border: 1px solid #FECACA;
          border-radius: 6px;
          padding: 10px;
          margin-top: 10px;
        }
        .footer {
          margin-top: 20px;
          padding: 15px;
          background: #F9FAFB;
          border-radius: 6px;
          text-align: center;
          font-size: 10px;
          color: #6B7280;
          border-top: 2px solid #4F46E5;
        }
        .medical-list {
          font-size: 11px;
          line-height: 1.4;
          color: #374151;
        }
        .compact-text {
          font-size: 11px;
          line-height: 1.3;
          margin: 4px 0;
        }
        .medical-history-section {
          background: #FEFEFE;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 15px;
          margin-top: 0px;
          margin-bottom: 15px;
          break-inside: auto;
        }
        .history-subsection {
          margin-bottom: 15px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F3F4F6;
        }
        .history-subsection:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .subsection-title {
          font-size: 13px;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 2px solid #4F46E5;
          display: inline-block;
        }
        .history-text {
          font-size: 12px;
          line-height: 1.5;
          color: #374151;
          margin: 0;
          text-align: justify;
        }
        @media print {
          .vital-card { break-inside: avoid; }
          .visit-item { break-inside: avoid; }
          .history-subsection { break-inside: avoid; }
          .medical-history-section { break-inside: auto; }
          body { margin: 0; padding: 15px; }
          .section { margin-bottom: 10px; }
        }
      }
    </style>`;

  // Build compact content sections
  let contentSections = '';
  console.log(healthProfile);

  // Patient Information Section (Left Column)
  if (userProfile) {
    const age = calculateAge(healthProfile?.dateOfBirth);
    contentSections += `
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">Patient Information</h3>
        </div>
        <div class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Full Name</div>
              <div class="info-value">${userProfile.name || userProfile.fullName || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Age</div>
              <div class="info-value">${age} years</div>
            </div>
            <div class="info-item">
              <div class="info-label">Gender</div>
              <div class="info-value">${userProfile.gender || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Blood Type</div>
              <div class="info-value">${healthProfile?.bloodType || healthProfile.bloodGroup || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Phone</div>
              <div class="info-value">${userProfile.phone || userProfile.phoneNumber || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Date of Birth</div>
              <div class="info-value">${healthProfile?.dateOfBirth || 'N/A'}</div>
            </div>
          </div>
          ${userProfile.emergencyContact ? `
            <div class="emergency-contact">
              <div class="info-label">Emergency Contact</div>
              <div class="info-value compact-text">${userProfile.emergencyContact}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Health Profile & Vitals Section (Right Column)
  if (healthProfile) {
    contentSections += `
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">Current Health Status</h3>
        </div>
        <div class="section-content">
          <div class="vitals-row">
            ${healthProfile.height ? `
              <div class="vital-card">
                <div class="vital-label">Height</div>
                <div class="vital-value">${healthProfile.height}</div>
                <div class="vital-unit">cm</div>
              </div>
            ` : ''}
            ${healthProfile.weight ? `
              <div class="vital-card">
                <div class="vital-label">Weight</div>
                <div class="vital-value">${healthProfile.weight}</div>
                <div class="vital-unit">kg</div>
              </div>
            ` : ''}
            ${healthProfile.bmi ? `
              <div class="vital-card">
                <div class="vital-label">BMI</div>
                <div class="vital-value">${healthProfile.bmi}</div>
                <div class="vital-unit">kg/m²</div>
              </div>
            ` : ''}
          </div>
          <div class="vitals-row">
            ${healthProfile.bloodPressure ? `
              <div class="vital-card">
                <div class="vital-label">Blood Pressure</div>
                <div class="vital-value">${healthProfile.bloodPressure}</div>
                <div class="vital-unit">mmHg</div>
              </div>
            ` : ''}
            ${healthProfile.heartRate ? `
              <div class="vital-card">
                <div class="vital-label">Heart Rate</div>
                <div class="vital-value">${healthProfile.heartRate}</div>
                <div class="vital-unit">bpm</div>
              </div>
            ` : ''}
            ${healthProfile.temperature ? `
              <div class="vital-card">
                <div class="vital-label">Temperature</div>
                <div class="vital-value">${healthProfile.temperature}</div>
                <div class="vital-unit">°C</div>
              </div>
            ` : ''}
          </div>
          
          ${healthProfile.allergies || healthProfile.medications || healthProfile.chronicDiseases ? `
            <div class="info-grid">
              ${healthProfile.allergies ? `
                <div class="info-item">
                  <div class="info-label">Allergies</div>
                  <div class="info-value medical-list">${Array.isArray(healthProfile.allergies) ? healthProfile.allergies.join(', ') : healthProfile.allergies}</div>
                </div>
              ` : ''}
              ${healthProfile.medications ? `
                <div class="info-item">
                  <div class="info-label">Medications</div>
                  <div class="info-value medical-list">${Array.isArray(healthProfile.medications) ? healthProfile.medications.join(', ') : healthProfile.medications}</div>
                </div>
              ` : ''}
              ${healthProfile.chronicDiseases ? `
                <div class="info-item">
                  <div class="info-label">Chronic Diseases</div>
                  <div class="info-value medical-list">${Array.isArray(healthProfile.chronicDiseases) ? healthProfile.chronicDiseases.join(', ') : healthProfile.chronicDiseases}</div>
                </div>
              ` : ''}
              ${healthProfile.majorHealthEvents ? `
                <div class="info-item">
                  <div class="info-label">Medical History</div>
                  <div class="info-value medical-list">${healthProfile.majorHealthEvents}</div>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }


  // Medical History Section (Full Width) - Added before visit summaries
  contentSections += `
    <div class="section full-width medical-history-section">
      <div class="section-header">
        <h3 class="section-title">Medical History</h3>
      </div>
      <div class="section-content">
        <div class="history-subsection">
          <h4 class="subsection-title">History of Present Illness</h4>
          <p class="history-text">
            Afham experienced high-grade fever with accompanying rash, body weakness, and joint pain in September 2025. He was subsequently diagnosed with Dengue fever, which was managed symptomatically. Treatment included antipyretics (Napa) and topical ointments for rash relief under the supervision of Dr. Shafin and Dr. Dip.
            No complications or adverse drug reactions were reported. The illness has since resolved, and the patient's current health status is stable with vital signs (blood pressure and heart rate) within the normal range for his age.
          </p>
        </div>
        
        <div class="history-subsection">
          <h4 class="subsection-title">Past Medical History</h4>
          <p class="history-text">
            Hypertension – ongoing management.<br>
            Diabetes Mellitus – ongoing management.<br>
            No history of tuberculosis, asthma, stroke, or cardiac disease.<br>
            No prior major surgeries, hospitalizations, or blood transfusions.<br>
            Previous illnesses were mild and self-limiting.
          </p>
        </div>
        
        <div class="history-subsection">
          <h4 class="subsection-title">Drug and Treatment History</h4>
          <p class="history-text">
            Regular medication for hypertension and diabetes.<br>
            Antipyretics (Napa) during dengue episode.<br>
            No history of prolonged steroid use.<br>
            No adverse drug reactions reported.
          </p>
        </div>
        
        <div class="history-subsection">
          <h4 class="subsection-title">Allergic History</h4>
          <p class="history-text">
            Allergic to dust and pollen.
          </p>
        </div>
        
        <div class="history-subsection">
          <h4 class="subsection-title">Family History</h4>
          <p class="history-text">
            Positive family history of hypertension and diabetes on both maternal and paternal sides, indicating a hereditary predisposition.
            No history of congenital or genetic disorders reported.
          </p>
        </div>
        
        <div class="history-subsection">
          <h4 class="subsection-title">Personal History</h4>
          <p class="history-text">
            Maintains good personal hygiene and balanced diet with adequate hydration.<br>
            Engages in moderate physical activity suitable for his age.<br>
            Denies tobacco, alcohol, or substance use.<br>
            Immunizations are up to date.
          </p>
        </div>
      </div>
    </div>
  `;
  

  // Visit Summaries Section (Full Width)
  if (visitSummaries && Array.isArray(visitSummaries) && visitSummaries.length > 0) {
    const summaries = generateVisitSummaries(visitSummaries.slice(0, 5)); // Limit to 5 recent visits
    contentSections += `
      <div class="section full-width visits-section">
        <div class="section-header">
          <h3 class="section-title">Recent Medical Visits (Last 5)</h3>
        </div>
        <div class="section-content">
          ${summaries.map((summary, index) => {
            const visit = visitSummaries[index];
            return `
              <div class="visit-item">
                <div class="visit-date">${visit?.appointmentDate || visit?.visitDate || `Visit ${index + 1}`}</div>
                <div class="visit-summary">${summary}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;



  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const patientName = userProfile?.name || userProfile?.fullName || 'Patient';

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Medical Report - ${patientName}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${printStyles}
    </head>
    <body>
      <div class="report-container">
        <div class="header">
          <h1>🏥 NiramoyAI Medical Report</h1>
          <p><strong>${patientName}</strong> | Generated: ${currentDate}</p>
        </div>

        <div class="two-column">
          ${contentSections}
        </div>

       
      </div>
    </body>
    </html>
  `;

  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Unable to open print window. Pop-up blocked?');
      alert('Please allow pop-ups to print the medical summary.');
      return;
    }
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  } catch (error) {
    console.error('Error during printing:', error);
    alert('Error generating print summary. Please try again.');
  }
};

export default { printHealthProfile, printBasicProfile, printMedicalSummary };