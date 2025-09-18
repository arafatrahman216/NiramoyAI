package com.example.niramoy.service;

import com.example.niramoy.entity.HealthProfile;
import com.example.niramoy.repository.graphDB.GraphDB;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.utils.JsonParser;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;

import java.util.List;
import java.util.Map;

import com.example.niramoy.entity.Visits;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserKGService {
    private final GraphDB graphDB;
    private final AIService AiService;
    
    public boolean isConnected() {
        return graphDB.isConnected();
    }

    public String getSchema() {
        return graphDB.getSchema();
    }

    public HealthProfile saveHealthProfile(HealthProfile healthProfile) {
        final PromptTemplate SUMMARY_PROMPT = PromptTemplate.from(
            """
                Provide a concise summary of the following patient data for quick reference by healthcare professionals:
                Patient Data: {patient_data}
                Summary will be a paragraph of max 200 words.
                Return JSON ONLY like this: {\"Summary\": \"...\"}
            """
        );
        
        Map<String, Object> chainVariables = Map.of(
            "patient_data", healthProfile.toString()
        );  

        Prompt prompt = SUMMARY_PROMPT.apply(chainVariables);
        String response = AiService.generateContent(prompt.text());
        log.info("Generated Summary: " + response);

        return healthProfile;
    }

    
    public boolean saveVisitData(Visits visit, Long patientID) {
        String extractedPrescriptionText = AiService.getTextFromImageUrl(visit.getPrescriptionFileUrl());
        List<String> extractedTestReportTexts = visit.getTestReportUrls().stream()
                                    .map(url -> AiService.getTextFromImageUrl(url))
                                    .toList();
                 
        StringBuilder testReportsCombined = new StringBuilder();
        for (int i = 0; i < extractedTestReportTexts.size(); i++) {
            testReportsCombined.append("Test Report ").append(i + 1).append(" : ")
                .append(extractedTestReportTexts.get(i));
            if (i < extractedTestReportTexts.size() - 1) {
                testReportsCombined.append("\n\n\n\n");
            }
        }
        String joinedTestReportsText = testReportsCombined.toString();
        log.info("Extracted Prescription Text: " + extractedPrescriptionText);
        log.info("Extracted Test Report Texts: " + joinedTestReportsText);

        
        final PromptTemplate SYMPTOMS_AND_SPECIALIZATION_EXTRACTION_PROMPT = PromptTemplate.from(
            """
            Extract the symptoms from the following text. Return as a comma-separated list.\n
            Then suggest a generalized medical specialization that would be most appropriate for finding doctor with these symptoms.\n
            Symptoms: {{symptoms}}\n
            Return JSON ONLY like this: {\"Symptoms\": \"...\", \"Specialization\": \"...\"}\n
            """
        );
        String promptText = SYMPTOMS_AND_SPECIALIZATION_EXTRACTION_PROMPT.apply(
            Map.of("symptoms", "Patient complains of persistent cough, shortness of breath, and occasional chest pain.")
        ).text();

        String response = AiService.generateContent(promptText);
        JSONObject responseJson = JsonParser.parseJsonToObject(response);

        String extractedSymptoms = responseJson.optString("Symptoms", "");
        String specialization = responseJson.optString("Specialization", "");

        Map<String, Object> visitData = Map.of(
            "symptoms", extractedSymptoms,
            "date", visit.getAppointmentDate().toString(),
            "doctor_name", visit.getDoctorName(),
            "specialization", specialization,
            "what_doctor_said_to_patient", visit.getPrescription()
        );



        final PromptTemplate VISIT_DETAILS_EXTRACTION_PROMPT = PromptTemplate.from(
            "You are a Medical Assistant. Think like a doctor, take account of both test and prescription data, think critically. " +
            "Based on the patient's visit to doctor details and the prescription information and Test Results, extract the following infos.\n" +
            "Doctor visit details: {{visit_details}}. Prescription text: {{prescription_text}}. Test results: {{test_results}}.\n" +
            "Extract and return JSON ONLY like this: " +
            "{\"DoctorDetails\":{\"Name\":\"...\",\"Specialization\":\"...\"},\"Symptoms\":[\"symptom1\",\"symptom2\"],\"Diagnosis\":[\"diagnosis1\",\"diagnosis2\"],\"PrescribedMedicines\":[{\"medicine_name\":\"...\",\"dosage_and_duration\":\"...\"}],\"GivenTests\":[{\"test_name\":\"...\",\"test_report_summary\":\"...\",\"test_report_severity\":\"...\"}],\"DoctorAdvice\":\"...\",\"visit_summary\":\"...\"}\n" +
            "Example of GivenTests: [{\"test_name\": \"Complete Blood and Hematology Report\", \"test_report_summary\": \"Elevated Fasting Glucose (135 mg/dL - HIGH), Total Cholesterol (240 mg/dL - HIGH), HDL-Cholesterol (160 mg/dL - HIGH) , & Triglycerides (190 mg/dL - HIGH). Cardiac Troponin I is within normal limits (<0.01 ng/mL).\", \"test_report_severity\": \"Normal\"}, {\"test_name\": \"Urinalysis\", \"test_report_summary\": \"Presence of mild proteinuria.\", \"test_report_severity\": \"Mild\"}]"
        );

        String visitDetails = visitData.toString();
        String prescriptionText = extractedPrescriptionText;
        String testResults = joinedTestReportsText;

        String visitPromptText = VISIT_DETAILS_EXTRACTION_PROMPT.apply(
            Map.of(
            "visit_details", visitDetails,
            "prescription_text", prescriptionText,
            "test_results", testResults
            )
        ).text();

        String extractedVisitDetails = AiService.generateContent(visitPromptText);
        JSONObject extractedVisitJson = JsonParser.parseJsonToObject(extractedVisitDetails);
        
        Map<String, Object> updatedVisitData = Map.of(
            "patientID", patientID,
            "visitID", visitData.getOrDefault("visitID", ""),
            "date", visitData.getOrDefault("date", ""),
            "doctorID", visitData.getOrDefault("doctorID", ""),
            "doctor_name", visitData.getOrDefault("doctor_name", ""),
            "specialization", visitData.getOrDefault("specialization", ""),
            "visit_type", visitData.getOrDefault("visit_type", ""),
            "DoctorAdvice", extractedVisitJson.optString("DoctorAdvice", ""),
            "visit_summary", extractedVisitJson.optString("visit_summary", "")
        );

        String visitQuery = """
            MATCH (p:Patient {patientID: $patientID})
            OPTIONAL MATCH (prev:Visit)<-[:HAS_VISIT]-(p)
            WITH p, prev
            ORDER BY prev.visitID DESC
            LIMIT 1
            CREATE (v:Visit {
                visitID: $visitID,
                date: $date,
                doctorID: $doctorID,
                doctor_name: $doctor_name,
                specialization: $specialization,
                visit_type: $visit_type,
                doctor_advice: $DoctorAdvice,
                visit_summary: $visit_summary
            })
            MERGE (p)-[:HAS_VISIT]->(v)
            FOREACH (_ IN CASE WHEN prev IS NOT NULL THEN [1] ELSE [] END |
                MERGE (prev)-[:NEXT_VISIT]->(v)
            )
            RETURN v
        """;
        graphDB.executeQuery(visitQuery, updatedVisitData);
        log.info("Visit node inserted.");

        if (isConnected() && extractedVisitJson.has("Symptoms")) {
            try {
                Object symptomsObj = extractedVisitJson.get("Symptoms");
                List<String> symptomsList;
                if (symptomsObj instanceof String) {
                    String symptomsStr = (String) symptomsObj;
                    symptomsList = List.of(symptomsStr.split(","))
                        .stream().map(String::trim).filter(s -> !s.isEmpty()).toList();
                } else if (symptomsObj instanceof org.json.JSONArray) {
                    org.json.JSONArray arr = (org.json.JSONArray) symptomsObj;
                    symptomsList = arr.toList().stream()
                        .map(Object::toString).map(String::trim).filter(s -> !s.isEmpty()).toList();
                } else {
                    symptomsList = List.of();
                }
                for (String symptom : symptomsList) {
                    String symptomQuery = """
                        MATCH (v:Visit {visitID: $visitID})
                        MERGE (s:Symptom {name: $symptom})
                        MERGE (v)-[:HAS_SYMPTOM]->(s)
                    """;
                    graphDB.executeQuery(symptomQuery, Map.of(
                        "visitID", updatedVisitData.get("visitID"),
                        "symptom", symptom
                    ));
                }
                log.info("Symptoms nodes inserted.");
            } catch (Exception e) {
                log.error("Error inserting symptoms: {}", e.getMessage());
            }
        } else {
            log.info("Skipping symptoms insertion - no database connection or no symptoms data.");
        }


        return true;
    }
}
