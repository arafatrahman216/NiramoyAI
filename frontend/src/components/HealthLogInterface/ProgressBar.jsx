// ==============================================
// PROGRESS BAR COMPONENT - HEALTH LOG
// ==============================================
// Progress indicator for health log form steps
import React from 'react';

const ProgressBar = ({ currentStep, steps }) => {
  // Don't show progress bar on the complete step
  if (currentStep >= steps.length - 1) return null;

  const progressPercentage = ((currentStep + 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex justify-center mb-4">
        {steps.slice(0, -1).map((step, index) => {
          const StepIcon = step.icon;
          return (
            <div key={index} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/25' :
                index < currentStep 
                  ? 'bg-emerald-600 text-white' :
                'bg-zinc-800 text-zinc-400'
              }`}>
                <StepIcon className="w-5 h-5" />
              </div>
              {index < steps.length - 2 && (
                <div className={`w-16 h-0.5 mx-2 transition-all duration-500 ${
                  index < currentStep ? 'bg-emerald-500' : 'bg-zinc-700'
                }`} />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="w-full max-w-md mx-auto bg-zinc-800 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Step info */}
      <div className="text-center">
        <div className="text-white font-medium mb-1">
          {steps[currentStep].title}
        </div>
        <span className="text-zinc-400 text-sm">
          Step {currentStep + 1} of {steps.length - 1}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
