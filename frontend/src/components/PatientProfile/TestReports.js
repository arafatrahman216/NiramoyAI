// src/components/PatientProfile/TestReports.js
import React, { useState, useEffect } from 'react';
import { FileText, Search, AlertTriangle, Calendar, Eye } from 'lucide-react';
import { fallbackTestReports } from '../../utils/dummyData';

const TestReports = ({ patientId }) => {
  const [testReports, setTestReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTestReports(fallbackTestReports);
    setFilteredReports(fallbackTestReports);
  }, [patientId]);

  useEffect(() => {
    let filtered = testReports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, testReports]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'normal': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getUrgencyIcon = (urgency) => {
    if (urgency === 'critical' || urgency === 'high') {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Test Reports</h3>
        <FileText className="w-6 h-6 text-emerald-400" />
      </div>

      {/* Search Controls */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by test name or summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
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
                  <div className={`p-2 rounded-lg ${getUrgencyColor(report.urgency)}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{report.testName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(report.testDateTime).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric'
                        })} at {new Date(report.testDateTime).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize border ${getUrgencyColor(report.urgency)}`}>
                    {getUrgencyIcon(report.urgency)}
                    <span className={getUrgencyIcon(report.urgency) ? 'ml-1' : ''}>{report.urgency}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-300 mb-2">Summary:</h5>
                <p className="text-gray-300 text-sm bg-gray-600/20 rounded-lg p-3">{report.summary}</p>
              </div>

              {/* Report Images */}
              {report.imageLinks && report.imageLinks.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Report Images:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {report.imageLinks.map((imageUrl, index) => (
                      <div key={index} className="bg-gray-600/20 rounded-lg p-3">
                        <div className="aspect-square bg-gray-700/50 rounded-lg overflow-hidden mb-2">
                          <img
                            src={imageUrl}
                            alt={`${report.testName} - Image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onClick={() => window.open(imageUrl, '_blank')}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0ibTIxIDlzLTktNi0xMi05LTMgMy0zIDNzLTMgOS0zIDEyIDMgMyAzIDNzOSAzIDEyIDMgMy0zIDMtMyAzLTkgMy0xMi0zLTMtMy0zeiIgc3Ryb2tlPSIjNjU3Mzg4IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjIiIGZpbGw9IiM2NTczODgiLz4KPHBhdGggZD0ibTIxIDE1LTMuMDktMy4wOWEyIDIgMCAwIDAtMi44MyAwbC01LjgzIDUuODMiIHN0cm9rZT0iIzY1NzM4OCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=';
                              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                              e.target.classList.add('opacity-50');
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 text-center truncate">
                          Image {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

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
              const testDate = new Date(r.testDateTime);
              const today = new Date();
              return testDate.getMonth() === today.getMonth() && testDate.getFullYear() === today.getFullYear();
            }).length}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Critical/High</h4>
          <p className="text-2xl font-bold text-red-400">
            {testReports.filter(r => r.urgency === 'critical' || r.urgency === 'high').length}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Last Test</h4>
          <p className="text-lg font-semibold text-white">
            {testReports.length > 0 
              ? new Date(testReports[0].testDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'N/A'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestReports;
