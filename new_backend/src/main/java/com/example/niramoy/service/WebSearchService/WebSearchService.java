package com.example.niramoy.service.WebSearchService;
import com.example.niramoy.dto.WebSearchResultDTO;

public interface WebSearchService {
    WebSearchResultDTO search(String query, int numResults);
}

