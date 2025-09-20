import React, { useState, useRef } from 'react';
import { Search, Paperclip, Mic, ArrowUp, MoreHorizontal, Globe, MessageSquare, HelpCircle, UserCheck, Calendar, Square } from 'lucide-react';
import { chatbotAPI } from '../../services/api';

// ==============================================
// SEARCH INPUT COMPONENT
// ==============================================
// Contains: Input field and all action buttons
// Edit individual button handlers to add functionality
const SearchInput = ({ query, setQuery, onSearch, placeholder = "Ask anything..." }) => {
  const [activeMode, setActiveMode] = useState('explain');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const textBoxRef = useRef(null);
  const chunksRef = useRef([]);

  const modes = [
    { id: 'explain', label: 'Explain', icon: MessageSquare },
    { id: 'qna', label: 'Q&A', icon: HelpCircle },
    { id: 'consult', label: 'Consult', icon: UserCheck },
    { id: 'plan', label: 'Plan', icon: Calendar }
  ];
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

  // Voice input functionality with recording
  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsProcessing(true);
      
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        textBoxRef.current.focus();

      }
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          chunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
          
          try {
            console.log('Sending audio to API...');
            const response = await chatbotAPI.getVoiceMessage(audioBlob);
            
            if (response.data && response.data.text) {
              console.log('Voice transcription successful:', response.data.text);
              setQuery(response.data.text);
            } else {
              console.error('No text in response:', response.data);
              alert('Failed to transcribe audio. Please try again.');
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
            alert('Error processing voice message. Please try again.');
          } finally {
            setIsProcessing(false);
            // Stop all tracks to free up microphone
            stream.getTracks().forEach(track => track.stop());
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
        console.log('Voice recording started');
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please check permissions.');
        setIsProcessing(false);
      }
    }
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
      handleModeAction(activeMode);
      onSearch(activeMode);
    }
  };

  const handleSearchWithMode = () => {
    handleModeAction(activeMode);
    onSearch(activeMode);
  };

  return (
    <div className="w-full max-w-3xl">
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
          ref={textBoxRef}
          className="w-full bg-transparent text-white placeholder-zinc-500 outline-none text-lg font-light"
        />
        
        {/* ACTION BUTTONS ROW */}
        <div className="flex items-center justify-between mt-4">
          {/* LEFT SIDE - MODE SELECTOR */}
          <div className="flex items-center space-x-2">
            {/* MODE SELECTOR EMBEDDED */}
            <div className="flex items-center bg-zinc-800 rounded-lg p-1.5 border border-zinc-700">
              {modes.map((mode, idx) => {
                const IconComponent = mode.icon;
                const getTooltipText = (modeId) => {
                  switch (modeId) {
                    case 'explain': return 'Explain - Get detailed explanations and step-by-step breakdowns';
                    case 'qna': return 'Q&A - Structured question-answer format for quick insights';
                    case 'consult': return 'Consult - Professional advice and expert recommendations';
                    case 'plan': return 'Plan - Create strategies, schedules and action plans';
                    default: return `${mode.label} mode`;
                  }
                };
                
                return (
                  <React.Fragment key={mode.id}>
                    <button
                      onClick={() => setActiveMode(mode.id)}
                      className={`relative p-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                        activeMode === mode.id
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                      }`}
                      title={getTooltipText(mode.id)}
                      aria-label={getTooltipText(mode.id)}
                    >
                      <IconComponent size={16} />
                    </button>
                    {idx < modes.length - 1 && (
                      <span className="mx-1 text-zinc-600 select-none text-lg">|</span>
                    )}
                  </React.Fragment>
                );
              })}
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
            
            {/* Voice Input Button with recording states */}
            <button 
              onClick={handleVoiceInput}
              disabled={isProcessing}
              className={`p-2 rounded-lg transition-all duration-300 group relative ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : isProcessing 
                  ? 'bg-zinc-700 text-zinc-300'
                  : 'hover:bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'
              }`}
              title={
                isRecording 
                  ? 'Click to stop recording' 
                  : isProcessing 
                  ? 'Processing audio...' 
                  : 'Voice input'
              }
            >
              {isProcessing ? (
                <div className="animate-spin w-4.5 h-4.5 border-2 border-zinc-300 border-t-transparent rounded-full" />
              ) : isRecording ? (
                <Square size={18} className="text-white" />
              ) : (
                <Mic size={18} />
              )}
              
              {/* Recording animation ring */}
              {isRecording && (
                <div className="absolute inset-0 rounded-lg border-2 border-red-400 animate-ping opacity-75"></div>
              )}
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






