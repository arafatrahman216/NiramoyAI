package com.example.niramoy.utils;

import com.example.niramoy.dto.HealthLogRecord;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

// FIXME : DELEte extra fucntions
@RequiredArgsConstructor
public class JsonParser {

    private static String cleanJsonResponse(String jsonResponse) {
        if (jsonResponse == null || jsonResponse.isEmpty()) {
            return null;
        }
        
        jsonResponse = jsonResponse.trim();
        if (jsonResponse.startsWith("```json")) {
            jsonResponse = jsonResponse.substring(7).trim();
        }
        if (jsonResponse.endsWith("```")) {
            jsonResponse = jsonResponse.substring(0, jsonResponse.length() - 3).trim();
        }
        
        return jsonResponse;
    }
    
    public static String parseExplanation(String jsonResponse) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return "No explanation available.";
        }

        try {
            JSONObject json = new JSONObject(cleanedResponse);
            return json.optString("Explanation", "No explanation available.");
        } catch (Exception e) {
            return "Error parsing explanation: " + e.getMessage();
        }
    }

    public static JSONObject parseExplanationJson(String jsonResponse) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return null;
        }

        try {
            JSONObject json = new JSONObject(cleanedResponse);
            if (json.has("Explanation")) {
                Object explanation = json.get("Explanation");
                return new JSONObject().put("Explanation", explanation);
            } else {
                return new JSONObject().put("Explanation", "No explanation available.");
            }
        } catch (Exception e) {
            return new JSONObject().put("Explanation", "Error parsing explanation: " + e.getMessage());
        }
    }
    
    public static String parsePlan(String jsonResponse) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return "No plan available.";
        }

        try {
            JSONObject json = new JSONObject(cleanedResponse);
            return json.optString("Plan", "No plan available.");
        } catch (Exception e) {
            return "Error parsing plan: " + e.getMessage();
        }
    }

    public static JSONObject parsePlanJson(String jsonResponse) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return null;
        }

        try {
            JSONObject json = new JSONObject(cleanedResponse);
            JSONObject result = new JSONObject();
            
            if (json.has("Plan")) {
                Object plan = json.get("Plan");
                result.put("Plan", plan);
            } else {
                result.put("Plan", "No plan available.");
            }
            
            // Preserve the is_plan field if it exists
            if (json.has("is_plan")) {
                result.put("is_plan", json.getBoolean("is_plan"));
            } else {
                result.put("is_plan", false);
            }
            
            // Preserve the Explanation field if it exists
            if (json.has("Explanation")) {
                result.put("Explanation", json.getString("Explanation"));
            }
            
            return result;
        } catch (Exception e) {
            JSONObject errorResult = new JSONObject();
            errorResult.put("Plan", "Error parsing plan: " + e.getMessage());
            errorResult.put("is_plan", false);
            errorResult.put("Explanation", "Error parsing explanation: " + e.getMessage());
            return errorResult;
        }
    }

    public static String parseAnswer(String jsonResponse) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return "No answer available.";
        }

        try {
            JSONObject json = new JSONObject(cleanedResponse);
            return json.optString("Answer", "No answer available.");
        } catch (Exception e) {
            return "Error parsing answer: " + e.getMessage();
        }
    }

    public static JSONObject parseAnswerJson(String jsonResponse) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return null;
        }

        try {
            JSONObject json = new JSONObject(cleanedResponse);
            if (json.has("Answer")) {
                Object answer = json.get("Answer");
                return new JSONObject().put("Answer", answer);
            } else {
                return new JSONObject().put("Answer", "No answer available.");
            }
        } catch (Exception e) {
            return new JSONObject().put("Answer", "Error parsing answer: " + e.getMessage());
        }
    }
    
    public static String parseConsultation(String jsonResponse) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return "No consultation available.";
        }

        try {
            JSONObject json = new JSONObject(cleanedResponse);
            return json.optString("Consultation", "No consultation available.");
        } catch (Exception e) {
            return "Error parsing consultation: " + e.getMessage();
        }
    }

    public static JSONObject parseConsultationJson(String jsonResponse) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return null;
        }

        try {
            JSONObject json = new JSONObject(cleanedResponse);
            if (json.has("Consultation")) {
                Object consultation = json.get("Consultation");
                return new JSONObject().put("Consultation", consultation);
            } else {
                return new JSONObject().put("Consultation", "No consultation available.");
            }
        } catch (Exception e) {
            return new JSONObject().put("Consultation", "Error parsing consultation: " + e.getMessage());
        }
    }

    // Generic parser that tries to extract the main content regardless of the key
    public static String parseResponse(String jsonResponse, String mode) {
        if (mode == null) {
            mode = "explain";
        }
        
        switch (mode.toLowerCase()) {
            case "explain":
                return parseExplanation(jsonResponse);
            case "plan":
            case "planner":
                return parsePlan(jsonResponse);
            case "qna":
            case "q&a":
            case "question":
                return parseAnswer(jsonResponse);
            case "consult":
            case "consultation":
                return parseConsultation(jsonResponse);
            default:
                return parseExplanation(jsonResponse);
        }
    }

    public static JSONObject parseResponseJson(String jsonResponse, String mode) {
        if (mode == null) {
            mode = "explain";
        }
        
        switch (mode.toLowerCase()) {
            case "explain":
                return parseExplanationJson(jsonResponse);
            case "plan":
            case "planner":
                return parsePlanJson(jsonResponse);
            case "qna":
            case "q&a":
            case "question":
                return parseAnswerJson(jsonResponse);
            case "consult":
            case "consultation":
                return parseConsultationJson(jsonResponse);
            default:
                return parseExplanationJson(jsonResponse);
        }
    }

    public static HealthLogRecord parseHealthLog(String geminiResponse) {
        try {
            HealthLogRecord healthLogRecord = new ObjectMapper().readValue(geminiResponse, HealthLogRecord.class);
            return healthLogRecord;
        }
        catch (Exception e) {
            return HealthLogRecord.builder().temperature("98.6").bloodSugar("6").diastolicBloodPressure("80")
                    .systolicBloodPressure("120").stressLevel("0").heartRate("72").oxygenSaturation("100").
                    otherSymptoms(new ArrayList<>()).note("")
                    .weight("").build();
        }
    }

    // Generic LLM json answer to json Object conversion    
    public static JSONObject parseJsonToObject(String jsonResponse) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return null;
        }

        JSONObject json = new JSONObject(cleanedResponse);
        return json;
    }

    // Generic method to parse any field from JSON response
    public static String parseJsonField(String jsonResponse, String fieldName) {
        String cleanedResponse = cleanJsonResponse(jsonResponse);
        if (cleanedResponse == null) {
            return "";
        }

        try {
            JSONObject json = new JSONObject(cleanedResponse);
            return json.optString(fieldName, "");
        } catch (Exception e) {
            return "";
        }
    }

    // Parse symptoms from JSON response into a List<String>
    public static List<String> parseSymptomsList(JSONObject jsonObject) {
        if (jsonObject == null || !jsonObject.has("Symptoms")) {
            return Collections.emptyList();
        }

        try {
            Object symptomsObj = jsonObject.get("Symptoms");
            if (symptomsObj instanceof String) {
                String symptomsStr = (String) symptomsObj;
                return List.of(symptomsStr.split(","))
                    .stream().map(String::trim).filter(s -> !s.isEmpty()).toList();
            } else if (symptomsObj instanceof org.json.JSONArray) {
                org.json.JSONArray arr = (org.json.JSONArray) symptomsObj;
                return arr.toList().stream()
                    .map(Object::toString).map(String::trim).filter(s -> !s.isEmpty()).toList();
            } else {
                return Collections.emptyList();
            }
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    // Parse diagnosis from JSON response into a List<String>
    public static List<String> parseDiagnosisList(JSONObject jsonObject) {
        if (jsonObject == null || !jsonObject.has("Diagnosis")) {
            return Collections.emptyList();
        }

        try {
            Object diagnosisObj = jsonObject.get("Diagnosis");
            if (diagnosisObj instanceof String) {
                String diagnosisStr = (String) diagnosisObj;
                return List.of(diagnosisStr.split(","))
                    .stream().map(String::trim).filter(s -> !s.isEmpty()).toList();
            } else if (diagnosisObj instanceof org.json.JSONArray) {
                org.json.JSONArray arr = (org.json.JSONArray) diagnosisObj;
                return arr.toList().stream()
                    .map(Object::toString).map(String::trim).filter(s -> !s.isEmpty()).toList();
            } else {
                return Collections.emptyList();
            }
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    // Parse prescribed medicines from JSON response
    public static List<Map<String, String>> parsePrescribedMedicines(JSONObject jsonObject) {
        if (jsonObject == null || !jsonObject.has("PrescribedMedicines")) {
            return Collections.emptyList();
        }

        try {
            org.json.JSONArray medicinesArray = jsonObject.getJSONArray("PrescribedMedicines");
            List<Map<String, String>> medicinesList = new ArrayList<>();
            
            for (int i = 0; i < medicinesArray.length(); i++) {
                org.json.JSONObject medObj = medicinesArray.getJSONObject(i);
                Map<String, String> medicine = Map.of(
                    "medicine_name", medObj.optString("medicine_name", ""),
                    "dosage_and_duration", medObj.optString("dosage_and_duration", "")
                );
                medicinesList.add(medicine);
            }
            return medicinesList;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    // Parse given tests from JSON response
    public static List<Map<String, String>> parseGivenTests(JSONObject jsonObject) {
        if (jsonObject == null || !jsonObject.has("GivenTests")) {
            return Collections.emptyList();
        }

        try {
            org.json.JSONArray testsArray = jsonObject.getJSONArray("GivenTests");
            List<Map<String, String>> testsList = new ArrayList<>();
            
            for (int i = 0; i < testsArray.length(); i++) {
                org.json.JSONObject testObj = testsArray.getJSONObject(i);
                Map<String, String> test = Map.of(
                    "test_name", testObj.optString("test_name", ""),
                    "test_report_summary", testObj.optString("test_report_summary", ""),
                    "test_report_severity", testObj.optString("test_report_severity", "")
                );
                testsList.add(test);
            }
            return testsList;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
