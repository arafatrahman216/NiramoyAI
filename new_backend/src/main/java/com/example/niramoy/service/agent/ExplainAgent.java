package com.example.niramoy.service.agent;

import org.springframework.stereotype.Service;
import com.example.niramoy.service.GoogleAIService;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.Map;

@Service
public class ExplainAgent implements Agent {
    private final GoogleAIService googleAIService;

    public ExplainAgent(GoogleAIService googleAIService) {
        this.googleAIService = googleAIService;
    }

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
        
        Prompt prompt = EXPLANATION_PROMPT.apply(chainVariables);
        String response = googleAIService.generateContent(prompt.text());
        
        return response;
    }
    

    //TODO: Fetch data from KG
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