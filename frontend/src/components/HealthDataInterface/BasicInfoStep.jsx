// ==============================================
// BASIC INFO STEP COMPONENT
// ==============================================
// TODO: Add input validation and error messages
import React from 'react';

const BasicInfoStep = ({ formData, handleInputChange, calculateAge }) => (
  <div className="space-y-8 animate-fade-in">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-light text-white mb-2">Basic Information</h2>
      <p className="text-zinc-400">Tell us a little about yourself</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-zinc-300 mb-2">Gender</label>
        <select
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors hover:border-zinc-600"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <label className="block text-zinc-300 mb-2">Date of Birth</label>
        <input
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors hover:border-zinc-600"
        />
        {formData.date_of_birth && (
          <p className="text-emerald-400 text-sm mt-1">
            Age: {calculateAge(formData.date_of_birth)} years old
          </p>
        )}
      </div>

      <div>
        <label className="block text-zinc-300 mb-2">Weight (kg)</label>
        <input
          type="number"
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          placeholder="Enter weight"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors hover:border-zinc-600 placeholder-zinc-500"
        />
      </div>

      <div>
        <label className="block text-zinc-300 mb-2">Height (cm)</label>
        <input
          type="number"
          value={formData.height}
          onChange={(e) => handleInputChange('height', e.target.value)}
          placeholder="Enter height"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors hover:border-zinc-600 placeholder-zinc-500"
        />
      </div>
    </div>
  </div>
);

export default BasicInfoStep;
