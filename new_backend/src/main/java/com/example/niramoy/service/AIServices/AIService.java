package com.example.niramoy.service.AIServices;

import org.springframework.stereotype.Service;

@Service
public interface AIService {
    String generateContent(String prompt);
    String generateContent(String systemPrompt, String userPrompt);
    boolean isConfigured();
    String getTextFromImageUrl(String imageUrl);
}