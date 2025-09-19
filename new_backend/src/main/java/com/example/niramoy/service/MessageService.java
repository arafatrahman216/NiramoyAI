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
import org.json.JSONObject;


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
}
