
package com.example.niramoy.service.WebSearchService;

import com.example.niramoy.dto.WebSearchResultDTO;

import java.util.Map;
import java.util.HashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
// @Profile("crawl4ai")
public class Crawl4aiSearchService implements WebSearchService {
    private final String scrapperMicroServiceUrl;
    private final WebClient webClient;

    public Crawl4aiSearchService(@Value("${app.scraper.url}") String scrapperMicroServiceUrl) {
        this.scrapperMicroServiceUrl = scrapperMicroServiceUrl;
        this.webClient = WebClient.builder().build();
    }

    @Override
    public WebSearchResultDTO search(String query, int numResults) {
        try {
            String url = scrapperMicroServiceUrl + "/api/scrape";
            
            // JSON body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("prompt", query);
            requestBody.put("num_results", numResults);
            
            // POST request
            WebSearchResultDTO result = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(WebSearchResultDTO.class)
                    .block();
            
            return result;
        } catch (Exception e) {
            log.error("Error during web search: ", e);
            return WebSearchResultDTO.builder()
                    .success(false)
                    .data(new HashMap<>())
                    .count(0)
                    .build();
        }
    }
}

