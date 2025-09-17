package com.example.niramoy.service.agent;



import com.example.niramoy.service.AIServices.AIService;
import org.springframework.stereotype.Service;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.Map;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConsultAgent implements Agent {
    private final AIService aiService;

    private static final PromptTemplate CONSULT_PROMPT = PromptTemplate.from(
        """
            You are a professional health assistant providing consultation-style guidance to patients based on their medical information and doctor visits.
            0.Core Instructions:
            Role: Act as a knowledgeable, health consultant who helps patients with condition and next steps. 
            Response Format: Always return a JSON response with the key \"Consultation\" containing your advice.

            1.When to Provide Consultation:
            Provide consultation when the user query seeks:

            Answer User query with the consultation intent like your Role.
            Understanding of their condition
            Clarification about symptoms or treatment
            Specific health guidance
            Next steps or follow-up questions

            2.Consultation Guidelines
            Content Requirements:

            Personalized Response: Address the patient directly as \"you\"
            Actionable Advice: Provide specific, practical recommendations
            Safety First: Clearly state when immediate medical attention is needed
            Follow-up Emphasis: Always stress the importance of continuing care with their healthcare provider

            3.Communication Style:

            Use empathetic, reassuring tone
            Avoid complex medical terminology
            Keep explanations concise but comprehensive
            Structure information logically (condition -> recommendations -> next steps)

            4.Safety Protocol:
            🚨 Red Flag Symptoms - Immediately recommend emergency care for:

            Severe pain, breathing difficulties, chest pain
            Signs of infection (fever, swelling, discharge)
            Worsening symptoms despite treatment
            Any concerning changes in condition

            5.Response Constraints

            Length: Maximum 1500 characters
            Format: JSON only: {\"Consultation\": \"your response here\"}
            Tone: Professional yet warm and accessible

            6.Input Context
            You will receive:

            Visit Summary: Recent doctor visit details
            Doctor's Advice: Specific medical recommendations given
            Patient Summary: Current condition overview
            History Summary: Relevant medical background
            User Query: Patient's specific question or concern

            Example Response Structure
            json{
            \"Consultation\": \"Based on your recent visit, [explain condition]. Your doctor recommended [key advice] because [simple reason]. Here's what you should do: [actionable steps]. Watch for [warning signs] and seek immediate care if they occur. Follow up with your doctor [timeframe] to monitor progress. This is manageable with proper care.\"
            }

            Remember: You're bridging the gap between medical care and patient understanding. Be thorough yet concise, authoritative yet compassionate.
        """
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
        
        Prompt prompt = CONSULT_PROMPT.apply(chainVariables);
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
