from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ToolInvocationRecord(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
    output: Any
    latency_ms: float
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class AgentThoughtStep(BaseModel):
    agent_name: str
    thought: str
    action_type: str # "OBSERVE" | "REASON" | "CALL_TOOL" | "DECIDE" | "SYNTHESIZE"
    tool_call: Optional[ToolInvocationRecord] = None
    confidence: float = 0.95
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ChildContext(BaseModel):
    child_id: str = "child_001"
    name: str = "Reyansh Sharma"
    age: int = 7
    primary_language: str = "en" # "en" | "hi" | "mr" | "ta" | "es"
    conditions: List[str] = ["Autism Spectrum (Level 2)", "Expressive Speech Delay"]
    allergies: List[str] = ["Peanuts (Severe Anaphylaxis)"]
    sensory_triggers: List[str] = ["Sudden loud noises (>75dB)", "Fluorescent flickering lights", "Scratchy clothing tags"]

class AACPredictionRequest(BaseModel):
    child_context: Optional[ChildContext] = None
    selected_tokens: List[str] # e.g. ["I want", "water"]
    recent_soundscape: Optional[str] = "Ocean"
    time_of_day: Optional[str] = "14:30"
    current_mood: Optional[str] = "TIRED"

class AACPredictionResponse(BaseModel):
    predicted_next_tiles: List[Dict[str, Any]]
    expanded_sentence: str
    spoken_phrase_hi: str
    spoken_phrase_en: str
    urgency_level: str # "NORMAL" | "HIGH" | "EMERGENCY"
    reasoning_traces: List[AgentThoughtStep]

class SensoryDistressRequest(BaseModel):
    child_context: Optional[ChildContext] = None
    pain_part: str # "Head", "Tummy", "Ears"
    intensity_level: int # 1, 2, 3
    sensation_type: str # "Throbbing", "Sharp", "Overwhelmed"
    recent_environment_db: Optional[float] = 82.5 # Decibels
    notes: Optional[str] = ""

class SensoryDistressResponse(BaseModel):
    distress_level: str # "MILD" | "MODERATE" | "SEVERE"
    correlated_trigger: str
    recommended_protocol: str
    box_breathing_cycles: int
    emergency_alert_triggered: bool
    reasoning_traces: List[AgentThoughtStep]

class ClinicalNoteSynthesisRequest(BaseModel):
    child_context: Optional[ChildContext] = None
    raw_transcript: str
    therapist_name: str = "Dr. Neha Verma, SLP"
    session_category: str = "SPEECH_THERAPY"

class ClinicalNoteSynthesisResponse(BaseModel):
    normalized_summary: str
    icd10_codes: List[Dict[str, str]]
    snomed_ct_codes: List[Dict[str, str]]
    milestones_extracted: List[str]
    fhir_r4_bundle: Dict[str, Any]
    reasoning_traces: List[AgentThoughtStep]

class MasterOrchestrationRequest(BaseModel):
    child_context: Optional[ChildContext] = None
    event_type: str # "AAC_INPUT" | "SENSORY_DISTRESS" | "CLINICAL_VOICE_NOTE" | "COMPANION_DRILL"
    payload: Dict[str, Any]

class MasterOrchestrationResponse(BaseModel):
    event_type: str
    orchestrator_decision: str
    participating_agents: List[str]
    actions_taken: List[Dict[str, Any]]
    reasoning_traces: List[AgentThoughtStep]
    total_execution_ms: float
    fhir_bundle_generated: Optional[Dict[str, Any]] = None
