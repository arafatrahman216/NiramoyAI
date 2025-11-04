import React from 'react';

const VisitContext = ({ visitContext, onClearVisitContext, showInChatOnly = true, isInChatMode = false, isLoading = false }) => {
  // Show loading banner if loading
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mb-3">
        <div className="bg-gradient-to-r from-purple-900/30 to-emerald-900/30 border border-purple-500/30 rounded-2xl p-4 transition-all animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-purple-300">Loading visit context...</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Only show visit context if it exists and we're in the appropriate mode
  if (!visitContext) return null;
  
  if (showInChatOnly && !isInChatMode) return null;

  return (
    <div className="w-full max-w-3xl mb-3">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 transition-all hover:border-zinc-600">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="space-y-2 text-sm">
              {/* CONTEXT: Visit header info */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm font-medium text-purple-400">Visit #{visitContext.visitId}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-sm font-medium text-purple-400">Dr. {visitContext.doctorName}</span>
                {visitContext.appointmentDate && (
                  <>
                    <span className="text-zinc-500">•</span>
                    <span className="text-sm font-medium text-purple-400">{visitContext.appointmentDate}</span>
                  </>
                )}
              </div>
              
              {/* CONTEXT: Diagnosis (new field from backend) */}
              {visitContext.diagnosis && (
                <div className="text-zinc-300">
                  <span className="text-zinc-500 font-medium">Diagnosis: </span>
                  {visitContext.diagnosis}
                </div>
              )}
              
              {/* CONTEXT: Symptoms */}
              {visitContext.symptoms && (
                <div className="text-zinc-300">
                  <span className="text-zinc-500 font-medium">Symptoms: </span>
                  {Array.isArray(visitContext.symptoms) ? visitContext.symptoms.join(', ') : visitContext.symptoms}
                </div>
              )}
              
              {/* CONTEXT: Prescription */}
              {visitContext.prescription && (
                <div className="text-zinc-300">
                  <span className="text-zinc-500 font-medium">Prescription: </span>
                  {Array.isArray(visitContext.prescription) ? visitContext.prescription.join(', ') : visitContext.prescription}
                </div>
              )}
              
              {/* CONTEXT: Summary from backend */}
              {visitContext.summary && (
                <div className="text-zinc-400 text-xs mt-2 p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <span className="text-zinc-500 font-medium">Summary: </span>
                  {visitContext.summary}
                </div>
              )}
            </div>
          </div>
          
          {/* CONTEXT: Close button */}
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