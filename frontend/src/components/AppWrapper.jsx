// ==============================================
// APP WRAPPER WITH ONBOARDING MODAL
// ==============================================
// Wraps the main app to show onboarding modal for new users
import React from 'react';
import { useAuth } from '../context/AuthContext';
import HealthOnboardingModal from './HealthDataInterface/HealthOnboardingModal';

const AppWrapper = ({ children }) => {
  const { user, showOnboarding, setShowOnboarding } = useAuth();

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Optionally update user state to mark onboarding as completed
    localStorage.setItem('onboardingCompleted', 'true');
  };

  const handleSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingSkipped', 'true');
  };

  return (
    <>
      {children}
      {/* Show onboarding modal only for PATIENT role users who just signed up */}
      {user && user.role === 'PATIENT' && showOnboarding && (
        <HealthOnboardingModal
          isOpen={showOnboarding}
          onClose={handleOnboardingComplete}
          onSkip={handleSkip}
        />
      )}
    </>
  );
};

export default AppWrapper;
