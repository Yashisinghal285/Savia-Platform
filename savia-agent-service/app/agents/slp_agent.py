from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.tools.aac_tools import predict_next_aac_tiles, expand_aac_utterance
from app.schemas.agent_schemas import AgentThoughtStep

class SLPAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="SLP_Adaptive_AAC_Agent",
            role="Speech Language Pathology & Assistive AAC Specialist",
            system_prompt=(
                "You are an expert pediatric SLP AI Agent. Your goal is to maximize communicative "
                "autonomy for non-verbal and speech-delayed children. You predict vocabulary needs, "
                "expand fragmented pictograms into natural speech, and adapt communication boards."
            )
        )
        self.register_tool("predict_next_aac_tiles", predict_next_aac_tiles)
        self.register_tool("expand_aac_utterance", expand_aac_utterance)

    async def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        traces: List[AgentThoughtStep] = []
        tokens = payload.get("selected_tokens", [])
        time_of_day = payload.get("time_of_day", "14:00")
        mood = payload.get("current_mood", "CALM")

        # Step 1: Observe
        traces.append(self.add_thought(
            f"Observed incoming AAC chip sequence: {tokens}. Current mood is {mood} at {time_of_day}.",
            action_type="OBSERVE",
            confidence=0.98
        ))

        # Step 2: Call predictive vocabulary tool
        traces.append(self.add_thought(
            "Querying contextual intent graph to predict top next-word communication chips.",
            action_type="CALL_TOOL",
            confidence=0.95
        ))
        pred_record = self.call_tool("predict_next_aac_tiles", tokens=tokens, time_of_day=time_of_day, mood=mood)
        traces[-1].tool_call = pred_record

        # Step 3: Call utterance expansion tool
        traces.append(self.add_thought(
            "Expanding token sequence into natural, high-clarity bilingual voice synthesis.",
            action_type="CALL_TOOL",
            confidence=0.96
        ))
        exp_record = self.call_tool("expand_aac_utterance", tokens=tokens)
        traces[-1].tool_call = exp_record

        # Step 4: Decision & Synthesis
        urgency = exp_record.output["urgency"]
        traces.append(self.add_thought(
            f"Formulated adaptive board plan with urgency classification '{urgency}'. Ready for speech output.",
            action_type="DECIDE",
            confidence=0.99
        ))

        return {
            "agent": self.name,
            "predicted_tiles": pred_record.output["predictions"],
            "expanded_phrase_en": exp_record.output["en"],
            "expanded_phrase_hi": exp_record.output["hi"],
            "urgency": urgency,
            "traces": traces
        }
