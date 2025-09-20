package com.example.niramoy.service.agent;

import com.example.niramoy.service.UserKGService;
import com.example.niramoy.service.AIServices.AIService;
import org.springframework.stereotype.Service;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.Map;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExplainAgent implements Agent {
    private final AIService aiService;
    private final UserKGService userKGService;

    private static final PromptTemplate EXPLANATION_PROMPT = PromptTemplate.from(
        "You are a professional Health Assistant. " +
        "Given the following context about a patient's visit to a doctor, and patient's medical history, doctor's advice in that visit, " +
        "answer user query with the intent to provide a detailed explanation of the patient's current condition if relevant. " +
        "If you detect the intention is to seek explanation, then follow the instructions given for explanation:\n" +
        "1. Explain simply so that a normal non-medical field person can understand it.\n" +
        "2. Explain with empathy, call him you.\n" +
        "3. Give some conclusion like not to worry, see another doctor or anything you see fit according to the query.\n" +
        "4. State some possible causes if relevant (only when relevant to the user_query).\n" +
        "5. Keep the conclusion in a new para, concise, very fluent and friendly.\n" +
        "6. Make points or segments as needed, but when explaining keep it fluent and easy, dont use jargon.\n" +
        "7. IMPORTANT: Keep your response under 1500 characters. Be concise but helpful.\n" +
        "MUST return JSON like this: {\"Explanation\": \"...\"}.\n\n" +
        "Visit Summary: {{visit_summary}}\n" +
        "Doctor's Advice: {{doctor_advice}}\n" +
        "Patient Summary: {{patient_summary}}\n" +
        "History Summary: {{history_summary}}\n" + "\n\n" +
        "Also track user intent. If intent is not relevant at all, politely refuse to answer and suggest consulting a healthcare professional." +
        "If intent is somewhat relevent answer the question with basic knowledge" +
        "If the question type doesnot match EXPLANATION mode, refer to use other Modes like QnA,Consult, Next Move Planner" +
        "ALWAYS return JSON like this {\"Explanation\": \"...\"}.\n\n" +
        "user_query: {{query}}"
    );



    @Override
    public String processQuery(String query, Long userId) {
        Map<String, Object> chainVariables = Map.of(
            "visit_summary", userKGService.getVisitSummaryLastThree(userId),
            "doctor_advice", userKGService.getDoctorAdvice(userId),
            "patient_summary", userKGService.getPatientSummary(userId),
            "history_summary", userKGService.getHistorySummary(userId),
            "query", query
        );
        
        Prompt prompt = EXPLANATION_PROMPT.apply(chainVariables);
        String response = aiService.generateContent(prompt.text());
        
        return response;
    }


    @Override
    public String processImageQuery(String query, String imageUrl, Long userId) {

        String imageText = aiService.getTextFromImageUrl(imageUrl);
        query = query +  ". Also analyze the image text provided and incorporate any relevant information from it"
            + " into your explanation. The image contains the following text (donot use \", use \\\" if needed): " + imageText;
        System.out.println("query: " + query);

        Map<String, Object> chainVariables = Map.of(
            "visit_summary", userKGService.getVisitSummaryLastThree(userId),
            "doctor_advice", userKGService.getDoctorAdvice(userId),
            "patient_summary", userKGService.getPatientSummary(userId),
            "history_summary", userKGService.getHistorySummary(userId),
            "query", query  

        );

        Prompt prompt = EXPLANATION_PROMPT.apply(chainVariables);
        String response = aiService.generateContent(prompt.text());

        return response;
    }
}