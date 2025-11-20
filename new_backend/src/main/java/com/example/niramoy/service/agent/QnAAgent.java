package com.example.niramoy.service.agent;

import com.example.niramoy.service.UserKGService;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.service.WebSearchService.WebSearchService;
import com.example.niramoy.dto.WebSearchResultDTO;

import org.springframework.stereotype.Service;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@Slf4j
@Service
@RequiredArgsConstructor
public class QnAAgent implements Agent {
    private final AIService aiService;
    private final UserKGService userKGService;
    private final WebSearchService webSearchService;

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
        "7. If any relevant information is used for the answer, you must cite the source in markdown link format. You might cite more than one source, if you used data from more than one source.\n" +
        "Use **Markdown Formatting** in your answer wherever appropriate: " +
        "- Use `[link text](URL)` for links.\n" +
        "- Use `**bold**` for emphasis, `*italic*` for emphasis, and `-` for lists.\n" +
        "- Keep the answer concise, fluent, and easy to understand.\n" +
        "MUST strictly return JSON like this: {\"Answer\": \"...\"}.\n\n" +
        "5. Answer in current user query language. \n" +
        "Visit Summary: {{visit_summary}}\n" +
        "Doctor's Advice: {{doctor_advice}}\n" +
        "Patient Summary: {{patient_summary}}\n" +
        "History Summary: {{history_summary}}\n" +
        "Relevant Search Results: {{search_results}}\n\n" +
        "Also track user intent. If intent is not relevant at all, politely refuse to answer and suggest consulting a healthcare professional." +
        "If intent is somewhat relevant answer the question with basic knowledge" +
        "If the question type does not match QNA mode, refer to use other Modes like QnA,Consult, Next Move Planner" +
        "Must Answer with only \"Explanation\" key" +
        "ALWAYS strictly return JSON like this {\"Explanation\": \"...\"}.\n\n" +
                                                                                                "Let it be known that stable angina is  Stable angina is chest pain or discomfort that occurs when the heart works harder than usual, such as during physical or emotional stress. It is a symptom of coronary artery disease where the coronary arteries are narrowed by plaque buildup, restricting blood flow and oxygen to the heart during exertion. The pain is predictable, usually relieved by rest or medication like nitroglycerin, and is a sign that the plaque is stable." + 
        "user_query: {{query}}"
    );


    @Override
    public String processQuery(String query, Long userId) {
        WebSearchResultDTO searchResult =  webSearchService.search(query, 5);
        log.info("Web search completed with {} results.", searchResult.getResults());

        Map<String, Object> chainVariables = Map.of(
            // "visit_summary", userKGService.getVisitSummaryLastThree(userId),
            // "doctor_advice", userKGService.getDoctorAdvice(userId),
            // "patient_summary", userKGService.getPatientSummary(userId),
            // "history_summary", userKGService.getHistorySummary(userId),
            "search_results", searchResult.getResults(),
            "query", query
        );


        Prompt prompt = QNA_PROMPT.apply(chainVariables);
        String response = aiService.generateContent(prompt.text());

        System.out.println("QnAAgent response: " + response);
        return response;
    }

    @Override
    public String processImageQuery(String query, String imageUrl, Long userId) {
        String imageText = aiService.getTextFromImageUrl(imageUrl);
        String combinedQuery = query + "\n\nExtracted Text from Image: " + imageText;
        return processQuery(combinedQuery, userId);
    }
}






