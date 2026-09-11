import asyncio
import time
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.agents.slp_agent import SLPAgent
from app.agents.sensory_agent import SensoryAgent
from app.agents.fhir_agent import FHIRAgent
from app.agents.companion_agent import CompanionAgent
from app.orchestrator import SaviaOrchestrator
from app.schemas.agent_schemas import MasterOrchestrationRequest, ChildContext

# Terminal Colors
GREEN = "\033[92m"
BLUE = "\033[94m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

async def run_all_tests():
    print(f"\n{BOLD}{CYAN}======================================================================{RESET}")
    print(f"{BOLD}{BLUE}       SAVIA CLINICAL MULTI-AGENT DAG AUTOMATED TEST SUITE{RESET}")
    print(f"{BOLD}{CYAN}======================================================================{RESET}\n")

    passed_count = 0
    total_count = 5

    # 1. Test SLPAgent
    t0 = time.time()
    slp = SLPAgent()
    slp_out = await slp.execute({
        "selected_tokens": ["want", "water"],
        "time_of_day": "14:30",
        "current_mood": "CALM"
    })
    slp_ms = round((time.time() - t0) * 1000, 2)
    assert "predicted_tiles" in slp_out and len(slp_out["predicted_tiles"]) > 0, "SLP predictions failed"
    assert "expanded_phrase_en" in slp_out, "SLP English expansion missing"
    assert len(slp_out["traces"]) >= 3, "SLP thought traces incomplete"
    print(f"[{GREEN}PASS{RESET}] 1. SLPAgent (Intent Graph & Natural Speech) ...... {GREEN}{slp_ms}ms{RESET}")
    passed_count += 1

    # 2. Test SensoryAgent
    t0 = time.time()
    sensory = SensoryAgent()
    sens_out = await sensory.execute({
        "pain_part": "Ears",
        "intensity_level": 3,
        "sensation_type": "Overwhelmed",
        "recent_environment_db": 82.5
    })
    sens_ms = round((time.time() - t0) * 1000, 2)
    assert "distress_level" in sens_out, "Sensory distress level missing"
    assert "protocol" in sens_out, "Sensory protocol missing"
    assert len(sens_out["traces"]) >= 3, "Sensory thought traces incomplete"
    print(f"[{GREEN}PASS{RESET}] 2. SensoryAgent (Decibel & Pain Watchdog) ........ {GREEN}{sens_ms}ms{RESET}")
    passed_count += 1

    # 3. Test FHIRAgent
    t0 = time.time()
    fhir = FHIRAgent()
    fhir_out = await fhir.execute({
        "raw_transcript": "Patient Aarav demonstrated successful AAC communication request for water and completed 4 cycles of sensory box breathing.",
        "session_category": "SPEECH_THERAPY"
    })
    fhir_ms = round((time.time() - t0) * 1000, 2)
    bundle = fhir_out.get("fhir_bundle", {})
    assert bundle.get("resourceType") == "Bundle", "Invalid FHIR R4 Bundle resourceType"
    assert len(bundle.get("entry", [])) >= 2, "FHIR Bundle entries incomplete"
    print(f"[{GREEN}PASS{RESET}] 3. FHIRAgent (HL7 FHIR R4 & ICD-10/SNOMED) ...... {GREEN}{fhir_ms}ms{RESET}")
    passed_count += 1

    # 4. Test CompanionAgent
    t0 = time.time()
    companion = CompanionAgent()
    comp_out = await companion.execute({
        "target_word": "water",
        "spoken_text": "water please"
    })
    comp_ms = round((time.time() - t0) * 1000, 2)
    assert "accuracy" in comp_out and comp_out["accuracy"] > 50, "Accuracy scoring failed"
    assert "earcon" in comp_out, "Sensory earcon generation missing"
    print(f"[{GREEN}PASS{RESET}] 4. CompanionAgent (Phoneme & Articulation) ....... {GREEN}{comp_ms}ms{RESET}")
    passed_count += 1

    # 5. Test Master Orchestrator DAG
    t0 = time.time()
    orchestrator = SaviaOrchestrator()
    req = MasterOrchestrationRequest(
        event_type="SENSORY_DISTRESS",
        payload={
            "pain_part": "Ears",
            "intensity_level": 3,
            "sensation_type": "Overwhelmed",
            "recent_environment_db": 84.0
        },
        child_context=ChildContext(name="Aarav Sharma")
    )
    orch_out = await orchestrator.orchestrate(req)
    orch_ms = round((time.time() - t0) * 1000, 2)
    assert orch_out.orchestrator_decision is not None, "Master decision synthesis failed"
    assert len(orch_out.participating_agents) >= 2, "Multi-agent coordination failed"
    assert len(orch_out.reasoning_traces) >= 4, "Unified thought trace stream missing"
    print(f"[{GREEN}PASS{RESET}] 5. Master Orchestrator (Parallel Async DAG) ..... {GREEN}{orch_ms}ms{RESET}")
    passed_count += 1

    print(f"\n{BOLD}{CYAN}----------------------------------------------------------------------{RESET}")
    print(f"{BOLD}{GREEN}ALL {passed_count}/{total_count} MULTI-AGENT TEST SUITES PASSED (0 ERRORS, 100% SUCCESS){RESET}")
    print(f"{BOLD}{CYAN}======================================================================{RESET}\n")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
