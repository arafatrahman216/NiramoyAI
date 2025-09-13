package com.example.niramoy.service.agent;

import org.springframework.stereotype.Service;
import com.example.niramoy.service.GoogleAIService;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.Map;

@Service
public class PlannerAgent implements Agent {
    private final GoogleAIService googleAIService;

    public PlannerAgent(GoogleAIService googleAIService) {
        this.googleAIService = googleAIService;
    }

    private static final PromptTemplate PLAN_PROMPT = PromptTemplate.from(
        "You are a professional Health Assistant. " +
        "Given the following context about a patient's visit to a doctor, and patient's medical history, " +
        "answer user query with the intent to provide a detailed plan of action for the patient's current condition if relevant. " +
        "If you detect the intention is to seek a plan of action, then follow the instructions given for plan:\n" +
        "1. Provide a step by step plan of action.\n" +
        "2. Explain with empathy, call him you.\n" +
        "3. Give some conclusion like not to worry, see another doctor or anything you see fit according to the query. Keep it concise and friendly.\n" +
        "4. Make points or segments as needed, but when explaining keep it fluent and easy, dont use jargon.\n" +
        "5. IMPORTANT: Keep your response under 1500 characters. Be concise but helpful.\n" +
        "MUST return JSON like this: {\"Plan\": \"...\"}.\n\n" +
        "Visit Summary: {{visit_summary}}\n" +
        "Doctor's Advice: {{doctor_advice}}\n" +
        "Patient Summary: {{patient_summary}}\n" +
        "History Summary: {{history_summary}}\n" +
        "KG Context: {{kg_context}}\n" +
        "user_query: {{query}}"
    );

    @Override
    public String processQuery(String query) {
        Map<String, Object> chainVariables = Map.of(
            "visit_summary", getVisitSummary(),
            "doctor_advice", getDoctorAdvice(),
            "patient_summary", getPatientSummary(),
            "history_summary", getHistorySummary(),
            "kg_context", getKGContext(),
            "query", query
        );
        
        Prompt prompt = PLAN_PROMPT.apply(chainVariables);
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

    private String getKGContext() {
        return "Providing knowledge graph data for this specific patient. Patient has history of migraines, seasonal allergies. Current medications include paracetamol as needed. Recent lab results show normal vitals.";
    }
}