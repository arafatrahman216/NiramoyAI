package com.example.niramoy.utils;

import org.json.JSONObject;

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
}
