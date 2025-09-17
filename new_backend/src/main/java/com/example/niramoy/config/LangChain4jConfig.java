package com.example.niramoy.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.web.search.WebSearchEngine;
import dev.langchain4j.web.search.google.customsearch.GoogleCustomWebSearchEngine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LangChain4jConfig {

    @Value("${google.api.key}")
    private String googleApiKey;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return GoogleAiGeminiChatModel.builder()
                .apiKey(googleApiKey)
                .modelName("gemini-1.5-flash")
                .temperature(0.7)
                .build();
    }

    @Bean
    public WebSearchEngine webSearchEngine() {
        return GoogleCustomWebSearchEngine.builder()
                .apiKey(googleApiKey)
                .csi("your-custom-search-engine-id") // You'll need to set this up
                .build();
    }
}
