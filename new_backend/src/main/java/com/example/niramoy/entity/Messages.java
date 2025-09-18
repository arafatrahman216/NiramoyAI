package com.example.niramoy.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Messages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "chat_id", nullable = false)
    private ChatSessions chatSession;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_agent", nullable = false)
    private boolean isAgent;

    @Column(name = "is_plan", nullable = true)
    private boolean isPlan;    
}
