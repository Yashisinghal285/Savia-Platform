from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.orchestrator import SaviaOrchestrator
from app.schemas.agent_schemas import (
    MasterOrchestrationRequest,
    MasterOrchestrationResponse,
    AACPredictionRequest,
    AACPredictionResponse,
    SensoryDistressRequest,
    SensoryDistressResponse,
    ClinicalNoteSynthesisRequest,
    ClinicalNoteSynthesisResponse
)

app = FastAPI(
    title="Savia Multi-Agent Clinical Orchestration Service",
    description=(
        "Autonomous Multi-Agent AI System for Pediatric Assistive Healthcare, "
        "Adaptive AAC Communication, Sensory De-escalation & HL7 FHIR R4 Synthesis."
    ),
    version="2.0.0"
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = SaviaOrchestrator()

@app.get("/")
def read_root():
    return {
        "service": "Savia Multi-Agent Clinical Orchestration Engine",
        "version": "2.0.0",
        "status": "ONLINE",
        "agents": [
            "Savia_Master_Orchestrator",
            "SLP_Adaptive_AAC_Agent",
            "Sensory_Distress_Watchdog_Agent",
            "FHIR_R4_EHR_Synthesizer_Agent",
            "Voice_Companion_Cognitive_Agent"
        ]
    }

@app.get("/api/agents/health")
def health_check():
    return {
        "status": "healthy",
        "agents_ready": 5,
        "tools_registered": [
            "predict_next_aac_tiles",
            "expand_aac_utterance",
            "analyze_sensory_distress",
            "map_clinical_codes",
            "generate_fhir_r4_bundle",
            "evaluate_phoneme_clarity"
        ]
    }

@app.post("/api/agents/orchestrate", response_model=MasterOrchestrationResponse)
async def orchestrate_event(request: MasterOrchestrationRequest):
    """Executes the complete multi-agent DAG pipeline with live thought traces."""
    try:
        return await orchestrator.orchestrate(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agents/aac-predict", response_model=AACPredictionResponse)
async def predict_aac(request: AACPredictionRequest):
    """Direct invocation for the SLP Adaptive AAC Agent."""
    res = await orchestrator.slp_agent.execute(request.model_dump())
    return AACPredictionResponse(
        predicted_next_tiles=res["predicted_tiles"],
        expanded_sentence=res["expanded_phrase_en"],
        spoken_phrase_hi=res["expanded_phrase_hi"],
        spoken_phrase_en=res["expanded_phrase_en"],
        urgency_level=res["urgency"],
        reasoning_traces=res["traces"]
    )

@app.post("/api/agents/sensory-watchdog", response_model=SensoryDistressResponse)
async def sensory_watchdog(request: SensoryDistressRequest):
    """Direct invocation for the Sensory Distress Watchdog Agent."""
    res = await orchestrator.sensory_agent.execute(request.model_dump())
    return SensoryDistressResponse(
        distress_level=res["distress_level"],
        correlated_trigger=res["correlated_trigger"],
        recommended_protocol=res["protocol"],
        box_breathing_cycles=res["breathing_cycles"],
        emergency_alert_triggered=res["alert_triggered"],
        reasoning_traces=res["traces"]
    )

@app.post("/api/agents/fhir-synthesize", response_model=ClinicalNoteSynthesisResponse)
async def fhir_synthesize(request: ClinicalNoteSynthesisRequest):
    """Direct invocation for the HL7 FHIR R4 Synthesizer Agent."""
    res = await orchestrator.fhir_agent.execute(request.model_dump())
    return ClinicalNoteSynthesisResponse(
        normalized_summary=request.raw_transcript,
        icd10_codes=res["icd10"],
        snomed_ct_codes=res["snomed"],
        milestones_extracted=["Spontaneous AAC communication", "Phonological articulation on track"],
        fhir_r4_bundle=res["fhir_bundle"],
        reasoning_traces=res["traces"]
    )
