package com.example.niramoy.runner;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;

import com.example.niramoy.service.agent.tools.PlannerTools;
import com.google.api.client.util.Value;

import dev.langchain4j.service.AiServices;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
// @Component
@RequiredArgsConstructor
public class AgentDemoRunner implements CommandLineRunner {
    private final ChatLanguageModel chatModel;


    static class Calculator {

        @Tool("Calculates the length of a string")
        int stringLength(String s) {
            System.out.println("Called stringLength() with s='" + s + "'");
            return s.length();
        }

        @Tool("Calculates the sum of two numbers")
        int add(int a, int b) {
            System.out.println("Called add() with a=" + a + ", b=" + b);
            return a + b;
        }

        @Tool("Calculates the square root of a number")
        double sqrt(int x) {
            System.out.println("Called sqrt() with x=" + x);
            return Math.sqrt(x);
        }
    }

    interface Assistant {

        String chat(String userMessage);
    }


    @Override
    public void run(String... args) throws Exception {
        Assistant assistant = AiServices.builder(Assistant.class)
                .chatLanguageModel(
                    GoogleAiGeminiChatModel.builder()
                        .apiKey( "")
                        .modelName("gemini-2.0-flash")
                        .temperature(0.7)
                        .build()
                )
                .tools(new Calculator())
                .build();
                
        String question = "What is the square root of the sum of the numbers of letters in the words \"hello\" and \"world\"?";

        String answer = assistant.chat(question);

        System.out.println(answer);     
    }
}