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
            
            5. Answer in current user query language.
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


            String promptFall = """
            {
                "is_plan": true,
                "Plan": {
                    "PreTreatment_Phase": [
                    {
                        "step": 1,
                        "action": "অবশিষ্ট ডায়াগনস্টিক টেস্টগুলো সম্পন্ন করা",
                        "why": "অ্যাঞ্জিওপ্লাস্টির আগে করোনারি ব্লকেজের সঠিক স্থানে ও তীব্রতা নিশ্চিত করা",
                        "tests": ["ইসিজি (ECG)", "ইকোকার্ডিওগ্রাম", "স্ট্রেস/ট্রেডমিল টেস্ট"],
                        "where": "CityPath Diagnostics Ltd. অথবা Apollo Hospital Dhaka",
                        "cost": "৳ 20,000",
                        "timeframe": "১–২ সপ্তাহ",
                        "details": "স্ট্রেস টেস্ট ব্যায়ামের সময় ব্লকেজ কতটা হার্টকে প্রভাবিত করে তা দেখায়"
                    },
                    {
                        "step": 2,
                        "action": "করোনারি অ্যাঞ্জিওগ্রাম (ঐচ্ছিক নিশ্চিতকরণ টেস্ট)",
                        "why": "আর্টারির ব্লকেজের নির্ভুল ইমেজিং পেতে এবং স্টেন্ট বসানোর পরিকল্পনা করতে",
                        "where": "Apollo Hospital বা Max Hospital Dhaka (Cardiac Catheterization Lab)",
                        "cost": "৳ 35,000–45,000",
                        "timeframe": "প্রক্রিয়ার ১–২ সপ্তাহ আগে",
                        "details": "ডাই ইনজেক্ট করে আর্টারির ভিতরের ছবি নেওয়ার একটি মিনিমালি ইনভেসিভ পদ্ধতি"
                    },
                    {
                        "step": 3,
                        "action": "ইন্টারভেনশনাল কার্ডিওলজিস্টের সঙ্গে পরামর্শ",
                        "why": "অ্যাঞ্জিওপ্লাস্টি প্রক্রিয়া নিয়ে বিস্তারিত আলোচনা এবং রিপোর্ট রিভিউ",
                        "where": "Apollo Hospital বা Max Hospital Dhaka",
                        "cost": "৳ 3,000",
                        "timeframe": "ডায়াগনস্টিক টেস্টের পরে",
                        "details": "স্টেন্টের ধরন, প্রক্রিয়ার সময় এবং রিকভারি কীভাবে হবে তা ব্যাখ্যা করবেন"
                    },
                    {
                        "step": 4,
                        "action": "প্রি-প্রসিডিউর মেডিকেল চেকআপ",
                        "why": "কিডনি ফাংশন ঠিক আছে কিনা ও ব্লাড প্রেসার নিয়ন্ত্রণে আছে কিনা নিশ্চিত করা",
                        "includes": ["ফুল ব্লাড কাউন্ট", "কিডনি ফাংশন টেস্ট (Creatinine, eGFR)", "লিভার ফাংশন টেস্ট", "ব্লাড গ্রুপিং", "ক্লটিং প্রোফাইল"],
                        "where": "CityPath Diagnostics বা হাসপাতালের ল্যাব",
                        "cost": "৳ 12,000",
                        "timeframe": "প্রক্রিয়ার ৩–৫ দিন আগে",
                        "details": "খারাপ কিডনি ফাংশন ডাই-এর কারণে ঝুঁকি বাড়ায়; ক্লটিং প্রোফাইল অ্যান্টিকোয়াগুলেশন নিরাপদ কিনা দেখায়"
                    },
                    {
                        "step": 5,
                        "action": "ঔষধ সমন্বয় ও প্রস্তুতি",
                        "why": "হার্টের ওষুধ চালিয়ে যাওয়া এবং ব্লাড থিনার সঠিকভাবে সমন্বয় করা প্রয়োজন",
                        "adjustments": [
                        "Atorvastatin 20mg চালিয়ে যান",
                        "Metoprolol 50mg দিনে দুইবার চালিয়ে যান",
                        "Aspirin 75mg প্রক্রিয়ার আগের দিন পর্যন্ত (প্রয়োজনে সকালে না খেতে বলা হতে পারে)",
                        "Clopidogrel (Plavix) লোডিং ডোজ নিয়ে চিকিৎসকের সঙ্গে আলোচনা করুন"
                        ],
                        "where": "ডাক্তারের নির্দেশনা অনুযায়ী বাড়িতে",
                        "cost": "৳ 0",
                        "timeframe": "কার্ডিওলজিস্টের নির্দেশ অনুযায়ী",
                        "details": "স্টেন্টের পরে ৬–১২ মাস Aspirin + Clopidogrel দুটোই একসাথে খেতে হবে"
                    }
                    ],
                    "Treatment_Phase": [
                    {
                        "step": 1,
                        "action": "বেলুন অ্যাঞ্জিওপ্লাস্টি ও স্টেন্ট বসানো",
                        "why": "ব্লকেজ খোলা এবং পুনরায় ব্লক হওয়া বন্ধ করতে স্টেন্ট স্থাপন",
                        "procedure_details": {
                        "type": "Percutaneous Coronary Intervention (PCI) — হালকা ব্লকেজের জন্য",
                        "approach": "হাতের কব্জি (radial) বা উরু (femoral) দিয়ে প্রবেশ",
                        "stent_type": "Drug-Eluting বা Bare Metal — ডাক্তার ঠিক করবেন",
                        "what_happens": [
                            "লোকাল অ্যানেস্থেসিয়া",
                            "গাইডওয়্যার দিয়ে ব্লকেজে পৌঁছানো",
                            "বেলুন ফোলানো",
                            "স্টেন্ট বসানো",
                            "স্টেন্ট সঠিকভাবে বসেছে কিনা তা অ্যাঞ্জিওগ্রামে দেখা",
                            "ক্যাথেটার ও সরঞ্জাম সরিয়ে ফেলা"
                        ]
                        },
                        "expected_outcome": "করোনারি রক্তপ্রবাহ স্বাভাবিক করা এবং বুকে ব্যথা কমানো",
                        "expected_side_effects": "হালকা ব্যথা/ব্রুজিং, বেলুন ফোলানোর সময় চাপ অনুভূতি",
                        "possible_complications": [
                        "এক্সেস সাইটে সামান্য রক্তপাত",
                        "ডাই-জনিত কিডনি সমস্যা (দুর্লভ)",
                        "অ্যারিথমিয়া (সাধারণত নিজেরাই ঠিক হয়)",
                        "স্টেন্ট থ্রম্বোসিস (১–২%)",
                        "রেস্টেনোসিস (BMS-এ বেশি)",
                        "ডাই অ্যালার্জি (দুর্লভ)"
                        ],
                        "cost": "৳ 200,000–300,000",
                        "stent_cost": "৳ 80,000–150,000",
                        "where": "Cardiac Catheterization Lab, Apollo বা Max Hospital",
                        "timeframe": "৪৫–৯০ মিনিট",
                        "special_notes": "হালকা ব্লকেজে সফলতার হার ৯৫%+"
                    }
                    ],
                    "PostTreatment_Phase": [
                    {
                        "step": 1,
                        "action": "প্রক্রিয়ার পরপর পর্যবেক্ষণ",
                        "why": "রক্তপাত বা তাৎক্ষণিক জটিলতা নজরে রাখার জন্য",
                        "what_to_expect": [
                        "৪–৬ ঘণ্টা বেড রেস্ট",
                        "ECG, হার্ট রেট, অক্সিজেন মনিটরিং",
                        "বারবার ভায়টাল চেক",
                        "কিডনি সুরক্ষার জন্য IV ফ্লুইড",
                        "প্রয়োজনে ব্যথা নিয়ন্ত্রণ"
                        ],
                        "where": "রিকভারি রুম",
                        "cost": "৳ 8,000",
                        "timeframe": "৪–৬ ঘণ্টা",
                        "red_flags": [
                        "থামছে না এমন রক্তপাত",
                        "হঠাৎ বুক ব্যথা",
                        "ভীষণ মাথা ঘোরা",
                        "হাত/পায়ে ঠাণ্ডা বা অবশ ভাব"
                        ]
                    },
                    {
                        "step": 2,
                        "action": "একই দিনে বা পরদিন ছাড়পত্র",
                        "why": "অ্যাঞ্জিওপ্লাস্টি মিনিমালি ইনভেসিভ",
                        "what_happens": [
                        "১২–২৪ ঘণ্টা পরে ড্রেসিং খুলে ফেলা",
                        "ডিসচার্জ নির্দেশনা",
                        "ফলো-আপ তারিখ দেওয়া",
                        "অ্যাক্টিভিটি সীমাবদ্ধতার ব্যাখ্যা"
                        ],
                        "where": "হাসপাতাল ডিসচার্জ ডেস্ক",
                        "cost": "৳ 0",
                        "timeframe": "একই দিন বা পরদিন",
                        "restrictions": "১ সপ্তাহ ভারী কাজ না করা, ২–৩ সপ্তাহ কঠিন ব্যায়াম বাদ"
                    },
                    {
                        "step": 3,
                        "action": "বাড়িতে রিকভারি (প্রথম ২ সপ্তাহ)",
                        "why": "এক্সেস সাইট সঠিকভাবে সেরে উঠতে দেওয়া",
                        "what_to_do": [
                        "প্রথম ৩–৫ দিন পরিষ্কার ও শুকনো রাখা",
                        "গোসলের সময় কেবল শাওয়ার",
                        "ভারী কাজ এড়ানো",
                        "ঢিলা পোশাক পরা",
                        "ওষুধ নিয়ম অনুযায়ী খাওয়া",
                        "হাঁটা শুরু করা",
                        "পানি বেশি খাওয়া"
                        ],
                        "cost": "৳ 3,000",
                        "where": "বাড়ি",
                        "timeframe": "২ সপ্তাহ",
                        "red_flags": [
                        "পুঁজ/ফোলা/রক্তপাত",
                        "উচ্চ জ্বর",
                        "নতুন ধরনের বুক ব্যথা",
                        "শ্বাসকষ্ট",
                        "অবশ ভাব",
                        "বড় আকারের ব্রুজিং"
                        ]
                    },
                    {
                        "step": 4,
                        "action": "ওষুধ ব্যবস্থাপনা — DAPT",
                        "why": "স্টেন্টে রক্ত জমাট বাঁধা প্রতিরোধে অত্যন্ত গুরুত্বপূর্ণ",
                        "medications": [
                        "Aspirin 75mg — প্রতিদিন",
                        "Clopidogrel 75mg — ৬–১২ মাস",
                        "Atorvastatin 20mg — প্রতিদিন",
                        "Metoprolol 50mg — দিনে ২ বার"
                        ],
                        "cost": "৳ 1,500–2,000 প্রতি মাসে",
                        "timeframe": "৬–১২ মাস",
                        "important_notes": "একদিনও বাদ দেওয়া যাবে না।"
                    },
                    {
                        "step": 5,
                        "action": "প্রথম ফলো-আপ",
                        "why": "রিকভারি সঠিকভাবে হচ্ছে কিনা দেখা",
                        "what_to_expect": [
                        "এক্সেস সাইট চেক",
                        "ব্লাড প্রেসার চেক",
                        "ওষুধের পার্শ্বপ্রতিক্রিয়া আলোচনা",
                        "বুক ব্যথা আছে কিনা",
                        "ব্যায়াম রুটিন অনুমতি"
                        ],
                        "cost": "৳ 2,000",
                        "where": "ডা. এস. আহমেদের চেম্বার",
                        "timeframe": "১–২ সপ্তাহ",
                        "what_to_prepare": "ওষুধের লিস্ট ও ডিসচার্জ পেপার"
                    },
                    {
                        "step": 6,
                        "action": "স্বাভাবিক জীবনে ফেরা (২–৪ সপ্তাহ)",
                        "why": "ধীরে ধীরে কার্যক্ষমতা বাড়ানো",
                        "guidelines": [
                        "অফিস কাজ — ১ সপ্তাহের পর",
                        "ভারী শারীরিক কাজ — ২–৩ সপ্তাহ",
                        "ড্রাইভিং — ১ সপ্তাহ",
                        "হাঁটা দিয়ে ব্যায়াম শুরু",
                        "৪ সপ্তাহ ভারী লিফটিং নিষেধ"
                        ],
                        "cost": "৳ 0",
                        "timeframe": "২–৪ সপ্তাহ",
                        "important_notes": "শরীরের সিগন্যাল শুনুন"
                    },
                    {
                        "step": 7,
                        "action": "দ্বিতীয় ফলো-আপ — ৬–৮ সপ্তাহ",
                        "why": "পুরোপুরি সেরে ওঠা নিশ্চিত করা",
                        "what_to_expect": [
                        "স্ট্রেস টেস্ট (প্রয়োজনে)",
                        "ব্লাড প্রেসার/কোলেস্টেরল চেক",
                        "এক্সারসাইজ টলারেন্স চেক"
                        ],
                        "cost": "৳ 2,500",
                        "where": "চেম্বার",
                        "timeframe": "একবার",
                        "details": "স্ট্রেস টেস্ট স্টেন্ট ঠিকমতো কাজ করছে কিনা দেখায়"
                    },
                    {
                        "step": 8,
                        "action": "কার্ডিয়াক রিহ্যাব ও জীবনধারা পরিবর্তন",
                        "why": "ভবিষ্যতে ব্লকেজ হওয়া প্রতিরোধ করতে",
                        "includes": [
                        "সুপারভাইজড ব্যায়াম",
                        "ডায়েট পরামর্শ",
                        "ধূমপান সম্পূর্ণ বন্ধ",
                        "স্ট্রেস ম্যানেজমেন্ট"
                        ],
                        "cost": "৳ 15,000–25,000",
                        "where": "Apollo বা Max Hospital রিহ্যাব সেন্টার",
                        "timeframe": "৮ সপ্তাহ",
                        "duration": "প্রয়োজনে বাড়ানো যায়",
                        "important_notes": "লাইফস্টাইল পরিবর্তন ওষুধের মতোই গুরুত্বপূর্ণ"
                    },
                    {
                        "step": 9,
                        "action": "দীর্ঘমেয়াদি ফলো-আপ",
                        "why": "স্টেন্ট ও হৃদযন্ত্রের স্বাস্থ্য নজরে রাখা",
                        "what_happens": [
                        "৩–৬ মাস অন্তর ভিজিট, পরে বছরে একবার",
                        "বার্ষিক রক্ত পরীক্ষা",
                        "বার্ষিক ECG",
                        "ব্লাড প্রেসার ও কোলেস্টেরল ম্যানেজমেন্ট"
                        ],
                        "cost": "৳ 2,000 প্রতি ভিজিট",
                        "where": "ডা. এস. আহমেদের চেম্বার",
                        "timeframe": "চলমান",
                        "critical_notes": "ফলো-আপ না করলে জটিলতা বাড়ার ঝুঁকি থাকে"
                    }
                    ],
                    "EstimatedTime": {
                    "PreTreatment_Phase": "২–৩ সপ্তাহ",
                    "Treatment_Phase": "১ দিন",
                    "PostTreatment_Phase": "৮–১২ সপ্তাহ"
                    },
                    "EstimatedTotalCost": {
                    "low": "৳ 350,000",
                    "typical": "৳ 550,000–700,000",
                    "high": "৳ 900,000+"
                    },
                    "CostBreakdown": {
                    "Pre-procedure tests": "৳ 55,000–80,000",
                    "Angiography (confirmatory)": "৳ 40,000",
                    "Cardiologist consultation": "৳ 5,000",
                    "Procedure (catheterization, angioplasty, stent)": "৳ 200,000–300,000",
                    "Stent (Drug-Eluting preferred for mild blockage)": "৳ 100,000–150,000",
                    "Hospital admission/recovery room": "৳ 10,000",
                    "Post-procedure observation and monitoring": "৳ 8,000",
                    "Medications (first 3 months of DAPT)": "৳ 4,500–6,000",
                    "Follow-up visits (first 3 months)": "৳ 6,000",
                    "Cardiac rehabilitation program": "৳ 20,000",
                    "Total": "৳ 550,000–700,000"
                    },
                    "ActionChecklist": [
                    "ECG, ইকো ও স্ট্রেস টেস্ট শিডিউল করুন",
                    "অ্যাঞ্জিওগ্রাফি বুক করুন",
                    "কার্ডিওলজিস্টের সঙ্গে পরামর্শ",
                    "প্রি-প্রসিডিউর রক্ত পরীক্ষা",
                    "ঔষধ সমন্বয় পরিকল্পনা নিন",
                    "হাসপাতালে ভর্তি বুকিং",
                    "১–২ সপ্তাহ মেডিকেল লিভ",
                    "ফ্যামিলি সাপোর্ট ব্যবস্থা করুন",
                    "বাড়ি রিকভারি প্রস্তুত করুন",
                    "ইনস্যুরেন্স/পেমেন্ট প্রস্তুত",
                    "ওষুধ/অ্যালার্জির তালিকা রাখুন",
                    "প্রসিডিউরের আগের রাত থেকে ফাস্টিং",
                    "কার্ডিয়াক রিহ্যাব শিডিউল",
                    "দৈনিক ওষুধ রিমাইন্ডার সেট করুন"
                    ],
                    "Urgency": "মধ্যম পর্যায়ের জরুরী",
                    "Urgency_Explanation": "লাইট ব্লকেজ হলেও ২–৩ সপ্তাহের মধ্যে সমাধান করা ভালো। জরুরি না, তবে দেরি করাও উচিত নয়।",
                    "Assumptions": [
                    "রোগী প্রক্রিয়ার জন্য মেডিকেলি স্থিতিশীল",
                    "কিডনি ফাংশন ভালো (eGFR >30)",
                    "ডাই বা ওষুধে বড় ধরনের অ্যালার্জি নেই",
                    "ফলো-আপে পরিবার সহায়তা পাবে",
                    "হাসপাতালে বেড পাওয়া যাবে",
                    "রোগী লাইফস্টাইল পরিবর্তনে প্রতিশ্রুতিবদ্ধ",
                    "DAPT নিয়মিত গ্রহণ করবে"
                    ]
                },
                "Explanation": "রহমান (৫২)–এর হালকা করোনারি ব্লকেজ ধরা পড়েছে। তার রক্তে LDL/TG বেশি এবং FPG 219 — এগুলো বড় রিস্ক ফ্যাক্টর। বেলুন অ্যাঞ্জিওপ্লাস্টি স্টেন্টসহ একটি কম ঝুঁকির, দ্রুত সেরে ওঠার পদ্ধতি। মূল চাবিকাঠি: ৬–১২ মাস DAPT নিয়মিত খাওয়া, ধূমপান বন্ধ, ওজন কমানো, ব্যায়াম ও নিয়মিত ফলো-আপ। সফলতার হার ৯৫%+, জটিলতা কম।"
                }
            """;



            // String promptFall =  """
            // {
            //     "is_plan": true,
            //     "Plan": {
            //         "PreTreatment_Phase": [
            //         {
            //             "step": 1,
            //             "action": "Complete remaining diagnostic tests",
            //             "why": "Confirm exact location and severity of coronary blockage before angioplasty",
            //             "tests": ["ECG", "Echocardiogram", "Treadmill/Stress Test"],
            //             "where": "CityPath Diagnostics Ltd. or Apollo Hospital Dhaka",
            //             "cost": "৳ 20,000",
            //             "timeframe": "1-2 weeks",
            //             "details": "Stress test will show how much the blockage affects heart function during exercise"
            //         },
            //         {
            //             "step": 2,
            //             "action": "Coronary angiography (optional confirmatory test)",
            //             "why": "Get detailed imaging of coronary arteries to plan stent placement precisely",
            //             "where": "Apollo Hospital or Max Hospital Dhaka (Cardiac Catheterization Lab)",
            //             "cost": "৳ 35,000-45,000",
            //             "timeframe": "1-2 weeks before procedure",
            //             "details": "This is a minimally invasive procedure where dye is injected to visualize blockage"
            //         },
            //         {
            //             "step": 3,
            //             "action": "Interventional cardiologist consultation",
            //             "why": "Discuss angioplasty procedure details and review imaging results",
            //             "where": "Apollo Hospital or Max Hospital Dhaka",
            //             "cost": "৳ 3,000",
            //             "timeframe": "After diagnostic tests",
            //             "details": "Doctor will explain stent type (drug-eluting or bare metal), procedure duration, and recovery expectations"
            //         },
            //         {
            //             "step": 4,
            //             "action": "Pre-procedure medical checkup",
            //             "why": "Ensure kidney function is adequate (contrast dye is nephrotoxic) and blood pressure is controlled",
            //             "includes": ["Full blood count", "Kidney function test (Creatinine, eGFR)", "Liver function test", "Blood typing", "Clotting profile"],
            //             "where": "CityPath Diagnostics or hospital laboratory",
            //             "cost": "৳ 12,000",
            //             "timeframe": "3-5 days before procedure",
            //             "details": "Poor kidney function may require special precautions with contrast dye; clotting profile ensures safe anticoagulation"
            //         },
            //         {
            //             "step": 5,
            //             "action": "Medication adjustments and preparation",
            //             "why": "Continue heart medications but adjust blood thinners to reduce bleeding risk during procedure",
            //             "adjustments": [
            //             "Continue Atorvastatin 20mg daily",
            //             "Continue Metoprolol 50mg twice daily",
            //             "Continue Aspirin 75mg until day of procedure (may stop morning of)",
            //             "Discuss Clopidogrel (Plavix) loading dose with doctor"
            //             ],
            //             "where": "At home following doctor's written instructions",
            //             "cost": "৳ 0",
            //             "timeframe": "As advised by cardiologist",
            //             "details": "You'll likely need to take Aspirin and Clopidogrel together after stent (dual antiplatelet therapy) for 6-12 months"
            //         }
            //         ],
            //         "Treatment_Phase": [
            //         {
            //             "step": 1,
            //             "action": "Balloon Angioplasty with Stent Placement",
            //             "why": "Open the narrowed coronary artery and place stent to prevent re-blockage",
            //             "procedure_details": {
            //             "type": "Percutaneous Coronary Intervention (PCI) for mild blockage",
            //             "approach": "Femoral artery (groin) or radial artery (wrist) access",
            //             "stent_type": "Drug-Eluting Stent (DES) or Bare Metal Stent (BMS) - doctor will decide",
            //             "what_happens": [
            //                 "Local anesthesia at access site",
            //                 "Guidewire threaded through blockage",
            //                 "Balloon inflated to compress plaque",
            //                 "Stent deployed at blockage site",
            //                 "Angiography repeated to confirm proper positioning",
            //                 "Equipment removed, light compression applied to access site"
            //             ]
            //             },
            //             "expected_outcome": "Restore blood flow through coronary artery, relieve chest pain",
            //             "expected_side_effects": "Mild groin/wrist discomfort, minor bruising, slight pressure feeling during balloon inflation",
            //             "possible_complications": [
            //             "Bleeding at access site (usually minor)",
            //             "Contrast-induced kidney injury (rare with proper hydration)",
            //             "Arrhythmia during procedure (usually self-resolving)",
            //             "Stent thrombosis (very rare, 1-2%)",
            //             "Restenosis (blockage recurrence, higher with BMS)",
            //             "Allergic reaction to contrast dye (rare)"
            //             ],
            //             "cost": "৳ 200,000-300,000",
            //             "stent_cost": "৳ 80,000-150,000 (varies by type and manufacturer)",
            //             "where": "Cardiac Catheterization Lab, Apollo Hospital or Max Hospital Dhaka",
            //             "timeframe": "45-90 minutes",
            //             "special_notes": "For mild blockage, success rate is 95%+. Procedure is less invasive than bypass surgery."
            //         }
            //         ],
            //         "PostTreatment_Phase": [
            //         {
            //             "step": 1,
            //             "action": "Immediate post-procedure observation",
            //             "why": "Monitor for bleeding at access site and detect any immediate complications",
            //             "what_to_expect": [
            //             "Bed rest with pressure dressing on access site for 4-6 hours",
            //             "Continuous cardiac monitoring (ECG, heart rate, oxygen levels)",
            //             "Frequent vital sign checks",
            //             "IV fluids to flush contrast dye and prevent kidney injury",
            //             "Pain management if needed"
            //             ],
            //             "where": "Recovery room/Post-Cath unit, hospital",
            //             "cost": "৳ 8,000",
            //             "timeframe": "4-6 hours",
            //             "red_flags": [
            //             "Bleeding from groin/wrist that doesn't stop with pressure",
            //             "Sudden chest pain or shortness of breath",
            //             "Dizziness or fainting",
            //             "Numbness or coldness in leg/arm below access site"
            //             ]
            //         },
            //         {
            //             "step": 2,
            //             "action": "Same-day or next-day hospital discharge",
            //             "why": "Angioplasty is minimally invasive; most patients go home same day or next morning",
            //             "what_happens": [
            //             "Access site dressing removed after 12-24 hours",
            //             "Discharge instructions and medication list provided",
            //             "Follow-up appointment scheduled",
            //             "Activity restrictions explained"
            //             ],
            //             "where": "Hospital discharge desk",
            //             "cost": "৳ 0 (included in procedure cost)",
            //             "timeframe": "Same day or 24 hours after procedure",
            //             "restrictions": "No heavy lifting for 1 week, no strenuous exercise for 2-3 weeks"
            //         },
            //         {
            //             "step": 3,
            //             "action": "Home recovery and wound care (First 2 weeks)",
            //             "why": "Allow access site to heal completely and monitor for delayed complications",
            //             "what_to_do": [
            //             "Keep groin/wrist clean and dry for first 3-5 days",
            //             "Avoid baths; take showers instead for first 5 days",
            //             "Avoid heavy lifting and strenuous activities",
            //             "Wear loose clothing to avoid pressure on access site",
            //             "Take all medications as prescribed without missing doses",
            //             "Gradually increase activity (walking is encouraged)",
            //             "Drink plenty of water to help flush contrast dye"
            //             ],
            //             "cost": "৳ 3,000 (medications, dressings)",
            //             "where": "At home",
            //             "timeframe": "2 weeks",
            //             "red_flags": [
            //             "Bleeding, pus, or increasing swelling at access site",
            //             "Fever above 38.5°C",
            //             "Severe chest pain (different from before)",
            //             "Shortness of breath at rest",
            //             "Numbness or weakness in leg/arm",
            //             "Large bruising that worsens"
            //             ]
            //         },
            //         {
            //             "step": 4,
            //             "action": "Medication management - Dual Antiplatelet Therapy (DAPT)",
            //             "why": "Prevent blood clots from forming on the stent (critical for first 6-12 months)",
            //             "medications": [
            //             "Aspirin 75mg - once daily indefinitely (after procedure)",
            //             "Clopidogrel (Plavix) 75mg - once daily for 6-12 months depending on stent type",
            //             "Continue Atorvastatin 20mg - once daily (cholesterol control)",
            //             "Continue Metoprolol 50mg - twice daily (heart rate and blood pressure control)"
            //             ],
            //             "cost": "৳ 1,500-2,000 per month",
            //             "timeframe": "6-12 months (DAPT duration)",
            //             "important_notes": "DO NOT SKIP DOSES. Missing even one dose increases stent thrombosis risk. After 6-12 months, Clopidogrel can be stopped but Aspirin continues indefinitely."
            //         },
            //         {
            //             "step": 5,
            //             "action": "First follow-up appointment with cardiologist",
            //             "why": "Assess recovery progress, ensure medications are tolerated, discuss activity resumption",
            //             "what_to_expect": [
            //             "Review access site healing",
            //             "Check blood pressure and heart rate",
            //             "Review medications and side effects",
            //             "Discuss chest symptoms (should be improved or resolved)",
            //             "Clear for gradual return to exercise",
            //             "Repeat ECG if needed"
            //             ],
            //             "cost": "৳ 2,000",
            //             "where": "Dr. S. Ahmed's clinic or hospital outpatient",
            //             "timeframe": "1-2 weeks after discharge",
            //             "what_to_prepare": "Bring medication list, note any symptoms, bring ECG or discharge papers"
            //         },
            //         {
            //             "step": 6,
            //             "action": "Return to work and normal activities (Weeks 2-4)",
            //             "why": "Gradually resume daily activities as healing progresses",
            //             "guidelines": [
            //             "Light office work can resume after 1 week",
            //             "Physical labor should wait 2-3 weeks",
            //             "Sexual activity can resume after 1-2 weeks when comfortable",
            //             "Driving can resume after 1 week if comfortable",
            //             "Exercise can start with walking, gradually increase intensity",
            //             "Avoid heavy lifting and straining for 4 weeks"
            //             ],
            //             "cost": "৳ 0",
            //             "timeframe": "Gradual over 2-4 weeks",
            //             "important_notes": "Listen to your body; stop if chest pain, shortness of breath, or excessive fatigue occurs"
            //         },
            //         {
            //             "step": 7,
            //             "action": "Second follow-up - 6-8 weeks after procedure",
            //             "why": "Ensure full recovery and assess cardiovascular status",
            //             "what_to_expect": [
            //             "Exercise stress test (optional, to confirm stent function)",
            //             "Blood pressure and cholesterol monitoring",
            //             "Assess exercise tolerance",
            //             "Review medication tolerance",
            //             "Discuss long-term preventive strategies"
            //             ],
            //             "cost": "৳ 2,500",
            //             "where": "Dr. S. Ahmed's clinic or hospital",
            //             "timeframe": "One visit",
            //             "details": "Stress test helps confirm stent is functioning and coronary circulation is adequate"
            //         },
            //         {
            //             "step": 8,
            //             "action": "Cardiac rehabilitation and lifestyle modification program",
            //             "why": "Prevent future blockages and improve overall cardiovascular health",
            //             "includes": [
            //             "Supervised treadmill and exercise sessions (2-3 per week)",
            //             "Nutritionist counseling for heart-healthy diet (low salt, low saturated fat)",
            //             "Smoking cessation support (Rahman must quit completely)",
            //             "Stress management and relaxation techniques",
            //             "Blood pressure and weight monitoring"
            //             ],
            //             "cost": "৳ 15,000-25,000 (complete 8-week program)",
            //             "where": "Apollo Hospital or Max Hospital Cardiac Rehab Center",
            //             "timeframe": "8 weeks (2-3 sessions weekly) starting 4-6 weeks after procedure",
            //             "duration": "Can extend if patient shows progress and motivation",
            //             "important_notes": "This is critical for preventing re-blockage. Lifestyle changes are as important as medication."
            //         },
            //         {
            //             "step": 9,
            //             "action": "Long-term follow-up (6 months and annually after)",
            //             "why": "Monitor stent function, prevent complications, manage risk factors",
            //             "what_happens": [
            //             "Regular cardiologist visits every 3-6 months first year, then annually",
            //             "Annual blood tests (lipid profile, kidney function, glucose)",
            //             "Annual ECG",
            //             "Blood pressure monitoring (home and clinic)",
            //             "Cholesterol and diabetes management",
            //             "Assessment of medication tolerance"
            //             ],
            //             "cost": "৳ 2,000 per visit (approximately 2-3 visits yearly)",
            //             "where": "Dr. S. Ahmed's clinic",
            //             "timeframe": "Ongoing indefinitely",
            //             "critical_notes": "Do NOT skip follow-ups. Many post-stent complications occur 6-12 months later if monitoring is poor."
            //         }
            //         ],
            //         "EstimatedTime": {
            //         "PreTreatment_Phase": "2-3 weeks (diagnostic tests and preparation)",
            //         "Treatment_Phase": "1 day (45-90 minute procedure + 4-6 hour recovery)",
            //         "PostTreatment_Phase": "8-12 weeks (discharge in 24 hours, full recovery in 4-6 weeks)"
            //         },
            //         "EstimatedTotalCost": {
            //         "low": "৳ 350,000",
            //         "typical": "৳ 550,000-700,000",
            //         "high": "৳ 900,000+"
            //         },
            //         "CostBreakdown": {
            //         "Pre-procedure tests": "৳ 55,000-80,000",
            //         "Angiography (confirmatory)": "৳ 40,000",
            //         "Cardiologist consultation": "৳ 5,000",
            //         "Procedure (catheterization, angioplasty, stent)": "৳ 200,000-300,000",
            //         "Stent (Drug-Eluting preferred for mild blockage)": "৳ 100,000-150,000",
            //         "Hospital admission/recovery room": "৳ 10,000",
            //         "Post-procedure observation and monitoring": "৳ 8,000",
            //         "Medications (first 3 months of DAPT)": "৳ 4,500-6,000",
            //         "Follow-up visits (first 3 months)": "৳ 6,000",
            //         "Cardiac rehabilitation program (optional but recommended)": "৳ 20,000",
            //         "Total": "৳ 550,000-700,000"
            //         },
            //         "ActionChecklist": ["Schedule ECG, Echocardiogram, and Stress Test", "Book coronary angiography at Apollo/Max Hospital", "Consult interventional cardiologist", "Complete pre-procedure blood work and kidney tests", "Get medication adjustment plan from Dr. S. Ahmed", "Book hospital admission 1 day before", "Arrange medical leave (1-2 weeks)", "Arrange family support during admission", "Prepare home recovery space", "Verify insurance or arrange payment", "Prepare medications and allergies list", "Fast from midnight before procedure", "Plan cardiac rehabilitation schedule", "Set daily medication reminders"],
            //         "Urgency": "Moderately Urgent",
            //         "Urgency_Explanation": "Mild coronary blockage with stable angina symptoms requires intervention within 2-3 weeks to prevent progression. Angioplasty is time-sensitive if symptoms worsen. Not an emergency requiring same-day intervention, but should not delay beyond 3-4 weeks.",
            //         "Assumptions": [
            //         "Patient is medically stable for minimally invasive procedure",
            //         "Kidney function (eGFR) is adequate for contrast dye (eGFR >30)",
            //         "Patient has no severe allergies to contrast dye or medications",
            //         "Family support available for discharge and first 2 weeks",
            //         "Hospital beds available at Apollo or Max Hospital",
            //         "Patient commits to lifestyle changes (smoking cessation, diet, exercise)",
            //         "Patient will strictly adhere to dual antiplatelet therapy",
            //         ]
            //     },
            //     "Explanation": "Rahman (52M) has mild coronary artery disease with stable angina. His test results show an atherogenic lipid profile (high LDL, high triglycerides, low HDL) and borderline diabetes (FPG 219), both major risk factors. The planned Balloon Angioplasty with Stent Placement is minimally invasive and appropriate for mild blockage—much less traumatic than bypass surgery. Pre-procedure phase (2-3 weeks) focuses on confirming blockage location and optimizing kidney function (critical for contrast dye safety). The actual procedure takes 45-90 minutes with 4-6 hour same-day recovery. Post-procedure is divided into immediate recovery (weeks 1-2), activity resumption (weeks 2-4), and cardiac rehabilitation (weeks 6-12). Critical factor: strict adherence to dual antiplatelet therapy (Aspirin + Clopidogrel) for 6-12 months prevents stent thrombosis. Cost varies significantly—private hospitals (৳550k-700k) vs government NICVD (৳150k-250k). Lifestyle changes are non-negotiable: Rahman must quit smoking immediately, follow heart-healthy diet, manage stress, and maintain exercise. Without these, blockage will recur despite the stent. Long-term follow-ups every 3-6 months are essential. The procedure has 95%+ success rate for mild blockages, with low complication rates when properly performed by experienced interventional cardiologists."
            //     }
            //         """;



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