import React from 'react';
import { Heart } from 'lucide-react';

const WelcomeStep = ({ nextStep }) => (
  <div className="text-center space-y-8 animate-fade-in">
    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center">
      <Heart className="w-12 h-12 text-white" />
    </div>
    <div>
      <h2 className="text-3xl font-light text-white mb-4">Welcome to NiramoyAI</h2>
      <p className="text-zinc-400 text-lg leading-relaxed max-w-md mx-auto">
        Let's create your personalized health profile. This journey will take just a few minutes and help us provide you with the best care recommendations.
      </p>
    </div>
    <div className="pt-8">
      <button
        onClick={nextStep}
        className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 font-medium"
      >
        Get Started
      </button>
    </div>
  </div>
);

export default WelcomeStep;
