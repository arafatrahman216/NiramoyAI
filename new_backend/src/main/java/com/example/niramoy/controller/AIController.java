// package com.example.niramoy.controller;

// import com.example.niramoy.service.AIAgentService;
// import com.example.niramoy.service.GoogleAIService;
// import com.example.niramoy.service.LangChain4jAgentService;
// import com.example.niramoy.service.SerpApiService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/ai")
// public class AIController {

//     private final AIAgentService aiAgentService;
//     private final GoogleAIService googleAIService;
//     private final SerpApiService serpApiService;
//     private final LangChain4jAgentService langChain4jAgentService;

//     public AIController(AIAgentService aiAgentService, 
//                        GoogleAIService googleAIService, 
//                        SerpApiService serpApiService,
//                        LangChain4jAgentService langChain4jAgentService) {
//         this.aiAgentService = aiAgentService;
//         this.googleAIService = googleAIService;
//         this.serpApiService = serpApiService;
//         this.langChain4jAgentService = langChain4jAgentService;
//     }

//     /**
//      * Process query using AI agent (equivalent to agent.run() in Python)
//      * POST /api/ai/query
//      */
//     @PostMapping("/query")
//     public ResponseEntity<Map<String, String>> processQuery(@RequestBody Map<String, String> request) {
//         try {
//             String query = request.get("query");
//             if (query == null || query.trim().isEmpty()) {
//                 return ResponseEntity.badRequest()
//                     .body(Map.of("error", "Query parameter is required"));
//             }

//             String response = aiAgentService.processQuery(query);
//             return ResponseEntity.ok(Map.of(
//                 "query", query,
//                 "response", response,
//                 "type", "ai_agent"
//             ));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError()
//                 .body(Map.of("error", "Error processing query: " + e.getMessage()));
//         }
//     }

//     /**
//      * Generate AI response only (no search)
//      * POST /api/ai/generate
//      */
//     @PostMapping("/generate")
//     public ResponseEntity<Map<String, String>> generateAI(@RequestBody Map<String, String> request) {
//         try {
//             String prompt = request.get("prompt");
//             if (prompt == null || prompt.trim().isEmpty()) {
//                 return ResponseEntity.badRequest()
//                     .body(Map.of("error", "Prompt parameter is required"));
//             }

//             String response = googleAIService.generateContent(prompt);
//             return ResponseEntity.ok(Map.of(
//                 "prompt", prompt,
//                 "response", response,
//                 "type", "ai_only"
//             ));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError()
//                 .body(Map.of("error", "Error generating AI response: " + e.getMessage()));
//         }
//     }

//     /**
//      * Search and analyze with AI
//      * POST /api/ai/search-analyze
//      */
//     @PostMapping("/search-analyze")
//     public ResponseEntity<Map<String, String>> searchAndAnalyze(@RequestBody Map<String, String> request) {
//         try {
//             String query = request.get("query");
//             if (query == null || query.trim().isEmpty()) {
//                 return ResponseEntity.badRequest()
//                     .body(Map.of("error", "Query parameter is required"));
//             }

//             String response = aiAgentService.searchAndAnalyze(query);
//             return ResponseEntity.ok(Map.of(
//                 "query", query,
//                 "response", response,
//                 "type", "search_and_analyze"
//             ));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError()
//                 .body(Map.of("error", "Error during search and analysis: " + e.getMessage()));
//         }
//     }

//     /**
//      * Get search results only (no AI processing)
//      * GET /api/ai/search?query=your+query
//      */
//     @GetMapping("/search")
//     public ResponseEntity<Map<String, Object>> search(@RequestParam String query) {
//         try {
//             List<Map<String, String>> results = serpApiService.getOrganicResults(query);
//             return ResponseEntity.ok(Map.of(
//                 "query", query,
//                 "results", results,
//                 "type", "search_only"
//             ));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError()
//                 .body(Map.of("error", "Error during search: " + e.getMessage()));
//         }
//     }

//     /**
//      * Process query using LangChain4j AI agent with tools
//      * POST /api/ai/langchain
//      */
//     @PostMapping("/langchain")
//     public ResponseEntity<Map<String, String>> processLangChainQuery(@RequestBody Map<String, String> request) {
//         try {
//             String query = request.get("query");
//             if (query == null || query.trim().isEmpty()) {
//                 return ResponseEntity.badRequest()
//                     .body(Map.of("error", "Query parameter is required"));
//             }

//             String response = langChain4jAgentService.processQuery(query);
//             return ResponseEntity.ok(Map.of(
//                 "query", query,
//                 "response", response,
//                 "type", "langchain4j_agent"
//             ));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError()
//                 .body(Map.of("error", "Error processing LangChain query: " + e.getMessage()));
//         }
//     }

//     /**
//      * Check service configuration status
//      * GET /api/ai/status
//      */
//     @GetMapping("/status")
//     public ResponseEntity<Map<String, Object>> getStatus() {
//         Map<String, Boolean> configStatus = aiAgentService.getConfigurationStatus();
//         Map<String, Boolean> langChainStatus = langChain4jAgentService.getConfigurationStatus();
        
//         return ResponseEntity.ok(Map.of(
//             "status", "OK",
//             "services", Map.of(
//                 "basic_agent", configStatus,
//                 "langchain4j_agent", langChainStatus
//             ),
//             "description", "AI Agent Services Status"
//         ));
//     }

//     /**
//      * Health check endpoint
//      * GET /api/ai/health
//      */
//     @GetMapping("/health")
//     public ResponseEntity<Map<String, Object>> healthCheck() {
//         boolean isHealthy = aiAgentService.isFullyConfigured();
//         return ResponseEntity.ok(Map.of(
//             "status", isHealthy ? "UP" : "DOWN",
//             "service", "AI Agent Service",
//             "configured", isHealthy
//         ));
//     }
// }
