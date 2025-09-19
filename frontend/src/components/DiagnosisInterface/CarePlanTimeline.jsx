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

  // Get color based on importance with glowing effects
  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'high': 
        return {
          bg: 'bg-red-500',
          glow: 'shadow-red-500/50 shadow-2xl',
          border: 'border-red-400',
          text: 'text-red-400'
        };
      case 'moderate': 
        return {
          bg: 'bg-yellow-500',
          glow: 'shadow-yellow-500/50 shadow-2xl',
          border: 'border-yellow-400',
          text: 'text-yellow-400'
        };
      case 'low': 
        return {
          bg: 'bg-green-500',
          glow: 'shadow-green-500/50 shadow-2xl',
          border: 'border-green-400',
          text: 'text-green-400'
        };
      default: 
        return {
          bg: 'bg-gray-500',
          glow: 'shadow-gray-500/50 shadow-2xl',
          border: 'border-gray-400',
          text: 'text-gray-400'
        };
    }
  };

  const getUrgencyStyle = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-900/80 text-red-300 border-red-500 shadow-red-500/50 shadow-2xl';
      case 'emergency — go to er now':
        return 'bg-red-900 text-red-200 border-red-400 animate-pulse shadow-red-600/70 shadow-2xl';
      case 'soon (days)':
        return 'bg-yellow-900/80 text-yellow-300 border-yellow-500 shadow-yellow-500/50 shadow-2xl';
      default:
        return 'bg-blue-900/80 text-blue-300 border-blue-500 shadow-blue-500/50 shadow-2xl';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-black min-h-screen text-gray-100">
      {/* Urgency Banner */}
      {planData?.Urgency && (
        <div className={`mb-12 p-6 rounded-xl border-2 text-center font-bold text-xl ${getUrgencyStyle(planData.Urgency)}`}>
          <AlertTriangle className="inline-block mr-3 w-8 h-8" />
          URGENCY: {planData.Urgency}
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line with glow */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-green-400 to-green-600 h-full shadow-green-400/50 shadow-lg"></div>

        {allSteps.map((step, index) => {
          const isRight = index % 2 === 0;
          const colors = getImportanceColor(step.this_step_importance);
          
          return (
            <div key={index} className="relative mb-4">
              {/* Timeline node - bigger and more vibrant */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-4 border-black ${colors.bg} ${colors.glow} z-20 flex items-center justify-center`}>
                <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
              </div>
              
              {/* Dotted line from node to content */}
              <div 
                className={`absolute top-6 ${
                  isRight 
                    ? 'left-1/2 ml-6 w-20' 
                    : 'right-1/2 mr-6 w-20'
                }`}
                style={{
                  borderTop: '2px dotted rgba(74, 222, 128, 0.6)',
                  height: '2px'
                }}
              ></div>
              
              {/* Content card */}
              <div className={`w-5/12 ${isRight ? 'ml-auto pl-24' : 'mr-auto pr-24'}`}>
                <div className="bg-gray-900/80 rounded-2xl shadow-2xl p-8 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300 hover:shadow-green-500/20">
                  {/* Action title */}
                  <h3 className="text-lg font-bold text-green-300 mb-3 leading-tight">
                    {step.action}
                  </h3>
                  
                  {/* Why */}
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <span className="text-green-400 font-semibold">Why:</span> {step.why}
                    </p>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 gap-3 text-sm mb-3">
                    {/* Where */}
                    {step.where && (
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                        <span><span className="text-blue-400 font-semibold">Where:</span> {step.where}</span>
                      </div>
                    )}
                    
                    {/* Cost */}
                    {step.cost && (
                      <div className="flex items-center text-gray-300">
                        <DollarSign className="w-5 h-5 mr-3 text-green-400" />
                        <span><span className="text-green-400 font-semibold">Cost:</span> ${step.cost}</span>
                      </div>
                    )}
                    
                    {/* Timeframe */}
                    {step.timeframe && (
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-3 text-purple-400" />
                        <span><span className="text-purple-400 font-semibold">Timeframe:</span> {step.timeframe}</span>
                      </div>
                    )}
                  </div>

                  {/* Expected side effects */}
                  {step.expected_side_effects && (
                    <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
                      <p className="text-sm text-yellow-300">
                        <span className="font-semibold text-yellow-400">Expected Side Effects:</span> {step.expected_side_effects}
                      </p>
                    </div>
                  )}

                  {/* Red flags */}
                  {step.red_flags && (
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-600/50 rounded-lg">
                      <p className="text-sm text-red-300 font-medium mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                        Red Flags - Seek immediate medical attention:
                      </p>
                      <ul className="text-sm text-red-300 list-disc list-inside space-y-1">
                        {step.red_flags.map((flag, flagIndex) => (
                          <li key={flagIndex}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Importance indicator */}
                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-black text-xs font-bold ${colors.bg} ${colors.glow}`}>
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
        <div className="mt-16 bg-gray-900/80 rounded-2xl shadow-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-green-300 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
            Action Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {planData.ActionChecklist.map((item, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-800/60 rounded-xl border border-gray-600/40">
                <input 
                  type="checkbox" 
                  className="mt-1 mr-3 w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2" 
                />
                <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Estimate */}
      {planData?.EstimatedTotalCost && (
        <div className="mt-8 bg-gray-900/80 rounded-xl p-4 border border-gray-700/50">
          <h2 className="text-lg font-bold text-green-300 mb-3">Estimated Cost</h2>
          <div className="flex justify-between text-center text-sm">
            <div>
              <div className="text-green-400 font-semibold">Low</div>
              <div className="text-green-300">{planData.EstimatedTotalCost.low}</div>
            </div>
            <div>
              <div className="text-blue-400 font-semibold">Typical</div>
              <div className="text-blue-300">{planData.EstimatedTotalCost.typical}</div>
            </div>
            <div>
              <div className="text-red-400 font-semibold">High</div>
              <div className="text-red-300">{planData.EstimatedTotalCost.high}</div>
            </div>
          </div>
        </div>
      )}

      {/* Assumptions */}
      {planData?.Assumptions && planData.Assumptions.length > 0 && (
        <div className="mt-8 bg-gray-800/60 rounded-xl p-4 border border-gray-600/40">
          <h2 className="text-lg font-bold text-green-300 mb-4">Assumptions</h2>
          <div className="text-gray-300 leading-relaxed text-sm">
            {planData.Assumptions.map((assumption, index) => (
              <p key={index} className="mb-2 flex items-start">
                <span className="text-green-400 mr-2 text-sm">•</span>
                <span>{assumption}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarePlanTimeline;
