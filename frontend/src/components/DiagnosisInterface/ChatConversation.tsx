import React, { useState, useEffect, useRef } from 'react';
import { chatbotAPI } from '../../services/api';
import CarePlanTimeline from './CarePlanTimeline';

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
  isPlan?: boolean;
}

interface ChatConversationProps {
  chatId: string;
  onBack: () => void;
  chatData?: any;
  embedded?: boolean;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ chatId, onBack, chatData, embedded = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for chat updates from search input
  useEffect(() => {
    const handleChatUpdate = () => {
      // Refetch messages when chat is updated
      fetchMessages();
    };

    window.addEventListener('chatRefresh', handleChatUpdate);
    return () => window.removeEventListener('chatRefresh', handleChatUpdate);
  }, [chatId]);

  // Fetch messages function
  const fetchMessages = async () => {
    if (!chatId) return;
    
    setLoading(true);
    
    // If we have chatData with messages, use it directly
    if (chatData && chatData.messages) {
      console.log('Using chatData messages:', chatData.messages);
      const formattedMessages: Message[] = chatData.messages.map((msg: any) => ({
        messageId: msg.messageId,
        content: msg.content,
        agent: msg.isAgent || msg.agent || false,
        timestamp: msg.timestamp,
        isPlan: msg.isPlan || false
      }));
      setMessages(formattedMessages);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    try {
      console.log('Fetching messages for chat ID:', chatId);
      
      const response = await fetch('/api/user/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ chatId: chatId.toString() })
      });
      
      const conversationData = await response.json();
      
      console.log('Full API Response:', response);
      console.log('Conversation Data:', conversationData);
      console.log('Messages from API:', conversationData.data);
      
      // The messages are in conversationData.data with the correct format
      const formattedMessages: Message[] = (conversationData.data || []).map((msg: any) => ({
        messageId: msg.messageId,
        content: msg.content,
        agent: msg.isAgent || msg.agent || false,
        timestamp: msg.timestamp,
        isPlan: msg.isPlan || false
      }));
      
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

  // Fetch conversation messages
  useEffect(() => {
    fetchMessages();
  }, [chatId, chatData]);

  // Update messages immediately when chatData changes (from parent component)
  useEffect(() => {
    if (chatData && chatData.messages) {
      console.log('ChatData updated from parent:', chatData.messages);
      const formattedMessages: Message[] = chatData.messages.map((msg: any) => ({
        messageId: msg.messageId,
        content: msg.content,
        agent: msg.isAgent || msg.agent || false,
        timestamp: msg.timestamp,
        isPlan: msg.isPlan || false
      }));
      setMessages(formattedMessages);
      // Scroll to bottom when new data comes from parent
      setTimeout(scrollToBottom, 100);
    }
  }, [chatData]);

  // Listen for chat refresh events
  useEffect(() => {
    const handleChatRefresh = () => {
      fetchMessages();
    };

    window.addEventListener('chatRefresh', handleChatRefresh);
    return () => {
      window.removeEventListener('chatRefresh', handleChatRefresh);
    };
  }, []);

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

  // Handle copy functionality with visual feedback
  const handleCopyMessage = async (messageId: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      console.log('Message copied to clipboard');
      
      // Reset the tick back to copy icon after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  // Parse care plan data from JSON content
  const parseCarePlanData = (content: string) => {
    console.log('Parsing content for care plan data:', content);
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      console.log('Parsed JSON:', parsed);
      if (parsed.Plan && (parsed.Plan.PreTreatment_Phase || parsed.Plan.Treatment_Phase || parsed.Plan.PostTreatment_Phase)) {
        console.log('Found valid care plan data');
        return parsed;
      }
    } catch (error) {
      console.log('JSON parsing failed, trying regex match');
      // If JSON parsing fails, look for JSON-like structure in the content
      const jsonMatch = content.match(/\{[\s\S]*"Plan"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extracted = JSON.parse(jsonMatch[0]);
          console.log('Extracted JSON from regex:', extracted);
          if (extracted.Plan && (extracted.Plan.PreTreatment_Phase || extracted.Plan.Treatment_Phase || extracted.Plan.PostTreatment_Phase)) {
            console.log('Found valid care plan data from regex');
            return extracted;
          }
        } catch (nestedError) {
          console.log('Nested parsing failed');
        }
      }
    }
    console.log('No care plan data found, using fallback');
    // Return null - the CarePlanTimeline component will handle fallback data
    return null;
  };

  if (embedded) {
    // Embedded mode - ChatGPT style with full-width messages
    return (
      <div className="w-full">
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
              className="w-full py-6"
            >
              <div className="max-w-3xl mx-auto px-6">
                <div className={`flex ${!message.agent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${!message.agent ? 'max-w-2xl' : 'flex-1'}`}>
                    {!message.agent ? (
                      /* USER MESSAGE - Wrapped in leaner, rounder box */
                      <div className="bg-zinc-800 rounded-3xl px-3 py-2 inline-block">
                        <p className="text-base text-zinc-100 leading-7 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    ) : (
                      /* AI MESSAGE - Check for care plan data or render plain text */
                      <div className="flex-1">
                        {(() => {
                          // Check if this is a plan message from backend
                          if (message.isPlan) {
                            const carePlanData = parseCarePlanData(message.content);
                            return (
                              <div className="w-full">
                                <CarePlanTimeline careData={carePlanData} />
                              </div>
                            );
                          } else {
                            // Render regular text message
                            return (
                              <>
                              <p className="text-base text-zinc-100 leading-7 whitespace-pre-wrap mb-3">
                                {message.content}
                              </p>
                              
                              {/* ACTION BUTTONS FOR AI RESPONSES */}
                              <div className="flex items-center space-x-2 mt-2">
                                {/* Copy functionality with visual feedback */}
                                <button
                                onClick={() => handleCopyMessage(message.messageId, message.content)}
                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
                                title={copiedMessageId === message.messageId ? "Copied!" : "Copy response"}
                                >
                                {copiedMessageId === message.messageId ? (
                                  /* Checkmark icon when copied */
                                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  /* Copy icon default state */
                                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                    )}
                                  </button>

                                  {/* TODO: Read aloud functionality - implement text-to-speech */}
                                  <button
                                    onClick={() => {
                                      // TODO: Implement text-to-speech functionality
                                      // Use Web Speech API or external TTS service
                                      console.log('Read aloud functionality - TODO');
                                    }}
                                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
                                    title="Read aloud"
                                  >
                                    <svg className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 17h4l6 6V1L9 7H5v10z" />
                                    </svg>
                                  </button>
                                </div>
                              </>
                            );
                          }
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  }

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
          messages.map((message) => {
            // Check if this is a plan message from backend
            if (message.agent && message.isPlan) {
              // Parse the JSON content for care plan data
              const carePlanData = parseCarePlanData(message.content);
              
              // Render care plan timeline in full width
              return (
                <div key={message.messageId} className="w-full">
                  <CarePlanTimeline careData={carePlanData} />
                </div>
              );
            } else {
              // Render regular chat bubble
              return (
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
              );
            }
          })
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
