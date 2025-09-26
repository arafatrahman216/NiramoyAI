package com.example.niramoy.service;
import com.example.niramoy.entity.User;


import com.example.niramoy.dto.ChatSessionDTO;
import com.example.niramoy.dto.MessageDTO;
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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import org.json.JSONObject;


@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final AgentSelector agentSelector;
    private final ImageService imageService;


    public List<Messages> getMessagesByChatId(Long chatId) {
        ChatSessions chatSessions = chatSessionRepository.findChatSessionsByChatId(chatId);
        return chatSessions.getMessages().stream().sorted(Comparator.comparing(Messages::getMessageId)).toList();
    }

    public boolean addMessageToChat(Long chatId, String message ) {
        try {
            ChatSessions chatSession = chatSessionRepository.findChatSessionsByChatId(chatId);
            Messages newMessage = Messages.builder().content(message).isAgent(false).isPlan(false).chatSession(chatSession).build();
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
            Messages newMessage = Messages.builder().content(message).isAgent(isAgent).isPlan(false).chatSession(chatSession).build();
            messageRepository.save(newMessage);
            return true;
        }
        catch (Exception e){
            return false;
        }
    }

    // @Cacheable(value = "chatSessions", key = "#user.id")
    public List<ChatSessionDTO> getChatSessionDtoByUser(User user)     {
        List<ChatSessions> chatSessionsList = chatSessionRepository.findChatSessionsByUserOrderByChatIdDesc(user);
        List<ChatSessionDTO> chatSessionDTOs =new ArrayList<>();
        for (ChatSessions cs: chatSessionsList){
            chatSessionDTOs.add(new ChatSessionDTO(cs));
        }
        return chatSessionDTOs;
    }

    // @CacheEvict(value = "chatSessions", key = "#user.id")
    public ChatSessionDTO createNewChatSession(User user) {

        ChatSessions emptyChatSession = chatSessionRepository.findChatSessionsByUserAndMessages_Empty(user);
        if (emptyChatSession != null) {
            return new ChatSessionDTO(emptyChatSession);
        }
        try {
            ChatSessions newChatSession = ChatSessions.builder()
                    .user(user)
                    .createdAt(java.time.LocalDateTime.now())
                    .title("New Chat").messages(new ArrayList<>())
                    .build();
            
            ChatSessions savedSession = chatSessionRepository.save(newChatSession);
            return new ChatSessionDTO(savedSession);
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
                    .isPlan(false)
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

            JSONObject parsedAiReplyJson = JsonParser.parseResponseJson(aiReply, mode);
            System.out.println("Parsed AI Reply JSON: " + parsedAiReplyJson.toString());

            Messages aiMessage;
            // Check if this is planner mode AND LLM explicitly set is_plan to true
            Boolean isPlanMessage = "plan".equals(mode) && 
                                   parsedAiReplyJson.has("is_plan") && 
                                   parsedAiReplyJson.getBoolean("is_plan");

            String parsedAiReply;
            if(isPlanMessage){
                // For plan messages, store the entire JSON so frontend can parse it
                // log.info("Plan Message detected");
                parsedAiReply = parsedAiReplyJson.toString();
            } else {
                // For non-plan messages, extract just the explanation
                parsedAiReply = parsedAiReplyJson.optString("Explanation", "No explanation available.");
            }
            
            aiMessage = Messages.builder()
                    .content(parsedAiReply)
                    .isAgent(true)
                    .isPlan(isPlanMessage)
                    .chatSession(chatSession)
                    .build();


            // 3. Save AI reply to database
            Messages savedAiMessage = messageRepository.save(aiMessage);

            return savedAiMessage;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process message: " + e.getMessage());
        }

    }


    public Messages sendMessageAndGetReplyWithAttachment(Long chatId, String message, MultipartFile file, String mode, Long userId) {
        try {
            // 1. Save user message to database
            String imageUrl = null;
            if (file != null && !file.isEmpty()) {
                imageUrl = imageService.uploadImage(file);
            }


            ChatSessions chatSession = chatSessionRepository.findChatSessionsByChatId(chatId);
            Messages userMessage = Messages.builder()
                    .content(message)
                    .isAgent(false)
                    .isPlan(false).attachmentLink(imageUrl)
                    .chatSession(chatSession)
                    .build();
            messageRepository.save(userMessage);

            // 2. Process message and generate AI reply
            String aiReply;
            Agent agentWithMode = agentSelector.selectAgent(mode);
            log.info("Message : " + message);

            try {
                if (file != null && !file.isEmpty()) {
                    // Handle image file
                    log.info("Uploaded image URL: " + imageUrl);
                    aiReply = agentWithMode.processImageQuery(message, imageUrl, userId);
                } else {
                    aiReply = agentWithMode.processQuery(message, userId);
                }
            } catch (Exception e) {
                throw new AgentProcessingException("AI Service is currently unavailable. Please try again later.", e);
            }

            JSONObject parsedAiReplyJson = JsonParser.parseResponseJson(aiReply, mode);
            System.out.println("Parsed AI Reply JSON: " + parsedAiReplyJson.toString());

            Messages aiMessage;
            // Check if this is planner mode AND LLM explicitly set is_plan to true
            Boolean isPlanMessage = "plan".equals(mode) &&
                    parsedAiReplyJson.has("is_plan") &&
                    parsedAiReplyJson.getBoolean("is_plan");

            String parsedAiReply;
            if (isPlanMessage) {
                // For plan messages, store the entire JSON so frontend can parse it
                // log.info("Plan Message detected");
                parsedAiReply = parsedAiReplyJson.toString();
            } else {
                // For non-plan messages, extract just the explanation
                parsedAiReply = parsedAiReplyJson.optString("Explanation", "No explanation available.");
            }

            aiMessage = Messages.builder()
                    .content(parsedAiReply)
                    .isAgent(true)
                    .isPlan(isPlanMessage)
                    .chatSession(chatSession).attachmentLink(imageUrl)
                    .build();
            messageRepository.save(aiMessage);
            return aiMessage;
        } catch (Exception e) {
            throw new RuntimeException("Failed to process message: " + e.getMessage());
        }
    }


    public List<Map<String,Object>> convertToMessageMap(List<Messages> messages) {
        List<Map<String,Object>> messageMaps = new ArrayList<>();
        for (Messages msg : messages) {
            Map<String,Object> map = new HashMap<>();
            map.put("messageId", msg.getMessageId());
            map.put("content", msg.getContent());
            map.put("isAgent", msg.isAgent());
            map.put("isPlan", msg.getIsPlan());
            map.put("attachmentLink", msg.getAttachmentLink());
            messageMaps.add(map);
        }
        return messageMaps;
    }

}
