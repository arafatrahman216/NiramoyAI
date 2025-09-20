import React, { useEffect, useState } from 'react';
import { chatbotAPI } from '../../services/api';

// ==============================================
// CHATS SIDEBAR COMPONENT
// ==============================================
// Contains: Chat history and conversation list
// Used to show previous chats, start new conversations, etc.

interface ChatsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setChatid: (chatId: string) => void;
  setSelectedChat?: (chat: any) => void;
  chatSessions?: any[]; // Preloaded chat sessions from parent
  setChatSessions?: (sessions: any[]) => void; // Function to update chat sessions in parent
  isLoading?: boolean; // Loading state from parent
}

const ChatsSidebar: React.FC<ChatsSidebarProps> = ({ 
  isOpen, 
  setChatid, 
  setSelectedChat, 
  onClose, 
  chatSessions = [], 
  setChatSessions,
  isLoading = false
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [creatingNewChat, setCreatingNewChat] = useState(false);
  
  // Refresh chat sessions if needed (for new chat creation)
  const refreshChatSessions = async () => {
    if (!setChatSessions) return;
    
    setRefreshing(true);
    try {
      const response = await chatbotAPI.getChatSessions();
      const data = response.data;
      setChatSessions(data.chatSessions || []);
      console.log('Chat sessions refreshed:', data);
    } catch (error) {
      console.error('Error refreshing chat sessions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle creating a new chat
  const handleNewChat = async () => {
    setCreatingNewChat(true);
    try {
      const response = await chatbotAPI.startConversation();
      const newChatId = response.data.conversationId || response.data.chatId;
      
      console.log('New chat created:', newChatId);
      
      // Select the new chat immediately
      if (newChatId) {
        setChatid(newChatId);
        onClose();
      }
      
      // Refresh the chat sessions list
      await refreshChatSessions();
    } catch (error) {
      console.error('Error creating new chat:', error);
    } finally {
      setCreatingNewChat(false);
    }
  };
  
  // No longer need useEffect to fetch on open since data is preloaded
  if (!isOpen) return null;

  return (
    <div className="fixed left-16 top-0 bottom-0 w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col z-30">
      {/* SIDEBAR HEADER */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-white">Chat History</h2>
          {refreshing && (
            <div className="animate-spin w-4 h-4 border-2 border-zinc-600 border-t-emerald-500 rounded-full"></div>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-800 rounded transition-colors"
          title="Close sidebar"
        >
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* NEW CHAT BUTTON */}
      <div className="p-4 border-b border-zinc-800">
        <button 
          onClick={handleNewChat}
          disabled={creatingNewChat}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {creatingNewChat ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Chat</span>
            </>
          )}
        </button>
      </div>
      
      {/* SIDEBAR CONTENT */}
      <div className="flex-1 p-4 overflow-y-scroll scrollbar-hide">
        {isLoading ? (
          /* Loading State */
          <div className="text-center text-zinc-500 mt-8">
            <div className="animate-spin w-8 h-8 border-2 border-zinc-600 border-t-emerald-500 rounded-full mx-auto mb-4"></div>
            <p className="text-sm">Loading chat history...</p>
          </div>
        ) : chatSessions.length === 0 ? (
          /* Empty State */
          <div className="text-center text-zinc-500 mt-8">
            <svg className="w-12 h-12 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs text-zinc-600 mt-1">Start a new chat to begin your medical consultation</p>
          </div>
        ) : (
          /* Chat History */
          <div className="space-y-2 mt-4">
            {chatSessions.map((session: any) => (
              <div 
                key={session.chatId} 
                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors"
                onClick={() => {
                  setChatid(session.chatId);
                  // Don't pass session data since it doesn't contain messages
                  // Let ChatConversation fetch messages separately
                  onClose();
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white truncate">
                      {session.title || 'Untitled Chat'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {session.messageCount !== undefined ? `${session.messageCount} messages` : 'No messages yet...'}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500 ml-2">
                    {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsSidebar;
