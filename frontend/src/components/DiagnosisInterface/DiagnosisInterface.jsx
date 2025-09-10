import React, { useState, useRef, useEffect, use } from 'react';
import Sidebar from './Sidebar';
import SearchInput from './SearchInput';
import MainLogo from './MainLogo';
import VisitsSidebar from './VisitsSidebar';
import ChatsSidebar from './ChatsSidebar';
import UploadVisitModal from './UploadVisitModal';

import api from '../../services/api';
import { set } from 'date-fns';

const DiagnosisInterface = () => {
  const [query, setQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const chatEndRef = useRef(null);
  const [chatId, setChatId] = useState(1);

  const [isVisitsSidebarOpen, setIsVisitsSidebarOpen] = useState(false);
  const [isChatsSidebarOpen, setIsChatsSidebarOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isLoadingResponse]);

  useEffect( () => {
    refreshChat();
  }
  , [chatId]);


  const refreshChat = async () => {
    const response = await api.post('/user/message', { "chatId" : chatId});
      const data = await response.data;
      console.log(data);
      const messages = data.data;

      setChatMessages([]);

      for (const msgPart of messages) {
        const type = msgPart.agent === true ? 'response' : 'query';
        setChatMessages(prev => [
          ...prev,
          { type, content: msgPart.content }
        ]);
      }
    }

  const handleSearch = async () => {
    if (!query.trim()) return;

    setChatMessages(prev => [...prev, { type: 'query', content: query }]);
    setIsLoadingResponse(true);
    
    
    try {
      
      const myQuery = query;
      setQuery('');
      const response2 = await api.post('/user/chat', { "chatId" : chatId, "message" : myQuery});
      console.log(response2);
      const response = await api.post('/agent/search', { "chatId" : chatId, "message" : myQuery});
      //! after integrating the agent in background. get the response from /user/chat endpoint instead
      //! of using /agent/search endpoint. and the /user/chat endpoint should 
      //! return the final response from the agent.

      setChatMessages(prev => [
        ...prev,
        { type: 'response', content: response.data.data }
      ]);
    } catch (error) {
      console.error('Search error:', error);
      setChatMessages(prev => [
        ...prev,
        { type: 'response', content: '❌ Error fetching response. Please try again.' }
      ]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      <div style={{ position: 'fixed', zIndex: 10000, minHeight: '100vh' }} className="flex-shrink-0 border-r border-zinc-800">

        {/* FIXED SIDE PANELS */}
        <Sidebar 
          onVisitsClick={() => setIsVisitsSidebarOpen(!isVisitsSidebarOpen)}
          isVisitsSidebarOpen={isVisitsSidebarOpen}
          onChatsClick={() => setIsChatsSidebarOpen(!isChatsSidebarOpen)}
          isChatsSidebarOpen={isChatsSidebarOpen}
        />

        <ChatsSidebar 
          isOpen={isChatsSidebarOpen}
          setChatid={setChatId}
          onClose={() => setIsChatsSidebarOpen(false)}
        />

        <VisitsSidebar 
          isOpen={isVisitsSidebarOpen}
          onClose={() => setIsVisitsSidebarOpen(false)}
          />
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {/* FIXED TOP BAR */}
        <div className="sticky top-0 bg-zinc-950 z-20 flex justify-between items-center px-8 pt-6 pb-4 border-b border-zinc-800">
          {/* Logo stays fixed here */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
          <MainLogo />
          </div>

          {/* Upload Visit Button */}
          <div className="flex-1" style={{ textAlign: 'right' }} > {/* Spacer to push button to right */}

          <button 
            onClick={() => setIsUploadModalOpen(true)}
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
        </div>

        {/* CHAT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto px-8">
          {chatMessages.length === 0 ? (
            // LANDING VIEW
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mt-8 w-full max-w-2xl">
                <SearchInput 
                  query={query} 
                  setQuery={setQuery} 
                  onSearch={handleSearch} 
                />
              </div>
            </div>
          ) : (
            // CHAT VIEW
            <>
              <div className="py-6 max-w-3xl mx-auto w-full">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex mb-3 transition-all duration-300 ease-in-out ${
                      msg.type === 'query' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xl px-4 py-2 rounded-2xl animate-fadeIn ${
                        msg.type === 'query'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-zinc-800 text-gray-200 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isLoadingResponse && (
                  <div className="flex justify-start mb-3">
                    <div className="bg-zinc-800 text-gray-300 px-4 py-2 rounded-2xl rounded-bl-none animate-pulse">
                      Typing...
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </>
          )}
        </div>

        {/* FIXED BOTTOM INPUT */}
        {chatMessages.length > 0 && (
          <div className="sticky bottom-0 bg-zinc-950 border-t border-zinc-800 px-8 py-4">
            <div className="max-w-3xl mx-auto">
              <SearchInput 
                query={query} 
                setQuery={setQuery} 
                onSearch={handleSearch} 
              />
            </div>
          </div>
        )}
      </div>

      <UploadVisitModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export default DiagnosisInterface;
