package com.example.niramoy.service.AIServices;

import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;
import dev.langchain4j.data.message.*;
import dev.langchain4j.data.image.Image;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.ArrayList;

import com.example.niramoy.service.ImageService;


@Service
@Profile("googleai")
public class GoogleAIService implements AIService {
    @Value("${google.api.key}")
    private String googleApiKey;
    private final ChatLanguageModel chatModel;
    private final ImageService imageService;

    public GoogleAIService(ChatLanguageModel chatModel, ImageService imageService) {
        this.chatModel = chatModel;
        this.imageService = imageService;
    }

    @Override
    public String generateContent(String prompt) {
        try {
            return chatModel.generate(prompt);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate content with Google AI", e);
        }
    }

    @Override
    public String generateContent(String systemPrompt, String userPrompt) {
        return generateContent(systemPrompt + "\n\nUser: " + userPrompt);
    }

    @Override
    public boolean isConfigured() {
        return googleApiKey != null && !googleApiKey.trim().isEmpty() && chatModel != null;
    }



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