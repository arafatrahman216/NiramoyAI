// ==============================================
// NAVIGATION BUTTONS COMPONENT
// ==============================================
// TODO: Add keyboard navigation support
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavigationButtons = ({ currentStep, steps, prevStep, nextStep }) => {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-zinc-700">
      <button
        onClick={prevStep}
        disabled={currentStep === 0}
        className={`flex items-center transition-colors group ${
          currentStep === 0 
            ? 'text-zinc-600 cursor-not-allowed' 
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        <ChevronLeft className={`w-4 h-4 mr-1 transition-transform ${
          currentStep === 0 
            ? '' 
            : 'group-hover:transform group-hover:-translate-x-1'
        }`} />
        Back
      </button>
      <button
        onClick={nextStep}
        className={`flex items-center px-6 py-2 rounded-xl transition-all duration-300 font-medium group bg-emerald-500 text-white hover:bg-emerald-600`}
      >
        {currentStep === steps.length - 1 ? 'Submit' : 'Continue'}
        <ChevronRight className="w-4 h-4 ml-1 group-hover:transform group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default NavigationButtons;
