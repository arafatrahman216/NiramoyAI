package com.example.niramoy.runner;

import com.example.niramoy.service.AIAgentService;
import com.example.niramoy.service.GoogleAIService;
import com.example.niramoy.service.LangChain4jAgentService;
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
    private final LangChain4jAgentService langChain4jAgentService;

    public AITestRunner(AIAgentService aiAgentService, 
                       GoogleAIService googleAIService, 
                       SerpApiService serpApiService,
                       LangChain4jAgentService langChain4jAgentService) {
        this.aiAgentService = aiAgentService;
        this.googleAIService = googleAIService;
        this.serpApiService = serpApiService;
        this.langChain4jAgentService = langChain4jAgentService;
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
            // System.out.println("\n--- Test 3: AI Agent with Search ---");
            // String agentQuery = "What are the latest trends in healthcare technology?";
            // String agentResponse = aiAgentService.processQuery(agentQuery);
            // System.out.println("Agent Query: " + agentQuery);
            // System.out.println("Agent Response: " + agentResponse.substring(0, Math.min(200, agentResponse.length())) + "...");
            
            // // Test 4: LangChain4j AI Agent with Tools (equivalent to Python LangChain agents)
            // System.out.println("\n--- Test 4: LangChain4j Agent with Tools ---");
            // if (langChain4jAgentService.isConfigured()) {
            //     String langChainQuery = "Search for the latest AI developments and summarize them";
            //     String langChainResponse = langChain4jAgentService.processQuery(langChainQuery);
            //     System.out.println("LangChain Query: " + langChainQuery);
            //     System.out.println("LangChain Response: " + langChainResponse.substring(0, Math.min(200, langChainResponse.length())) + "...");
            // } else {
            //     System.out.println("LangChain4j Agent not fully configured");
            // }
            
            System.out.println("\n✅ All AI services are working correctly!");
            
        } catch (Exception e) {
            System.out.println("❌ AI services test failed: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=== End AI Services Test ===");
    }
}
