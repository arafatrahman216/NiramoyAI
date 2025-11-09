package com.example.niramoy.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for SerpAPI Google Search
 * Equivalent to GoogleSearch from serpapi in Python
 */
@Service
public class SerpApiService {

    @Value("${serpapi.key}")
    private String serpApiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    private static final String SERPAPI_BASE_URL = "https://serpapi.com";

    public SerpApiService() {
        this.webClient = WebClient.builder()
                .baseUrl(SERPAPI_BASE_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Search Google using SerpAPI
     * Equivalent to GoogleSearch(params).get_dict() in Python
     */
    public Map<String, Object> search(String query) {
        return search(query, "google", 10);
    }

    /**
     * Search with custom parameters
     */
    public Map<String, Object> search(String query, String engine, int num) {
        try {
            String uri = UriComponentsBuilder.fromPath("/search")
                    .queryParam("api_key", serpApiKey)
                    .queryParam("engine", engine)
                    .queryParam("q", query)
                    .queryParam("num", num)
                    .build()
                    .toUriString();

            String response = webClient.get()
                    .uri(uri)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseSearchResponse(response);
        } catch (Exception e) {
            throw new RuntimeException("Error calling SerpAPI: " + e.getMessage(), e);
        }
    }

    /**
     * Get organic search results as a simplified list
     */
    public List<Map<String, String>> getOrganicResults(String query) {
        Map<String, Object> searchResults = search(query);
        List<Map<String, String>> organicResults = new ArrayList<>();

        try {
            JsonNode jsonNode = objectMapper.valueToTree(searchResults);
            JsonNode organic = jsonNode.get("organic_results");

            if (organic != null && organic.isArray()) {
                for (JsonNode result : organic) {
                    Map<String, String> item = new HashMap<>();
                    item.put("title", getTextValue(result, "title"));
                    item.put("link", getTextValue(result, "link"));
                    item.put("snippet", getTextValue(result, "snippet"));
                    organicResults.add(item);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error parsing organic results: " + e.getMessage(), e);
        }

        return organicResults;
    }

    /**
     * Search and return formatted text summary
     */
    public String searchAndSummarize(String query) {
        List<Map<String, String>> results = getOrganicResults(query);
        StringBuilder summary = new StringBuilder();
        summary.append("Search results for: ").append(query).append("\n\n");

        for (int i = 0; i < Math.min(results.size(), 5); i++) {
            Map<String, String> result = results.get(i);
            summary.append(i + 1).append(". ")
                    .append(result.get("title")).append("\n")
                    .append(result.get("snippet")).append("\n")
                    .append("Link: ").append(result.get("link")).append("\n\n");
        }

        return summary.toString();
    }

    private Map<String, Object> parseSearchResponse(String response) {
        try {
            return objectMapper.readValue(response, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing SerpAPI response: " + e.getMessage(), e);
        }
    }

    private String getTextValue(JsonNode node, String fieldName) {
        JsonNode field = node.get(fieldName);
        return field != null ? field.asText() : "";
    }

    /**
     * Check if the service is properly configured
     */
    public boolean isConfigured() {
        return serpApiKey != null && !serpApiKey.isEmpty();
    }
}
