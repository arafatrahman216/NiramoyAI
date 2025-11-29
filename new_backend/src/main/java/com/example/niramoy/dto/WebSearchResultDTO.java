

package com.example.niramoy.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebSearchResultDTO {
    private boolean success;
    private Map<String, String> data;
    private int count;

    public String getResults() {
        if (data == null || data.isEmpty()) return "";

        return data.entrySet()
                .stream()
                .map(e -> "URL : " + e.getKey() + " -> Content : " + e.getValue())
                .reduce("", (a, b) -> a + b + "\n");
    }

        public String getURL() {
        if (data == null || data.isEmpty()) return "";

        return data.entrySet()
                .stream()
                .map(e -> "URL : " + e.getKey())
                .reduce("", (a, b) -> a + b + "\n");
    }

}
