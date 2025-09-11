package com.example.niramoy.service;


import com.example.niramoy.entity.ChatSessions;
import com.example.niramoy.entity.Messages;
import com.example.niramoy.repository.ChatSessionRepository;
import com.example.niramoy.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatSessionRepository chatSessionRepository;



    public ChatSessions getMessagesByChatId(Long chatId) {
        ChatSessions chatSessions = chatSessionRepository.findChatSessionsByChatId(chatId);
        return chatSessions;
    }


    public boolean addMessageToChat(Long chatId, String message ) {
        try {
            ChatSessions chatSession = chatSessionRepository.findChatSessionsByChatId(chatId);
            Messages newMessage = Messages.builder().content(message).isAgent(false).chatSession(chatSession).build();
            messageRepository.save(newMessage);
            return true;
        }
        catch (Exception e){
            return false;
        }
    }


    public boolean addMessageToChat(Long chatId, String message, boolean isAgent ) {
        try {
            ChatSessions chatSession = chatSessionRepository.findChatSessionsByChatId(chatId);
            Messages newMessage = Messages.builder().content(message).isAgent(isAgent).chatSession(chatSession).build();
            messageRepository.save(newMessage);
            return true;
        }
        catch (Exception e){
            return false;
        }
    }

    public ChatSessions createNewChatSession(com.example.niramoy.entity.User user) {
        try {
            ChatSessions newChatSession = ChatSessions.builder()
                    .user(user)
                    .createdAt(java.time.LocalDateTime.now())
                    .title("New Chat")
                    .build();
            
            ChatSessions savedSession = chatSessionRepository.save(newChatSession);
            return savedSession;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create new chat session: " + e.getMessage());
        }
    }

    public Messages sendMessageAndGetReply(Long chatId, String message) {
        try {
            // 1. Save user message to database
            ChatSessions chatSession = chatSessionRepository.findChatSessionsByChatId(chatId);
            Messages userMessage = Messages.builder()
                    .content(message)
                    .isAgent(false)
                    .chatSession(chatSession)
                    .build();
            messageRepository.save(userMessage);

            // 2. Process message and generate AI reply
            String aiReply = processMessageAndGenerateReply(message, chatSession);

            // 3. Save AI reply to database
            Messages aiMessage = Messages.builder()
                    .content(aiReply)
                    .isAgent(true)
                    .chatSession(chatSession)
                    .build();
            Messages savedAiMessage = messageRepository.save(aiMessage);

            return savedAiMessage;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process message: " + e.getMessage());
        }
    }

    @Async
    public CompletableFuture<Messages> processMessageAsync(Long chatId, String message) {
        try {
            // 1. Save user message to database (synchronous)
            ChatSessions chatSession = chatSessionRepository.findChatSessionsByChatId(chatId);
            Messages userMessage = Messages.builder()
                    .content(message)
                    .isAgent(false)
                    .chatSession(chatSession)
                    .build();
            messageRepository.save(userMessage);

            // 2. Process message and generate AI reply (asynchronous)
            String aiReply = processMessageAndGenerateReply(message, chatSession);

            // 3. Save AI reply to database (asynchronous)
            Messages aiMessage = Messages.builder()
                    .content(aiReply)
                    .isAgent(true)
                    .chatSession(chatSession)
                    .build();
            Messages savedAiMessage = messageRepository.save(aiMessage);

            return CompletableFuture.completedFuture(savedAiMessage);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process message asynchronously: " + e.getMessage());
        }
    }

    // TODO: Replace this with actual AI processing logic
    // This method will be enhanced to call OpenAI/other AI services in the future
    private String processMessageAndGenerateReply(String userMessage, ChatSessions chatSession) {
        // TODO: Implement AI processing here
        // 1. Get conversation history from chatSession.getMessages()
        // 2. Format messages for AI model (system prompt + conversation history + new message)
        // 3. Call AI API (OpenAI GPT-4, Anthropic Claude, etc.)
        // 4. Process AI response and extract medical advice
        // 5. Return formatted reply with medical recommendations
        
        // Simulate AI processing delay
        try {
            Thread.sleep(1000); // Simulate AI processing time
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // TEMPLATE REPLY - Replace this with actual AI logic
        String templateReply = "Thanks for your question! I'm here to help with medical guidance. " +
                              "How can I assist you today?";
        
        return templateReply;
    }
}
