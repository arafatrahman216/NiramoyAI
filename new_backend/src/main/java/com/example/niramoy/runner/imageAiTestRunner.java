package com.example.niramoy.runner;

import com.example.niramoy.service.AIServices.AIService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class imageAiTestRunner implements CommandLineRunner {
    private final AIService AiService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Image AI Test Runner ===");
        String imageUrl = "https://caybpletpctedkylptmh.storage.supabase.co/storage/v1/object/images/7072da95-c5b0-43a6-ae8c-3a1294f2ef1e.png";
        String extractedText = AiService.getTextFromImageUrl(imageUrl);
        System.out.println("Extracted Text from Image: " + extractedText);
    }
}
