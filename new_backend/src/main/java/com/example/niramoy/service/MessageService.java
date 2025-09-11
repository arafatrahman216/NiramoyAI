package com.example.niramoy.service;


import com.example.niramoy.entity.ChatSessions;
import com.example.niramoy.entity.Messages;
import com.example.niramoy.repository.ChatSessionRepository;
import com.example.niramoy.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

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
}
