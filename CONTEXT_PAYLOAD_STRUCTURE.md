# Context Payload Structure for Backend

## Overview
The frontend now sends **previous messages** and **visit context** as **separate attributes** in the payload, not embedded in the message text.

---

## 1. Regular Message (JSON Payload)

**Endpoint:** `POST /user/chat`

**Content-Type:** `application/json`

### Payload Structure:

```json
{
  "message": "What should I do about my allergies?",
  "chatId": "12345",
  "mode": "explain",
  "previousMessages": [
    {
      "role": "user",
      "content": "I have been feeling tired lately"
    },
    {
      "role": "user",
      "content": "My blood pressure was high yesterday"
    }
  ],
  "visitContext": {
    "visitId": 5,
    "doctorName": "Dr. Sarah Johnson",
    "appointmentDate": "2024-11-15",
    "diagnosis": "Seasonal Allergic Rhinitis",
    "symptoms": ["Sneezing", "Runny nose", "Itchy eyes", "Nasal congestion"],
    "prescription": [
      "Cetirizine 10mg - Once daily",
      "Fluticasone nasal spray - Twice daily"
    ],
    "summary": "Patient presented with seasonal allergy symptoms...",
    "otherInfo": {
      "visitType": "Routine",
      "doctorAdvice": "Avoid known allergens...",
      "specialization": "Allergist",
      "doctorID": "789"
    }
  }
}
```

---

## 2. Message with Attachment (FormData)

**Endpoint:** `POST /user/chat-attachment`

**Content-Type:** `multipart/form-data`

### FormData Fields:

```javascript
{
  message: "What should I do about my allergies?",
  chatId: "12345",
  mode: "explain",
  attachment: <File Object>,
  previousMessages: "[{\"role\":\"user\",\"content\":\"I have been feeling tired lately\"},{\"role\":\"user\",\"content\":\"My blood pressure was high yesterday\"}]",
  visitContext: "{\"visitId\":5,\"doctorName\":\"Dr. Sarah Johnson\",\"appointmentDate\":\"2024-11-15\",\"diagnosis\":\"Seasonal Allergic Rhinitis\",\"symptoms\":[\"Sneezing\",\"Runny nose\",\"Itchy eyes\",\"Nasal congestion\"],\"prescription\":[\"Cetirizine 10mg - Once daily\",\"Fluticasone nasal spray - Twice daily\"],\"summary\":\"Patient presented with seasonal allergy symptoms...\",\"otherInfo\":{\"visitType\":\"Routine\",\"doctorAdvice\":\"Avoid known allergens...\",\"specialization\":\"Allergist\",\"doctorID\":\"789\"}}"
}
```

**Note:** `previousMessages` and `visitContext` are sent as **JSON strings** in FormData.

---

## 3. Backend Implementation Guide

### Java DTO for Regular Message:

```java
@Data
public class ChatRequestDTO {
    private String message;
    private String chatId;
    private String mode;
    
    // New fields for context
    private List<MessageContext> previousMessages;
    private VisitContextDTO visitContext;
}

@Data
public class MessageContext {
    private String role;
    private String content;
}

// VisitContextDTO already exists in your codebase
```

### Controller Example:

```java
@PostMapping("/chat")
public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody ChatRequestDTO request) {
    String message = request.getMessage();
    String chatId = request.getChatId();
    String mode = request.getMode();
    
    // Access context data
    List<MessageContext> previousMessages = request.getPreviousMessages();
    VisitContextDTO visitContext = request.getVisitContext();
    
    // Build context for LLM
    String contextPrompt = buildContextPrompt(previousMessages, visitContext);
    String fullPrompt = contextPrompt + "\n\nUser Query: " + message;
    
    // Send to LLM...
}

private String buildContextPrompt(List<MessageContext> previousMessages, VisitContextDTO visitContext) {
    StringBuilder prompt = new StringBuilder();
    
    // Add previous conversation context
    if (previousMessages != null && !previousMessages.isEmpty()) {
        prompt.append("Previous conversation:\n");
        for (MessageContext msg : previousMessages) {
            prompt.append(msg.getRole().toUpperCase())
                  .append(": ")
                  .append(msg.getContent())
                  .append("\n");
        }
        prompt.append("\n");
    }
    
    // Add visit context
    if (visitContext != null) {
        prompt.append("Relevant Visit Information:\n");
        prompt.append("Visit ID: ").append(visitContext.getVisitId()).append("\n");
        prompt.append("Doctor: ").append(visitContext.getDoctorName()).append("\n");
        prompt.append("Date: ").append(visitContext.getAppointmentDate()).append("\n");
        
        if (visitContext.getDiagnosis() != null) {
            prompt.append("Diagnosis: ").append(visitContext.getDiagnosis()).append("\n");
        }
        
        if (visitContext.getSymptoms() != null && !visitContext.getSymptoms().isEmpty()) {
            prompt.append("Symptoms: ").append(String.join(", ", visitContext.getSymptoms())).append("\n");
        }
        
        if (visitContext.getPrescription() != null && !visitContext.getPrescription().isEmpty()) {
            prompt.append("Prescription: ").append(String.join(", ", visitContext.getPrescription())).append("\n");
        }
        
        if (visitContext.getSummary() != null) {
            prompt.append("Summary: ").append(visitContext.getSummary()).append("\n");
        }
        
        prompt.append("\n");
    }
    
    return prompt.toString();
}
```

### For Attachment Endpoint:

```java
@PostMapping("/chat-attachment")
public ResponseEntity<Map<String, Object>> sendMessageWithAttachment(
    @RequestParam("message") String message,
    @RequestParam("chatId") String chatId,
    @RequestParam("mode") String mode,
    @RequestParam(value = "attachment", required = false) MultipartFile attachment,
    @RequestParam(value = "previousMessages", required = false) String previousMessagesJson,
    @RequestParam(value = "visitContext", required = false) String visitContextJson
) throws JsonProcessingException {
    
    // Parse JSON strings
    ObjectMapper mapper = new ObjectMapper();
    
    List<MessageContext> previousMessages = null;
    if (previousMessagesJson != null && !previousMessagesJson.isEmpty()) {
        previousMessages = mapper.readValue(
            previousMessagesJson, 
            new TypeReference<List<MessageContext>>() {}
        );
    }
    
    VisitContextDTO visitContext = null;
    if (visitContextJson != null && !visitContextJson.isEmpty()) {
        visitContext = mapper.readValue(visitContextJson, VisitContextDTO.class);
    }
    
    // Build context and process...
    String contextPrompt = buildContextPrompt(previousMessages, visitContext);
    
    // Process attachment and send to LLM...
}
```

---

## 4. Example Request Flow

### Frontend Code:
```javascript
const contextData = {
  previousMessages: [
    { role: 'user', content: 'I feel tired' },
    { role: 'user', content: 'My BP was high' }
  ],
  visitContext: {
    visitId: 5,
    doctorName: 'Dr. Sarah Johnson',
    diagnosis: 'Seasonal Allergic Rhinitis',
    symptoms: ['Sneezing', 'Runny nose'],
    summary: 'Patient presented with seasonal allergy symptoms...'
  }
};

await chatbotAPI.sendMessage(
  'What should I do about my allergies?',
  chatId,
  'explain',
  contextData
);
```

### Backend Receives:
```json
{
  "message": "What should I do about my allergies?",
  "chatId": "12345",
  "mode": "explain",
  "previousMessages": [...],
  "visitContext": {...}
}
```

### LLM Receives (after processing):
```
Previous conversation:
USER: I feel tired
USER: My BP was high

Relevant Visit Information:
Visit ID: 5
Doctor: Dr. Sarah Johnson
Date: 2024-11-15
Diagnosis: Seasonal Allergic Rhinitis
Symptoms: Sneezing, Runny nose
Summary: Patient presented with seasonal allergy symptoms...

User Query: What should I do about my allergies?
```

---

## 5. Benefits of This Approach

✅ **Clean separation of concerns** - Message, context, and metadata are separate
✅ **Easier backend processing** - Structured data instead of parsing text
✅ **Better LLM prompts** - You control exactly how context is formatted
✅ **Type safety** - DTOs ensure data integrity
✅ **Flexible** - Easy to add/remove context fields
✅ **Debuggable** - Clear visibility of what context is being sent

---

## 6. Testing

### Test without context:
```bash
curl -X POST http://localhost:8080/api/user/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "message": "Hello",
    "chatId": "123",
    "mode": "explain"
  }'
```

### Test with full context:
```bash
curl -X POST http://localhost:8080/api/user/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "message": "What should I do?",
    "chatId": "123",
    "mode": "explain",
    "previousMessages": [
      {"role": "user", "content": "I feel sick"}
    ],
    "visitContext": {
      "visitId": 5,
      "doctorName": "Dr. Smith",
      "diagnosis": "Flu"
    }
  }'
```

---

## 7. Notes

- **Max previous messages:** Currently limited to last 10 user messages
- **Visit context:** Only sent when user clicks a visit node in the timeline
- **Context clearing:** Visit context is cleared after message is sent
- **Message history:** Persists throughout the chat session
- **Optional fields:** Both `previousMessages` and `visitContext` are optional
