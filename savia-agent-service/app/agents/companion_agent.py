import time
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.schemas.agent_schemas import AgentThoughtStep

def evaluate_phoneme_clarity(target_word: str, spoken_audio_text: str) -> Dict[str, Any]:
    """Calculates phonetic matching accuracy and phoneme production score."""
    start = time.time()
    t = target_word.strip().lower()
    s = spoken_audio_text.strip().lower()

    if t == s:
        accuracy = 100.0
        feedback = "Perfect clear articulation! ⭐⭐⭐"
        reward_earcon = "sparkle"
    elif t in s or s in t:
        accuracy = 80.0
        feedback = "Great attempt! Keep practicing that sound! ⭐⭐"
        reward_earcon = "success"
    else:
        accuracy = 55.0
        feedback = "Good try! Let's listen together again. ⭐"
        reward_earcon = "tap"

    return {
        "target": target_word,
        "spoken": spoken_audio_text,
        "accuracy_score": accuracy,
        "feedback": feedback,
        "earcon": reward_earcon,
        "latency_ms": round((time.time() - start) * 1000, 2)
    }

class CompanionAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Voice_Companion_Cognitive_Agent",
            role="Interactive Pediatric Voice & Articulation Coach",
            system_prompt=(
                "You are an encouraging, empathetic pediatric voice companion. You guide "
                "children through speech drills, evaluate articulation clarity, and provide "
                "sensory-friendly auditory rewards."
            )
        )
        self.register_tool("evaluate_phoneme_clarity", evaluate_phoneme_clarity)

    async def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        traces: List[AgentThoughtStep] = []
        target = payload.get("target_word", "Water")
        spoken = payload.get("spoken_audio_text", "Wawa")

        # Step 1: Observe Speech Input
        traces.append(self.add_thought(
            f"Observed audio phoneme attempt: Target='{target}', Spoken='{spoken}'. Evaluating acoustic clarity.",
            action_type="OBSERVE",
            confidence=0.98
        ))

        # Step 2: Call Phoneme Evaluation Tool
        traces.append(self.add_thought(
            "Calling phoneme matching engine to compute articulation accuracy and reward level.",
            action_type="CALL_TOOL",
            confidence=0.96
        ))
        eval_record = self.call_tool("evaluate_phoneme_clarity", target_word=target, spoken_audio_text=spoken)
        traces[-1].tool_call = eval_record

        # Step 3: Decision
        score = eval_record.output["accuracy_score"]
        traces.append(self.add_thought(
            f"Accuracy computed at {score}%. Awarding auditory earcon '{eval_record.output['earcon']}'.",
            action_type="DECIDE",
            confidence=0.99
        ))

        return {
            "agent": self.name,
            "accuracy": score,
            "feedback": eval_record.output["feedback"],
            "earcon": eval_record.output["earcon"],
            "traces": traces
        }
