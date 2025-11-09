// package com.example.niramoy.runner;

// import dev.langchain4j.agent.tool.Tool;
// import dev.langchain4j.model.chat.ChatLanguageModel;
// import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;


// import com.example.niramoy.service.LangChain4jAgentService;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;


// @Slf4j
// // @Component
// @RequiredArgsConstructor
// public class AgentDemoRunner implements CommandLineRunner {
//     private final LangChain4jAgentService  agentService;

//     @Override
//     public void run(String... args) throws Exception {
//         String query = "Price of gold today in bangladesh?";
//         log.info("Processing query: {}", query);
//         String response = agentService.processQuery(query);
//         log.info("Agent response:\n{}", response);  
//     }
// }