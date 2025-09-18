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

    
    public boolean saveVisitDetails(Visits visit, Long patientID, Long doctorID) {
        log.info("Saving visit details to Knowledge Graph for visit ID: {}", visit.getVisitId());   
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
            Symptoms: {{symptoms}}\n
            Return JSON ONLY like this: {\"Symptoms\": \"...\"}\n
            """
        );
        String promptText = SYMPTOMS_AND_SPECIALIZATION_EXTRACTION_PROMPT.apply(
            Map.of("symptoms", "Patient complains of persistent cough, shortness of breath, and occasional chest pain.")
        ).text();

        String response = AiService.generateContent(promptText);

        String extractedSymptoms = JsonParser.parseJsonField(response, "Symptoms");

        Map<String, Object> visitData = Map.of(
            "symptoms", extractedSymptoms,
            "date", visit.getAppointmentDate().toString(),
            "doctor_name", visit.getDoctorName(),
            "what_doctor_said_to_patient", visit.getPrescription()
        );


        final PromptTemplate VISIT_DETAILS_EXTRACTION_PROMPT = PromptTemplate.from(
            "You are a Medical Assistant. Think like a doctor, take account of both test and prescription data, think critically. " +
            "Based on the patient's visit to doctor details and the prescription information and Test Results, extract the following infos.\n" +
            "Doctor visit details: {{visit_details}}. Prescription text: {{prescription_text}}. Test results: {{test_results}}.\n" +
            "For DoctorAdvice take what doctor prescribed to patient (could be vague too) Plus deduce what is told in the precription. Then you will give a output as DoctorAdvice which will be clear and consice" +
            "Extract and return JSON ONLY like this: " +
            "{\"DoctorDetails\":{\"Name\":\"...\",\"Specialization\":\"...\"},\"Symptoms\":[\"symptom1\",\"symptom2\"],\"Diagnosis\":[\"diagnosis1\",\"diagnosis2\"],\"PrescribedMedicines\":[{\"medicine_name\":\"...\",\"dosage_and_duration\":\"...\"}],\"GivenTests\":[{\"test_name\":\"...\",\"test_report_summary\":\"...\",\"test_report_severity\":\"...\"}],\"DoctorAdvice\":\"...\",\"visit_summary\":\"...\", \"visit_type\": \"...\"}\n" +
            "Examples of visit_type : Routine, Followup, Emergency" +
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
        
        
        String doctorName = visitData.getOrDefault("doctor_name", "").toString();
        String specialization = "";
        String doctorIdString = "";
        if(doctorID != -1L ) doctorIdString = doctorID.toString();
        if (extractedVisitJson.has("DoctorDetails")) {
            JSONObject doctorDetails = extractedVisitJson.getJSONObject("DoctorDetails");
            doctorName = doctorDetails.optString("Name", doctorName);
            specialization = doctorDetails.optString("Specialization", "");
        }

        Map<String, Object> updatedVisitData = Map.of(
            "patientID", patientID,
            "visitID", visit.getVisitId(),
            "date", visitData.getOrDefault("date", ""),
            "doctorID", doctorIdString,
            "doctor_name", doctorName,
            "specialization", specialization,
            "visit_type", extractedVisitJson.optString("visit_type", ""),
            "DoctorAdvice", extractedVisitJson.optString("DoctorAdvice", ""),
            "visit_summary", extractedVisitJson.optString("visit_summary", "")
        );


        // Insertion Visit, Symptoms, Diagnosis, Medicines, Tests Nodes.
        try {
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
        } catch (Exception e) {
            log.error("Error inserting visit node: {}", e.getMessage());
        }

        try {
            List<String> symptomsList = JsonParser.parseSymptomsList(extractedVisitJson);
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
            log.info("Symptoms nodes inserted: {}", symptomsList.size());
        } catch (Exception e) {
            log.error("Error inserting symptoms: {}", e.getMessage());
        }

        try {
            List<String> diagnosisList = JsonParser.parseDiagnosisList(extractedVisitJson);
            for (String diagnosis : diagnosisList) {
                String diagnosisQuery = """
                    MATCH (v:Visit {visitID: $visitID})
                    MERGE (d:Diagnosis {name: $diagnosis})
                    MERGE (v)-[:HAS_DIAGNOSIS]->(d)
                """;
                graphDB.executeQuery(diagnosisQuery, Map.of(
                    "visitID", updatedVisitData.get("visitID"),
                    "diagnosis", diagnosis
                ));
            }
            log.info("Diagnosis nodes inserted: {}", diagnosisList.size());
        } catch (Exception e) {
            log.error("Error inserting diagnosis: {}", e.getMessage());
        }

        try {
            List<Map<String, String>> medicinesList = JsonParser.parsePrescribedMedicines(extractedVisitJson);
            for (Map<String, String> med : medicinesList) {
                String medicineQuery = """
                    MATCH (v:Visit {visitID: $visitID})
                    MERGE (m:Medicine {medicine_name: $medicine_name, dosage_and_duration: $dosage_and_duration})
                    MERGE (v)-[:HAS_MEDICINE]->(m)
                """;
                graphDB.executeQuery(medicineQuery, Map.of(
                    "visitID", updatedVisitData.get("visitID"),
                    "medicine_name", med.get("medicine_name"),
                    "dosage_and_duration", med.get("dosage_and_duration")
                ));
            }
            log.info("Medicines nodes inserted: {}", medicinesList.size());
        } catch (Exception e) {
            log.error("Error inserting medicines: {}", e.getMessage());
        }

        try {
            List<Map<String, String>> testsList = JsonParser.parseGivenTests(extractedVisitJson);
            for (Map<String, String> test : testsList) {
                String testQuery = """
                    MATCH (v:Visit {visitID: $visitID})
                    MERGE (t:Test {
                        test_name: $test_name,
                        test_report_summary: $test_report_summary,
                        test_report_severity: $test_report_severity
                    })
                    MERGE (v)-[:HAS_TEST]->(t)
                """;
                graphDB.executeQuery(testQuery, Map.of(
                    "visitID", updatedVisitData.get("visitID"),
                    "test_name", test.get("test_name"),
                    "test_report_summary", test.get("test_report_summary"),
                    "test_report_severity", test.get("test_report_severity")
                ));
            }
            log.info("Test nodes inserted: {}", testsList.size());
        } catch (Exception e) {
            log.error("Error inserting tests: {}", e.getMessage());
        }


        // RELATIONSHIP EXTRACTION
        log.info("=== EXTRACTING RELATIONSHIPS ===");
        
        final PromptTemplate RELATIONSHIP_EXTRACTION_PROMPT = PromptTemplate.from(
            """
            You are a Medical Knowledge Expert. Analyze the medical data to identify relationships between different medical entities. Think critically about how symptoms, tests, diagnoses, and medicines relate to each other.
            
            Based on the following medical data, extract relationships between entities:
            Symptoms: {{symptoms}}
            Test Results: {{tests}}
            Diagnoses: {{diagnoses}}
            Medicines: {{medicines}}
            Patient Data: {{patient_data}}
            
            Extract relationships and return JSON ONLY like this:
            {
              "TestRelationships": [
                {"test": "...", "relationship": "SUPPORTS", "target": "...", "target_type": "Diagnosis"}
              ],
              "SymptomRelationships": [
                {"symptom": "...", "relationship": "SUGGESTS", "diagnosis": "..."}
              ],
              "TreatmentRelationships": [
                {"diagnosis": "...", "relationship": "TREATED_BY", "medicine": "..."}
              ],
              "AllergyRelationships": [
                {"patient": "...", "relationship": "ALLERGIC_TO", "medicine": "..."}
              ],
              "DrugInteractions": [
                {"medicine1": "...", "relationship": "INTERACTS_WITH", "medicine2": "..."}
              ]
            }
            """
        );

        try {
            // Get patient allergies for relationship analysis
            String patientAllergyQuery = "MATCH (p:Patient {patientID: $patientID}) RETURN p.allergies as allergies";
            List<Map<String, Object>> patientResult = graphDB.executeQuery(patientAllergyQuery, Map.of("patientID", patientID));
            String patientAllergies = patientResult.isEmpty() ? "" : (String) patientResult.get(0).getOrDefault("allergies", "");

            String relationshipPromptText = RELATIONSHIP_EXTRACTION_PROMPT.apply(
                Map.of(
                    "symptoms", extractedVisitJson.optJSONArray("Symptoms") != null ? extractedVisitJson.optJSONArray("Symptoms").toString() : "[]",
                    "tests", extractedVisitJson.optJSONArray("GivenTests") != null ? extractedVisitJson.optJSONArray("GivenTests").toString() : "[]",
                    "diagnoses", extractedVisitJson.optJSONArray("Diagnosis") != null ? extractedVisitJson.optJSONArray("Diagnosis").toString() : "[]",
                    "medicines", extractedVisitJson.optJSONArray("PrescribedMedicines") != null ? extractedVisitJson.optJSONArray("PrescribedMedicines").toString() : "[]",
                    "patient_data", String.format("{\"allergies\": \"%s\", \"patientID\": \"%s\"}", patientAllergies, patientID)
                )
            ).text();

            String relationshipsResponse = AiService.generateContent(relationshipPromptText);
            JSONObject relationships = JsonParser.parseJsonToObject(relationshipsResponse);
            log.info("Extracted Relationships: {}", relationships != null ? relationships.toString() : "null");

            // INSERT RELATIONSHIPS INTO NEO4J
            log.info("=== INSERTING RELATIONSHIPS ===");

            if (relationships == null) {
                log.warn("No relationships extracted, skipping relationship insertion.");
                return true;
            }

            // 1. Test Relationships
            try {
                if (!relationships.has("TestRelationships")) {
                    log.debug("No TestRelationships found");
                } else {
                    org.json.JSONArray testRels = relationships.getJSONArray("TestRelationships");
                    for (int i = 0; i < testRels.length(); i++) {
                        org.json.JSONObject rel = testRels.getJSONObject(i);
                        String relationshipType = rel.optString("relationship", "SUPPORTS");
                        String targetType = rel.optString("target_type", "Diagnosis");
                        
                        if ("Diagnosis".equals(targetType)) {
                            String testDiagnosisQuery = String.format("""
                                MATCH (t:Test {test_name: $test})
                                MATCH (d:Diagnosis {name: $target})
                                MERGE (t)-[:%s]->(d)
                            """, relationshipType);
                            graphDB.executeQuery(testDiagnosisQuery, Map.of(
                                "test", rel.optString("test", ""),
                                "target", rel.optString("target", "")
                            ));
                        } else if ("Symptom".equals(targetType)) {
                            String testSymptomQuery = String.format("""
                                MATCH (t:Test {test_name: $test})
                                MATCH (s:Symptom {name: $target})
                                MERGE (t)-[:%s]->(s)
                            """, relationshipType);
                            graphDB.executeQuery(testSymptomQuery, Map.of(
                                "test", rel.optString("test", ""),
                                "target", rel.optString("target", "")
                            ));
                        }
                    }
                    log.info("Test relationships inserted.");
                }
            } catch (Exception e) {
                log.error("Error inserting test relationships: {}", e.getMessage());
            }

            // 2. Symptom Relationships
            try {
                if (!relationships.has("SymptomRelationships")) {
                    log.debug("No SymptomRelationships found");
                } else {
                    org.json.JSONArray symptomRels = relationships.getJSONArray("SymptomRelationships");
                    for (int i = 0; i < symptomRels.length(); i++) {
                        org.json.JSONObject rel = symptomRels.getJSONObject(i);
                        String relationshipType = rel.optString("relationship", "SUGGESTS");
                        
                        String symptomDiagnosisQuery = String.format("""
                            MATCH (s:Symptom {name: $symptom})
                            MATCH (d:Diagnosis {name: $diagnosis})
                            MERGE (s)-[:%s]->(d)
                        """, relationshipType);
                        graphDB.executeQuery(symptomDiagnosisQuery, Map.of(
                            "symptom", rel.optString("symptom", ""),
                            "diagnosis", rel.optString("diagnosis", "")
                        ));
                    }
                    log.info("Symptom relationships inserted.");
                }
            } catch (Exception e) {
                log.error("Error inserting symptom relationships: {}", e.getMessage());
            }

            // 3. Treatment Relationships
            try {
                if (!relationships.has("TreatmentRelationships")) {
                    log.debug("No TreatmentRelationships found");
                } else {
                    org.json.JSONArray treatmentRels = relationships.getJSONArray("TreatmentRelationships");
                    for (int i = 0; i < treatmentRels.length(); i++) {
                        org.json.JSONObject rel = treatmentRels.getJSONObject(i);
                        String relationshipType = rel.optString("relationship", "TREATED_BY");
                        
                        if ("TREATED_BY".equals(relationshipType)) {
                            String treatmentQuery = """
                                MATCH (d:Diagnosis {name: $diagnosis})
                                MATCH (m:Medicine {medicine_name: $medicine})
                                MERGE (d)-[:TREATED_BY]->(m)
                            """;
                            graphDB.executeQuery(treatmentQuery, Map.of(
                                "diagnosis", rel.optString("diagnosis", ""),
                                "medicine", rel.optString("medicine", "")
                            ));
                        } else if ("REQUIRES_FOLLOWUP".equals(relationshipType)) {
                            String followupQuery = """
                                MATCH (d:Diagnosis {name: $diagnosis})
                                MATCH (v:Visit {visitID: $visitID})
                                MERGE (d)-[:REQUIRES_FOLLOWUP]->(v)
                            """;
                            graphDB.executeQuery(followupQuery, Map.of(
                                "diagnosis", rel.optString("diagnosis", ""),
                                "visitID", updatedVisitData.get("visitID")
                            ));
                        }
                    }
                    log.info("Treatment relationships inserted.");
                }
            } catch (Exception e) {
                log.error("Error inserting treatment relationships: {}", e.getMessage());
            }

            // 4. Allergy Relationships
            try {
                if (!relationships.has("AllergyRelationships")) {
                    log.debug("No AllergyRelationships found");
                } else {
                    org.json.JSONArray allergyRels = relationships.getJSONArray("AllergyRelationships");
                    for (int i = 0; i < allergyRels.length(); i++) {
                        org.json.JSONObject rel = allergyRels.getJSONObject(i);
                        
                        String allergyQuery = """
                            MATCH (p:Patient {patientID: $patientID})
                            MATCH (m:Medicine {medicine_name: $medicine})
                            MERGE (p)-[:ALLERGIC_TO]->(m)
                        """;
                        graphDB.executeQuery(allergyQuery, Map.of(
                            "patientID", patientID,
                            "medicine", rel.optString("medicine", "")
                        ));
                    }
                    log.info("Allergy relationships inserted.");
                }
            } catch (Exception e) {
                log.error("Error inserting allergy relationships: {}", e.getMessage());
            }

            // 5. Drug Interactions
            try {
                if (!relationships.has("DrugInteractions")) {
                    log.debug("No DrugInteractions found");
                } else {
                    org.json.JSONArray drugRels = relationships.getJSONArray("DrugInteractions");
                    for (int i = 0; i < drugRels.length(); i++) {
                        org.json.JSONObject rel = drugRels.getJSONObject(i);
                        
                        String interactionQuery = """
                            MATCH (m1:Medicine {medicine_name: $medicine1})
                            MATCH (m2:Medicine {medicine_name: $medicine2})
                            MERGE (m1)-[:INTERACTS_WITH]->(m2)
                            MERGE (m2)-[:INTERACTS_WITH]->(m1)
                        """;
                        graphDB.executeQuery(interactionQuery, Map.of(
                            "medicine1", rel.optString("medicine1", ""),
                            "medicine2", rel.optString("medicine2", "")
                        ));
                    }
                    log.info("Drug interaction relationships inserted.");
                }
            } catch (Exception e) {
                log.error("Error inserting drug interaction relationships: {}", e.getMessage());
            }

            log.info("✅ All relationships successfully processed!");

        } catch (Exception e) {
            log.error("Error in relationship extraction and insertion: {}", e.getMessage());
        }

        return true;
    }


    public String getVisitSummaryLastThree(Long patientID) {
        String cypherQuery = """
            MATCH (p:Patient {patientID: $patientID})-[:HAS_VISIT]->(v:Visit)
            RETURN v.visit_summary as visitSummary, v.date as date
            ORDER BY v.date DESC
            LIMIT 3
        """;
        
        try {
            List<Map<String, Object>> results = graphDB.executeQuery(cypherQuery, Map.of("patientID", patientID));
            
            if (results == null || results.isEmpty()) {
                return "No visits found for patient ID: " + patientID;
            }
            
            StringBuilder concatenatedSummary = new StringBuilder();
            concatenatedSummary.append("Complete Visit History for Patient ").append(patientID).append(": ");
            
            for (int i = 0; i < results.size(); i++) {
                Map<String, Object> visit = results.get(i);
                String visitSummary = (String) visit.getOrDefault("visitSummary", "");
                String date = (String) visit.getOrDefault("date", "");
                
                if (!visitSummary.isEmpty()) {
                    concatenatedSummary.append("Visit on ").append(date).append(": ")
                                    .append(visitSummary);
                    
                    if (i < results.size() - 1) {
                        concatenatedSummary.append(" | "); // Separator between visit summaries
                    }
                }
            }
            
            return concatenatedSummary.toString();
            
        } catch (Exception e) {
            log.error("Error fetching concatenated visit summary for patient {}: {}", patientID, e.getMessage(), e);
            return "Error fetching visit summary for patient ID: " + patientID;
        }
    }


    public String getDoctorAdvice(Long patientID) {
        String cypherQuery = """
            MATCH (p:Patient {patientID: $patientID})-[:HAS_VISIT]->(v:Visit)
            RETURN v.doctor_advice as doctorAdvice, v.date as date
            ORDER BY v.date DESC
            LIMIT 3
        """;
        
        try {
            List<Map<String, Object>> results = graphDB.executeQuery(cypherQuery, Map.of("patientID", patientID));
            
            if (results == null || results.isEmpty()) {
                return "No visits found for patient ID: " + patientID;
            }
            
            StringBuilder concatenatedSummary = new StringBuilder();
            concatenatedSummary.append("Complete Doctor's Advice for Patient ").append(patientID).append(": ");

            for (int i = 0; i < results.size(); i++) {
                Map<String, Object> visit = results.get(i);
                String visitSummary = (String) visit.getOrDefault("doctorAdvice", "");
                String date = (String) visit.getOrDefault("date", "");
                
                if (!visitSummary.isEmpty()) {
                    concatenatedSummary.append("Visit on ").append(date).append(": ")
                                    .append(visitSummary);
                    
                    if (i < results.size() - 1) {
                        concatenatedSummary.append(" | "); // Separator between visit summaries
                    }
                }
            }
            
            return concatenatedSummary.toString();
            
        } catch (Exception e) {
            log.error("Error fetching concatenated visit summary for patient {}: {}", patientID, e.getMessage(), e);
            return "Error fetching visit summary for patient ID: " + patientID;
        }
    }


    public String getPatientSummary(Long patientID) {
        String cypherQuery = """
            MATCH (p:Patient {patientID: $patientID})
            RETURN p.patient_summary as patientSummary
        """;

        try{
            List<Map<String, Object>> results = graphDB.executeQuery(cypherQuery, Map.of("patientID", patientID));
            if (results == null || results.isEmpty()) {
                return "No patient data found.";
            }

            return results.get(0).getOrDefault("patientSummary", "No summary available.").toString();
        } catch (Exception e) {
            log.error("Error fetching patient summary: {}", e.getMessage(), e);
            return "Error fetching patient summary.";
        }
                
    }


    private String getHistorySummary() {
        return "";
    }
}
