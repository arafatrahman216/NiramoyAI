import React from 'react';
import Timeline from '../Timeline/Timeline';

// ==============================================
// VISITS SIDEBAR COMPONENT
// ==============================================
// Contains: Visits and appointments sidebar with timeline
// Used to show upcoming appointments, visit history, timeline graph etc.

interface VisitsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const VisitsSidebar: React.FC<VisitsSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed left-16 top-0 bottom-0 w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col z-30">
      {/* SIDEBAR HEADER */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Visits Timeline</h2>
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
      
      {/* SIDEBAR CONTENT - Timeline */}
      <div className="flex-1 overflow-hidden">
        <Timeline />
      </div>
    </div>
  );
};

export default VisitsSidebar;
