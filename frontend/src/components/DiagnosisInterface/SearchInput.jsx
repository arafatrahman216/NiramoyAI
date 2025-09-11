import React from 'react';
import { Search, Paperclip, Mic, ArrowUp, MoreHorizontal, Globe } from 'lucide-react';

// ==============================================
// SEARCH INPUT COMPONENT
// ==============================================
// Contains: Input field and all action buttons
// Edit individual button handlers to add functionality
const SearchInput = ({ query, setQuery, onSearch, placeholder = "Ask anything..." }) => {
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

  // TODO: Add focus mode functionality
  const handleFocusMode = () => {
    console.log('Focus mode clicked');
    // Add focus mode toggle (academic, web, etc.)
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all hover:border-zinc-600">
        {/* MAIN INPUT FIELD */}
        {/* Edit placeholder text, styling here */}
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          className="w-full bg-transparent text-white placeholder-zinc-500 outline-none text-lg font-light"
        />
        
        {/* ACTION BUTTONS ROW */}
        <div className="flex items-center justify-between mt-4">
          {/* LEFT SIDE BUTTONS */}
          {/* Edit these handlers to add functionality */}
          <div className="flex items-center space-x-2">
            {/* Search Button - currently just visual */}
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group">
              <Search size={18} className="text-emerald-400 group-hover:text-emerald-300" />
            </button>
            
            {/* Attachment Button - edit handleAttachment() */}
            <button 
              onClick={handleAttachment}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
              title="Attach files"
            >
              <Paperclip size={18} className="text-zinc-500 group-hover:text-zinc-300" />
            </button>
            
            {/* Focus Mode Button - edit handleFocusMode() */}
            <button 
              onClick={handleFocusMode}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
              title="Focus mode"
            >
              <Globe size={18} className="text-zinc-500 group-hover:text-zinc-300" />
            </button>
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
            
            {/* Secondary Focus Button */}
            <button 
              onClick={handleFocusMode}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
            >
              <Globe size={18} className="text-zinc-500 group-hover:text-zinc-300" />
            </button>
            
            {/* Secondary Attachment Button */}
            <button 
              onClick={handleAttachment}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
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
            {/* This button calls the main search function */}
            <button 
              onClick={onSearch}
              disabled={!query.trim()}
              className="bg-emerald-500 p-2 rounded-lg hover:bg-emerald-600 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors group"
              title="Search"
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
