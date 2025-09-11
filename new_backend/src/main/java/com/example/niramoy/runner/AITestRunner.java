package com.example.niramoy.runner;

import com.example.niramoy.service.AIAgentService;
import com.example.niramoy.service.GoogleAIService;
import com.example.niramoy.service.SerpApiService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2) // Run after Neo4j test
public class AITestRunner implements CommandLineRunner {

    private final AIAgentService aiAgentService;
    private final GoogleAIService googleAIService;
    private final SerpApiService serpApiService;

    public AITestRunner(AIAgentService aiAgentService, 
                       GoogleAIService googleAIService, 
                       SerpApiService serpApiService) {
        this.aiAgentService = aiAgentService;
        this.googleAIService = googleAIService;
        this.serpApiService = serpApiService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== AI Services Test ===");
        
        try {
            // Check configuration
            var configStatus = aiAgentService.getConfigurationStatus();
            System.out.println("Configuration Status:");
            System.out.println("- Google AI: " + (configStatus.get("googleAI") ? "✅ Configured" : "❌ Not configured"));
            System.out.println("- SerpAPI: " + (configStatus.get("serpAPI") ? "✅ Configured" : "❌ Not configured"));
            
            if (!aiAgentService.isFullyConfigured()) {
                System.out.println("❌ AI services not fully configured. Check your API keys.");
                return;
            }
            
            // Test 1: Simple AI generation (equivalent to llm.invoke())
            System.out.println("\n--- Test 1: Simple AI Generation ---");
            String simplePrompt = "What is machine learning in simple terms?";
            String aiResponse = googleAIService.generateContent(simplePrompt);
            System.out.println("Prompt: " + simplePrompt);
            System.out.println("Response: " + aiResponse);
            
            // Test 2: Search functionality (equivalent to GoogleSearch)
            // System.out.println("\n--- Test 2: Search Results ---");
            // String searchQuery = "latest developments in artificial intelligence 2024";
            // var searchResults = serpApiService.getOrganicResults(searchQuery);
            // System.out.println("Search Query: " + searchQuery);
            // System.out.println("Results found: " + searchResults.size());
            // if (!searchResults.isEmpty()) {
            //     System.out.println("First result: " + searchResults.get(0).get("title"));
            // }
            
            // Test 3: AI Agent with search capability (equivalent to initialize_agent)
            System.out.println("\n--- Test 3: AI Agent with Search ---");
            String agentQuery = "What are the latest trends in healthcare technology?";
            String agentResponse = aiAgentService.processQuery(agentQuery);
            System.out.println("Agent Query: " + agentQuery);
            System.out.println("Agent Response: " + agentResponse.substring(0, Math.min(200, agentResponse.length())) + "...");
            
            System.out.println("\n✅ All AI services are working correctly!");
            
        } catch (Exception e) {
            System.out.println("❌ AI services test failed: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=== End AI Services Test ===");
    }
}
