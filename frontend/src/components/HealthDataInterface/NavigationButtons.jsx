import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavigationButtons = ({ currentStep, steps, prevStep, nextStep }) => {
  if (currentStep <= 0 || currentStep >= steps.length - 1) return null;

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-zinc-700">
      <button
        onClick={prevStep}
        className="flex items-center text-zinc-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
        Back
      </button>
      <button
        onClick={nextStep}
        className="flex items-center bg-emerald-500 text-white px-6 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-300 font-medium group"
      >
        {currentStep === steps.length - 2 ? 'Complete' : 'Continue'}
        <ChevronRight className="w-4 h-4 ml-1 group-hover:transform group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default NavigationButtons;
