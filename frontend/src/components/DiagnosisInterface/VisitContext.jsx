import React from 'react';

const VisitContext = ({ visitContext, onClearVisitContext, showInChatOnly = true, isInChatMode = false }) => {
  // Only show visit context if it exists and we're in the appropriate mode
  if (!visitContext) return null;
  
  if (showInChatOnly && !isInChatMode) return null;

  return (
    <div className="mb-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 transition-all hover:border-zinc-600">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm font-medium text-purple-400">Visit Context Added</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-400">Visit #{visitContext.visitId}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-300">Dr. {visitContext.doctorName}</span>
                {visitContext.appointmentDate && (
                  <>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">{visitContext.appointmentDate}</span>
                  </>
                )}
              </div>
              {visitContext.symptoms && (
                <div className="text-zinc-400">
                  <span className="text-zinc-500">Symptoms: </span>
                  {Array.isArray(visitContext.symptoms) ? visitContext.symptoms.join(', ') : visitContext.symptoms}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClearVisitContext}
            className="p-1 hover:bg-zinc-700 rounded transition-colors"
            title="Remove visit context"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitContext;