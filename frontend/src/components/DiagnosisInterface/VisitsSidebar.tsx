import React from 'react';

// ==============================================
// VISITS SIDEBAR COMPONENT
// ==============================================
// Contains: Visits and appointments sidebar
// Used to show upcoming appointments, visit history, etc.

interface VisitsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const VisitsSidebar: React.FC<VisitsSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* SIDEBAR HEADER */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Visits & Appointments</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-800 rounded transition-colors"
          title="Close sidebar"
        >
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* SIDEBAR CONTENT */}
      <div className="flex-1 p-4">
        {/* Empty State */}
        <div className="text-center text-zinc-500 mt-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No visits or appointments yet</p>
          <p className="text-xs text-zinc-600 mt-1">Your upcoming appointments will appear here</p>
        </div>

        {/* TODO: Add actual visits/appointments list here */}
        {/* Example structure for future implementation:
        <div className="space-y-3 mt-4">
          <div className="p-3 bg-zinc-800 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-white">Dr. Smith</h3>
                <p className="text-xs text-zinc-400">General Checkup</p>
              </div>
              <span className="text-xs text-zinc-500">Tomorrow 2:00 PM</span>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default VisitsSidebar;
