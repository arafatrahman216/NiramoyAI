// ==============================================
// LIFESTYLE STEP COMPONENT
// ==============================================
// TODO: Add tag suggestions from backend
// TODO: Add allergy info popover
import React from 'react';
import CustomTagInput from './CustomTagInput';

const LifestyleStep = ({ 
  formData,
  selectedExercise,
  exerciseTags,
  handleArrayChange,
  handleTagClick,
  setSelectedExercise,
  showCustomInput,
  customInputValue,
  handleCustomInputOpen,
  handleCustomInputChange,
  handleCustomInputCancel,
  handleCustomInputAdd
}) => {
  const addCustomLifestyle = () => {
    if (customInputValue.lifestyle.trim() !== "") {
      handleArrayChange('lifestyle', customInputValue.lifestyle.toLowerCase().replace(/['().<>\s]/g, '_'));
      handleCustomInputChange('lifestyle', '');
      handleCustomInputCancel('lifestyle');
    }
  };

  const addCustomAllergy = () => {
    if (customInputValue.allergies.trim() !== "") {
      handleArrayChange('allergies', customInputValue.allergies.toLowerCase().replace(/['().<>\s]/g, '_'));
      handleCustomInputChange('allergies', '');
      handleCustomInputCancel('allergies');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Lifestyle & Health History</h2>
        <p className="text-zinc-400">Help us understand your lifestyle and health background</p>
      </div>

      <div className="space-y-8">
        {/* Lifestyle Habits */}
        <div>
          <h3 className="text-lg text-white mb-4">Lifestyle Habits</h3>
          <p className="text-zinc-400 text-sm mb-4">Select all that apply to you:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              'Smoking', 'Alcohol', 'Exercise (Regular)', 'Exercise (Occasional)', 'No Exercise',
              'Vegetarian Diet', 'Vegan Diet', 'High Protein Diet', 'Low Carb Diet', 'High Sugar Diet',
              'Low Fat Diet', 'Keto Diet', 'Intermittent Fasting', 'Meditation', 'Yoga', 'Caffeine',
              'Sleep <6h', 'Sleep 6-8h', 'Sleep >8h', 'Work Stress', 'Sedentary Job', 'Active Job', 'None'
            ].map((habit) => (
              <button
                key={habit}
                onClick={() => handleArrayChange('lifestyle', habit.toLowerCase().replace(/['().<>\s]/g, '_'))}
                className={`px-3 py-1.5 text-sm rounded-xl border transition-all ${
                  formData.lifestyle.includes(habit.toLowerCase().replace(/['().<>\s]/g, '_'))
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                }`}
              >
                {habit}
              </button>
            ))}
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-xl border border-dashed border-zinc-600 text-zinc-400 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 transition-all"
              onClick={() => handleCustomInputOpen("lifestyle")}
            >
              Others
            </button>
          </div>
          
          <CustomTagInput
            isOpen={showCustomInput.lifestyle}
            value={customInputValue.lifestyle}
            placeholder="Enter custom lifestyle habit"
            onChange={(value) => handleCustomInputChange('lifestyle', value)}
            onAdd={addCustomLifestyle}
            onCancel={() => handleCustomInputCancel('lifestyle')}
            buttonColor="emerald"
          />
        </div>

        {/* Exercise */}
        <div>
          <h3 className="text-lg text-white mb-4">Exercise</h3>
          <p className="text-zinc-400 text-sm mb-4">Select your exercise habits:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {exerciseTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-1.5 text-sm rounded-xl border transition-all ${selectedExercise.includes(tag)
                  ? "bg-green-600 border-green-500 text-white"
                  : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"}
                `}
                onClick={() => handleTagClick(tag, selectedExercise, setSelectedExercise)}
              >
                {tag}
              </button>
            ))}
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-xl border border-dashed border-zinc-600 text-zinc-400 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 transition-all"
              onClick={() => handleCustomInputOpen("exercise")}
            >
              Others
            </button>
          </div>
          
          <CustomTagInput
            isOpen={showCustomInput.exercise}
            value={customInputValue.exercise}
            placeholder="Enter custom exercise"
            onChange={(value) => handleCustomInputChange('exercise', value)}
            onAdd={() => handleCustomInputAdd("exercise", selectedExercise, setSelectedExercise)}
            onCancel={() => handleCustomInputCancel('exercise')}
            buttonColor="green"
          />
        </div>

        {/* Common Allergies */}
        <div>
          <h3 className="text-lg text-white mb-4">Common Allergies</h3>
          <p className="text-zinc-400 text-sm mb-4">Select any allergies you have:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              'Peanuts', 'Shellfish', 'Dairy', 'Gluten', 'Pollen', 'Dust', 'Medications', 'Pet Dander',
              'Soy', 'Eggs', 'Tree Nuts', 'Latex', 'Insect Stings', 'Mold', 'Fragrances', 'None'
            ].map((allergy) => (
              <button
                key={allergy}
                onClick={() => handleArrayChange('allergies', allergy.toLowerCase().replace(/['().<>\s]/g, '_'))}
                className={`px-3 py-1.5 text-sm rounded-xl border transition-all ${
                  formData.allergies.includes(allergy.toLowerCase().replace(/['().<>\s]/g, '_'))
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                }`}
              >
                {allergy}
              </button>
            ))}
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-xl border border-dashed border-zinc-600 text-zinc-400 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 transition-all"
              onClick={() => handleCustomInputOpen("allergies")}
            >
              Others
            </button>
          </div>
          
          <CustomTagInput
            isOpen={showCustomInput.allergies}
            value={customInputValue.allergies}
            placeholder="Enter custom allergy"
            onChange={(value) => handleCustomInputChange('allergies', value)}
            onAdd={addCustomAllergy}
            onCancel={() => handleCustomInputCancel('allergies')}
            buttonColor="emerald"
          />
        </div>
      </div>
    </div>
  );
};

export default LifestyleStep;
