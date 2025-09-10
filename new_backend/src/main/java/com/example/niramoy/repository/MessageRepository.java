package com.example.niramoy.repository;

import com.example.niramoy.entity.ChatSessions;
import com.example.niramoy.entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MessageRepository extends JpaRepository<Messages, Long> {

    List<Messages> findMessagesByChatSession_ChatId(Long chatId);

}
