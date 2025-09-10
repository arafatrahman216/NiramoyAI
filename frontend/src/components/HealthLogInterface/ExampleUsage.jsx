// ==============================================
// EXAMPLE: HOW TO USE HEALTH LOG MODAL
// ==============================================
// This is an example component showing how to integrate the HealthLogModal

import React, { useState } from 'react';
import { Plus, Activity } from 'lucide-react';
import { HealthLogModal } from '../HealthLogInterface';

const ExampleDashboardComponent = () => {
  const [isHealthLogOpen, setIsHealthLogOpen] = useState(false);

  return (
    <div className="p-6">
      {/* Example: Quick Action Button */}
      <div className="mb-6">
        <button
          onClick={() => setIsHealthLogOpen(true)}
          className="flex items-center px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Health Data
        </button>
      </div>

      {/* Example: Health Log Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-emerald-400" />
            Daily Health Log
          </h3>
          <button
            onClick={() => setIsHealthLogOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
          >
            Add Entry
          </button>
        </div>
        <p className="text-gray-400 text-sm">
          Track your daily health vitals, symptoms, and notes.
        </p>
      </div>

      {/* Health Log Modal */}
      <HealthLogModal 
        isOpen={isHealthLogOpen} 
        onClose={() => setIsHealthLogOpen(false)} 
      />
    </div>
  );
};

export default ExampleDashboardComponent;
