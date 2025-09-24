package com.example.niramoy.repository;


import com.example.niramoy.entity.ChatSessions;
import com.example.niramoy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSessions, Long> {

    ChatSessions findChatSessionsByChatId(Long chatId);

    List<ChatSessions> findChatSessionsByUserOrderByChatIdDesc(User user);

    ChatSessions findChatSessionsByUserAndMessages_Empty(User user);
}
