package com.example.niramoy.service.AIServices;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface AIService {
    String generateContent(String prompt);
    String generateContent(String systemPrompt, String userPrompt);
    boolean isConfigured();
    String getTextFromImageUrl(String imageUrl);
}