// package com.example.niramoy.runner;
//
//import com.example.niramoy.service.AIAgentService;
//import com.example.niramoy.service.AIServices.AIService;
//import com.example.niramoy.service.GoogleAIService;
//import com.example.niramoy.service.LangChain4jAgentService;
//import com.example.niramoy.service.SerpApiService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.core.annotation.Order;
//import org.springframework.stereotype.Component;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.*;
//import java.nio.file.Files;
//
//
// @Component
// @Order(2) // Run after Neo4j test
// public class AITestRunner implements CommandLineRunner {
//
//     private final AIAgentService aiAgentService;
//     private final AIService googleAIService;
//     private final SerpApiService serpApiService;
//     private final LangChain4jAgentService langChain4jAgentService;
//
//     public AITestRunner(AIAgentService aiAgentService,
//                         AIService googleAIService,
//                         SerpApiService serpApiService,
//                         LangChain4jAgentService langChain4jAgentService) {
//         this.aiAgentService = aiAgentService;
//         this.googleAIService = googleAIService;
//         this.serpApiService = serpApiService;
//         this.langChain4jAgentService = langChain4jAgentService;
//     }
//
//     @Override
//     public void run(String... args) throws Exception {
//         System.out.println("=== AI Services Test ===");
//
//         try {
//             // Check configuration
//             var configStatus = aiAgentService.getConfigurationStatus();
//             System.out.println("Configuration Status:");
//             System.out.println("- Google AI: " + (configStatus.get("googleAI") ? "✅ Configured" : "❌ Not configured"));
//             System.out.println("- SerpAPI: " + (configStatus.get("serpAPI") ? "✅ Configured" : "❌ Not configured"));
//
//             if (!aiAgentService.isFullyConfigured()) {
//                 System.out.println("❌ AI services not fully configured. Check your API keys.");
//                 return;
//             }
//
//             // Test 1: Image Analysis with our new functionality
//             System.out.println("\n--- Test 1: Image Analysis with Custom Prompt ---");
//             try {
//
//                 // Also test local file if it exists (fallback)
//                 String imagePath = "src/main/java/com/example/niramoy/runner/test.png";
//                 File imageFile = new File(imagePath);
//                 if (imageFile.exists()) {
//                     System.out.println("\n--- Test 1d: Local File Analysis (Bonus) ---");
//                     // Create a custom MultipartFile implementation for testing
//                     byte[] imageBytes = Files.readAllBytes(imageFile.toPath());
//                     MultipartFile testImageFile = new TestMultipartFile(
//                             "test.png",
//                             "test.png",
//                             "image/png",
//                             imageBytes
//                     );
//                     String prompt = "Extract all visible text from this image. " +
//                             "Maintain the original structure and formatting as much as possible. " +
//                             "Include all text you can see, whether it's printed, handwritten, or digital. " +
//                             "If this is a medical document, pay special attention to medication names, " +
//                             "dosages, instructions, dates, and any other medical information.";
//
//                     // OKOKOK multipart file diye
//                     String localImageAnalysis = googleAIService.analyzeImageWithPrompt(testImageFile, prompt);
//                     System.out.println("Local Image Analysis: " + localImageAnalysis);
//                 } else {
//                     System.out.println("\n--- Local test.png not found, skipping local file test ---");
//                 }
//
//             } catch (Exception e) {
//                 System.out.println("❌ Image analysis test failed: " + e.getMessage());
//                 e.printStackTrace();
//
//                 // Fallback to simple text generation
//                 String aiResponse = googleAIService.generateContent("What are the benefits of AI in medical diagnosis?");
//                 System.out.println("Fallback Response: " + aiResponse);
//             }
//
////             // Test 1: Simple AI generation (equivalent to llm.invoke())
////             System.out.println("\n--- Test 1: Simple AI Generation ---");
////             String simplePrompt = "What is machine learning in simple terms?";
////             String aiResponse = googleAIService.generateContent(simplePrompt);
////             System.out.println("Prompt: " + simplePrompt);
////             System.out.println("Response: " + aiResponse);
//
////             // Test 2: Search functionality (equivalent to GoogleSearch)
////             // System.out.println("\n--- Test 2: Search Results ---");
////             // String searchQuery = "latest developments in artificial intelligence 2024";
////             // var searchResults = serpApiService.getOrganicResults(searchQuery);
////             // System.out.println("Search Query: " + searchQuery);
////             // System.out.println("Results found: " + searchResults.size());
////             // if (!searchResults.isEmpty()) {
////             //     System.out.println("First result: " + searchResults.get(0).get("title"));
////             // }
//
////             // Test 3: AI Agent with search capability (equivalent to initialize_agent)
////             // System.out.println("\n--- Test 3: AI Agent with Search ---");
////             // String agentQuery = "What are the latest trends in healthcare technology?";
////             // String agentResponse = aiAgentService.processQuery(agentQuery);
////             // System.out.println("Agent Query: " + agentQuery);
////             // System.out.println("Agent Response: " + agentResponse.substring(0, Math.min(200, agentResponse.length())) + "...");
//
////             // // Test 4: LangChain4j AI Agent with Tools (equivalent to Python LangChain agents)
////             // System.out.println("\n--- Test 4: LangChain4j Agent with Tools ---");
////             // if (langChain4jAgentService.isConfigured()) {
////             //     String langChainQuery = "Search for the latest AI developments and summarize them";
////             //     String langChainResponse = langChain4jAgentService.processQuery(langChainQuery);
////             //     System.out.println("LangChain Query: " + langChainQuery);
////             //     System.out.println("LangChain Response: " + langChainResponse.substring(0, Math.min(200, langChainResponse.length())) + "...");
////             // } else {
////             //     System.out.println("LangChain4j Agent not fully configured");
////             // }
//
////             System.out.println("\n✅ All AI services are working correctly!");
//
//         } catch (Exception e) {
//             System.out.println("❌ AI services test failed: " + e.getMessage());
//             e.printStackTrace();
//         }
//     }
//
//
//    /**
//     * Custom MultipartFile implementation for testing purposes
//     */
//    private static class TestMultipartFile implements MultipartFile {
//        private final String name;
//        private final String originalFilename;
//        private final String contentType;
//        private final byte[] content;
//
//        public TestMultipartFile(String name, String originalFilename, String contentType, byte[] content) {
//            this.name = name;
//            this.originalFilename = originalFilename;
//            this.contentType = contentType;
//            this.content = content;
//        }
//
//        @Override
//        public String getName() { return name; }
//
//        @Override
//        public String getOriginalFilename() { return originalFilename; }
//
//        @Override
//        public String getContentType() { return contentType; }
//
//        @Override
//        public boolean isEmpty() { return content.length == 0; }
//
//        @Override
//        public long getSize() { return content.length; }
//
//        @Override
//        public byte[] getBytes() { return content; }
//
//        @Override
//        public InputStream getInputStream() { return new ByteArrayInputStream(content); }
//
//        @Override
//        public void transferTo(File dest) throws IOException, IllegalStateException {
//            Files.write(dest.toPath(), content);
//        }
//    }
//}
//
