import React, { useState } from 'react';
import { Search, Paperclip, Mic, ArrowUp, MoreHorizontal, MessageSquare, HelpCircle, UserCheck, Calendar } from 'lucide-react';

// ==============================================
// MODE SELECTOR COMPONENT
// ==============================================
const ModeSelector = ({ activeMode, setActiveMode }) => {
  const modes = [
    { id: 'explain', label: 'Explain', icon: MessageSquare },
    { id: 'qna', label: 'Q&A', icon: HelpCircle },
    { id: 'consult', label: 'Consult', icon: UserCheck },
    { id: 'plan', label: 'Plan', icon: Calendar }
  ];

  return (
    <div className="relative">
      <div className="flex items-center bg-zinc-800 rounded-lg p-1 border border-zinc-700">
        {modes.map((mode) => {
          const IconComponent = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeMode === mode.id
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
              }`}
            >
              <IconComponent size={16} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==============================================
// SEARCH INPUT COMPONENT
// ==============================================
// Contains: Input field and all action buttons
// Edit individual button handlers to add functionality
const SearchInput = ({ query, setQuery, onSearch }) => {
  const [activeMode, setActiveMode] = useState('explain');

  // TODO: Add focus functionality
  const handleFocus = () => {
    console.log('Search input focused');
    // Add focus tracking, analytics, etc.
  };

  // TODO: Add attachment functionality
  const handleAttachment = () => {
    console.log('Attachment clicked');
    // Add file upload, image attachment logic here
  };

  // TODO: Add voice input functionality
  const handleVoiceInput = () => {
    console.log('Voice input clicked');
    // Add speech recognition, voice recording logic here
  };

  // TODO: Add more options functionality
  const handleMoreOptions = () => {
    console.log('More options clicked');
    // Add dropdown menu, additional settings, etc.
  };

  // TODO: Mode-specific functionalities
  const handleModeAction = (mode) => {
    console.log(`${mode} mode activated`);
    switch (mode) {
      case 'explain':
        // Add explain mode logic - detailed explanations, step-by-step breakdowns
        break;
      case 'qna':
        // Add Q&A mode logic - structured question-answer format
        break;
      case 'consult':
        // Add consult mode logic - professional advice, recommendations
        break;
      case 'plan':
        // Add plan mode logic - planning, scheduling, strategy creation
        break;
      default:
        break;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleSearchWithMode = () => {
    handleModeAction(activeMode);
    onSearch();
  };

  return (
    <div className="w-full max-w-2xl">
      {/* MODE SELECTOR */}
      <div className="flex justify-center mb-4">
        <ModeSelector activeMode={activeMode} setActiveMode={setActiveMode} />
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all hover:border-zinc-600">
        {/* MAIN INPUT FIELD */}
        {/* Edit placeholder text, styling here */}
        <input
          type="text"
          placeholder={`Ask anything in ${activeMode} mode...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          className="w-full bg-transparent text-white placeholder-zinc-500 outline-none text-lg font-light"
        />
        
        {/* ACTION BUTTONS ROW */}
        <div className="flex items-center justify-between mt-4">
          {/* LEFT SIDE - MODE INDICATOR */}
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700">
              <span className="text-emerald-400 text-sm font-medium capitalize">{activeMode}</span>
            </div>
          </div>
          
          {/* RIGHT SIDE BUTTONS */}
          <div className="flex items-center space-x-2">
            {/* More Options - edit handleMoreOptions() */}
            <button 
              onClick={handleMoreOptions}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
              title="More options"
            >
              <MoreHorizontal size={18} className="text-zinc-500 group-hover:text-zinc-300" />
            </button>
            
            {/* Attachment Button - edit handleAttachment() */}
            <button 
              onClick={handleAttachment}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
              title="Attach files"
            >
              <Paperclip size={18} className="text-zinc-500 group-hover:text-zinc-300" />
            </button>
            
            {/* Voice Input Button - edit handleVoiceInput() */}
            <button 
              onClick={handleVoiceInput}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
              title="Voice input"
            >
              <Mic size={18} className="text-zinc-500 group-hover:text-zinc-300" />
            </button>
            
            {/* SUBMIT BUTTON - Main search trigger */}
            {/* This button calls the main search function with mode context */}
            <button 
              onClick={handleSearchWithMode}
              disabled={!query.trim()}
              className="bg-emerald-500 p-2 rounded-lg hover:bg-emerald-600 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors group"
              title={`Search in ${activeMode} mode`}
            >
              <ArrowUp size={18} className="text-white group-disabled:text-zinc-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;