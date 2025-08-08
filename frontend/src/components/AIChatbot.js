import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Fab,
  Slide,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Send,
  Close,
  SmartToy,
  Person,
  Minimize,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { chatbotAPI } from '../services/api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AIChatbot = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Initial welcome message
  const welcomeMessage = {
    id: 'welcome',
    text: "Hi! I'm NiramoyAI Assistant. I can help you with medical questions, find doctors, suggest treatments, and provide health information. How can I assist you today?",
    sender: 'bot',
    timestamp: new Date(),
    suggestions: [
      'Find a cardiologist near me',
      'What are symptoms of diabetes?',
      'Book an appointment',
      'Health tips for seniors',
    ]
  };

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([welcomeMessage]);
      startNewConversation();
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewConversation = async () => {
    try {
      const response = await chatbotAPI.startConversation();
      setConversationId(response.data.conversationId);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Simulate API call - replace with actual API call when backend is ready
      const response = await simulateAIResponse(messageText);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions || [],
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Simulate AI response - replace with actual API call
  const simulateAIResponse = async (message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = {
          'cardiologist': {
            message: "I can help you find a cardiologist! Based on your location, here are some highly-rated cardiologists:\n\n• Dr. Sarah Johnson at Dhaka Medical College Hospital (4.8★)\n• Dr. Ahmed Rahman at Square Hospital (4.9★)\n\nWould you like me to help you book an appointment or get more details about any of these doctors?",
            suggestions: ['Book appointment with Dr. Sarah', 'More cardiologist details', 'Find nearby hospitals']
          },
          'diabetes': {
            message: "Common symptoms of diabetes include:\n\n• Increased thirst and frequent urination\n• Unexplained weight loss\n• Fatigue and weakness\n• Blurred vision\n• Slow-healing cuts and wounds\n\nIf you're experiencing these symptoms, I recommend consulting with a doctor. Would you like me to help you find an endocrinologist?",
            suggestions: ['Find endocrinologist', 'Diabetes prevention tips', 'Blood sugar monitoring']
          },
          'appointment': {
            message: "I can help you book an appointment! To get started, I'll need to know:\n\n1. What type of doctor do you need?\n2. Your preferred location\n3. Any specific date/time preferences\n\nWhat specialty doctor are you looking for?",
            suggestions: ['Cardiologist', 'General physician', 'Specialist consultation', 'Emergency appointment']
          },
          'health tips': {
            message: "Here are some important health tips for seniors:\n\n• Stay physically active with gentle exercises\n• Maintain a balanced diet rich in nutrients\n• Stay hydrated and get adequate sleep\n• Regular health checkups and screenings\n• Stay socially active and mentally engaged\n\nWould you like specific advice on any of these areas?",
            suggestions: ['Exercise for seniors', 'Senior nutrition guide', 'Preventive screenings', 'Mental health tips']
          },
          'default': {
            message: "I understand you're asking about healthcare. Let me help you with that! I can assist with:\n\n• Finding doctors and specialists\n• Medical information and symptoms\n• Booking appointments\n• Health tips and prevention\n• Emergency guidance\n\nWhat specific health topic would you like to know about?",
            suggestions: ['Find a doctor', 'Symptom checker', 'Health information', 'Book appointment']
          }
        };

        const lowerMessage = message.toLowerCase();
        let response = responses.default;

        if (lowerMessage.includes('cardiologist') || lowerMessage.includes('heart')) {
          response = responses.cardiologist;
        } else if (lowerMessage.includes('diabetes') || lowerMessage.includes('sugar')) {
          response = responses.diabetes;
        } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
          response = responses.appointment;
        } else if (lowerMessage.includes('health tips') || lowerMessage.includes('senior')) {
          response = responses['health tips'];
        }

        resolve(response);
      }, 1500);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth={isFullscreen ? false : 'sm'}
      fullWidth
      fullScreen={isFullscreen || isMobile}
      PaperProps={{
        sx: {
          height: isFullscreen ? '100vh' : isMinimized ? '60px' : '70vh',
          maxHeight: isFullscreen ? 'none' : '70vh',
          borderRadius: isFullscreen ? 0 : 3,
          overflow: 'hidden',
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 32, height: 32 }}>
            <SmartToy fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6">NiramoyAI Assistant</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Online • Ready to help
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton onClick={toggleMinimize} sx={{ color: 'white', mr: 1 }}>
            <Minimize />
          </IconButton>
          <IconButton onClick={toggleFullscreen} sx={{ color: 'white', mr: 1 }}>
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {!isMinimized && (
        <>
          {/* Messages */}
          <DialogContent
            sx={{
              p: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                bgcolor: 'grey.50',
              }}
            >
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          maxWidth: '80%',
                          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.300',
                          }}
                        >
                          {message.sender === 'user' ? <Person /> : <SmartToy />}
                        </Avatar>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                            color: message.sender === 'user' ? 'white' : 'text.primary',
                            borderRadius: 2,
                            maxWidth: '100%',
                          }}
                        >
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                            {message.text}
                          </Typography>
                          {message.suggestions && message.suggestions.length > 0 && (
                            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {message.suggestions.map((suggestion, index) => (
                                <Chip
                                  key={index}
                                  label={suggestion}
                                  size="small"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' },
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </Paper>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}>
                      <SmartToy />
                    </Avatar>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Thinking...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>
          </DialogContent>

          {/* Input */}
          <DialogActions sx={{ p: 2, bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Ask me about health, doctors, symptoms, or book appointments..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || loading}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&:disabled': { bgcolor: 'grey.300' },
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

// Floating Chatbot Button
export const ChatbotButton = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1000,
          }}
        >
          <Fab
            color="primary"
            size="large"
            onClick={onClick}
            sx={{
              boxShadow: 6,
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: 8,
              },
              transition: 'all 0.3s ease',
            }}
          >
            <SmartToy />
          </Fab>
          
          {/* Tooltip */}
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              mb: 1,
              p: 1,
              borderRadius: 2,
              bgcolor: 'common.black',
              color: 'white',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              opacity: 0.9,
            }}
          >
            Ask NiramoyAI Assistant
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatbot;
