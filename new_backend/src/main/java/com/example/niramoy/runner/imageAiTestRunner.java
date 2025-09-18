package com.example.niramoy.runner;

import com.example.niramoy.service.AIServices.AIService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Component
@RequiredArgsConstructor
public class imageAiTestRunner implements CommandLineRunner {
    private final AIService AiService;

    @Override
    public void run(String... args) throws Exception {
        try{
            System.out.println("=== Image AI Test Runner ===");
            String imageUrl = "https://fazcrlmvdczokbxfvyyn.storage.supabase.co/storage/v1/object/images/56c0c96b-df17-4679-93fb-a9a906789a1a.png";
            String extractedText = AiService.getTextFromImageUrl(imageUrl);
            System.out.println("Extracted Text from Image: " + extractedText);
        } catch(Exception e){
            log.error("Error in Image AI Test Runner: {}", e.getMessage());
        }
    }


    // public void run(String... args) throws Exception {
    //     final PromptTemplate SYMPTOMS_AND_SPECIALIZATION_EXTRACTION_PROMPT = PromptTemplate.from(
    //         """
    //         Extract the symptoms from the following text. Return as a comma-separated list.\n
    //         Then suggest a generalized medical specialization that would be most appropriate for finding doctor with these symptoms.\n
    //         Symptoms: {{symptoms}}\n
    //         Return JSON ONLY like this: {\"Symptoms\": \"...\", \"Specialization\": \"...\"}\n
    //         """
    //     );
    //     String promptText = SYMPTOMS_AND_SPECIALIZATION_EXTRACTION_PROMPT.apply(
    //         Map.of("symptoms", "Patient complains of persistent cough, shortness of breath, and occasional chest pain.")
    //     ).text();

    //     String response = AiService.generateContent(promptText);

    //     JSONObject json = JsonParser.parseJsonToObject(response);
    //     if (json != null) {
    //         String symptoms = json.optString("Symptoms");
    //         String specialization = json.optString("Specialization");
    //         System.out.println("Extracted Symptoms: " + symptoms);
    //         System.out.println("Suggested Specialization: " + specialization);
    //     } else {
    //         System.out.println("Failed to parse JSON response.");
    //     }
    // }
}
