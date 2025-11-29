package com.example.niramoy.service.agent;

import org.springframework.stereotype.Service;

@Service
public interface Agent {
    String processQuery(String query, Long userId);
    String processImageQuery(String query, String imageUrl, Long userId);
}