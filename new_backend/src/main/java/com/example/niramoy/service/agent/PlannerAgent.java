package com.example.niramoy.service.agent;

import com.example.niramoy.service.UserKGService;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.utils.JsonParser;
import com.example.niramoy.service.agent.tools.PlannerAgentTools;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlannerAgent implements Agent {
    private final AIService aiService;
    private final UserKGService userKGService;
    private final PlannerAgentTools plannerAgentTools;

    private static final String planningPrompt = """
            You are a professional Health Assistant + Normal chatter if needed.
            1. Detect intent:
               - If user asks for plan/guideline/timeline → "is_plan": true → respond in "Plan", keep "Explanation" empty.
               - Otherwise → "is_plan": false → respond in "Explanation", keep "Plan" empty.
               - If not relevant → politely refuse + suggest consulting healthcare.
               - If somewhat relevant → answer with basic knowledge.
               - If not a PLAN type → refer user to QnA/Consult/Next Move modes.
            
            2. If is_plan = false:
               - Chat normally. Explanation only. Plan empty.
            
            3. If is_plan = true:
               - JSON output only with top-level "Plan".
               - Keys: "PreTreatment_Phase", "Treatment_Phase", "PostTreatment_Phase", "EstimatedTime", "EstimatedTotalCost", "ActionChecklist", "Urgency".
               - Each phase = array of steps {step, action, why, where, cost, timeframe, this_step_importance}.
               - Treatment: add "expected_side_effects" if relevant.
               - PostTreatment: add "red_flags" if relevant.
               - EstimatedTime = per phase duration.
               - EstimatedTotalCost = Low/Typical/High.
               - ActionChecklist = 4–10 clear, copyable steps.
               - Urgency = Routine / Within 1 week / Urgent (24–48h) / Emergency — go to ER now.
            
            4. Behavior:
               - Be concise, empathetic, friendly.
               - Avoid jargon; explain simply.
               - Always explain “why”.
               - If danger → urgent action.
               - Fill gaps with reasonable assumptions → note in "Assumptions".
            Input placeholders (always provided):
            Visit Summary: {{visit_summary}}
            Patient Summary: {{patient_summary}}
            History Summary: {{history_summary}}
            KG Context: {{kg_context}}
            User Query: {{query}}

            Important Instructions:
            - Keep PreTreatment, Treatment, PostTreatment phases empty if not applicable.
            - Include EstimatedTime for each relevant phase.
            - Include step-specific importance ("this_step_importance") for every step.
            - Include red flags for PostTreatment steps if relevant.
            - If urgent, state clearly and prioritize critical steps.

            Example JSON structure (flexible; phases can be empty if not needed):
             {
             "is_plan": true,
             "Plan": {
                 "PreTreatment_Phase": [],
                 "Treatment_Phase": [],
                 "PostTreatment_Phase": [],
                 "EstimatedTime": {},
                 "EstimatedTotalCost": {"low":"", "typical":"", "high":""},
                 "ActionChecklist": [],
                 "Urgency": "",
                 "Assumptions": [""]
             }
             "Explanation" : "..."
             }
    
             Example Response:
             {
                 "Plan":
                 {
                     "PreTreatment_Phase": [
                     {
                         "step": 1,
                         "action": "Consult your cardiologist immediately.",
                         "why": "To discuss your upcoming heart surgery and any pre-operative preparations needed.",
                         "where" : "Max hospital",
                         "cost": "300",
                         "timeframe": "Within 24 hours",
                         "this_step_importance" : "low"
                     }
                     ],
                     "Treatment_Phase": [
                     {
                         "step": 1,
                         "action": "Heart Surgery",
                         "expected_side_effects": "Pain, swelling, bleeding, complications related to anesthesia. ",
                         "cost": "5000"
                         "why": "To address the heart condition."
                         "where" : "",
                         "timeframe" : "7 days",
                         "this_step_importance" : "high"
                     }
                     ],
                     "PostTreatment_Phase": [
                     {
                         "step": 1,
                         "action": "Hospital Stay",
                         "when": "Immediately following surgery.",
                         "where" : "Max Hospital",
                         "cost" : "1000",
                         "why" : "need to heal"
                         "timeframe" : "7 days",
                         "red_flags": ["Excessive bleeding", "Chest pain", "Shortness of breath"]
                         "this_step_importance" : "high"
    
                     }
                     ],
                     "EstimatedTime" : {
                     "PreTreatment_Phase" : "1",
                     "Treatment_Phase" : "2",
                     "PostTreatment_Phase": "4"
                     },
                     "EstimatedTotalCost": {
                     "low": "$5000",
                     "typical": "$15000",
                     "high": "$50000+"
                     },
                     "ActionChecklist": [
                     "Schedule a consultation with your cardiologist/surgeon immediately.",
                     "Complete all pre-operative tests and assessments.",
                     "Prepare your home for recovery.",
                     "Inform family and friends of your surgery schedule.",
                     ],
                     "Urgency": "Urgent",
                     "Assumptions": [
                         "Patient is stable and can undergo surgery.",
                         "Patient has a support system in place for recovery."
                     ]
                 }
             }""";


    private static final PromptTemplate PLAN_PROMPT = PromptTemplate.from(
        planningPrompt
    );

    private static final PromptTemplate EXTRACTION_PROMPT = PromptTemplate.from(
        """
            You are a extraction agent with professional Knowledge of medical field.
            Now i have tools get information from web like Test costs, Test Time, Treatment costs, Doctor fees, Hospital fees, Hospital locations.
            I have to generate natural  language query to search for these informations.
            Given the user query, extract the relevant keywords and generate a concise search query that can be used to find the required information.
            Generate only the most relevent 2-4 questions.
            Also Extract location from user query if mentioned(default dhaka)
            Must provide answer in a JSON.
            
            Example:
            User Query: "What is the cost of an MRI scan in New York City?"
            Output: {"location": "Dhaka", "queries": ["MRI scan cost New York City"]}

            User Query: "How long does it take to get a blood test done?"
            Output: {"location": "", "queries": ["blood test duration"]}

            User Query: {{query}}
        """
    );


    @Override
    public String processQuery(String query, Long userId) {

        log.info("1. Getting Latest Test Names");
        String lastVisitTestNames = userKGService.getLatestTestNames(userId);
        // log.info("Latest Test Names: {}", lastVisitTestNames);  

        Map<String, Object> extractionVariables = Map.of(
            "query", query
        );
        Prompt extractionPrompt = EXTRACTION_PROMPT.apply(extractionVariables);
        String extractionResponse = null;
        try{
            extractionResponse = aiService.generateContent(extractionPrompt.text() + " | " + lastVisitTestNames);
        } catch (Exception e) {
            log.error("Error generating content: {}", e.getMessage());
        }

        String searchResultsString = "";
        if (extractionResponse == null) {
            log.error("Extraction response is null, skipping web search");
        } 
        else 
        {
            log.info("2. Processing Extraction Response for Web Search");
            JSONObject extractionJson = JsonParser.parseJsonToObject(extractionResponse);
            // log.info("Extraction JSON: {}", extractionJson);
            if (extractionJson == null) {
                log.error("Failed to parse extraction response to JSON.");
            } 
            else if (extractionJson.has("queries") && extractionJson.has("location")) {
                JSONArray queriesArray = extractionJson.getJSONArray("queries");
                String location = extractionJson.getString("location");
                StringBuilder kgContextBuilder = new StringBuilder();

                for (int i = 0; i < queriesArray.length(); i++) {
                    String searchQuery = queriesArray.getString(i);
                    String searchResult;
                    if (location != null && !location.isEmpty()) {
                        searchQuery += " User's location: " + location;
                    }
                    
                    //Search web for results
                    log.info("{}th web search for query: {}", i + 1, searchQuery);
                    searchResult = plannerAgentTools.searchWeb(searchQuery);
                    kgContextBuilder.append("Q:    " + searchQuery + " A:     " + searchResult).append("\n");
                }
                searchResultsString = kgContextBuilder.toString();
            }
        }


        // Now real plan generation 
        Map<String, Object> chainVariables = Map.of(
            "visit_summary", userKGService.getVisitSummaryLastThree(userId),
//            "doctor_advice", userKGService.getDoctorAdvice(userId),
            "patient_summary", userKGService.getPatientSummary(userId),
            "history_summary", userKGService.getHistorySummary(userId),
            "kg_context", searchResultsString,
            "query", query
        );
        
        log.info("In Planning Agent");
        Prompt prompt = PLAN_PROMPT.apply(chainVariables);
        String response;
        try{
          // log.info(prompt.text());
          log.info("3. Generating Plan Response from AI");
          response = aiService.generateContent(prompt.text());
        } catch (Exception e) {
            log.error("Error generating content: {}", e.getMessage());
            return "{\"Plan\": {\"Error\": \"Failed to generate plan due to internal error.\"}}";
        }

        log.info("Got answer from AI " + response);
        return response;
    }


    @Override
    public String processImageQuery(String query, String imageUrl, Long userId) {
        String imageText = aiService.getTextFromImageUrl(imageUrl);
        query = query + ". Also analyze the image text provided and incorporate any relevant information from"
                + " into your plan. The image contains the following text: " + imageText;

        return processQuery(query, userId);
    }
}