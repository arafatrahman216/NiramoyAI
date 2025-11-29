package com.example.niramoy.dto;


import com.example.niramoy.entity.ChatSessions;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatSessionDTO {

    private Long chatId ;
    private String title;
    private String createdAt ;
    private int messageCount;

    public ChatSessionDTO(ChatSessions chatSessions) {
        this.chatId = chatSessions.getChatId();
        this.title = chatSessions.getTitle();
        this.createdAt = chatSessions.getCreatedAt().toString();
        this.messageCount = chatSessions.getMessages().size();
    }
}
