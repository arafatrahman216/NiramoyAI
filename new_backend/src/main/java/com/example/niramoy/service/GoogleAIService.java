//package com.example.niramoy.service;
//
//import dev.langchain4j.model.chat.ChatLanguageModel;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import dev.langchain4j.data.message.*;
//import dev.langchain4j.data.image.Image;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.io.InputStream;
//import java.net.URI;
//import java.net.URLConnection;
//import java.util.Base64;
//import java.util.List;
//import java.util.ArrayList;
//
///**
// * Service for interacting with Google Generative AI (Gemini) using LangChain4j
// * Equivalent to ChatGoogleGenerativeAI in Python LangChain
// */
//@Service
//public class GoogleAIService {
//
//    @Value("${google.api.key}")
//    private String googleApiKey;
//
//    private final ChatLanguageModel chatModel;
//    @Autowired
//    private ImageService imageService;
//
//    public GoogleAIService(ChatLanguageModel chatModel) {
//        this.chatModel = chatModel;
//    }
//
//    /**
//     * Generate content using Gemini model via LangChain4j
//     * Equivalent to ChatGoogleGenerativeAI.invoke() in Python
//     */
//    public String generateContent(String prompt) {
//        try {
//            return chatModel.generate(prompt);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to generate content with Google AI", e);
//        }
//    }
//
//    /**
//     * Generate content with custom system and user prompts
//     */
//    public String generateContent(String systemPrompt, String userPrompt) {
//        return generateContent(systemPrompt + "\n\nUser: " + userPrompt);
//    }
//
//    /**
//     * Check if the service is properly configured
//     */
//    public boolean isConfigured() {
//        return googleApiKey != null && !googleApiKey.trim().isEmpty() && chatModel != null;
//    }
//
//
//
//}
