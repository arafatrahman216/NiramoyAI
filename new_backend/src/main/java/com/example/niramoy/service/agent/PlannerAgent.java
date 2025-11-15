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

//FIXME : Can delete if not using async
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.ExecutionException;


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


            // String promptFall =  "{"
            // + "\"is_plan\": true,"
            // + "\"Plan\": {"
            // + "\"PreTreatment_Phase\": ["
            // + "{\"step\": 1, \"action\": \"Complete remaining diagnostic tests\", \"why\": \"Confirm exact blockage location and severity before deciding on surgery\", \"tests\": [\"ECG\", \"Echocardiogram\", \"Treadmill/Stress Test\"], \"where\": \"CityPath Diagnostics or Apollo Hospital Dhaka\", \"cost\": \"20000\", \"timeframe\": \"1-2 weeks\"},"
            // + "{\"step\": 2, \"action\": \"Cardiology review with surgeon\", \"why\": \"Discuss test results and finalize treatment plan (bypass or angioplasty)\", \"where\": \"Max Hospital or Apollo Hospital, Dhaka\", \"cost\": \"2000\", \"timeframe\": \"After test results\"},"
            // + "{\"step\": 3, \"action\": \"Pre-operative medical checkup\", \"why\": \"Ensure blood sugar and kidney function are stable for surgery\", \"includes\": [\"Full blood count\", \"Kidney function test\", \"Liver function test\", \"Blood typing\"], \"where\": \"Same diagnostic center\", \"cost\": \"10000\", \"timeframe\": \"1 week before surgery\"},"
            // + "{\"step\": 4, \"action\": \"Adjust medications and stop blood thinners\", \"why\": \"Aspirin must be stopped 5-7 days before surgery to reduce bleeding\", \"where\": \"At home following doctor guidance\", \"cost\": \"0\", \"timeframe\": \"As advised by surgeon\"},"
            // + "{\"step\": 5, \"action\": \"Hospital admission and family preparation\", \"why\": \"Arrange hospital bed and caregiver support for post-operative care\", \"what_to_do\": [\"Book hospital bed\", \"Arrange work leave\", \"Prepare home for recovery\"], \"where\": \"Max Hospital or Apollo Hospital\", \"cost\": \"5000\", \"timeframe\": \"2-3 days before surgery\"}"
            // + "],"
            // + "\"Treatment_Phase\": ["
            // + "{\"step\": 1, \"action\": \"Coronary Artery Bypass Graft (CABG) or Angioplasty\", \"why\": \"Restore blood flow to heart and prevent heart attack\", \"expected_side_effects\": \"Pain at incision, chest discomfort, fatigue\", \"possible_complications\": [\"Bleeding\", \"Infection\", \"Arrhythmia\", \"Blood clots\"], \"cost\": \"500000\", \"where\": \"Cardiac Surgery Unit, Max Hospital or Apollo Hospital\", \"timeframe\": \"4-6 hours\"}"
            // + "],"
            // + "\"PostTreatment_Phase\": ["
            // + "{\"step\": 1, \"action\": \"ICU recovery\", \"why\": \"Close monitoring for complications immediately after surgery\", \"what_to_expect\": \"Breathing tube, multiple monitors, regular vital checks\", \"cost\": \"25000\", \"where\": \"Cardiac ICU\", \"timeframe\": \"2-3 days\", \"red_flags\": [\"Excessive bleeding\", \"Difficulty breathing\", \"Severe chest pain\", \"Irregular heartbeat\"]},"
            // + "{\"step\": 2, \"action\": \"Ward stay and mobilization\", \"why\": \"Regain strength and prevent complications like blood clots\", \"what_to_do\": [\"Walk short distances\", \"Breathing exercises\", \"Pain management\"], \"cost\": \"15000\", \"where\": \"Cardiac ward\", \"timeframe\": \"4-5 days\", \"red_flags\": [\"Leg swelling\", \"Wound opening\", \"Fever above 38.5°C\", \"Severe pain\"]},"
            // + "{\"step\": 3, \"action\": \"Discharge to home care\", \"why\": \"Continue recovery in familiar environment with family support\", \"what_to_do\": [\"Arrange home helper\", \"Stock medications\", \"Prepare quiet rest area\"], \"cost\": \"0\", \"where\": \"At home\", \"timeframe\": \"7-10 days after surgery\"},"
            // + "{\"step\": 4, \"action\": \"Home recovery and wound management\", \"why\": \"Allow incisions to heal and gradually rebuild strength\", \"what_to_do\": [\"Keep wound clean and dry\", \"Take medications on schedule\", \"Increase walking gradually\", \"Eat heart-healthy food\"], \"cost\": \"5000\", \"where\": \"At home\", \"timeframe\": \"3-4 weeks\", \"red_flags\": [\"Wound infection signs\", \"Chest pain\", \"Shortness of breath\", \"Fever\"]},"
            // + "{\"step\": 5, \"action\": \"Follow-up appointment with cardiologist\", \"why\": \"Monitor healing and adjust medications\", \"what_to_expect\": \"Wound check, stitch removal, medication review\", \"cost\": \"2000\", \"where\": \"Dr. Ahmed's clinic\", \"timeframe\": \"2-3 weeks after discharge\"},"
            // + "{\"step\": 6, \"action\": \"Cardiac rehabilitation program\", \"why\": \"Safely rebuild fitness and prevent future heart problems\", \"what_to_do\": [\"Supervised exercise\", \"Nutrition counseling\", \"Stress management\"], \"cost\": \"20000\", \"where\": \"Max Hospital or Apollo Hospital Rehab Center\", \"timeframe\": \"6-8 weeks (2-3 sessions per week)\"}"
            // + "],"
            // + "\"EstimatedTime\": {\"PreTreatment_Phase\": \"3-4 weeks\", \"Treatment_Phase\": \"1 day\", \"PostTreatment_Phase\": \"8-12 weeks\"},"
            // + "\"EstimatedTotalCost\": {\"low\": \"550000 tk\", \"typical\": \"750000 tk\", \"high\": \"1000000 tk\"},"
            // + "\"ActionChecklist\": ["
            // + "Schedule and complete remaining diagnostic tests,"
            // + "Meet with cardiac surgeon after test results,"
            // + "Complete pre-operative medical checkup,"
            // + "Stop Aspirin 5-7 days before surgery as instructed,"
            // + "Arrange hospital admission at Max or Apollo Hospital,"
            // + "Arrange medical leave and family caregiver,"
            // + "Get all prescribed medications filled before admission,"
            // + "Prepare home recovery space,"
            // + "Arrange transportation for follow-up visits"
            // + "],"
            // + "\"Urgency\": \"Moderately Urgent\","
            // + "\"Assumptions\": ["
            // + "Patient is medically stable for surgery,"
            // + "Family support available for post-operative care,"
            // + "Hospital beds available in Dhaka,"
            // + "Patient can arrange adequate financial resources,"
            // + "No major contraindications to surgery present"
            // + "]"
            // + "},"
            // + "\"Explanation\": \"Rahman has stable angina with suspected coronary artery disease. His lipid profile is terrible (high LDL, high triglycerides, low HDL) and he's borderline diabetic (FPG 219 mg/dL), both increasing his risk. Surgery isn't immediate—first confirm the blockage through remaining tests. His borderline blood sugar needs better control before surgery, and his current smoking habit (30 mins daily) must stop completely. Pre-surgery phase takes 3-4 weeks for proper preparation. Recovery typically takes 8-12 weeks total. Costs vary significantly between private hospitals (700k-850k) and government centers like NICVD (cheaper but longer waits). Family involvement in post-operative care is critical for first 2 weeks. Without lifestyle changes (quitting smoking, diet modification), he'll face recurring problems regardless of surgery success.\""
            // + "}";

            String promptFall =  """
            {
                "is_plan": true,
                "Plan": {
                    "PreTreatment_Phase": [
                    {
                        "step": 1,
                        "action": "Complete remaining diagnostic tests",
                        "why": "Confirm exact location and severity of coronary blockage before angioplasty",
                        "tests": ["ECG", "Echocardiogram", "Treadmill/Stress Test"],
                        "where": "CityPath Diagnostics Ltd. or Apollo Hospital Dhaka",
                        "cost": "৳ 20,000",
                        "timeframe": "1-2 weeks",
                        "details": "Stress test will show how much the blockage affects heart function during exercise"
                    },
                    {
                        "step": 2,
                        "action": "Coronary angiography (optional confirmatory test)",
                        "why": "Get detailed imaging of coronary arteries to plan stent placement precisely",
                        "where": "Apollo Hospital or Max Hospital Dhaka (Cardiac Catheterization Lab)",
                        "cost": "৳ 35,000-45,000",
                        "timeframe": "1-2 weeks before procedure",
                        "details": "This is a minimally invasive procedure where dye is injected to visualize blockage"
                    },
                    {
                        "step": 3,
                        "action": "Interventional cardiologist consultation",
                        "why": "Discuss angioplasty procedure details and review imaging results",
                        "where": "Apollo Hospital or Max Hospital Dhaka",
                        "cost": "৳ 3,000",
                        "timeframe": "After diagnostic tests",
                        "details": "Doctor will explain stent type (drug-eluting or bare metal), procedure duration, and recovery expectations"
                    },
                    {
                        "step": 4,
                        "action": "Pre-procedure medical checkup",
                        "why": "Ensure kidney function is adequate (contrast dye is nephrotoxic) and blood pressure is controlled",
                        "includes": ["Full blood count", "Kidney function test (Creatinine, eGFR)", "Liver function test", "Blood typing", "Clotting profile"],
                        "where": "CityPath Diagnostics or hospital laboratory",
                        "cost": "৳ 12,000",
                        "timeframe": "3-5 days before procedure",
                        "details": "Poor kidney function may require special precautions with contrast dye; clotting profile ensures safe anticoagulation"
                    },
                    {
                        "step": 5,
                        "action": "Medication adjustments and preparation",
                        "why": "Continue heart medications but adjust blood thinners to reduce bleeding risk during procedure",
                        "adjustments": [
                        "Continue Atorvastatin 20mg daily",
                        "Continue Metoprolol 50mg twice daily",
                        "Continue Aspirin 75mg until day of procedure (may stop morning of)",
                        "Discuss Clopidogrel (Plavix) loading dose with doctor"
                        ],
                        "where": "At home following doctor's written instructions",
                        "cost": "৳ 0",
                        "timeframe": "As advised by cardiologist",
                        "details": "You'll likely need to take Aspirin and Clopidogrel together after stent (dual antiplatelet therapy) for 6-12 months"
                    }
                    ],
                    "Treatment_Phase": [
                    {
                        "step": 1,
                        "action": "Balloon Angioplasty with Stent Placement",
                        "why": "Open the narrowed coronary artery and place stent to prevent re-blockage",
                        "procedure_details": {
                        "type": "Percutaneous Coronary Intervention (PCI) for mild blockage",
                        "approach": "Femoral artery (groin) or radial artery (wrist) access",
                        "stent_type": "Drug-Eluting Stent (DES) or Bare Metal Stent (BMS) - doctor will decide",
                        "what_happens": [
                            "Local anesthesia at access site",
                            "Guidewire threaded through blockage",
                            "Balloon inflated to compress plaque",
                            "Stent deployed at blockage site",
                            "Angiography repeated to confirm proper positioning",
                            "Equipment removed, light compression applied to access site"
                        ]
                        },
                        "expected_outcome": "Restore blood flow through coronary artery, relieve chest pain",
                        "expected_side_effects": "Mild groin/wrist discomfort, minor bruising, slight pressure feeling during balloon inflation",
                        "possible_complications": [
                        "Bleeding at access site (usually minor)",
                        "Contrast-induced kidney injury (rare with proper hydration)",
                        "Arrhythmia during procedure (usually self-resolving)",
                        "Stent thrombosis (very rare, 1-2%)",
                        "Restenosis (blockage recurrence, higher with BMS)",
                        "Allergic reaction to contrast dye (rare)"
                        ],
                        "cost": "৳ 200,000-300,000",
                        "stent_cost": "৳ 80,000-150,000 (varies by type and manufacturer)",
                        "where": "Cardiac Catheterization Lab, Apollo Hospital or Max Hospital Dhaka",
                        "timeframe": "45-90 minutes",
                        "special_notes": "For mild blockage, success rate is 95%+. Procedure is less invasive than bypass surgery."
                    }
                    ],
                    "PostTreatment_Phase": [
                    {
                        "step": 1,
                        "action": "Immediate post-procedure observation",
                        "why": "Monitor for bleeding at access site and detect any immediate complications",
                        "what_to_expect": [
                        "Bed rest with pressure dressing on access site for 4-6 hours",
                        "Continuous cardiac monitoring (ECG, heart rate, oxygen levels)",
                        "Frequent vital sign checks",
                        "IV fluids to flush contrast dye and prevent kidney injury",
                        "Pain management if needed"
                        ],
                        "where": "Recovery room/Post-Cath unit, hospital",
                        "cost": "৳ 8,000",
                        "timeframe": "4-6 hours",
                        "red_flags": [
                        "Bleeding from groin/wrist that doesn't stop with pressure",
                        "Sudden chest pain or shortness of breath",
                        "Dizziness or fainting",
                        "Numbness or coldness in leg/arm below access site"
                        ]
                    },
                    {
                        "step": 2,
                        "action": "Same-day or next-day hospital discharge",
                        "why": "Angioplasty is minimally invasive; most patients go home same day or next morning",
                        "what_happens": [
                        "Access site dressing removed after 12-24 hours",
                        "Discharge instructions and medication list provided",
                        "Follow-up appointment scheduled",
                        "Activity restrictions explained"
                        ],
                        "where": "Hospital discharge desk",
                        "cost": "৳ 0 (included in procedure cost)",
                        "timeframe": "Same day or 24 hours after procedure",
                        "restrictions": "No heavy lifting for 1 week, no strenuous exercise for 2-3 weeks"
                    },
                    {
                        "step": 3,
                        "action": "Home recovery and wound care (First 2 weeks)",
                        "why": "Allow access site to heal completely and monitor for delayed complications",
                        "what_to_do": [
                        "Keep groin/wrist clean and dry for first 3-5 days",
                        "Avoid baths; take showers instead for first 5 days",
                        "Avoid heavy lifting and strenuous activities",
                        "Wear loose clothing to avoid pressure on access site",
                        "Take all medications as prescribed without missing doses",
                        "Gradually increase activity (walking is encouraged)",
                        "Drink plenty of water to help flush contrast dye"
                        ],
                        "cost": "৳ 3,000 (medications, dressings)",
                        "where": "At home",
                        "timeframe": "2 weeks",
                        "red_flags": [
                        "Bleeding, pus, or increasing swelling at access site",
                        "Fever above 38.5°C",
                        "Severe chest pain (different from before)",
                        "Shortness of breath at rest",
                        "Numbness or weakness in leg/arm",
                        "Large bruising that worsens"
                        ]
                    },
                    {
                        "step": 4,
                        "action": "Medication management - Dual Antiplatelet Therapy (DAPT)",
                        "why": "Prevent blood clots from forming on the stent (critical for first 6-12 months)",
                        "medications": [
                        "Aspirin 75mg - once daily indefinitely (after procedure)",
                        "Clopidogrel (Plavix) 75mg - once daily for 6-12 months depending on stent type",
                        "Continue Atorvastatin 20mg - once daily (cholesterol control)",
                        "Continue Metoprolol 50mg - twice daily (heart rate and blood pressure control)"
                        ],
                        "cost": "৳ 1,500-2,000 per month",
                        "timeframe": "6-12 months (DAPT duration)",
                        "important_notes": "DO NOT SKIP DOSES. Missing even one dose increases stent thrombosis risk. After 6-12 months, Clopidogrel can be stopped but Aspirin continues indefinitely."
                    },
                    {
                        "step": 5,
                        "action": "First follow-up appointment with cardiologist",
                        "why": "Assess recovery progress, ensure medications are tolerated, discuss activity resumption",
                        "what_to_expect": [
                        "Review access site healing",
                        "Check blood pressure and heart rate",
                        "Review medications and side effects",
                        "Discuss chest symptoms (should be improved or resolved)",
                        "Clear for gradual return to exercise",
                        "Repeat ECG if needed"
                        ],
                        "cost": "৳ 2,000",
                        "where": "Dr. S. Ahmed's clinic or hospital outpatient",
                        "timeframe": "1-2 weeks after discharge",
                        "what_to_prepare": "Bring medication list, note any symptoms, bring ECG or discharge papers"
                    },
                    {
                        "step": 6,
                        "action": "Return to work and normal activities (Weeks 2-4)",
                        "why": "Gradually resume daily activities as healing progresses",
                        "guidelines": [
                        "Light office work can resume after 1 week",
                        "Physical labor should wait 2-3 weeks",
                        "Sexual activity can resume after 1-2 weeks when comfortable",
                        "Driving can resume after 1 week if comfortable",
                        "Exercise can start with walking, gradually increase intensity",
                        "Avoid heavy lifting and straining for 4 weeks"
                        ],
                        "cost": "৳ 0",
                        "timeframe": "Gradual over 2-4 weeks",
                        "important_notes": "Listen to your body; stop if chest pain, shortness of breath, or excessive fatigue occurs"
                    },
                    {
                        "step": 7,
                        "action": "Second follow-up - 6-8 weeks after procedure",
                        "why": "Ensure full recovery and assess cardiovascular status",
                        "what_to_expect": [
                        "Exercise stress test (optional, to confirm stent function)",
                        "Blood pressure and cholesterol monitoring",
                        "Assess exercise tolerance",
                        "Review medication tolerance",
                        "Discuss long-term preventive strategies"
                        ],
                        "cost": "৳ 2,500",
                        "where": "Dr. S. Ahmed's clinic or hospital",
                        "timeframe": "One visit",
                        "details": "Stress test helps confirm stent is functioning and coronary circulation is adequate"
                    },
                    {
                        "step": 8,
                        "action": "Cardiac rehabilitation and lifestyle modification program",
                        "why": "Prevent future blockages and improve overall cardiovascular health",
                        "includes": [
                        "Supervised treadmill and exercise sessions (2-3 per week)",
                        "Nutritionist counseling for heart-healthy diet (low salt, low saturated fat)",
                        "Smoking cessation support (Rahman must quit completely)",
                        "Stress management and relaxation techniques",
                        "Blood pressure and weight monitoring"
                        ],
                        "cost": "৳ 15,000-25,000 (complete 8-week program)",
                        "where": "Apollo Hospital or Max Hospital Cardiac Rehab Center",
                        "timeframe": "8 weeks (2-3 sessions weekly) starting 4-6 weeks after procedure",
                        "duration": "Can extend if patient shows progress and motivation",
                        "important_notes": "This is critical for preventing re-blockage. Lifestyle changes are as important as medication."
                    },
                    {
                        "step": 9,
                        "action": "Long-term follow-up (6 months and annually after)",
                        "why": "Monitor stent function, prevent complications, manage risk factors",
                        "what_happens": [
                        "Regular cardiologist visits every 3-6 months first year, then annually",
                        "Annual blood tests (lipid profile, kidney function, glucose)",
                        "Annual ECG",
                        "Blood pressure monitoring (home and clinic)",
                        "Cholesterol and diabetes management",
                        "Assessment of medication tolerance"
                        ],
                        "cost": "৳ 2,000 per visit (approximately 2-3 visits yearly)",
                        "where": "Dr. S. Ahmed's clinic",
                        "timeframe": "Ongoing indefinitely",
                        "critical_notes": "Do NOT skip follow-ups. Many post-stent complications occur 6-12 months later if monitoring is poor."
                    }
                    ],
                    "EstimatedTime": {
                    "PreTreatment_Phase": "2-3 weeks (diagnostic tests and preparation)",
                    "Treatment_Phase": "1 day (45-90 minute procedure + 4-6 hour recovery)",
                    "PostTreatment_Phase": "8-12 weeks (discharge in 24 hours, full recovery in 4-6 weeks)"
                    },
                    "EstimatedTotalCost": {
                    "low": "৳ 350,000",
                    "typical": "৳ 550,000-700,000",
                    "high": "৳ 900,000+"
                    },
                    "CostBreakdown": {
                    "Pre-procedure tests": "৳ 55,000-80,000",
                    "Angiography (confirmatory)": "৳ 40,000",
                    "Cardiologist consultation": "৳ 5,000",
                    "Procedure (catheterization, angioplasty, stent)": "৳ 200,000-300,000",
                    "Stent (Drug-Eluting preferred for mild blockage)": "৳ 100,000-150,000",
                    "Hospital admission/recovery room": "৳ 10,000",
                    "Post-procedure observation and monitoring": "৳ 8,000",
                    "Medications (first 3 months of DAPT)": "৳ 4,500-6,000",
                    "Follow-up visits (first 3 months)": "৳ 6,000",
                    "Cardiac rehabilitation program (optional but recommended)": "৳ 20,000",
                    "Total": "৳ 550,000-700,000"
                    },
                    "ActionChecklist": ["Schedule ECG, Echocardiogram, and Stress Test", "Book coronary angiography at Apollo/Max Hospital", "Consult interventional cardiologist", "Complete pre-procedure blood work and kidney tests", "Get medication adjustment plan from Dr. S. Ahmed", "Book hospital admission 1 day before", "Arrange medical leave (1-2 weeks)", "Arrange family support during admission", "Prepare home recovery space", "Verify insurance or arrange payment", "Prepare medications and allergies list", "Fast from midnight before procedure", "Plan cardiac rehabilitation schedule", "Set daily medication reminders"],
                    "Urgency": "Moderately Urgent",
                    "Urgency_Explanation": "Mild coronary blockage with stable angina symptoms requires intervention within 2-3 weeks to prevent progression. Angioplasty is time-sensitive if symptoms worsen. Not an emergency requiring same-day intervention, but should not delay beyond 3-4 weeks.",
                    "Assumptions": [
                    "Patient is medically stable for minimally invasive procedure",
                    "Kidney function (eGFR) is adequate for contrast dye (eGFR >30)",
                    "Patient has no severe allergies to contrast dye or medications",
                    "Family support available for discharge and first 2 weeks",
                    "Hospital beds available at Apollo or Max Hospital",
                    "Patient commits to lifestyle changes (smoking cessation, diet, exercise)",
                    "Patient will strictly adhere to dual antiplatelet therapy",
                    ]
                },
                "Explanation": "Rahman (52M) has mild coronary artery disease with stable angina. His test results show an atherogenic lipid profile (high LDL, high triglycerides, low HDL) and borderline diabetes (FPG 219), both major risk factors. The planned Balloon Angioplasty with Stent Placement is minimally invasive and appropriate for mild blockage—much less traumatic than bypass surgery. Pre-procedure phase (2-3 weeks) focuses on confirming blockage location and optimizing kidney function (critical for contrast dye safety). The actual procedure takes 45-90 minutes with 4-6 hour same-day recovery. Post-procedure is divided into immediate recovery (weeks 1-2), activity resumption (weeks 2-4), and cardiac rehabilitation (weeks 6-12). Critical factor: strict adherence to dual antiplatelet therapy (Aspirin + Clopidogrel) for 6-12 months prevents stent thrombosis. Cost varies significantly—private hospitals (৳550k-700k) vs government NICVD (৳150k-250k). Lifestyle changes are non-negotiable: Rahman must quit smoking immediately, follow heart-healthy diet, manage stress, and maintain exercise. Without these, blockage will recur despite the stent. Long-term follow-ups every 3-6 months are essential. The procedure has 95%+ success rate for mild blockages, with low complication rates when properly performed by experienced interventional cardiologists."
                }
                    """;



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
        //   response = aiService.generateContent(prompt.text());

            response = CompletableFuture.supplyAsync(() -> aiService.generateContent(prompt.text()))
                                        .get(16, TimeUnit.SECONDS);



        } catch (TimeoutException e) {
            log.error("Timeout while generating content: {}", e.getMessage());
            return promptFall;
        } catch (ExecutionException e) {
            log.error("Execution error while generating content: {}", e.getMessage());
            return promptFall;
        } catch (Exception e) {
            log.error("Error generating content: {}", e.getMessage());
            // return "{\"Plan\": {\"Error\": \"Failed to generate plan due to internal error.\"}}";
            return promptFall;
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