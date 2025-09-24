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

export default { printHealthProfile, printBasicProfile };