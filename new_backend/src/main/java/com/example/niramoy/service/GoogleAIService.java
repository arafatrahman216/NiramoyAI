package com.example.niramoy.service;

import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import dev.langchain4j.data.message.*;
import dev.langchain4j.data.image.Image;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URLConnection;
import java.util.Base64;
import java.util.List;
import java.util.ArrayList;

/**
 * Service for interacting with Google Generative AI (Gemini) using LangChain4j
 * Equivalent to ChatGoogleGenerativeAI in Python LangChain
 */
@Service
public class GoogleAIService {

    @Value("${google.api.key}")
    private String googleApiKey;

    private final ChatLanguageModel chatModel;
    @Autowired
    private ImageService imageService;

    public GoogleAIService(ChatLanguageModel chatModel) {
        this.chatModel = chatModel;
    }

    /**
     * Generate content using Gemini model via LangChain4j
     * Equivalent to ChatGoogleGenerativeAI.invoke() in Python
     */
    public String generateContent(String prompt) {
        try {
            return chatModel.generate(prompt);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate content with Google AI", e);
        }
    }

    /**
     * Generate content with custom system and user prompts
     */
    public String generateContent(String systemPrompt, String userPrompt) {
        return generateContent(systemPrompt + "\n\nUser: " + userPrompt);
    }

    /**
     * Check if the service is properly configured
     */
    public boolean isConfigured() {
        return googleApiKey != null && !googleApiKey.trim().isEmpty() && chatModel != null;
    }

    /**
     * Analyze image with text prompt using Gemini Vision
     * Supports medical image analysis, prescription reading, test report interpretation
     */
    public String analyzeImageWithPrompt(MultipartFile imageFile, String prompt) {
        try {
            // Validate inputs
            Image image = imageService.buildImageFromMultipartFile(imageFile,prompt);

            // Create multimodal message with image and text
            List<ChatMessage> messages = new ArrayList<>();
            // Add system message for medical context
            messages.add(SystemMessage.from(
                "You are an expert medical AI assistant. Analyze medical images including " +
                "prescriptions, test reports, X-rays, lab results, and other medical documents. " +
                "Provide accurate, detailed, and helpful information. If you're unsure about " +
                "any medical interpretation, clearly state your limitations."
            ));

            // Add user message with image and prompt
            UserMessage userMessage = UserMessage.from(
                TextContent.from(prompt),
                ImageContent.from(image)
            );
            messages.add(userMessage);

            // Generate response using chat model
            AiMessage response = chatModel.generate(messages).content();
            return response.text();

        } catch (Exception e) {
            throw new RuntimeException("Failed to read image file", e);
        }
    }
    public String analyzeImageFromUrl(String imageUrl, String prompt) {
        try {
            Image image = imageService.buildImageFromUrl(imageUrl,prompt);
            // Create multimodal message with image and text
            List<ChatMessage> messages = new ArrayList<>();
            
            // Add system message for medical context
            messages.add(SystemMessage.from(
                "You are an expert medical AI assistant. Analyze medical images including " +
                "prescriptions, test reports, X-rays, lab results, and other medical documents. " +
                "Provide accurate, detailed, and helpful information. If you're unsure about " +
                "any medical interpretation, clearly state your limitations."
            ));

            // Add a user message with image and prompt
            UserMessage userMessage = UserMessage.from(
                TextContent.from(prompt),
                ImageContent.from(image)
            );
            messages.add(userMessage);

            // Generate response using chat model
            AiMessage response = chatModel.generate(messages).content();
            return response.text();

        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze image from URL: " + imageUrl, e);
        }
    }

}
