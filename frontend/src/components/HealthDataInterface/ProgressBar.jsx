import React from 'react';

const ProgressBar = ({ currentStep, steps }) => {
  if (currentStep <= 0 || currentStep >= steps.length - 1) return null;

  return (
    <div className="mb-8">
      <div className="flex justify-center mb-4">
        {steps.slice(1, -1).map((step, index) => {
          const StepIcon = step.icon;
          const stepIndex = index + 1;
          return (
            <div key={stepIndex} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                stepIndex === currentStep ? 'bg-emerald-500 text-white' :
                stepIndex < currentStep ? 'bg-emerald-600 text-white' :
                'bg-zinc-800 text-zinc-400'
              }`}>
                <StepIcon className="w-5 h-5" />
              </div>
              {index < steps.length - 3 && (
                <div className={`w-16 h-0.5 mx-2 transition-all ${
                  stepIndex < currentStep ? 'bg-emerald-500' : 'bg-zinc-700'
                }`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <span className="text-zinc-400">Step {currentStep} of {steps.length - 2}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
