import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SearchInput from './SearchInput';
import MainLogo from './MainLogo';
import VisitsSidebar from './VisitsSidebar';
import ChatsSidebar from './ChatsSidebar';

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
      {/* Center logo and search input */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 bg-zinc-950">
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
  );
};

export default DiagnosisInterface;