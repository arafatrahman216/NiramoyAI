// ==============================================
// NAVIGATION BUTTONS COMPONENT - HEALTH LOG
// ==============================================
// Navigation controls for health log form
import React from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

const NavigationButtons = ({ currentStep, steps, prevStep, nextStep }) => {
  const isLastStep = currentStep === steps.length - 2; // -2 because we don't show nav on complete step

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-700">
      <button
        onClick={prevStep}
        disabled={currentStep === 0}
        className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 group ${
          currentStep === 0 
            ? 'text-zinc-600 cursor-not-allowed opacity-50' 
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        }`}
      >
        <ChevronLeft className={`w-4 h-4 mr-1 transition-transform ${
          currentStep === 0 
            ? '' 
            : 'group-hover:transform group-hover:-translate-x-1'
        }`} />
        Back
      </button>

      {/* Step indicator dots */}
      <div className="flex space-x-2">
        {steps.slice(0, -1).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'bg-emerald-500 scale-125'
                : index < currentStep
                ? 'bg-emerald-600'
                : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>

      <button
        onClick={nextStep}
        className={`flex items-center px-6 py-2 rounded-xl transition-all duration-300 font-medium group ${
          isLastStep
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
            : 'bg-emerald-500 text-white hover:bg-emerald-600'
        }`}
      >
        {isLastStep ? (
          <>
            <Save className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
            Complete Log
          </>
        ) : (
          <>
            Continue
            <ChevronRight className="w-4 h-4 ml-1 group-hover:transform group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
};

export default NavigationButtons;
