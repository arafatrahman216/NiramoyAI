import React, { useEffect, useState } from 'react';
import api from '../../services/api';

// ==============================================
// CHATS SIDEBAR COMPONENT
// ==============================================
// Contains: Chat history and conversation list
// Used to show previous chats, start new conversations, etc.

interface ChatsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setChatid: (chatId: string) => void;
}

const ChatsSidebar: React.FC<ChatsSidebarProps> = ({ isOpen, setChatid, onClose }) => {
  const [chatSessions, setChatSessions] = useState([]);
  
  
  useEffect(() => {
    // Fetch chat sessions from backend API
    const fetchChatSessions = async () => {
      try {
        const response = await api.get('http://localhost:8000/api/user/chat-sessions');
        const data = await response.data;
        setChatSessions(data.chatSessions || []);

        console.log(data);
        console.log(chatSessions.length );
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
      }
    };
    fetchChatSessions();
  }, []);
  if (!isOpen) return null;
  
  return (
    <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* SIDEBAR HEADER */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Chat History</h2>
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
      
      {/* NEW CHAT BUTTON
      <div className="p-4 border-b border-zinc-800">
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>
      </div> */}
      
      {/* SIDEBAR CONTENT */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Empty State */}
        <div className="text-center text-zinc-500 mt-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs text-zinc-600 mt-1">Start a new chat to begin your medical consultation</p>
        </div>

        {/* TODO: Add actual chat history here */}
        {/* Example structure for future implementation:*/}

        
        <div className="space-y-2 mt-4">
          {chatSessions.length === 0 ? (
            <p className="text-sm text-zinc-500">No previous chats found.</p>
          ) : (
            chatSessions.map((session: any) => (
              <div key={session.chatId} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors"
                onClick={() => {
                  setChatid(session.chatId);
                  onClose();
                }
                }
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white truncate">
                      {session.title || 'Untitled Chat'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {session.messages.length+" messages" || 'No messages yet...'}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500 ml-2">{new Date(session.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
          </div>
      </div>
    </div>
  );
};

export default ChatsSidebar;
