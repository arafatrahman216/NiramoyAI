// ==============================================
// NOTES LOG STEP COMPONENT
// ==============================================
// Step for adding notes and additional health information
import React from 'react';
import { FileText, MessageSquare, Clock } from 'lucide-react';

const NotesLogStep = ({ formData, handleInputChange }) => {
  const notePrompts = [
    "How are you feeling overall today?",
    "Any changes in your regular routine?",
    "Medication effects or side effects?",
    "Sleep quality and duration?",
    "Energy levels throughout the day?",
    "Pain levels and locations?",
    "Appetite and food intake?",
    "Mood and emotional state?",
    "Physical activity and exercise?",
    "Any doctor's appointments or treatments?"
  ];

  const handlePromptClick = (prompt) => {
    const currentNotes = formData.notes || '';
    const newNotes = currentNotes ? `${currentNotes}\n\n${prompt} ` : `${prompt} `;
    handleInputChange('notes', newNotes);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-white mb-2">Additional Notes</h2>
        <p className="text-zinc-400">Add any additional information about your health today</p>
      </div>

      {/* Main Notes Input */}
      <div>
        <label className="flex items-center text-zinc-300 mb-3">
          <FileText className="w-5 h-5 mr-2 text-blue-400" />
          Health Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Share any additional details about your health today. You can include information about how you're feeling, any concerns, medication effects, or anything else you think might be relevant..."
          rows={8}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-400 focus:outline-none transition-colors hover:border-zinc-600 resize-none custom-scrollbar"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-zinc-500">
            {formData.notes ? formData.notes.length : 0} characters
          </span>
          <span className="text-xs text-zinc-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Quick Note Prompts */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-emerald-400" />
          Quick Prompts
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Click on any prompt below to add it to your notes as a starting point:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {notePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt)}
              className="text-left p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-4">
        <h4 className="text-sm font-medium text-blue-300 mb-3 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          Tips for Better Health Tracking
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-200/80">
          <div>
            <p className="mb-2">
              <strong>Be Specific:</strong> Include details about timing, intensity, and duration of symptoms.
            </p>
            <p className="mb-2">
              <strong>Track Patterns:</strong> Note what might have triggered symptoms or improvements.
            </p>
          </div>
          <div>
            <p className="mb-2">
              <strong>Include Context:</strong> Mention activities, meals, stress levels, or weather changes.
            </p>
            <p className="mb-2">
              <strong>Regular Updates:</strong> Consistent logging helps identify trends over time.
            </p>
          </div>
        </div>
      </div>

      {/* Example Note */}
      {!formData.notes && (
        <div className="bg-zinc-900/30 border border-zinc-700 rounded-xl p-4">
          <h4 className="text-sm font-medium text-zinc-300 mb-2">Example Note:</h4>
          <p className="text-xs text-zinc-400 italic">
            "Woke up feeling refreshed after 8 hours of sleep. Blood pressure was slightly elevated this morning, 
            possibly due to the stressful meeting yesterday. Took medication as usual at 8 AM. Experienced mild 
            headache around 2 PM, but it subsided after drinking water and taking a short walk. Energy levels 
            were good throughout the day. No side effects from new medication."
          </p>
        </div>
      )}
    </div>
  );
};

export default NotesLogStep;
