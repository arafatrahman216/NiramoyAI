package com.example.niramoy.service;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.service.AiServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * AI Agent Service using LangChain4j with proper tool integration
 * Equivalent to LangChain's initialize_agent with search tools
 */
@Service
public class LangChain4jAgentService {

    private final ChatLanguageModel chatModel;
    private final SerpApiService serpApiService;
    private final Assistant assistant;

    public LangChain4jAgentService(ChatLanguageModel chatModel, 
                                   SerpApiService serpApiService) {
        this.chatModel = chatModel;
        this.serpApiService = serpApiService;
        
        // Create AI Service with tools
        this.assistant = AiServices.builder(Assistant.class)
                .chatLanguageModel(chatModel)
                .tools(this)
                .build();
    }

    interface Assistant {
        String chat(String message);
    }

    public String processQuery(String query) {
        return assistant.chat("you have a search tool named searchWeb. Use that to answer." + query);
    }

    @Tool("Search the web for current information on any topic")
    public String searchWeb(String query) {
        try {
            List<Map<String, String>> results = serpApiService.getOrganicResults(query);
            if (results.isEmpty()) {
                return "No search results found for: " + query;
            }
            
            // Format results for the AI
            return results.stream()
                    .limit(5) // Limit to top 5 results
                    .map(result -> String.format("Title: %s\nSnippet: %s\nURL: %s", 
                            result.get("title"), 
                            result.get("snippet"), 
                            result.get("link")))
                    .collect(Collectors.joining("\n\n"));
                    
        } catch (Exception e) {
            return "Search failed: " + e.getMessage();
        }
    }

    public boolean isConfigured() {
        return chatModel != null && serpApiService.isConfigured();
    }

    /**
     * Get configuration status
     */
    public Map<String, Boolean> getConfigurationStatus() {
        return Map.of(
            "chatModel", chatModel != null,
            "serpAPI", serpApiService.isConfigured(),
            "fullyConfigured", isConfigured()
        );
    }
}
