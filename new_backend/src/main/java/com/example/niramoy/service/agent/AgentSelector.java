package com.example.niramoy.service.agent;

import org.springframework.stereotype.Component;

@Component
public class AgentSelector {
    private final ExplainAgent explainAgent;
    private final QnAAgent qnAAgent;
    private final ConsultAgent consultAgent;
    private final PlannerAgent plannerAgent;

    public AgentSelector(ExplainAgent explainAgent, QnAAgent qnAAgent, 
                        ConsultAgent consultAgent, PlannerAgent plannerAgent) {
        this.explainAgent = explainAgent;
        this.qnAAgent = qnAAgent;
        this.consultAgent = consultAgent;
        this.plannerAgent = plannerAgent;
    }

    public Agent selectAgent(String mode) {
        if (mode == null) {
            return explainAgent;    // Default fallback
        }
        
        switch (mode.toLowerCase()) {
            case "explain":
                return explainAgent;
            case "qna":
                return qnAAgent;
            case "consult":
                return consultAgent;
            case "plan":
                return plannerAgent;
            default:
                return explainAgent; // Default fallback
        }
    }
}
