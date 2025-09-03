import React from 'react';
import { Heart } from 'lucide-react';

const CompleteStep = ({ formData, calculateAge, resetForm }) => (
  <div className="text-center space-y-8 animate-fade-in">
    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center">
      <Heart className="w-12 h-12 text-white" />
    </div>
    <div>
      <h2 className="text-3xl font-light text-white mb-4">Profile Complete!</h2>
      <p className="text-zinc-300 text-lg leading-relaxed max-w-md mx-auto">
        Thank you for providing your health information. NiramoyAI is now ready to provide you with personalized health insights and recommendations.
      </p>
    </div>
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-lg mx-auto">
      <pre className="text-left text-sm text-zinc-300 overflow-x-auto custom-scrollbar">
        {JSON.stringify({
          ...formData,
          calculated_age: formData.date_of_birth ? calculateAge(formData.date_of_birth) : null
        }, null, 2)}
      </pre>
    </div>
    <button
      onClick={resetForm}
      className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 font-medium"
    >
      Start Over
    </button>
  </div>
);

export default CompleteStep;
