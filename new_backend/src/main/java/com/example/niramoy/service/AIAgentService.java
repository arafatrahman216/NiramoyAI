package com.example.niramoy.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * AI Agent Service that combines Google AI and SerpAPI search
 * Equivalent to LangChain's initialize_agent with DuckDuckGoSearchRun tool
 */
@Service
public class AIAgentService {

    private final GoogleAIService googleAIService;
    private final SerpApiService serpApiService;

    public AIAgentService(GoogleAIService googleAIService, SerpApiService serpApiService) {
        this.googleAIService = googleAIService;
        this.serpApiService = serpApiService;
    }

    /**
     * Process a query using AI and search tools
     * Equivalent to agent.run() in Python LangChain
     */
    public String processQuery(String query) {
        try {
            // First, try to answer with AI
            String aiResponse = googleAIService.generateContent(
                "You are a helpful AI assistant. If you need more current information to answer accurately, say 'SEARCH_NEEDED: [search query]'. Otherwise, provide a complete answer.",
                query
            );

            // Check if AI requested a search
            if (aiResponse.contains("SEARCH_NEEDED:")) {
                String searchQuery = extractSearchQuery(aiResponse);
                String searchResults = serpApiService.searchAndSummarize(searchQuery);
                
                // Generate final answer with search results
                return googleAIService.generateContent(
                    "Based on the following search results, provide a comprehensive answer to the user's question.\n\nSearch Results:\n" + searchResults,
                    "Original Question: " + query
                );
            }

            return aiResponse;
        } catch (Exception e) {
            return "Sorry, I encountered an error processing your query: " + e.getMessage();
        }
    }

    /**
     * Search for information and get AI-generated summary
     */
    public String searchAndAnalyze(String query) {
        try {
            String searchResults = serpApiService.searchAndSummarize(query);
            return googleAIService.generateContent(
                "Analyze and summarize the following search results. Provide key insights and relevant information.",
                "Search Query: " + query + "\n\nSearch Results:\n" + searchResults
            );
        } catch (Exception e) {
            return "Error during search and analysis: " + e.getMessage();
        }
    }

    /**
     * Generate content using only AI (no search)
     */
    public String generateAIResponse(String prompt) {
        return googleAIService.generateContent(prompt);
    }

    /**
     * Get search results only (no AI processing)
     */
    public List<Map<String, String>> getSearchResults(String query) {
        return serpApiService.getOrganicResults(query);
    }

    /**
     * Check if all required services are configured
     */
    public boolean isFullyConfigured() {
        return googleAIService.isConfigured() && serpApiService.isConfigured();
    }

    /**
     * Get configuration status
     */
    public Map<String, Boolean> getConfigurationStatus() {
        return Map.of(
            "googleAI", googleAIService.isConfigured(),
            "serpAPI", serpApiService.isConfigured(),
            "fullyConfigured", isFullyConfigured()
        );
    }

    private String extractSearchQuery(String aiResponse) {
        try {
            String marker = "SEARCH_NEEDED:";
            int startIndex = aiResponse.indexOf(marker) + marker.length();
            String searchPart = aiResponse.substring(startIndex).trim();
            
            // Extract until end of line or end of string
            int endIndex = searchPart.indexOf('\n');
            if (endIndex != -1) {
                searchPart = searchPart.substring(0, endIndex);
            }
            
            // Remove brackets if present
            return searchPart.replaceAll("[\\[\\]]", "").trim();
        } catch (Exception e) {
            return "general information about the topic";
        }
    }


    private String getAiResponse(String userMessage, String mode) {
        if(mode.trim().isEmpty()){
            throw new IllegalArgumentException("Mode cannot be empty");
        }

        try {
            switch (mode.toLowerCase()) {
                case "explain":
                    return generateAIResponse(userMessage);
                default:
                    return "Invalid mode. Please choose 'explain', 'plan', or 'consult'.";
                    
            }
        } catch (Exception e) {
            return "Error occurred while getting AI response: " + e.getMessage();
        }
    }
}
