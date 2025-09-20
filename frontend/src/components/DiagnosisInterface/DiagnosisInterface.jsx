// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import SearchInput from './SearchInput';
// import MainLogo from './MainLogo';
// import VisitsSidebar from './VisitsSidebar';
// import ChatsSidebar from './ChatsSidebar';
// import UploadVisitModal from './UploadVisitModal';
// import ChatConversation from './ChatConversation';

// import { chatbotAPI, doctorAPI } from '../../services/api'

// // ==============================================
// // DIAGNOSIS INTERFACE MAIN CONTAINER
// // ==============================================
// // Combines all components and handles main search logic
// // Edit handleSearch() to add your search implementation
// const DiagnosisInterface = () => {
//   // SEARCH STATE
//   const [query, setQuery] = useState('');
  
//   // VISITS SIDEBAR STATE
//   const [isVisitsSidebarOpen, setIsVisitsSidebarOpen] = useState(false);
  
//   // CHATS SIDEBAR STATE
//   const [isChatsSidebarOpen, setIsChatsSidebarOpen] = useState(false);
  
//   // CHAT ID STATE - tracks selected chat
//   const [selectedChatId, setSelectedChatId] = useState(null);
  
//   // SELECTED CHAT DATA - tracks full chat data with messages
//   const [selectedChatData, setSelectedChatData] = useState(null);
  
//   // UPLOAD VISIT MODAL STATE
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

//   // MAIN SEARCH HANDLER
//   // Handles search/message sending based on current context
//   const handleSearch = async (mode = 'explain') => {
//     if (!query.trim()) return;
    
//     // Check if user is authenticated
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Please log in to send messages.');
//       return;
//     }
    
//     // If we're in chat mode, send message to current chat
//     if (selectedChatId) {
//       console.log('Sending message to current chat:', selectedChatId);
//       console.log('Message content:', query);
//       console.log('Auth token exists:', !!localStorage.getItem('token'));
      
//       // Add user message immediately to local state
//       const userMessage = {
//         messageId: Date.now(),
//         content: query.trim(),
//         isAgent: false,
//         timestamp: new Date().toISOString(),
//         isPlan: false
//       };
      
//       // Update local chat data immediately to show user message
//       if (selectedChatData) {
//         const updatedChatData = {
//           ...selectedChatData,
//           messages: [...(selectedChatData.messages || []), userMessage]
//         };
//         setSelectedChatData(updatedChatData);
//       }
      
//       const messageToSend = query.trim();
//       setQuery(''); // Clear input immediately
      
//       try {
//         // Send message to current chat using chatbotAPI
//         const response = await chatbotAPI.sendMessage(messageToSend, selectedChatId, mode);
        
//         console.log('API Response:', response);
        
//         if (response.data.success) {
//           console.log('Message sent successfully:', response.data);
          
//           // Add AI reply to local state
//           const aiReply = {
//             messageId: response.data.aiResponse.messageId || Date.now() + 1,
//             content: response.data.aiResponse.content,
//             isAgent: true,
//             timestamp: new Date().toISOString(),
//             isPlan: response.data.aiResponse.isPlan || false
//           };
          
//           // Update local chat data with AI reply
//           if (selectedChatData) {
//             const updatedChatData = {
//               ...selectedChatData,
//               messages: [...(selectedChatData.messages || []), userMessage, aiReply]
//             };
//             setSelectedChatData(updatedChatData);
//           }
          
//           // Force a refresh of the chat conversation component
//           window.dispatchEvent(new CustomEvent('chatRefresh'));
          
//         } else {
//           console.error('Failed to send message:');
//           alert('Failed to send message: ' + response.data.message);
          

//           if (selectedChatData) {
//             const errorMessage = {
//               messageId: Date.now() + 2,
//               content: "Something went wrong. Please try again.",
//               isAgent: true,
//               timestamp: new Date().toISOString()
//             };
//             setSelectedChatData({
//               ...selectedChatData,
//               messages: [...(selectedChatData.messages || []), errorMessage]
//             });
//           }


//         }
//       } catch (error) {
//         console.error('Full error object:', error);
//         console.error('Error response:', error.response);
//         console.error('Error status:', error.response?.status);
//         console.error('Error data:', error.response?.data);
      
        
//           if (error.response?.status === 401) {
//             alert('Authentication failed. Please log in again.');
//           } else if (error.response?.status === 403) {
//             alert('Access denied. You don\'t have permission to send messages.');
//           } else if (error.response?.status === 500) {
//             alert('Server error. Please try again later.');
//           } else if (error.response == 400){
//             alert('Bad request. Please check your message and try again.');
//           } else if (error.response?.status === 429) {
//             alert('Too many requests. Please slow down.');
//           } else if (error.response?.status === 503) {
//             alert('Service unavailable. Try again.');
//           } else {
//             alert('Error sending message. Please try again.');
//           }
//       }
//     } else {
//       // If not in chat mode, create new chat (default search behavior)
//       console.log('Creating new chat for search query:', query);
      
//       try {
//         const response = await chatbotAPI.startConversation();
//         const newChatId = response.data.conversationId || response.data.chatId;
        
//         if (newChatId) {
//           setSelectedChatId(newChatId);
//           setSelectedChatData({
//             chatId: newChatId,
//             title: 'New Chat',
//             messages: []
//           });
          
//           // Don't clear query here - let user send it as first message
//           console.log('New chat created, user can now send their query');
//         }
//       } catch (error) {
//         console.error('Error creating new chat:', error);
//         alert('Unable to start new chat. Please try again.');
//       }
//     }
//   };

//   // UPLOAD VISIT HANDLER
//   const handleUploadVisit = () => {
//     console.log('Opening upload visit modal');
//     setIsUploadModalOpen(true);
//     // TODO: Add any pre-upload setup here
//     // - Check authentication
//     // - Validate permissions
//     // - Initialize form data
//   };

//   // CHAT SELECTION HANDLER
//   const handleChatSelection = (chatId) => {
//     setSelectedChatId(chatId);
//     console.log('Selected chat ID:', chatId);
//   };

//   // BACK TO SEARCH HANDLER
//   const handleBackToSearch = () => {
//     setSelectedChatId(null);
//     setSelectedChatData(null);
//     console.log('Returning to search interface');
//   };

//   // HANDLE SELECTED CHAT DATA
//   const handleSelectedChat = (chatData) => {
//     setSelectedChatData(chatData);
//     console.log('Selected full chat data:', chatData);
//   };

//   // HANDLE NEW CHAT CREATION
//   const handleNewChat = async () => {
//     try {
//       // Import chatbotAPI dynamically
//       const { chatbotAPI } = await import('../../services/api');
      
//       console.log('Starting new chat...');
//       const response = await chatbotAPI.startConversation();
//       const newChatId = response.data.conversationId || response.data.chatId;
      
//       if (newChatId) {
//         // Set the new chat as selected
//         setSelectedChatId(newChatId);
//         setSelectedChatData({
//           chatId: newChatId,
//           title: 'New Chat',
//           messages: []
//         });
        
//         // Clear any existing query
//         setQuery('');
        
//         console.log('New chat created and selected:', newChatId);
//       }
//     } catch (error) {
//       console.error('Error creating new chat:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* SIDEBAR SECTION - FIXED */}
//       {/* Navigation and user controls */}
//       <Sidebar 
//         onVisitsClick={() => setIsVisitsSidebarOpen(!isVisitsSidebarOpen)}
//         isVisitsSidebarOpen={isVisitsSidebarOpen}
//         onChatsClick={() => setIsChatsSidebarOpen(!isChatsSidebarOpen)}
//         isChatsSidebarOpen={isChatsSidebarOpen}
//         onNewChat={handleNewChat}
//       />

//       {/* CHATS SIDEBAR */}
//       <ChatsSidebar 
//         isOpen={isChatsSidebarOpen}
//         onClose={() => setIsChatsSidebarOpen(false)}
//         setChatid={handleChatSelection}
//         setSelectedChat={handleSelectedChat}
//       />

//       {/* VISITS SIDEBAR */}
//       <VisitsSidebar 
//         isOpen={isVisitsSidebarOpen}
//         onClose={() => setIsVisitsSidebarOpen(false)}
//       />

//       {/* MAIN CONTENT AREA - WITH LEFT MARGIN FOR FIXED SIDEBAR */}
//       <div className={`${(isChatsSidebarOpen || isVisitsSidebarOpen) ? 'ml-96' : 'ml-16'} flex flex-col bg-zinc-950 min-h-screen transition-all duration-300`}>
//         {/* TOP BAR - UPLOAD BUTTON AND CHAT HEADER */}
//         <div className="flex justify-between items-center pt-6 pr-8 pb-4 pl-8">
//           {/* LEFT SIDE - CHAT INFO */}
//           <div className="flex items-center space-x-3">
//             {selectedChatId && (
//               <>
//                 <button
//                   onClick={handleBackToSearch}
//                   className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
//                   title="Back to search"
//                 >
//                   <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
//                 <div>
//                   <h2 className="text-lg font-semibold text-white">
//                     {selectedChatData?.title || 'Chat Conversation'}
//                   </h2>
//                   <p className="text-sm text-zinc-400">
//                     {selectedChatData?.messages?.length || 0} messages
//                   </p>
//                 </div>
//               </>
//             )}
//           </div>
          
//           {/* RIGHT SIDE - UPLOAD BUTTON */}
//           <button 
//             onClick={handleUploadVisit}
//             className="bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-3 hover:border-zinc-600 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all group"
//           >
//             <div className="flex items-center space-x-3">
//               <svg className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//               </svg>
//               <span className="text-white font-medium">Upload Visit</span>
//             </div>
//           </button>
//         </div>

//         {/* MAIN CONTENT AREA - CHATGPT STYLE */}
//         <div className="flex-1 flex flex-col relative">
//           {selectedChatId ? (
//             /* CHAT MODE - CONVERSATION + FIXED INPUT AT BOTTOM */
//             <>
//               {/* MESSAGES AREA */}
//               <div className="flex-1 overflow-y-auto pb-40 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 hover:scrollbar-thumb-zinc-700">
//                 <ChatConversation 
//                   chatId={selectedChatId}
//                   onBack={handleBackToSearch}
//                   chatData={selectedChatData}
                  
//                   embedded={true}
//                 />
//               </div>

//               {/* FIXED SEARCH INPUT AT BOTTOM */}
//               <div className={`fixed bottom-0 ${(isChatsSidebarOpen || isVisitsSidebarOpen) ? 'left-96' : 'left-16'} right-0 py-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-zinc-950/80 backdrop-blur-sm z-40 transition-all duration-300`}>
//                 <div className="max-w-4xl mx-auto px-6">
//                   <SearchInput 
//                     query={query} 
//                     setQuery={setQuery} 
//                     onSearch={handleSearch}
//                     placeholder="Continue conversation or search..."
//                   />
//                 </div>
//               </div>
//             </>
//           ) : (
//             /* DEFAULT SEARCH VIEW - CENTERED LOGO AND SEARCH */
//             <div className="flex-1 flex flex-col items-center justify-center px-8">
//               {/* LOGO SECTION */}
//               <MainLogo />

//               {/* SEARCH SECTION */}
//               <SearchInput 
//                 query={query} 
//                 setQuery={setQuery} 
//                 onSearch={handleSearch} 
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* UPLOAD VISIT MODAL */}
//       <UploadVisitModal 
//         isOpen={isUploadModalOpen}
//         onClose={() => setIsUploadModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default DiagnosisInterface;




import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import SearchInput from './SearchInput';
import MainLogo from './MainLogo';
import VisitsSidebar from './VisitsSidebar';
import ChatsSidebar from './ChatsSidebar';
import UploadVisitModal from './UploadVisitModal';
import ChatConversation from './ChatConversation';

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
  
  // UPLOAD VISIT MODAL STATE
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // PROCESSING STATE - tracks when AI is generating response
  const [isProcessing, setIsProcessing] = useState(false);
  
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
      console.log('Attachment:', attachment?.name);
      console.log('Auth token exists:', !!localStorage.getItem('token'));
      
      const messageToSend = query.trim();
      setQuery(''); // Clear input immediately

      // Set processing state to show loading indicator
      setIsProcessing(true);
      
      // Add user message immediately to local state
      const userMessage = {
        messageId: Date.now(),
        content: messageToSend,
        isAgent: false,
        timestamp: new Date().toISOString(),
        isPlan: false
      };
      
      // Add user message immediately to chat
      window.dispatchEvent(new CustomEvent('addMessage', { detail: userMessage }));
      
      var aiMessage;
      try {
        // Choose API method based on whether we have attachment
        const response = attachment 
          ? await chatbotAPI.sendMessageWithAttachment(messageToSend, selectedChatId, attachment, mode)
          : await chatbotAPI.sendMessage(messageToSend, selectedChatId, mode);
        
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
        

          setQuery(messageToSend);
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
  const handleChatSelection = (chatId) => {
    setSelectedChatId(chatId);
    console.log('Selected chat ID:', chatId);
  };

  // BACK TO SEARCH HANDLER
  const handleBackToSearch = () => {
    setSelectedChatId(null);
    setSelectedChatData({ messages: [] });
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
                  embedded={true}
                />
              </div>

              {/* FIXED SEARCH INPUT AT BOTTOM */}
              <div className={`fixed bottom-0 ${(isChatsSidebarOpen || isVisitsSidebarOpen) ? 'left-96' : 'left-16'} right-0 py-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-zinc-950/80 backdrop-blur-sm z-40 transition-all duration-300`}>
                <div className="max-w-4xl mx-auto px-6">
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