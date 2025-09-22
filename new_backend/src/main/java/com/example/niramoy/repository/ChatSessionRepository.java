package com.example.niramoy.repository;


import com.example.niramoy.entity.ChatSessions;
import com.example.niramoy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSessions, Long> {

    ChatSessions findChatSessionsByChatId(Long chatId);

    ChatSessions findChatSessionsByUser(User user);

    ChatSessions findChatSessionsByUserAndMessages_Empty(User user);
}
