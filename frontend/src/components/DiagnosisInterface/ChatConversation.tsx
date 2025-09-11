import React, { useState, useEffect, useRef } from 'react';
import { chatbotAPI } from '../../services/api';

// ==============================================
// CHAT CONVERSATION COMPONENT
// ==============================================
// Displays the full conversation for a selected chat
// Handles message loading, display, and new message sending

interface Message {
  messageId: number;
  content: string;
  agent: boolean;
  timestamp?: string;
}

interface ChatConversationProps {
  chatId: string;
  onBack: () => void;
  chatData?: any;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ chatId, onBack, chatData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversation messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      
      setLoading(true);
      
      // If we have chatData with messages, use it directly
      if (chatData && chatData.messages) {
        console.log('Using chatData messages:', chatData.messages);
        setMessages(chatData.messages);
        setLoading(false);
        return;
      }
      
      // Otherwise, fetch from API
      try {
        const response = await chatbotAPI.getConversation(chatId);
        const conversationData = response.data;
        
        console.log('Full API Response:', response);
        console.log('Conversation Data:', conversationData);
        console.log('Messages from API:', conversationData.messages);
        
        // The messages are directly in the response with the correct format
        const formattedMessages: Message[] = conversationData.messages || [];
        console.log('Formatted Messages:', formattedMessages);
        setMessages(formattedMessages);
        
        console.log('Final messages state:', formattedMessages);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        console.error('Full error object:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, chatData]);

  // Send new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const userMessage: Message = {
      messageId: Date.now(),
      content: newMessage.trim(),
      agent: false
    };

    // Add user message immediately to UI
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const response = await chatbotAPI.sendMessage(messageToSend, chatId as any);
      const botResponse = response.data;

      // Add bot response to messages
      const botMessage: Message = {
        messageId: Date.now() + 1,
        content: botResponse.message || botResponse.response || 'No response received',
        agent: true
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        messageId: Date.now() + 1,
        content: 'Sorry, there was an error sending your message. Please try again.',
        agent: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">
      {/* CHAT HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Back to search"
          >
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">Chat Conversation</h2>
            <p className="text-sm text-zinc-400">Chat ID: {chatId}</p>
          </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin w-8 h-8 border-2 border-zinc-600 border-t-emerald-500 rounded-full"></div>
            <span className="ml-3 text-zinc-400">Loading conversation...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-zinc-500 mt-8">
            <svg className="w-12 h-12 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs text-zinc-600 mt-1">Start the conversation by sending a message</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.messageId}
              className={`flex ${!message.agent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  !message.agent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-800 text-zinc-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Now'}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* MESSAGE INPUT */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            {sending ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;
