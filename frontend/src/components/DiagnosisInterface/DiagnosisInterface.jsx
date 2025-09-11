import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SearchInput from './SearchInput';
import MainLogo from './MainLogo';
import VisitsSidebar from './VisitsSidebar';
import ChatsSidebar from './ChatsSidebar';
import UploadVisitModal from './UploadVisitModal';
import ChatConversation from './ChatConversation';

import agentAPI from '../../services/api'

// ==============================================
// DIAGNOSIS INTERFACE MAIN CONTAINER
// ==============================================
// Combines all components and handles main search logic
// Edit handleSearch() to add your search implementation
const DiagnosisInterface = () => {
  // SEARCH STATE
  const [query, setQuery] = useState('');
  
  // VISITS SIDEBAR STATE
  const [isVisitsSidebarOpen, setIsVisitsSidebarOpen] = useState(false);
  
  // CHATS SIDEBAR STATE
  const [isChatsSidebarOpen, setIsChatsSidebarOpen] = useState(false);
  
  // CHAT ID STATE - tracks selected chat
  const [selectedChatId, setSelectedChatId] = useState(null);
  
  // SELECTED CHAT DATA - tracks full chat data with messages
  const [selectedChatData, setSelectedChatData] = useState(null);
  
  // UPLOAD VISIT MODAL STATE
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // MAIN SEARCH HANDLER
  // TODO: Replace this with your actual search implementation
  const handleSearch = () => {
    if (!query.trim()) return;
    
    console.log('Searching for:', query);
    
    // ADD YOUR SEARCH LOGIC HERE:
    // - API calls to your backend
    // - Navigate to results page
    // - Update global state
    // - Show loading states
    // Example:
    // searchAPI(query).then(results => {
    //   setSearchResults(results);
    //   navigate('/results');
    // });

    agentAPI.searchAPI(query).then(response => {
        console.log('Diagnosis results:', response.data);
    });

  };

  // UPLOAD VISIT HANDLER
  const handleUploadVisit = () => {
    console.log('Opening upload visit modal');
    setIsUploadModalOpen(true);
    // TODO: Add any pre-upload setup here
    // - Check authentication
    // - Validate permissions
    // - Initialize form data
  };

  // CHAT SELECTION HANDLER
  const handleChatSelection = (chatId) => {
    setSelectedChatId(chatId);
    console.log('Selected chat ID:', chatId);
  };

  // BACK TO SEARCH HANDLER
  const handleBackToSearch = () => {
    setSelectedChatId(null);
    setSelectedChatData(null);
    console.log('Returning to search interface');
  };

  // HANDLE SELECTED CHAT DATA
  const handleSelectedChat = (chatData) => {
    setSelectedChatData(chatData);
    console.log('Selected full chat data:', chatData);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* SIDEBAR SECTION */}
      {/* Navigation and user controls */}
      <Sidebar 
        onVisitsClick={() => setIsVisitsSidebarOpen(!isVisitsSidebarOpen)}
        isVisitsSidebarOpen={isVisitsSidebarOpen}
        onChatsClick={() => setIsChatsSidebarOpen(!isChatsSidebarOpen)}
        isChatsSidebarOpen={isChatsSidebarOpen}
      />

      {/* CHATS SIDEBAR */}
      <ChatsSidebar 
        isOpen={isChatsSidebarOpen}
        onClose={() => setIsChatsSidebarOpen(false)}
        setChatid={handleChatSelection}
        setSelectedChat={handleSelectedChat}
      />

      {/* VISITS SIDEBAR */}
      <VisitsSidebar 
        isOpen={isVisitsSidebarOpen}
        onClose={() => setIsVisitsSidebarOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {/* TOP BAR - UPLOAD BUTTON AND CHAT HEADER */}
        <div className="flex justify-between items-center pt-6 pr-8 pb-4 pl-8">
          {/* LEFT SIDE - CHAT INFO */}
          <div className="flex items-center space-x-3">
            {selectedChatId && (
              <>
                <button
                  onClick={handleBackToSearch}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Back to search"
                >
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {selectedChatData?.title || 'Chat Conversation'}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {selectedChatData?.messages?.length || 0} messages
                  </p>
                </div>
              </>
            )}
          </div>
          
          {/* RIGHT SIDE - UPLOAD BUTTON */}
          <button 
            onClick={handleUploadVisit}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-3 hover:border-zinc-600 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-white font-medium">Upload Visit</span>
            </div>
          </button>
        </div>

        {/* MAIN CONTENT AREA - CHATGPT STYLE */}
        <div className="flex-1 flex flex-col relative">
          {selectedChatId ? (
            /* CHAT MODE - CONVERSATION + FIXED INPUT AT BOTTOM */
            <>
              {/* MESSAGES AREA */}
              <div className="flex-1 overflow-y-auto pb-24">
                <ChatConversation 
                  chatId={selectedChatId}
                  onBack={handleBackToSearch}
                  chatData={selectedChatData}
                  embedded={true}
                />
              </div>

              {/* FIXED SEARCH INPUT AT BOTTOM */}
              <div className="fixed bottom-0 left-0 right-0 py-4">
                <div className="max-w-4xl mx-auto px-6">
                  <SearchInput 
                    query={query} 
                    setQuery={setQuery} 
                    onSearch={handleSearch}
                    placeholder="Continue conversation or search..."
                  />
                </div>
              </div>
            </>
          ) : (
            /* DEFAULT SEARCH VIEW - CENTERED LOGO AND SEARCH */
            <div className="flex-1 flex flex-col items-center justify-center px-8">
              {/* LOGO SECTION */}
              <MainLogo />

              {/* SEARCH SECTION */}
              <SearchInput 
                query={query} 
                setQuery={setQuery} 
                onSearch={handleSearch} 
              />
            </div>
          )}
        </div>
      </div>

      {/* UPLOAD VISIT MODAL */}
      <UploadVisitModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export default DiagnosisInterface;