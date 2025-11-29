// // package com.example.niramoy.runner;


// // import com.example.niramoy.service.agent.tools.PlannerTools;
// // import org.springframework.boot.CommandLineRunner;
// // import org.springframework.stereotype.Component;
// // import lombok.RequiredArgsConstructor;
// // import lombok.extern.slf4j.Slf4j;

// // import java.util.Scanner;

// // @Slf4j
// // @Component
// // @RequiredArgsConstructor
// // public class AgentDemoRunner implements CommandLineRunner {
// //     private final PlannerTools plannerTools;

// //     @Override
// //     public void run(String... args) throws Exception {
// //         System.out.println("\n" + "=".repeat(80));
// //         System.out.println("🚀 NIRAMOY AI AGENT SYSTEM DEMO");
// //         System.out.println("=".repeat(80));
        
// //         try {
// //             runAutomatedDemo();
// //         } catch (Exception e) {
// //             log.error("Error in agent demo: {}", e.getMessage(), e);
// //         }
        
// //         System.out.println("\n" + "=".repeat(80));
// //         System.out.println("✅ AGENT DEMO COMPLETED");
// //         System.out.println("=".repeat(80));
// //     }

// //     private void runAutomatedDemo() {
// //         System.out.println("\n🎯 AUTOMATED AGENT DEMONSTRATIONS");
// //         System.out.println("-".repeat(50));
        
// //         // Demo 5: Planner Tools - Tool Capabilities
// //         demoPlannerTools();
// //     }

// //     private void demoPlannerTools() {
// //         System.out.println("\n🔍 Testing Web Search Tool:");
// //         try {
// //             String searchResult = plannerTools.searchWeb("latest diabetes treatment 2025");
// //             System.out.println("🌐 Search Results:" + searchResult);
// //         } catch (Exception e) {
// //             System.out.println("❌ Search Error: " + e.getMessage());
// //         }
        
// //         // Demo medical costs search
// //         System.out.println("\n💰 Testing Medical Costs Search:");
// //         try {
// //             String costResult = plannerTools.searchMedicalCosts("MRI scan", "DHAKA");
// //             System.out.println("💵 Cost Information:" + costResult);
// //         } catch (Exception e) {
// //             System.out.println("❌ Cost Search Error: " + e.getMessage());
// //         }
        
// //         // Demo healthcare provider search
// //         System.out.println("\n🏥 Testing Healthcare Provider Search:");
// //         try {
// //             String providerResult = plannerTools.searchHealthcareProviders("cardiologist", "Chittagong");
// //             System.out.println("🩺 Healthcare Providers:" + providerResult);
// //         } catch (Exception e) {
// //             System.out.println("❌ Provider Search Error: " + e.getMessage());
// //         }
        
// //     }
// // }






// import dev.langchain4j.agent.tool.Tool;
// import dev.langchain4j.memory.chat.MessageWindowChatMemory;
// import dev.langchain4j.model.chat.ChatModel;
// import dev.langchain4j.model.openai.OpenAiChatModel;
// import dev.langchain4j.service.AiServices;

// import static dev.langchain4j.model.openai.OpenAiChatModelName.GPT_4_O_MINI;

// public class _10_ServiceWithToolsExample {

//     // Please also check CustomerSupportApplication and CustomerSupportApplicationTest
//     // from spring-boot-example module

//     static class Calculator {

//         @Tool("Calculates the length of a string")
//         int stringLength(String s) {
//             System.out.println("Called stringLength() with s='" + s + "'");
//             return s.length();
//         }

//         @Tool("Calculates the sum of two numbers")
//         int add(int a, int b) {
//             System.out.println("Called add() with a=" + a + ", b=" + b);
//             return a + b;
//         }

//         @Tool("Calculates the square root of a number")
//         double sqrt(int x) {
//             System.out.println("Called sqrt() with x=" + x);
//             return Math.sqrt(x);
//         }
//     }

//     interface Assistant {

//         String chat(String userMessage);
//     }

//     public static void main(String[] args) {

//         ChatModel model = OpenAiChatModel.builder()
//                 .apiKey(ApiKeys.OPENAI_API_KEY) // WARNING! Tools are not supported with "demo" API key
//                 .modelName(GPT_4_O_MINI)
//                 .strictTools(true) // https://docs.langchain4j.dev/integrations/language-models/open-ai#structured-outputs-for-tools
//                 .build();

//         Assistant assistant = AiServices.builder(Assistant.class)
//                 .chatModel(model)
//                 .tools(new Calculator())
//                 .chatMemory(MessageWindowChatMemory.withMaxMessages(10))
//                 .build();

//         String question = "What is the square root of the sum of the numbers of letters in the words \"hello\" and \"world\"?";

//         String answer = assistant.chat(question);

//         System.out.println(answer);
//         // The square root of the sum of the number of letters in the words "hello" and "world" is approximately 3.162.
//     }
// }