package com.example.niramoy.service.AIServices;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface AIService {
    String generateContent(String prompt);
    String generateContent(String systemPrompt, String userPrompt);
    boolean isConfigured();
    public String analyzeImageWithPrompt(MultipartFile imageFile, String prompt);
    public String analyzeImageFromUrl(String imageUrl, String prompt);
} 