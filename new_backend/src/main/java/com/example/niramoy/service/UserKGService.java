package com.example.niramoy.service;

import com.example.niramoy.entity.HealthProfile;
import com.example.niramoy.repository.graphDB.GraphDB;
import com.example.niramoy.service.AIServices.AIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserKGService {
    private final GraphDB graphDB;
    private final AIService aiService;
    
    public boolean isConnected() {
        return graphDB.isConnected();
    }

    public String getSchema() {
        return graphDB.getSchema();
    }

    public HealthProfile saveHealthProfile(HealthProfile healthProfile) {
        final PromptTemplate SUMMARY_PROMPT = PromptTemplate.from(
            """
                Provide a concise summary of the following patient data for quick reference by healthcare professionals:
                Patient Data: {patient_data}
                Summary will be a paragraph of max 200 words.
                Return JSON ONLY like this: {\"Summary\": \"...\"}
            """
        );
        
        Map<String, Object> chainVariables = Map.of(
            "patient_data", healthProfile.toString()
        );  

        Prompt prompt = SUMMARY_PROMPT.apply(chainVariables);
        String response = aiService.generateContent(prompt.text());
        log.info("Generated Summary: " + response);

        return healthProfile;
    }

    
}
