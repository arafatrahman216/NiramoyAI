// src/components/PatientProfile/TestReports.js
import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, Clock, AlertTriangle, CheckCircle, Search, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TestReports = ({ patientId }) => {
  const [testReports, setTestReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  // Fallback test reports data
  const fallbackTestReports = [
    {
      id: 1,
      testName: 'Complete Blood Count (CBC)',
      category: 'blood',
      date: '2025-09-10',
      time: '09:30 AM',
      status: 'completed',
      orderedBy: 'Dr. Michael Chen',
      lab: 'LabCorp - Downtown',
      results: [
        { parameter: 'White Blood Cells', value: '7.2', unit: 'K/uL', reference: '4.0-10.0', status: 'normal' },
        { parameter: 'Red Blood Cells', value: '4.5', unit: 'M/uL', reference: '4.2-5.4', status: 'normal' },
        { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', reference: '12.0-15.0', status: 'normal' },
        { parameter: 'Hematocrit', value: '42.1', unit: '%', reference: '36-45', status: 'normal' },
        { parameter: 'Platelets', value: '285', unit: 'K/uL', reference: '150-450', status: 'normal' }
      ],
      summary: 'All values within normal limits. No signs of infection or anemia.',
      criticalValues: [],
      notes: 'Routine blood work as part of annual physical examination.'
    },
    {
      id: 2,
      testName: 'Lipid Panel',
      category: 'blood',
      date: '2025-09-10',
      time: '09:30 AM',
      status: 'completed',
      orderedBy: 'Dr. Sarah Johnson',
      lab: 'LabCorp - Downtown',
      results: [
        { parameter: 'Total Cholesterol', value: '195', unit: 'mg/dL', reference: '<200', status: 'normal' },
        { parameter: 'LDL Cholesterol', value: '125', unit: 'mg/dL', reference: '<100', status: 'high' },
        { parameter: 'HDL Cholesterol', value: '45', unit: 'mg/dL', reference: '>40', status: 'normal' },
        { parameter: 'Triglycerides', value: '150', unit: 'mg/dL', reference: '<150', status: 'normal' }
      ],
      summary: 'LDL cholesterol slightly elevated. Consider dietary modifications and follow-up.',
      criticalValues: ['LDL Cholesterol'],
      notes: 'Patient advised on dietary changes to reduce LDL cholesterol levels.'
    },
    {
      id: 3,
      testName: 'HbA1c (Glycated Hemoglobin)',
      category: 'blood',
      date: '2025-09-08',
      time: '11:15 AM',
      status: 'completed',
      orderedBy: 'Dr. Michael Chen',
      lab: 'Quest Diagnostics',
      results: [
        { parameter: 'HbA1c', value: '6.8', unit: '%', reference: '<7.0', status: 'normal' },
        { parameter: 'Estimated Average Glucose', value: '148', unit: 'mg/dL', reference: '<154', status: 'normal' }
      ],
      summary: 'Diabetes well controlled. HbA1c within target range for diabetic patients.',
      criticalValues: [],
      notes: 'Continue current diabetes management plan. Excellent glycemic control.'
    },
    {
      id: 4,
      testName: 'Chest X-Ray',
      category: 'imaging',
      date: '2025-09-05',
      time: '02:45 PM',
      status: 'completed',
      orderedBy: 'Dr. Emily Rodriguez',
      lab: 'Radiology Associates',
      results: [
        { parameter: 'Heart Size', value: 'Normal', unit: '', reference: 'Normal', status: 'normal' },
        { parameter: 'Lung Fields', value: 'Clear', unit: '', reference: 'Clear', status: 'normal' },
        { parameter: 'Pleural Spaces', value: 'Normal', unit: '', reference: 'Normal', status: 'normal' }
      ],
      summary: 'Normal chest X-ray. No acute cardiopulmonary abnormalities.',
      criticalValues: [],
      notes: 'Ordered due to chest discomfort. Results rule out pulmonary issues.'
    },
    {
      id: 5,
      testName: 'Electrocardiogram (ECG)',
      category: 'cardiac',
      date: '2025-09-05',
      time: '02:30 PM',
      status: 'completed',
      orderedBy: 'Dr. Emily Rodriguez',
      lab: 'Emergency Department',
      results: [
        { parameter: 'Heart Rate', value: '95', unit: 'bpm', reference: '60-100', status: 'normal' },
        { parameter: 'Rhythm', value: 'Sinus', unit: '', reference: 'Sinus', status: 'normal' },
        { parameter: 'QRS Duration', value: '98', unit: 'ms', reference: '<120', status: 'normal' },
        { parameter: 'QT Interval', value: '420', unit: 'ms', reference: '<440', status: 'normal' }
      ],
      summary: 'Normal sinus rhythm. No signs of acute cardiac ischemia or arrhythmia.',
      criticalValues: [],
      notes: 'ECG performed in emergency department. Results normal.'
    },
    {
      id: 6,
      testName: 'Comprehensive Metabolic Panel',
      category: 'blood',
      date: '2025-08-28',
      time: '10:00 AM',
      status: 'completed',
      orderedBy: 'Dr. Michael Chen',
      lab: 'LabCorp - Downtown',
      results: [
        { parameter: 'Glucose', value: '118', unit: 'mg/dL', reference: '70-100', status: 'high' },
        { parameter: 'BUN', value: '18', unit: 'mg/dL', reference: '7-20', status: 'normal' },
        { parameter: 'Creatinine', value: '1.0', unit: 'mg/dL', reference: '0.6-1.2', status: 'normal' },
        { parameter: 'eGFR', value: '>60', unit: 'mL/min', reference: '>60', status: 'normal' },
        { parameter: 'Sodium', value: '140', unit: 'mEq/L', reference: '136-145', status: 'normal' },
        { parameter: 'Potassium', value: '4.2', unit: 'mEq/L', reference: '3.5-5.0', status: 'normal' }
      ],
      summary: 'Slightly elevated fasting glucose consistent with diabetes. Kidney function normal.',
      criticalValues: ['Glucose'],
      notes: 'Annual screening labs. Glucose elevation expected given diabetes history.'
    }
  ];

  useEffect(() => {
    setTestReports(fallbackTestReports);
    setFilteredReports(fallbackTestReports);
  }, [patientId]);

  useEffect(() => {
    let filtered = testReports;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(report => report.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.orderedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.lab.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, filterCategory, testReports]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'blood': return 'text-red-400 bg-red-500/20';
      case 'imaging': return 'text-blue-400 bg-blue-500/20';
      case 'cardiac': return 'text-pink-400 bg-pink-500/20';
      case 'urine': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'low': return <TrendingDown className="w-4 h-4 text-blue-400" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'text-green-400';
      case 'high': return 'text-red-400';
      case 'low': return 'text-blue-400';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Tests' },
    { value: 'blood', label: 'Blood Tests' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'cardiac', label: 'Cardiac' },
    { value: 'urine', label: 'Urine Tests' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Test Reports</h3>
        <FileText className="w-6 h-6 text-emerald-400" />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by test name, doctor, or lab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-gray-700">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No test reports found</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-gray-700/50 rounded-xl p-6 border border-gray-600/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(report.category)}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{report.testName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(report.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {report.time}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Ordered by {report.orderedBy}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(report.category)}`}>
                    {report.category}
                  </span>
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-400 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Critical Values Alert */}
              {report.criticalValues.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-red-400 font-medium text-sm">Critical Values: </span>
                    <span className="text-red-300 text-sm">{report.criticalValues.join(', ')}</span>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-300 mb-2">Summary:</h5>
                <p className="text-gray-300 text-sm bg-gray-600/20 rounded-lg p-3">{report.summary}</p>
              </div>

              {/* Key Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {report.results.slice(0, 6).map((result, index) => (
                  <div key={index} className="bg-gray-600/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400 truncate">{result.parameter}</span>
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-sm font-semibold ${getStatusColor(result.status)}`}>
                        {result.value}
                      </span>
                      {result.unit && (
                        <span className="text-xs text-gray-400">{result.unit}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">Ref: {result.reference}</span>
                  </div>
                ))}
              </div>

              {/* Lab Info */}
              <div className="text-xs text-gray-400">
                <span>Lab: {report.lab}</span>
                {report.notes && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{report.notes}</span>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{selectedReport.testName}</h3>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* All Results */}
              <div className="space-y-3">
                {selectedReport.results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex-1">
                      <span className="text-white font-medium">{result.parameter}</span>
                      <span className="text-gray-400 text-sm ml-2">({result.reference})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${getStatusColor(result.status)}`}>
                        {result.value} {result.unit}
                      </span>
                      {getStatusIcon(result.status)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-3">Summary & Notes</h4>
                <p className="text-gray-300 mb-4">{selectedReport.summary}</p>
                {selectedReport.notes && (
                  <p className="text-gray-400 text-sm">{selectedReport.notes}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Total Tests</h4>
          <p className="text-2xl font-bold text-white">{testReports.length}</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">This Month</h4>
          <p className="text-2xl font-bold text-blue-400">
            {testReports.filter(r => {
              const testDate = new Date(r.date);
              const today = new Date();
              return testDate.getMonth() === today.getMonth() && testDate.getFullYear() === today.getFullYear();
            }).length}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Critical Values</h4>
          <p className="text-2xl font-bold text-red-400">
            {testReports.reduce((acc, report) => acc + report.criticalValues.length, 0)}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Last Test</h4>
          <p className="text-lg font-semibold text-white">
            {testReports.length > 0 
              ? new Date(testReports[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'N/A'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestReports;
