package com.example.niramoy.service.AIServices;

public interface AIService {
    String generateContent(String prompt);
    String generateContent(String systemPrompt, String userPrompt);
    boolean isConfigured();
    String getTextFromImageUrl(String imageUrl);
}