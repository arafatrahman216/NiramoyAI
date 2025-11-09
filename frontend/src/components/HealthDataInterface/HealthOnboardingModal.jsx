// ==============================================
// HEALTH ONBOARDING MODAL
// ==============================================
// Modal wrapper for health data form shown after signup
import React, { useState } from 'react';
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import UpdatedHealthDataForm from './UpdatedHealthDataForm';

const HealthOnboardingModal = ({ isOpen, onClose, onSkip }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'
  const [hideForm, setHideForm] = useState(false); // hide modal content but keep banner on homepage

  const handleSubmitStart = () => {
    setIsSubmitting(true);
    // Hide the form/modal content but keep component mounted for banner
    setHideForm(true);
  };

  const handleSubmitComplete = (success) => {
    setIsSubmitting(false);
    setSubmissionStatus(success ? 'success' : 'error');

    // Auto-dismiss banner after showing the result
    setTimeout(() => {
      setSubmissionStatus(null);
      if (success) {
        // Close modal fully on success
        onClose();
      } else {
        // Restore form to allow retry
        setHideForm(false);
      }
    }, 3000);
  };

  // Render banner at top-left if submitting or submission complete
  const renderBanner = () => {
    if (isSubmitting) {
      return (
        <div className="fixed top-20 left-4 z-[60] animate-slide-in-left">
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-black border border-emerald-500/30 rounded-lg px-4 py-3 shadow-xl flex items-center gap-3 min-w-[300px]">
            <Loader2 className="w-5 h-5 text-emerald-500 animate-spin flex-shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">Updating Your Profile...</p>
              <p className="text-zinc-400 text-xs mt-0.5">Please wait</p>
            </div>
          </div>
        </div>
      );
    }

    if (submissionStatus) {
      return (
        <div className="fixed top-20 left-4 z-[60] animate-slide-in-left">
          <div className={`rounded-lg px-4 py-3 shadow-xl flex items-center gap-3 min-w-[300px] border ${
            submissionStatus === 'success'
              ? 'bg-gradient-to-r from-emerald-900/50 via-emerald-900/30 to-black border-emerald-500/40'
              : 'bg-gradient-to-r from-red-900/50 via-red-900/30 to-black border-red-500/40'
          }`}>
            {submissionStatus === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <div>
              <p className={`font-medium text-sm ${
                submissionStatus === 'success' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {submissionStatus === 'success' ? 'Profile Updated Successfully!' : 'Update Failed'}
              </p>
              <p className="text-zinc-300 text-xs mt-0.5">
                {submissionStatus === 'success'
                  ? 'Your health profile has been saved'
                  : 'Please try again or skip for now'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Show the onboarding modal with form OR banner on homepage
  return (
    <>
      {/* Banner - Always render if submitting or submission complete (even when modal is closed) */}
      {(isSubmitting || submissionStatus) && renderBanner()}

  {/* Modal - Only show if modal is open and not hidden */}
  {isOpen && !hideForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onSkip}
          />
          
          {/* Modal Content */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              {/* Skip Button - Bottom Left Corner */}
              <button
                onClick={onSkip}
                className="absolute -bottom-4 left-0 z-10 flex items-center gap-2 px-4 py-2 
                  bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white 
                  rounded-lg transition-all duration-200 backdrop-blur-sm
                  border border-zinc-700 hover:border-zinc-600 shadow-lg"
              >
                <span className="text-sm font-medium">Skip for now</span>
                <X className="w-4 h-4" />
              </button>

              {/* Health Data Form */}
              <div className="relative bg-gradient-to-br from-black via-zinc-950 to-black rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-zinc-800 px-6 py-4">
                  <h2 className="text-xl font-bold text-white mb-1">Welcome to NiramoyAI! 🎉</h2>
                  <p className="text-sm text-zinc-400">
                    Help us personalize your healthcare experience by completing your health profile
                  </p>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  <UpdatedHealthDataForm 
                    isOnboarding={true}
                    onComplete={handleSubmitComplete}
                    onSubmitStart={handleSubmitStart}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HealthOnboardingModal;
