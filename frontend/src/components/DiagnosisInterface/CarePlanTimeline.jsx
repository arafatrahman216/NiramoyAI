import React from 'react';
import { Clock, MapPin, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const CarePlanTimeline = ({ careData }) => {
  // Debug logging
  console.log('=== CARE PLAN TIMELINE COMPONENT ===');
  console.log('careData type:', typeof careData);
  console.log('careData value:', careData);
  console.log('careData is null:', careData === null);
  console.log('careData is undefined:', careData === undefined);
  if (careData) {
    console.log('careData keys:', Object.keys(careData));
    if (careData.Plan) {
      console.log('Plan keys:', Object.keys(careData.Plan));
    }
  }
  
  // Default dummy data if no careData is provided
  const defaultCareData = {
    "Plan": {
      "PreTreatment_Phase": [
        {
          "step": 1,
          "action": "Consult your cardiologist or surgeon immediately.",
          "why": "To discuss your upcoming heart surgery and any pre-operative preparations needed. This is crucial for a safe procedure.",
          "where": "Max hospital",
          "cost": "300",
          "timeframe": "Within 24 hours – this is vital.",
          "this_step_importance": "low"
        },
        {
          "step": 2,
          "action": "Complete all pre-operative tests and assessments as directed by your surgeon.",
          "why": "These tests help determine your overall health and readiness for surgery, ensuring a safer procedure.",
          "where": "Your doctor's office or a designated testing facility.",
          "cost": "Varies greatly depending on tests ordered (blood work, EKG, chest X-ray, etc.). Expect $200-$1000.",
          "timeframe": "As soon as possible, following your consultation.",
          "this_step_importance": "high"
        }
      ],
      "Treatment_Phase": [
        {
          "step": 1,
          "action": "Heart Surgery",
          "expected_side_effects": "Pain, swelling, bruising, infection, bleeding, complications related to anesthesia. Your surgeon will discuss specific risks.",
          "cost": "5000",
          "why": "To address the underlying heart condition.",
          "where": "",
          "timeframe": "7 days",
          "this_step_importance": "high"
        }
      ],
      "PostTreatment_Phase": [
        {
          "step": 1,
          "action": "Hospital Stay",
          "when": "Immediately following surgery.",
          "where": "Max Hospital",
          "cost": "1000",
          "why": "need to heal",
          "timeframe": "7 days",
          "red_flags": ["Excessive bleeding", "Chest pain", "Shortness of breath", "High fever", "Swelling in legs"],
          "this_step_importance": "high"
        },
        {
          "step": 2,
          "action": "Follow-up appointments",
          "when": "Scheduled by your cardiologist or surgeon.",
          "where": "Max Hospital",
          "cost": "1000",
          "why": "checkup",
          "timeframe": "come after 10 days",
          "red_flags": ["Unexplained weight gain", "Fatigue", "Persistent cough"],
          "this_step_importance": "moderate"
        }
      ],
      "EstimatedTime": {
        "PreTreatment_Phase": "1",
        "Treatment_Phase": "2",
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
  };

  // Use provided data or fall back to dummy data
  const data = careData || defaultCareData;

  // Safe access to Plan data with fallbacks
  const planData = data?.Plan || defaultCareData.Plan;

  // Combine all steps from all phases in order
  const allSteps = [
    ...(planData?.PreTreatment_Phase || []),
    ...(planData?.Treatment_Phase || []),
    ...(planData?.PostTreatment_Phase || [])
  ];

  // Get color based on importance with glowing effects - updated color scheme
  const getImportanceColor = (importance) => {
    importance = importance?.toLowerCase();
    switch (importance) {
      case 'high': 
        return {
          bg: 'bg-red-500',
          glow: 'shadow-red-500/60 shadow-2xl',
          border: 'border-red-400',
          text: 'text-red-400'
        };
      case 'moderate': 
        return {
          bg: 'bg-yellow-500',
          glow: 'shadow-yellow-500/60 shadow-2xl',
          border: 'border-yellow-400',
          text: 'text-yellow-400'
        };
      case 'low': 
        return {
          bg: 'bg-emerald-500',
          glow: 'shadow-emerald-500/60 shadow-2xl',
          border: 'border-emerald-400',
          text: 'text-emerald-400'
        };
      default: 
        return {
          bg: 'bg-emerald-500',
          glow: 'shadow-emerald-500/60 shadow-2xl',
          border: 'border-emerald-400',
          text: 'text-emerald-400'
        };
    }
  };

  const getUrgencyStyle = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-950/50 text-red-200 border-red-800/60 backdrop-blur-sm';
      case 'emergency — go to er now':
        return 'bg-red-950/70 text-red-100 border-red-700/80 animate-pulse backdrop-blur-sm';
      case 'within 1 week':
        return 'bg-amber-950/50 text-amber-200 border-amber-800/60 backdrop-blur-sm';
      default:
        return 'bg-emerald-950/50 text-emerald-200 border-emerald-800/60 backdrop-blur-sm';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 text-zinc-100">
      {/* Modern Urgency Alert */}
      {planData?.Urgency && (
        <div className={`mb-6 p-4 rounded-2xl border text-center ${getUrgencyStyle(planData.Urgency)}`}>
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium text-base">
              {planData.Urgency === 'urgent' ? 'Urgent Medical Plan' : 
               planData.Urgency === 'emergency — go to er now' ? 'Emergency - Seek Immediate Care' :
               `Medical Plan - ${planData.Urgency}`}
            </span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line - glowy and vibrant */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 h-full shadow-emerald-400/50 shadow-lg opacity-80"></div>

        {allSteps.map((step, index) => {
          const isRight = index % 2 === 0;
          const colors = getImportanceColor(step.this_step_importance);
          
          return (
            <div key={index} className="relative" style={{ marginBottom: index === allSteps.length - 1 ? '2rem' : '4rem' }}>
              {/* Timeline node - bigger and glowy */}
                {/* <div className={`absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-2xl hover:rounded-full border-0 ${colors.bg} z-20 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out hover:scale-105 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg ring-1 ring-gradient-to-r ring-from-transparent ring-to-white/10 ${colors.glow}`}> */}
                {/* <div className={`absolute left-1/2 transform -translate-x-1/2 w-11 h-11 rounded-2xl border-0 ${colors.bg} z-20 flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl backdrop-blur-xl bg-gradient-to-br from-white/10 via-transparent to-black/5 ring-1 ring-white/10 hover:ring-white/25 ${colors.glow} group-hover:animate-spin-slow`}> */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 w-11 h-11 rounded-3xl border-0 ${colors.bg} z-20 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-0.5 ring-1 ring-black/5 backdrop-blur-sm ${colors.glow} group`}>

                {/* <div className="w-3 h-3 bg-white rounded-full shadow-inner"></div> */}
              </div>
              
              {/* Dotted line from node to content - emerald green */}
              <div 
                className={`absolute top-5 ${
                  isRight 
                    ? 'left-1/2 w-20' 
                    : 'right-1/2 w-20'
                }`}
                style={{
                  borderTop: '3px dotted rgba(52, 211, 153, 0.6)',
                  height: '4px',
                  transform: isRight ? 'translateX(40px)' : 'translateX(-40px)'
                }}
              ></div>
              
              {/* Content card - positioned to start from midpoint of previous card */}
              <div 
                className={`w-5/12 ${isRight ? 'ml-auto pl-20' : 'mr-auto pr-20'}`}
                style={{ 
                  marginTop: index === 0 ? '0' : '-12rem' // Start from midpoint of previous card
                }}
              >
                                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/60 backdrop-blur-sm hover:bg-zinc-900/70 hover:border-zinc-700/70 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10">
                  {/* Action title */}
                  <h3 className="text-base font-semibold text-zinc-100 mb-3 leading-tight">
                    {step.action}
                  </h3>
                  
                  {/* Why */}
                  <div className="mb-4">
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      <span className="text-emerald-400 font-medium">Purpose:</span> {step.why}
                    </p>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 gap-2 text-sm mb-3">
                    {/* Where */}
                    {step.where && (
                      <div className="flex items-center text-zinc-300">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                        <span className="text-zinc-400">{step.where}</span>
                      </div>
                    )}
                    
                    {/* Cost */}
                    {step.cost && (
                      <div className="flex items-center text-zinc-300">
                        <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
                        <span className="text-zinc-400">${step.cost}</span>
                      </div>
                    )}
                    
                    {/* Timeframe */}
                    {step.timeframe && (
                      <div className="flex items-center text-zinc-300">
                        <Clock className="w-4 h-4 mr-2 text-emerald-400" />
                        <span className="text-zinc-400">{step.timeframe}</span>
                      </div>
                    )}
                  </div>

                  {/* Expected side effects */}
                  {step.expected_side_effects && (
                    <div className="mt-3 p-3 bg-amber-950/20 border border-amber-800/30 rounded-lg">
                      <p className="text-xs text-amber-200">
                        <span className="font-medium text-amber-300">Side Effects:</span> {step.expected_side_effects}
                      </p>
                    </div>
                  )}

                  {/* Red flags */}
                  {step.red_flags && (
                    <div className="mt-3 p-3 bg-red-950/20 border border-red-800/30 rounded-lg">
                      <p className="text-xs text-red-200 font-medium mb-2 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1 text-red-400" />
                        Warning Signs:
                      </p>
                      <ul className="text-xs text-red-200 space-y-1">
                        {step.red_flags.map((flag, flagIndex) => (
                          <li key={flagIndex} className="flex items-start">
                            <span className="text-red-400 mr-1 text-xs">•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Importance indicator */}
                  <div className="mt-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-white text-xs font-medium ${colors.bg} ${colors.glow} opacity-90`}>
                      {step.this_step_importance?.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Checklist */}
      {planData?.ActionChecklist && planData.ActionChecklist.length > 0 && (
        <div className="mt-6 bg-zinc-900/30 rounded-2xl p-4 border border-zinc-800/40 backdrop-blur-sm">
          <div className="flex items-center mb-4 pb-2 border-b border-zinc-800/50">
            <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
            <h2 className="text-base font-medium text-zinc-200">Action Items</h2>
          </div>
          <div className="space-y-2">
            {planData.ActionChecklist.map((item, index) => (
              <label key={index} className="flex items-start p-2 rounded-lg hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="mt-1 mr-3 w-3.5 h-3.5 text-emerald-600 bg-zinc-800 border-zinc-600 rounded focus:ring-emerald-500 focus:ring-1" 
                />
                <span className="text-zinc-300 text-sm leading-relaxed group-hover:text-zinc-200">{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Cost Estimate */}
      {planData?.EstimatedTotalCost && (
        <div className="mt-4 bg-zinc-900/30 rounded-2xl p-4 border border-zinc-800/40 backdrop-blur-sm">
          <div className="flex items-center mb-3 pb-2 border-b border-zinc-800/50">
            <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
            <h2 className="text-base font-medium text-zinc-200">Cost Estimate</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
              <div className="text-emerald-400 font-medium text-xs mb-1">Low</div>
              <div className="text-zinc-200 text-sm font-medium">{planData.EstimatedTotalCost.low}</div>
            </div>
            <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
              <div className="text-blue-400 font-medium text-xs mb-1">Typical</div>
              <div className="text-zinc-200 text-sm font-medium">{planData.EstimatedTotalCost.typical}</div>
            </div>
            <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
              <div className="text-amber-400 font-medium text-xs mb-1">High</div>
              <div className="text-zinc-200 text-sm font-medium">{planData.EstimatedTotalCost.high}</div>
            </div>
          </div>
        </div>
      )}

      {/* Assumptions */}
      {planData?.Assumptions && planData.Assumptions.length > 0 && (
        <div className="mt-4 bg-zinc-900/20 rounded-2xl p-4 border border-zinc-800/30 backdrop-blur-sm">
          <div className="flex items-center mb-3 pb-2 border-b border-zinc-800/40">
            <div className="w-4 h-4 mr-2 bg-zinc-600 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></div>
            </div>
            <h2 className="text-base font-medium text-zinc-200">Plan Assumptions</h2>
          </div>
          <div className="space-y-2">
            {planData.Assumptions.map((assumption, index) => (
              <div key={index} className="flex items-start text-sm">
                <span className="text-emerald-400 mr-2 mt-1.5 text-xs">•</span>
                <span className="text-zinc-300 leading-relaxed">{assumption}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarePlanTimeline;
