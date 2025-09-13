package com.example.niramoy.service.AIServices;

import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;



@Service
@Profile("googleai")
public class GoogleAIService {
    @Value("${google.api.key}")
    private String googleApiKey;

    private final ChatLanguageModel chatModel;

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
}
