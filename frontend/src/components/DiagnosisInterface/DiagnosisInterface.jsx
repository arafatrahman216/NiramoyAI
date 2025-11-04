import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import SearchInput from './SearchInput';
import MainLogo from './MainLogo';
import VisitsSidebar from './VisitsSidebar';
import ChatsSidebar from './ChatsSidebar';
import UploadVisitModal from './UploadVisitModal';
import ChatConversation from './ChatConversation';
import VisitContext from './VisitContext';

import { chatbotAPI, doctorAPI, userInfoAPI } from '../../services/api'

// ==============================================
// DIAGNOSIS INTERFACE MAIN CONTAINER
// ==============================================
// Combines all components and handles main search logic
// Edit handleSearch() to add your search implementation
const DiagnosisInterface = () => {
  // SEARCH STATE
  const [query, setQuery] = useState('');
  
  // SEARCH INPUT REF for clearing attachments
  const searchInputRef = useRef(null);
  
  // VISITS SIDEBAR STATE
  const [isVisitsSidebarOpen, setIsVisitsSidebarOpen] = useState(false);
  
  // CHATS SIDEBAR STATE
  const [isChatsSidebarOpen, setIsChatsSidebarOpen] = useState(false);
  
  // CHAT ID STATE - tracks selected chat
  const [selectedChatId, setSelectedChatId] = useState(null);
  
  // SELECTED CHAT DATA - tracks full chat data with messages
  const [selectedChatData, setSelectedChatData] = useState({ messages: [] });
  
  //CONTEXT: Store previous messages to send as context to LLM
  const [previousMessages, setPreviousMessages] = useState([]);
  
  // UPLOAD VISIT MODAL STATE
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // PROCESSING STATE - tracks when AI is generating response
  const [isProcessing, setIsProcessing] = useState(false);
  
  // VISIT CONTEXT STATE - stores visit information for chatbot context
  const [visitContext, setVisitContext] = useState(null);
  
  //CONTEXT: Loading state for visit context
  const [isLoadingVisitContext, setIsLoadingVisitContext] = useState(false);

  // Handle visit context from timeline clicks
  const handleVisitContextSet = (context) => {
    setVisitContext(context);
    setIsLoadingVisitContext(false); //CONTEXT: Clear loading when context is set
  };
  
  //CONTEXT: Handle visit loading state
  const handleVisitLoading = (isLoading) => {
    setIsLoadingVisitContext(isLoading);
  };

  // Clear visit context
  const clearVisitContext = () => {
    setVisitContext(null);
    setIsLoadingVisitContext(false); //CONTEXT: Clear loading when context is cleared
  };
  
  // RECENT VISITS STATE - for Timeline component
  const [recentVisits, setRecentVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(true);
  
  // CHAT SESSIONS STATE - for ChatsSidebar component
  const [chatSessions, setChatSessions] = useState([]);
  const [chatSessionsLoading, setChatSessionsLoading] = useState(true);

  // FETCH RECENT VISITS ON COMPONENT MOUNT
  useEffect(() => {
    const fetchRecentVisits = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, skipping visit fetch');
          setVisitsLoading(false);
          return;
        }
        
        const response = await userInfoAPI.getRecentVisits();
        
        if (response.data.success) {
          console.log('Recent visits fetched:', response.data.recentVisits);
          setRecentVisits(response.data.recentVisits);
        }
      } catch (error) {
        console.error('Failed to fetch recent visits:', error);
      } finally {
        setVisitsLoading(false);
      }
    };
    
    const fetchChatSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, skipping chat sessions fetch');
          setChatSessionsLoading(false);
          return;
        }
        
        const response = await chatbotAPI.getChatSessions();
        
        if (response.data && response.data.chatSessions) {
          console.log('Chat sessions fetched:', response.data.chatSessions);
          setChatSessions(response.data.chatSessions);
        }
      } catch (error) {
        console.error('Failed to fetch chat sessions:', error);
      } finally {
        setChatSessionsLoading(false);
      }
    };
    
    fetchRecentVisits();
    fetchChatSessions();
  }, []);

  // MAIN SEARCH HANDLER
  // Handles search/message sending based on current context
  const handleSearch = async (mode = 'explain', attachment = null) => {
    if (!query.trim() && !attachment) return;
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to send messages.');
      return;
    }
    
    // If we're in chat mode, send message to current chat
    if (selectedChatId) {
      console.log('Sending message to current chat:', selectedChatId);
      console.log('Message content:', query);
      console.log('Visit context:', visitContext);
      console.log('Attachment:', attachment?.name);
      console.log('Auth token exists:', !!localStorage.getItem('token'));
      
      // Prepare message content with visit context if available
      const originalQuery = query.trim();
      let messageToSend = originalQuery;
      if (visitContext) {
        const contextString = `${visitContext.summary} ${originalQuery}`;
        messageToSend = contextString;
      }
      
      setQuery(''); // Clear input immediately
      clearVisitContext(); // Clear visit context after sending

      // Set processing state to show loading indicator
      setIsProcessing(true);
      
      // Add user message immediately to local state (show original query, not context)
      const userMessage = {
        messageId: Date.now(),
        content: originalQuery, // Show original user query
        isAgent: false,
        timestamp: new Date().toISOString(),
        isPlan: false
      };
      
      // Add user message immediately to chat
      window.dispatchEvent(new CustomEvent('addMessage', { detail: userMessage }));
      
      var aiMessage;
      try {
        //CONTEXT: Prepare context data to send with the message
        const contextData = {
          previousMessages: previousMessages,
          visitContext: visitContext
        };
        
        // Choose API method based on whether we have attachment
        const response = attachment 
          ? await chatbotAPI.sendMessageWithAttachment(messageToSend, selectedChatId, attachment, mode, contextData)
          : await chatbotAPI.sendMessage(messageToSend, selectedChatId, mode, contextData);
        
        console.log('API Response:', response);
        
        if (response.data.success && response.data.aiResponse) {
          console.log('Message sent successfully:', response.data);
          
          // Clear attachment after successful send
          if (attachment && searchInputRef.current) {
            searchInputRef.current.clearAttachment();
          }
          
          // Add AI response directly from API response
          aiMessage = {
            messageId: response.data.aiResponse.messageId,
            content: response.data.aiResponse.content,
            isAgent: true,
            agent: true, // For ChatConversation compatibility
            timestamp: new Date().toISOString(),
            isPlan: response.data.aiResponse.isPlan || false,
            attachmentLink: response.data.aiResponse.imageLink || response.data.aiResponse.image_link || response.data.aiResponse.imageUrl || null
          };
          
          // Update local chat data with AI reply (user message should already be there)
          setSelectedChatData(prevData => {
            const updatedChatData = {
              ...prevData,
              messages: [...(prevData.messages || []), aiMessage]
            };
            console.log('DiagnosisInterface: Setting updated chat data:', updatedChatData);
            return updatedChatData;
          });
          
          // Send AI message to ChatConversation component
          window.dispatchEvent(new CustomEvent('addMessage', { detail: aiMessage }));
          
          //CONTEXT: Update previousMessages queue with new user message, keep max 6
          setPreviousMessages(prev => {
            const updated = [...prev, { role: 'user', content: originalQuery }];
            return updated.slice(-10);
          });
          
        } else {
          console.error('Failed to send message:');
          alert('Failed to send message: ' + response.data.message);
          

          const errorMessage = {
            messageId: Date.now() + 2,
            content: "Something went wrong. Please try again.",
            isAgent: true,
            timestamp: new Date().toISOString(),
            isPlan: false
          };
          setSelectedChatData(prevData => ({
            ...prevData,
            messages: [...(prevData.messages || []), errorMessage]
          }));


        }
      } catch (error) {
        console.error('Full error object:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        

          setQuery(originalQuery); // Restore original query, not the context-enhanced version
          if (error.response?.status === 401) {
            alert('Authentication failed. Please log in again.');
          } else if (error.response?.status === 403) {
            alert('Access denied. You don\'t have permission to send messages.');
          } else if (error.response?.status === 500) {
            window.dispatchEvent(new CustomEvent('addMessage', { detail: {
            messageId: Date.now() + 1,
            isAgent: true,
            content: 'Sorry, there was a server error. Please try again later.',

          } }));
            alert('Server error. Please try again later.');
          } else if (error.response == 400){
            alert('Bad request. Please check your message and try again.');
          } else if (error.response?.status === 429) {
            alert('Too many requests. Please slow down.');
          } else if (error.response?.status === 503) {
            alert('Service unavailable. Try again.');
          } else {
            alert('Error sending message. Please try again.');
          }
      } finally {
        // Always clear processing state
        setIsProcessing(false);
      }
    } else {
      // If not in chat mode, create new chat (default search behavior)
      console.log('Creating new chat for search query:', query);
      
      setIsProcessing(true);
      
      try {
        const response = await chatbotAPI.startConversation();
        const newChatId = response.data.conversationId || response.data.chatId;
        
        if (newChatId) {
          setSelectedChatId(newChatId);
          
          // Don't clear query here - let user send it as first message
          console.log('New chat created, user can now send their query');
        }
      } catch (error) {
        console.error('Error creating new chat:', error);
        alert('Unable to start new chat. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
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
  const handleChatSelection = async (chatId) => {
    setSelectedChatId(chatId);
    console.log('Selected chat ID:', chatId);
    
    //CONTEXT: Fetch and store previous messages when a chat is selected
    try {
      const response = await chatbotAPI.getMessages(chatId);
      const conversationData = response.data;
      
      //CONTEXT: Filter only user messages and keep last 6
      const userMessages = (conversationData.data || [])
        .filter((msg) => !msg.isAgent)
        .map((msg) => ({
          role: 'user',
          content: msg.content
        }))
        .slice(-10);
      
      setPreviousMessages(userMessages);
      console.log('Previous messages loaded as context:', userMessages);
    } catch (error) {
      console.error('Error loading previous messages:', error);
      setPreviousMessages([]);
    }
  };

  // BACK TO SEARCH HANDLER
  const handleBackToSearch = () => {
    setSelectedChatId(null);
    setSelectedChatData({ messages: [] });
    clearVisitContext(); // Clear visit context when returning to search
    setPreviousMessages([]); //CONTEXT: Clear previous messages context
    console.log('Returning to search interface');
  };

  // HANDLE NEW CHAT CREATION
  const handleNewChat = async () => {
    try {
      // Import chatbotAPI dynamically
      const { chatbotAPI } = await import('../../services/api');
      
      console.log('Starting new chat...');
      const response = await chatbotAPI.startConversation();
      const newChatId = response.data.conversationId || response.data.chatId;
      
      if (newChatId) {
        // Set the new chat as selected
        setSelectedChatId(newChatId);
        
        // Clear any existing query
        setQuery('');
        
        setPreviousMessages([]); //CONTEXT: Clear previous messages for new chat
        
        console.log('New chat created and selected:', newChatId);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* SIDEBAR SECTION - FIXED */}
      {/* Navigation and user controls */}
      <Sidebar 
        onVisitsClick={() => setIsVisitsSidebarOpen(!isVisitsSidebarOpen)}
        isVisitsSidebarOpen={isVisitsSidebarOpen}
        onChatsClick={() => setIsChatsSidebarOpen(!isChatsSidebarOpen)}
        isChatsSidebarOpen={isChatsSidebarOpen}
        onNewChat={handleNewChat}
      />

      {/* CHATS SIDEBAR */}
      <ChatsSidebar 
        isOpen={isChatsSidebarOpen}
        onClose={() => setIsChatsSidebarOpen(false)}
        setChatid={handleChatSelection}
        setSelectedChat={handleChatSelection}
        chatSessions={chatSessions}
        setChatSessions={setChatSessions}
        isLoading={chatSessionsLoading}
      />

      {/* VISITS SIDEBAR */}
      <VisitsSidebar 
        isOpen={isVisitsSidebarOpen}
        onClose={() => setIsVisitsSidebarOpen(false)}
        onVisitContextSet={handleVisitContextSet}
        onVisitLoading={handleVisitLoading} //CONTEXT: Pass loading handler
        visits={recentVisits}
        isLoading={visitsLoading}
      />

      {/* MAIN CONTENT AREA - WITH LEFT MARGIN FOR FIXED SIDEBAR */}
      <div className={`${(isChatsSidebarOpen || isVisitsSidebarOpen) ? 'ml-96' : 'ml-16'} flex flex-col bg-zinc-950 min-h-screen transition-all duration-300`}>
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
                    Chat Conversation
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Active chat
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
              <div className="flex-1 overflow-y-auto pb-40 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 hover:scrollbar-thumb-zinc-700">
                <ChatConversation 
                  chatId={selectedChatId}
                  onBack={handleBackToSearch}
                  chatData={selectedChatData}
                  isProcessing={isProcessing}
                  visitContext={visitContext}
                  onClearVisitContext={clearVisitContext}
                  embedded={true}
                />
              </div>

              {/* FIXED SEARCH INPUT AT BOTTOM */}
              <div className={`fixed bottom-0 ${(isChatsSidebarOpen || isVisitsSidebarOpen) ? 'left-96' : 'left-16'} right-0 py-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-zinc-950/80 backdrop-blur-sm z-40 transition-all duration-300`}>
                <div className="max-w-4xl mx-auto px-6">
                  {/* VISIT CONTEXT DISPLAY */}
                  <VisitContext 
                    visitContext={visitContext} 
                    onClearVisitContext={clearVisitContext}
                    isInChatMode={!!selectedChatId}
                    isLoading={isLoadingVisitContext} //CONTEXT: Pass loading state
                  />

                  <SearchInput 
                    ref={searchInputRef}
                    query={query} 
                    setQuery={setQuery} 
                    onSearch={handleSearch}
                    placeholder="Continue conversation or search..."
                    disabled={isProcessing}
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
                ref={searchInputRef}
                query={query} 
                setQuery={setQuery} 
                onSearch={handleSearch}
                disabled={isProcessing}
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