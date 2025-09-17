package com.example.niramoy.service;


import com.example.niramoy.service.AIServices.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final AIService aiService;
    private final SerpApiService serpApiService;


    public String getDoctors(String query){
        String response = serpApiService.searchAndSummarize(query);
        System.out.println(response);
        response= aiService.generateContent("" +
                "Based on the following search results, provide a comprehensive answer to the user's question.\n\nSearch Results:\n" + response,
                "Original Question: " + query);
        System.out.println(response);
        return response;
    }
}
