package com.example.niramoy.service;

import com.example.niramoy.entity.HealthProfile;
import com.example.niramoy.entity.Medicine;
import com.example.niramoy.repository.MedicineRepository;
import com.example.niramoy.repository.graphDB.GraphDB;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.utils.JsonParser;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.niramoy.dto.VisitContextDTO;
import com.example.niramoy.entity.Visits;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserKGService {
    private final GraphDB graphDB;
    private final AIService AiService;
    private final MedicineRepository medicineRepository;


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


    public boolean saveVisitDetails(Visits visit, Long patientID, Long doctorID, String extractedPrescriptionText) {
        log.info("Saving visit details to Knowledge Graph for visit ID: {}", visit.getVisitId());
        // String extractedPrescriptionText = AiService.getTextFromImageUrl(visit.getPrescriptionFileUrl());
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

        //FIX: DOCTOR SPECIALIZATION NOT CORRECT
        String promptText = SYMPTOMS_AND_SPECIALIZATION_EXTRACTION_PROMPT.apply(
            Map.of("symptoms", visit.getSymptoms())
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
        
        
        Object doctorNameObj = visitData.getOrDefault("doctor_name", "");
        String doctorName = doctorNameObj != null ? doctorNameObj.toString() : "";
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
            log.info("Visit node inserted. VISIT ID {}", updatedVisitData.get("visitID"));
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
            Extract Medications is for different purpose, it is not related to the relationship extraction(frequency in 24 hr format(like "8:00", "22:00")-> must me hr:min format).) if you are unsure about the time, twice a day is ["08:00", "20:00"]. once may be ["08:00"] or ["20:00"]. thrice may be ["08:00", "14:00", "20:00"].
            (default duration= 7 days, dosage means how many you have to take in per take(default 1), type is in Tab,Injection, Syrup, Capsule, Drop etc(default Tab))
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
              ],
              "Medications" : [
                {"medicine_name": "...", "dosage" : "...", "frequency": ["...", "..."], "duration": "...", "instructions": "...", "type": "..."} ]
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
                    "patient_data", String.format("{\"allergies\": \"%s\", \"patientID\": \"%s\"}", patientAllergies, patientID),
                    "medications", extractedVisitJson.optJSONArray("Medications") != null ? extractedVisitJson.optJSONArray("Medications").toString() : "[]"
                )
            ).text();

            String relationshipsResponse = AiService.generateContent(relationshipPromptText);
            JSONObject relationships = JsonParser.parseJsonToObject(relationshipsResponse);
            // log.info("Extracted Relationships: {}", relationships != null ? relationships.toString() : "null");

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
                    JSONArray drugRels = relationships.getJSONArray("DrugInteractions");
                    for (int i = 0; i < drugRels.length(); i++) {
                        JSONObject rel = drugRels.getJSONObject(i);
                        
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

            // 6. Medications Nodes
            try {
                if (!relationships.has("Medications")) {
                    log.debug("No Medications found");
                } else {
                    JSONArray medications = relationships.getJSONArray("Medications");
                    for (int i = 0; i < medications.length(); i++) {
                        JSONObject med = medications.getJSONObject(i);
                        Medicine medicine = Medicine.builder().medicineName(med.optString("medicine_name"))
                            .doses( med.optString("dosage","1")).duration( med.optString("duration","7 days"))
                            .frequency( JsonParser.jsonArrayToList((JSONArray) med.get("frequency"))).instructions(med.optString("instructions"))
                            .type(med.optString("type", "Tablet")).visit(visit).build();
                        log.info("Inserting medication json: {}", med.toString());
                        medicineRepository.save(medicine);
                        log.info("Inserting medicine in db: {}", medicine);
                    }
                    log.info("Medications nodes inserted.");

                }
            } catch (Exception e) {
                log.error("Error inserting medications: {}", e.getMessage());
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

            Object summaryObj = results.get(0).getOrDefault("patientSummary", "No summary available.");
            return summaryObj != null ? summaryObj.toString() : "No summary available.";
        } catch (Exception e) {
            log.error("Error fetching patient summary: {}", e.getMessage(), e);
            return "Error fetching patient summary.";
        }  
    }


    public String getLatestTestNames(Long patientID) {
        String cypherQuery = """
            MATCH (p:Patient {patientID: $patientID})-[:HAS_VISIT]->(v:Visit)
            WITH v
            ORDER BY v.date DESC
            LIMIT 1
            MATCH (v)-[ht:HAS_TEST]->(t:Test)
            RETURN t.test_name as testName, t.test_report_summary as testReportSummary, t.test_report_severity as testReportSeverity
        """;

        try{
            List<Map<String, Object>> results = graphDB.executeQuery(cypherQuery, Map.of("patientID", patientID));
            if (results == null || results.isEmpty()) {
                return "No patient data found.";
            }

            StringBuilder testNames = new StringBuilder("Latest Test Names for Patient " + patientID + ":\n");
            for (Map<String, Object> result : results) {
                Object testNameObj = result.getOrDefault("testName", "Unknown Test");
                String testName = testNameObj != null ? testNameObj.toString() : "Unknown Test";
                testNames.append("- ").append(testName).append("\n");
            }
            return testNames.toString();
        } catch (Exception e) {
            log.error("Error fetching patient summary: {}", e.getMessage(), e);
            return "Error fetching patient summary.";
        } 
    }


    public String getHistorySummary(Long patientID) {
        return "";
    }

    public boolean createPatientDuringSignup(Long patientID, String name) {
        log.info("Creating patient in Knowledge Graph during signup with ID: {}", patientID);

        try {
            String createPatientQuery = """
                MERGE (p:Patient {patientID: $patientID})
                SET p.name = $name,
                    p.created_date = $createdDate
                RETURN p
            """;

            Map<String, Object> patientData = new HashMap<>();
            patientData.put("patientID", patientID);
            patientData.put("name", name != null ? name : "");
            patientData.put("createdDate", java.time.LocalDateTime.now().toString());

            List<Map<String, Object>> result = graphDB.executeQuery(createPatientQuery, patientData);

            if (!result.isEmpty()) {
                log.info("Successfully created patient with ID: {} in Knowledge Graph", patientID);
                return true;
            } else {
                log.error("Failed to create patient with ID: {} in Knowledge Graph", patientID);
                return false;
            }
        } catch (Exception e) {
            log.error("Error creating patient with ID {}: {}", patientID, e.getMessage());
            return false;
        }
    }

    public boolean createOrUpdatePatient(Long patientID, String name, String gender, Integer age, 
                                  Double weight, Double height, String bloodType, 
                                  String allergies, String chronicDiseases, String lifestyle, 
                                  String majorEvents) {
        log.info("Creating or updating patient in Knowledge Graph with ID: {}", patientID);

        try {
            // First check if patient already exists
            String checkQuery = "MATCH (p:Patient {patientID: $patientID}) RETURN p";
            List<Map<String, Object>> existingPatient = graphDB.executeQuery(checkQuery, Map.of("patientID", patientID));
            
            if (!existingPatient.isEmpty()) {
                log.info("Patient with ID {} already exists in Knowledge Graph - will update existing record", patientID);
            }
            
            // Generate patient summary using AI
            final PromptTemplate PATIENT_SUMMARY_PROMPT = PromptTemplate.from(
                """
                Create a comprehensive medical summary for the following patient data:
                Name: {name}
                Age: {age}
                Gender: {gender}
                Weight: {weight} kg
                Height: {height} cm
                Blood Type: {bloodType}
                Allergies: {allergies}
                Chronic Diseases: {chronicDiseases}
                Lifestyle: {lifestyle}
                Major Events: {majorEvents}
                
                Provide a concise medical summary (max 200 words) that would be useful for healthcare professionals.
                Return JSON ONLY like this: {"patient_summary": "..."}
                """
            );
            
            Map<String, Object> summaryVariables = new java.util.HashMap<>();
            summaryVariables.put("name", name != null ? name : "");
            summaryVariables.put("age", age != null ? age.toString() : "Unknown");
            summaryVariables.put("gender", gender != null ? gender : "");
            summaryVariables.put("weight", weight != null ? weight.toString() : "Unknown");
            summaryVariables.put("height", height != null ? height.toString() : "Unknown");
            summaryVariables.put("bloodType", bloodType != null ? bloodType : "");
            summaryVariables.put("allergies", allergies != null ? allergies : "");
            summaryVariables.put("chronicDiseases", chronicDiseases != null ? chronicDiseases : "");
            summaryVariables.put("lifestyle", lifestyle != null ? lifestyle : "");
            summaryVariables.put("majorEvents", majorEvents != null ? majorEvents : "");
            
            Prompt summaryPrompt = PATIENT_SUMMARY_PROMPT.apply(summaryVariables);
            String summaryResponse = AiService.generateContent(summaryPrompt.text());
            String patientSummary = JsonParser.parseJsonField(summaryResponse, "patient_summary");
            
            // Create patient node in Neo4j
            String createPatientQuery = """
                MERGE (p:Patient {patientID: $patientID})
                SET
                    p.name = $name,
                    p.gender = $gender,
                    p.age = $age,
                    p.weight = $weight,
                    p.height = $height,
                    p.bloodType = $bloodType,
                    p.allergies = $allergies,
                    p.chronic_diseases = $chronicDiseases,
                    p.lifestyle = $lifestyle,
                    p.major_events = $majorEvents,
                    p.patient_summary = $patientSummary,
                    p.created_date = $createdDate
                RETURN p
            """;
            
            Map<String, Object> patientData = new HashMap<>();
            patientData.put("patientID", patientID);
            patientData.put("name", name != null ? name : "");
            patientData.put("gender", gender != null ? gender : "");
            patientData.put("age", age != null ? age : 0);
            patientData.put("weight", weight != null ? weight : 0.0);
            patientData.put("height", height != null ? height : 0.0);
            patientData.put("bloodType", bloodType != null ? bloodType : "");
            patientData.put("allergies", allergies != null ? allergies : "");
            patientData.put("chronicDiseases", chronicDiseases != null ? chronicDiseases : "");
            patientData.put("lifestyle", lifestyle != null ? lifestyle : "");
            patientData.put("majorEvents", majorEvents != null ? majorEvents : "");
            patientData.put("patientSummary", patientSummary != null ? patientSummary : "");
            patientData.put("createdDate", java.time.LocalDateTime.now().toString());
            
            List<Map<String, Object>> result = graphDB.executeQuery(createPatientQuery, patientData);
            
            if (!result.isEmpty()) {
                log.info("Successfully created patient with ID: {} in Knowledge Graph", patientID);
                
                // Create chronic disease nodes and relationships if chronic diseases exist
                if (chronicDiseases != null && !chronicDiseases.trim().isEmpty()) {
                    String[] diseases = chronicDiseases.split(",");
                    for (String disease : diseases) {
                        String trimmedDisease = disease.trim();
                        if (!trimmedDisease.isEmpty()) {
                            String diseaseQuery = """
                                MATCH (p:Patient {patientID: $patientID})
                                MERGE (cd:ChronicDisease {name: $diseaseName})
                                MERGE (p)-[:HAS_CHRONIC_DISEASE]->(cd)
                            """;
                            graphDB.executeQuery(diseaseQuery, Map.of(
                                "patientID", patientID,
                                "diseaseName", trimmedDisease
                            ));
                        }
                    }
                    log.info("Created chronic disease relationships for patient: {}", patientID);
                }
                
                // Create allergy nodes and relationships if allergies exist
                if (allergies != null && !allergies.trim().isEmpty()) {
                    String[] allergyList = allergies.split(",");
                    for (String allergy : allergyList) {
                        String trimmedAllergy = allergy.trim();
                        if (!trimmedAllergy.isEmpty()) {
                            String allergyQuery = """
                                MATCH (p:Patient {patientID: $patientID})
                                MERGE (a:Allergy {name: $allergyName})
                                MERGE (p)-[:HAS_ALLERGY]->(a)
                            """;
                            graphDB.executeQuery(allergyQuery, Map.of(
                                "patientID", patientID,
                                "allergyName", trimmedAllergy
                            ));
                        }
                    }
                    log.info("Created allergy relationships for patient: {}", patientID);
                }
                
                return true;
            } else {
                log.error("Failed to create patient with ID: {} in Knowledge Graph", patientID);
                return false;
            }
            
        } catch (Exception e) {
            log.error("Error creating patient with ID {}: {}", patientID, e.getMessage(), e);
            return false;
        }
    }


    public VisitContextDTO getVisitContextByID(Long visitID) {
        log.info("Fetching visit context from Knowledge Graph for visit ID: {}", visitID);

        // visitID = Long.valueOf(5);
        String cypherQuery = """
            MATCH (v:Visit {visitID: $visitID})
            OPTIONAL MATCH (v)-[:HAS_SYMPTOM]->(symptom)
            OPTIONAL MATCH (v)-[:HAS_DIAGNOSIS]->(diagnosis)
            OPTIONAL MATCH (v)-[:HAS_MEDICINE]->(medicine)
            RETURN 
                v.visitID as visitID,
                v.doctor_name as doctorName,
                v.date as date,
                v.visit_summary as visitSummary,
                v.visit_type as visitType,
                v.doctor_advice as doctorAdvice,
                v.specialization as specialization,
                v.doctorID as doctorID,
                collect(DISTINCT symptom.name) AS symptoms,
                collect(DISTINCT diagnosis.name) AS diagnoses,
                collect(DISTINCT medicine.medicine_name + ' - ' + medicine.dosage_and_duration) AS medicines
        """;

        try {
            List<Map<String, Object>> results = graphDB.executeQuery(cypherQuery, 
                Map.of("visitID", visitID));
            
            if (results == null || results.isEmpty()) {
                log.warn("No visit found with ID: {}", visitID);
                return null;
            }

            Map<String, Object> result = results.get(0);
            
            // Extract symptoms list
            @SuppressWarnings("unchecked")
            List<String> symptoms = (List<String>) result.getOrDefault("symptoms", new ArrayList<>());
            symptoms = symptoms.stream()
                .filter(s -> s != null && !s.isEmpty())
                .collect(Collectors.toList());
            
            // Extract diagnoses list
            @SuppressWarnings("unchecked")
            List<String> diagnoses = (List<String>) result.getOrDefault("diagnoses", new ArrayList<>());
            diagnoses = diagnoses.stream()
                .filter(d -> d != null && !d.isEmpty())
                .collect(Collectors.toList());
            
            // Extract medicines/prescription list
            @SuppressWarnings("unchecked")
            List<String> medicines = (List<String>) result.getOrDefault("medicines", new ArrayList<>());
            medicines = medicines.stream()
                .filter(m -> m != null && !m.isEmpty())
                .collect(Collectors.toList());
            
            // Build otherInfo map
            Map<String, Object> otherInfo = new HashMap<>();
            if (result.containsKey("visitType") && result.get("visitType") != null) {
                otherInfo.put("visitType", result.get("visitType"));
            }
            if (result.containsKey("doctorAdvice") && result.get("doctorAdvice") != null) {
                otherInfo.put("doctorAdvice", result.get("doctorAdvice"));
            }
            if (result.containsKey("specialization") && result.get("specialization") != null) {
                otherInfo.put("specialization", result.get("specialization"));
            }
            if (result.containsKey("doctorID") && result.get("doctorID") != null) {
                otherInfo.put("doctorID", result.get("doctorID"));
            }
            
            // Build VisitContextDTO
            VisitContextDTO visitContext = VisitContextDTO.builder()
                .visitId(visitID)
                .doctorName((String) result.getOrDefault("doctorName", "Unknown Doctor"))
                .appointmentDate((String) result.getOrDefault("date", ""))
                .diagnosis(diagnoses.isEmpty() ? null : String.join(", ", diagnoses))
                .symptoms(symptoms.isEmpty() ? null : symptoms)
                .prescription(medicines.isEmpty() ? null : medicines)
                .summary((String) result.getOrDefault("visitSummary", ""))
                .otherInfo(otherInfo)
                .build();
            
            log.info("Successfully fetched visit context for visit ID: {}", visitID);
            return visitContext;
            
        } catch (Exception e) {
            log.error("Error fetching visit context for visit ID {}: {}", visitID, e.getMessage(), e);
            return null;
        }
    }


    public String getMedicalSummary(Long patientID) {
       String cypherQuery = """
          MATCH (p:Patient {patientID: $patientID})
          OPTIONAL MATCH (p)-[:HAS_VISIT]->(v:Visit)
          WITH p, v
          ORDER BY v.date DESC
          WITH p, collect({ visit_summary: v.visit_summary, visit_date: v.date })[0..3] AS last_five_visits
          OPTIONAL MATCH (d:Diagnosis)-[:TREATED_BY]->(med:Medicine)
          WITH p, last_five_visits,
              collect(DISTINCT CASE WHEN d IS NULL OR med IS NULL THEN NULL ELSE { diagnosis: d.name, medicine_name: med.medicine_name } END) AS raw_treatments
          WITH p, last_five_visits, [t IN raw_treatments WHERE t IS NOT NULL][0..10] AS treatments
          RETURN
             p.name AS patient_name,
             p.allergies AS allergies,
             p.chronic_diseases AS chronic_diseases,
             last_five_visits,
             treatments
       """;

        try {
            List<Map<String, Object>> results = graphDB.executeQuery(cypherQuery, Map.of("patientID", patientID));
            if (results == null || results.isEmpty()) {
                log.warn("No medical summary found for patient {}", patientID);
                return "No medical summary found.";
            }

            Map<String, Object> row = results.get(0);
            Map<String, Object> summary = new HashMap<>();
            summary.put("patient_name", row.getOrDefault("patient_name", ""));
            summary.put("allergies", row.getOrDefault("allergies", ""));
            summary.put("chronic_diseases", row.getOrDefault("chronic_diseases", ""));
            summary.put("last_five_visits", row.getOrDefault("last_five_visits", List.of()));
            summary.put("treatments", row.getOrDefault("treatments", List.of()));
            String medicalSummary = "Patient Name: " + summary.get("patient_name").toString() + "\n" +
                                "Allergies: " + summary.get("allergies").toString() + "\n" +
                                "Chronic Diseases: " + summary.get("chronic_diseases").toString() + "\n" +
                                "Last Five Visits: " + summary.get("last_five_visits").toString() + "\n" +
                                "Treatments: " + summary.get("treatments").toString();
            // log.info("Medical Summary for patient {}: \n{}", patientID, medicalSummary);
            return medicalSummary;
        } catch (Exception e) {
            log.error("Error fetching medical summary for patient {}: {}", patientID, e.getMessage(), e);
            return "Error fetching medical summary.";
        }   
    }


}

