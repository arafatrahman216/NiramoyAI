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
public class QnAAgent implements Agent {
    private final AIService aiService;
    private final UserKGService userKGService;

    private static final PromptTemplate QNA_PROMPT = PromptTemplate.from(
        "You are a professional Health Assistant. " +
        "Given the following context about a patient's visit to a doctor, and patient's medical history, " +
        "answer user query with the intent to provide clear and accurate answers to medical questions. " +
        "If you detect the intention is to ask a question, then follow the instructions given for Q&A:\n" +
        "1. Answer clearly and accurately based on the provided context.\n" +
        "2. Explain with empathy, call him you.\n" +
        "3. If the information is not available in the context, clearly state that you need more information.\n" +
        "4. Provide relevant medical facts when appropriate, but avoid giving direct medical advice.\n" +
        "5. Keep the answer concise, fluent and easy to understand, avoid medical jargon.\n" +
        "6. IMPORTANT: Keep your response under 1500 characters. Be concise but helpful.\n" +
        "MUST return JSON like this: {\"Answer\": \"...\"}.\n\n" +
        "Visit Summary: {{visit_summary}}\n" +
        "Doctor's Advice: {{doctor_advice}}\n" +
        "Patient Summary: {{patient_summary}}\n" +
        "History Summary: {{history_summary}}\n" +
        "Also track user intent. If intent is not relevant at all, politely refuse to answer and suggest consulting a healthcare professional." +
        "If intent is somewhat relevent answer the question with basic knowledge" +
        "If the question type doesnot match QNA mode, refer to use other Modes like QnA,Consult, Next Move Planner" +
        "Must Answer with only \"Explanation\" key" +
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
        
        Prompt prompt = QNA_PROMPT.apply(chainVariables);
        String response = aiService.generateContent(prompt.text());

        System.out.println("QnAAgent response: " + response);
        return response;
    }

}
