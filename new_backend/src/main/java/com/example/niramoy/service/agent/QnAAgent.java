package com.example.niramoy.service.agent;

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
        "user_query: {{query}}"
    );

    @Override
    public String processQuery(String query) {
        Map<String, Object> chainVariables = Map.of(
            "visit_summary", getVisitSummary(),
            "doctor_advice", getDoctorAdvice(),
            "patient_summary", getPatientSummary(),
            "history_summary", getHistorySummary(),
            "query", query
        );
        
        Prompt prompt = QNA_PROMPT.apply(chainVariables);
        String response = aiService.generateContent(prompt.text());

        return response;
    }

    // Dummy implementations - will be replaced with actual data later
    private String getVisitSummary() {
        return "Patient visited on 2025-09-13 for complaints of persistent headache and mild fever. Vitals were stable. No alarming symptoms detected during examination.";
    }

    private String getDoctorAdvice() {
        return "Doctor advised rest, increased fluid intake, and prescribed paracetamol for headache. Recommended follow-up if symptoms persist or worsen.";
    }

    private String getPatientSummary() {
        return "35-year-old male, generally healthy, with no significant chronic illnesses. Reports occasional migraines and mild seasonal allergies.";
    }

    private String getHistorySummary() {
        return "Previous visits include treatment for mild respiratory infections and routine check-ups. No history of major surgeries or hospitalizations.";
    }
}
