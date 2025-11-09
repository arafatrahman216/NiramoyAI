package com.example.niramoy.service.agent.tools;

import com.example.niramoy.service.SerpApiService;
import com.example.niramoy.service.UserKGService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class PlannerAgentTools {
    private final SerpApiService serpApiService;

    public String searchWeb(String query) {
        try {
            log.info("Searching web for: {}", query);
            Map<String, Object> searchResults = serpApiService.search(query);
            
            // Extract organic results
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> organicResults = (List<Map<String, Object>>) searchResults.get("organic_results");
            
            if (organicResults == null || organicResults.isEmpty()) {
                return "No search results found for: " + query;
            }
            
            // Format the results for the AI
            StringBuilder formattedResults = new StringBuilder();
            formattedResults.append("Search results for '").append(query).append("':\n\n");
            
            // Take top 1 results
            int count = Math.min(1, organicResults.size());
            for (int i = 0; i < count; i++) {
                Map<String, Object> result = organicResults.get(i);
                String title = (String) result.get("title");
                String snippet = (String) result.get("snippet");
                String link = (String) result.get("link");
                
                formattedResults.append(String.format("%d. %s\n", i + 1, title));
                if (snippet != null) {
                    formattedResults.append("   ").append(snippet).append("\n");
                }
                if (link != null) {
                    formattedResults.append("   Source: ").append(link).append("\n");
                }
                formattedResults.append("\n");
            }
            
            return formattedResults.toString();
            
        } catch (Exception e) {
            log.error("Error searching web: {}", e.getMessage());
            return "Error occurred while searching the web: " + e.getMessage();
        }
    }
}
