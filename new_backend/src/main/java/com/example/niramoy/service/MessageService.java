package com.example.niramoy.service;


import com.example.niramoy.entity.ChatSessions;
import com.example.niramoy.entity.Messages;
import com.example.niramoy.repository.ChatSessionRepository;
import com.example.niramoy.repository.MessageRepository;
import com.example.niramoy.service.agent.Agent;
import com.example.niramoy.service.agent.AgentSelector; 
import com.example.niramoy.utils.JsonParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.example.niramoy.customExceptions.AgentProcessingException;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final AgentSelector agentSelector;




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

    public Messages sendMessageAndGetReply(Long chatId, String message, String mode, Long userId) {
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
            String aiReply;
            Agent agentWithMode = agentSelector.selectAgent(mode);
            log.info("Message : " + message);
            
            try{
                aiReply = agentWithMode.processQuery(message, userId);
            } catch (Exception e){
                throw new AgentProcessingException("AI Service is currently unavailable. Please try again later.", e);
            }

            String parsedAiReply = JsonParser.parseResponse(aiReply, mode);

            // 3. Save AI reply to database
            Messages aiMessage = Messages.builder()
                    .content(parsedAiReply)
                    .isAgent(true)
                    .chatSession(chatSession)
                    .build();
            Messages savedAiMessage = messageRepository.save(aiMessage);

            return savedAiMessage;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process message: " + e.getMessage());
        }
    }













}
