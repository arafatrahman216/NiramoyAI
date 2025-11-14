import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Printer, X, FileText, Heart, Calendar } from 'lucide-react';

const PrintSummaryModal = ({ isOpen, onClose, userProfile, healthProfile, recentVisits }) => {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState({
    medicalHistory: true,
    healthProfile: true,
    visitSummaries: true
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;
  console.log("User Profile:", userProfile);
  

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handlePrint = async () => {
    setIsLoading(true);
    
    try {
      // Import the print utilities
      const { printMedicalSummary } = await import('../../utils/printer');
      
      
      // Prepare data for printing based on selected options
      const printData = {
        userProfile: selectedOptions.medicalHistory ? userProfile : null,
        healthProfile: selectedOptions.healthProfile ? healthProfile : null,
        visitSummaries: selectedOptions.visitSummaries ? recentVisits : null
      };
      
      // Generate and print the summary
      await printMedicalSummary(printData);
      
      // Close modal after successful print
      onClose();
    } catch (error) {
      console.error('Error printing summary:', error);
      alert('Failed to generate print summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasAnySelection = Object.values(selectedOptions).some(selected => selected);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Printer className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{t('printSummaryModal.printMedicalSummary')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            {t('printSummaryModal.selectInformation')}
          </p>

          {/* Options */}
          <div className="space-y-4">
            {/* Medical History */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="medicalHistory"
                checked={selectedOptions.medicalHistory}
                onChange={() => handleOptionChange('medicalHistory')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="medicalHistory" className="flex items-center space-x-2 cursor-pointer">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-medium">{t('printSummaryModal.medicalHistory')}</span>
              </label>
            </div>

            {/* Health Profile */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="healthProfile"
                checked={selectedOptions.healthProfile}
                onChange={() => handleOptionChange('healthProfile')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="healthProfile" className="flex items-center space-x-2 cursor-pointer">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-gray-700 font-medium">{t('printSummaryModal.healthProfile')}</span>
              </label>
            </div>

            {/* Visit Summaries */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="visitSummaries"
                checked={selectedOptions.visitSummaries}
                onChange={() => handleOptionChange('visitSummaries')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="visitSummaries" className="flex items-center space-x-2 cursor-pointer">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 font-medium">{t('printSummaryModal.visitSummaries')}</span>
              </label>
            </div>
          </div>

          {/* Warning if no selections */}
          {!hasAnySelection && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                {t('printSummaryModal.pleaseSelectOption')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {t('printSummaryModal.cancel')}
          </button>
          <button
            onClick={handlePrint}
            disabled={!hasAnySelection || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('printSummaryModal.generating')}</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>{t('printSummaryModal.printSummary')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintSummaryModal;