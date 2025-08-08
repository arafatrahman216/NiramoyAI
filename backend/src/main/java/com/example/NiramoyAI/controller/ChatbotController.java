package com.example.NiramoyAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @PostMapping("/message")
    public ResponseEntity<Map<String, Object>> processMessage(@RequestBody Map<String, String> request) {
        try {
            String userMessage = request.get("message");
            if (userMessage == null || userMessage.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Message cannot be empty");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Simulate AI response based on keywords
            String botResponse = generateResponse(userMessage.toLowerCase());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", botResponse);
            response.put("timestamp", new Date());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error processing message: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/greet")
    public ResponseEntity<Map<String, Object>> getGreeting() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Hello! I'm NiramoyAI, your healthcare assistant. How can I help you today?");
        response.put("timestamp", new Date());
        return ResponseEntity.ok(response);
    }

    private String generateResponse(String message) {
        // Healthcare-related responses
        if (message.contains("symptom") || message.contains("pain") || message.contains("headache") || 
            message.contains("fever") || message.contains("cough") || message.contains("cold")) {
            return "I understand you're experiencing symptoms. While I can provide general information, it's important to consult with a qualified doctor for proper diagnosis and treatment. Would you like me to help you find a doctor in your area?";
        }
        
        if (message.contains("doctor") || message.contains("physician") || message.contains("specialist")) {
            return "I can help you find qualified doctors in various specialties. You can search for doctors by specialty, location, or name using our doctor finder. Would you like me to show you available doctors in a specific specialty?";
        }
        
        if (message.contains("appointment") || message.contains("booking") || message.contains("schedule")) {
            return "To book an appointment, you'll need to contact the doctor's office directly or use their online booking system. I can help you find doctors and their contact information. Would you like me to search for doctors in your area?";
        }
        
        if (message.contains("medicine") || message.contains("medication") || message.contains("drug")) {
            return "For medication-related questions, please consult with a pharmacist or your doctor. They can provide accurate information about dosages, interactions, and side effects. Never take medications without proper medical supervision.";
        }
        
        if (message.contains("emergency") || message.contains("urgent") || message.contains("serious")) {
            return "⚠️ If this is a medical emergency, please call emergency services immediately (999 in Bangladesh) or go to the nearest hospital emergency room. For urgent but non-emergency medical issues, consider visiting an urgent care center.";
        }
        
        if (message.contains("test") || message.contains("lab") || message.contains("blood test") || 
            message.contains("x-ray") || message.contains("scan")) {
            return "Medical tests should be ordered and interpreted by qualified healthcare professionals. I can help you find test centers and laboratories in your area. Would you like me to show you nearby diagnostic centers?";
        }
        
        if (message.contains("hospital") || message.contains("clinic")) {
            return "I can help you find hospitals and clinics in your area. Our database includes information about various healthcare facilities, their specialties, and contact details. Would you like me to search for healthcare facilities near you?";
        }
        
        if (message.contains("cost") || message.contains("price") || message.contains("expensive") || 
            message.contains("affordable")) {
            return "Healthcare costs can vary significantly. I recommend contacting the healthcare providers directly for accurate pricing information. Many facilities offer payment plans or accept insurance. Would you like help finding affordable healthcare options?";
        }
        
        if (message.contains("insurance") || message.contains("coverage")) {
            return "Insurance coverage varies by provider and plan. I recommend contacting your insurance company directly to understand your coverage. Many doctors and hospitals can also help verify your insurance benefits.";
        }
        
        if (message.contains("hello") || message.contains("hi") || message.contains("hey")) {
            return "Hello! I'm NiramoyAI, your healthcare assistant. I can help you find doctors, healthcare facilities, and provide general health information. How can I assist you today?";
        }
        
        if (message.contains("thank") || message.contains("thanks")) {
            return "You're welcome! I'm here to help with your healthcare needs. If you have any more questions about finding doctors or healthcare services, feel free to ask!";
        }
        
        if (message.contains("help") || message.contains("what can you do")) {
            return "I can help you with:\n\n• Finding doctors by specialty or location\n• Locating healthcare facilities and test centers\n• General health information\n• Emergency contact guidance\n• Healthcare resources in Bangladesh\n\nWhat would you like assistance with?";
        }
        
        // Default response for unrecognized queries
        return "I'm here to help with your healthcare needs! I can assist you with finding doctors, healthcare facilities, and general health information. Could you please be more specific about what you're looking for? For example, you can ask about finding a cardiologist, or about symptoms you're experiencing.";
    }
}
