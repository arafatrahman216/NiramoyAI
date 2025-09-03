import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SearchInput from './SearchInput';
import MainLogo from './MainLogo';
import VisitsSidebar from './VisitsSidebar';
import ChatsSidebar from './ChatsSidebar';
import UploadVisitModal from './UploadVisitModal';

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
      />

      {/* VISITS SIDEBAR */}
      <VisitsSidebar 
        isOpen={isVisitsSidebarOpen}
        onClose={() => setIsVisitsSidebarOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {/* UPLOAD VISIT BUTTON - TOP RIGHT */}
        <div className="flex justify-end pt-6 pr-8 pb-4">
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

        {/* CENTER CONTENT - LOGO AND SEARCH */}
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