package com.example.niramoy.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Service for interacting with Google Generative AI (Gemini)
 * Equivalent to ChatGoogleGenerativeAI in Python LangChain
 */
@Service
public class GoogleAIService {

    @Value("${google.api.key}")
    private String googleApiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    private static final String GOOGLE_AI_BASE_URL = "https://generativelanguage.googleapis.com";

    public GoogleAIService() {
        this.webClient = WebClient.builder()
                .baseUrl(GOOGLE_AI_BASE_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Generate content using Gemini model
     * Equivalent to ChatGoogleGenerativeAI.invoke() in Python
     */
    public String generateContent(String prompt) {
        try {
            String requestBody = buildRequestBody(prompt);
            
            String response = webClient.post()
                    .uri("/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" + googleApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractContentFromResponse(response);
        } catch (Exception e) {
            throw new RuntimeException("Error calling Google AI API: " + e.getMessage(), e);
        }
    }

    /**
     * Generate content with system prompt and user message
     */
    public String generateContent(String systemPrompt, String userMessage) {
        String combinedPrompt = systemPrompt + "\n\nUser: " + userMessage;
        return generateContent(combinedPrompt);
    }

    private String buildRequestBody(String prompt) {
        try {
            Map<String, Object> request = Map.of(
                "contents", new Object[]{
                    Map.of(
                        "parts", new Object[]{
                            Map.of("text", prompt)
                        }
                    )
                },
                "generationConfig", Map.of(
                    "temperature", 0.7,
                    "topK", 40,
                    "topP", 0.95,
                    "maxOutputTokens", 1024
                )
            );
            
            return objectMapper.writeValueAsString(request);
        } catch (Exception e) {
            throw new RuntimeException("Error building request body: " + e.getMessage(), e);
        }
    }

    private String extractContentFromResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode candidates = jsonNode.get("candidates");
            
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).get("content");
                if (content != null) {
                    JsonNode parts = content.get("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        JsonNode text = parts.get(0).get("text");
                        if (text != null) {
                            return text.asText();
                        }
                    }
                }
            }
            
            return "No content generated";
        } catch (Exception e) {
            throw new RuntimeException("Error parsing response: " + e.getMessage(), e);
        }
    }

    /**
     * Check if the service is properly configured
     */
    public boolean isConfigured() {
        return googleApiKey != null && !googleApiKey.isEmpty();
    }
}
