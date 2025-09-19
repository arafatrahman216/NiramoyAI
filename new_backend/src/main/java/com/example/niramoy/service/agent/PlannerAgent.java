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
            First,
            - Detect User intent. If user if asking for a plan or guideline or timeline then make "is_plan": true in the json response. Then response in "Plan" and Keep "Explanation" empty.
            - If user is not asking for a plan or guideline or timeline then make "is_plan": false in the json response. Then response in "Explanation" and Keep "Plan" empty.
            - If intent is not relevant at all, politely refuse to answer and suggest consulting a healthcare
            - If intent is somewhat relevent answer the question with basic knowledge
            - If the question type doesnot match PLANNER mode, refer to use other Modes
              like QnA,Consult, Next Move Planner

            If is_plan is false then do these:
            Normal chat with the user. Keep "Plan" empty and respond in "Explanation".


            If is_plan is true then do these:
            Keep "Explanation" empty and respond in "Plan".
            Generate a clear, empathetic, actionable care plan based on the patient’s context, visit notes, and query. Your plan should be practical, in plain language, and use second-person ("you"). Adapt to the situation: some cases may not require Pre-Treatment or Post-Treatment phases. If urgent/unsafe, highlight it immediately with concrete steps.

            Output requirements (MANDATORY):
            - Return ONLY valid JSON with top-level "Plan".
            - "Plan" keys must include:
            "PreTreatment_Phase", "Treatment_Phase", "PostTreatment_Phase",
            "EstimatedTime", "EstimatedTotalCost", "ActionChecklist", "Urgency".
            - Each phase = array of step objects with fields:
            "step", "action", "why", "where", "cost", "timeframe", "this_step_importance".
            - For Treatment: add "expected_side_effects" if relevant.
            - For PostTreatment: add "red_flags" if relevant.
            - Include only relevant phases; leave empty arrays if not applicable.
            - "EstimatedTime": estimated duration of each phase in days/weeks.
            - "EstimatedTotalCost": Low/Typical/High ranges.
            - "ActionChecklist": 4–10 practical, copyable steps for the patient.
            - "Urgency": "Routine", "Within 1 week", "Urgent (24–48h)", "Emergency — go to ER now".

            Behavior:
            - Be concise, empathetic, and friendly.
            - Avoid jargon; explain medical terms simply.
            - Always justify major actions/tests briefly ("why").
            - If danger is possible, instruct immediate action (ER or urgent care).
            - Fill missing info with reasonable assumptions and note them in "Assumptions".

            Input placeholders (always provided):
            Visit Summary: {{visit_summary}}
            Doctor's Advice: {{doctor_advice}}
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
                        "action": "Consult your cardiologist or surgeon immediately.",
                        "why": "To discuss your upcoming heart surgery and any pre-operative preparations needed.  This is crucial for a safe procedure.",
                        "where" : "Max hospital",
                        "cost": "300",
                        "timeframe": "Within 24 hours – this is vital.",
                        "this_step_importance" : "low"
                    }
                    ],
                    "Treatment_Phase": [
                    {
                        "step": 1,
                        "action": "Heart Surgery",
                        "expected_side_effects": "Pain, swelling, bruising, infection, bleeding, complications related to anesthesia.  Your surgeon will discuss specific risks.",
                        "cost": "5000"
                        "why": "To address the underlying heart condition."
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
                        "red_flags": ["Excessive bleeding", "Chest pain", "Shortness of breath", "High fever", "Swelling in legs"]
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
                    "Arrange for transportation to and from the hospital.",
                    "Prepare your home for recovery.",
                    "Pack a hospital bag.",
                    "Inform family and friends of your surgery schedule.",
                    "Clarify insurance coverage and payment arrangements."
                    ],
                    "Urgency": "Urgent",
                    "Assumptions": [
                        "Patient is stable and can undergo surgery.",
                        "Insurance will cover the majority of the costs.",
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
            You can generate 0-5 search quaries if needed.
            Also Extract location from user query if mentioned.
            Must provide answer in a JSON.
            
            Example:
            User Query: "What is the cost of an MRI scan in New York City?"
            Output: {"location": "New York City", "queries": ["MRI scan cost New York City"]}

            User Query: "How long does it take to get a blood test done?"
            Output: {"location": "", "queries": ["blood test duration"]}

            User Query: {{query}}
        """
    );


    @Override
    public String processQuery(String query, Long userId) {

        String lastVisitTestNames = userKGService.getLatestTestNames(userId);
        log.info("Latest Test Names: {}", lastVisitTestNames);  

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
            JSONObject extractionJson = JsonParser.parseJsonToObject(extractionResponse);
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
                    searchResult = plannerAgentTools.searchWeb(searchQuery);    
                    kgContextBuilder.append("Q:    " + searchQuery + " A:     " + searchResult).append("\n");
                }
                log.info("KG Context: {}", kgContextBuilder.toString());
                searchResultsString = kgContextBuilder.toString();
            }
        }


        // Now real plan generation 
        Map<String, Object> chainVariables = Map.of(
            "visit_summary", userKGService.getVisitSummaryLastThree(userId),
            "doctor_advice", userKGService.getDoctorAdvice(userId),
            "patient_summary", userKGService.getPatientSummary(userId),
            "history_summary", userKGService.getHistorySummary(userId),
            "kg_context", searchResultsString,
            "query", query
        );
        
        log.info("In Planning Agent");
        Prompt prompt = PLAN_PROMPT.apply(chainVariables);
        String response;
        try{
          response = aiService.generateContent(prompt.text());
        } catch (Exception e) {
            log.error("Error generating content: {}", e.getMessage());
            return "{\"Plan\": {\"Error\": \"Failed to generate plan due to internal error.\"}}";
        }
        log.info("Got answer from AI " + response);
        return response;
    }

}