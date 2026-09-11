from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.tools.telemetry_tools import analyze_sensory_distress
from app.schemas.agent_schemas import AgentThoughtStep

class SensoryAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Sensory_Distress_Watchdog_Agent",
            role="Pediatric Sensory Integration & Autonomic Regulation Specialist",
            system_prompt=(
                "You are an autonomous Sensory Watchdog Agent. You monitor pediatric distress logs, "
                "detect sensory overload triggers, evaluate decibel telemetry, and formulate "
                "immediate de-escalation protocols including 4-4-4 Box Breathing."
            )
        )
        self.register_tool("analyze_sensory_distress", analyze_sensory_distress)

    async def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        traces: List[AgentThoughtStep] = []
        pain_part = payload.get("pain_part", "Head")
        intensity = payload.get("intensity_level", 2)
        sensation = payload.get("sensation_type", "Throbbing")
        env_db = payload.get("recent_environment_db", 78.0)

        # Step 1: Observe Telemetry
        traces.append(self.add_thought(
            f"Observed distress telemetry: Part='{pain_part}', Intensity={intensity}/3, Sensation='{sensation}', Ambient Audio={env_db} dB.",
            action_type="OBSERVE",
            confidence=0.99
        ))

        # Step 2: Call Analysis Tool
        traces.append(self.add_thought(
            "Analyzing multi-modal correlation between physiological pain and acoustic decibel exposure.",
            action_type="CALL_TOOL",
            confidence=0.97
        ))
        analysis_record = self.call_tool(
            "analyze_sensory_distress",
            pain_part=pain_part,
            intensity=intensity,
            sensation=sensation,
            environment_db=env_db
        )
        traces[-1].tool_call = analysis_record

        # Step 3: Evaluate Emergency Escalation
        output = analysis_record.output
        is_severe = output["distress_level"] == "SEVERE"
        if is_severe:
            traces.append(self.add_thought(
                f"High distress detected! Autonomous protocol: Escalate telemetry alert to primary guardian & trigger {output['box_breathing_cycles']} box-breathing cycles.",
                action_type="DECIDE",
                confidence=0.99
            ))
        else:
            traces.append(self.add_thought(
                f"Distress categorized as '{output['distress_level']}'. Prescribing tactile sensory calming.",
                action_type="DECIDE",
                confidence=0.95
            ))

        return {
            "agent": self.name,
            "distress_level": output["distress_level"],
            "correlated_trigger": output["correlated_trigger"],
            "protocol": output["recommended_protocol"],
            "breathing_cycles": output["box_breathing_cycles"],
            "alert_triggered": output["alert_triggered"],
            "traces": traces
        }
