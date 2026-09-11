import time
from typing import Dict, Any, List

def analyze_sensory_distress(pain_part: str, intensity: int, sensation: str, environment_db: float = 65.0) -> Dict[str, Any]:
    """Analyzes physiological pain & environmental decibels to classify pediatric distress."""
    start = time.time()
    
    # Calculate distress severity
    severity_score = (intensity * 2) + (1.5 if environment_db > 75.0 else 0)
    
    if severity_score >= 6:
        distress_level = "SEVERE"
        cycles = 6
        alert_mother = True
    elif severity_score >= 4:
        distress_level = "MODERATE"
        cycles = 4
        alert_mother = False
    else:
        distress_level = "MILD"
        cycles = 3
        alert_mother = False

    correlated_trigger = "Unknown sensory stimulus"
    if pain_part.lower() in ["head", "ears"] and environment_db > 70.0:
        correlated_trigger = f"Acoustic sensory overload ({environment_db} dB detected in ambient room sound)"
    elif pain_part.lower() == "tummy":
        correlated_trigger = "Gastrointestinal discomfort or anxiety-induced somatic tension"
    elif "throbbing" in sensation.lower():
        correlated_trigger = "Vascular tension / light-sensitive fatigue"

    protocol = f"Step 1: Put on noise-canceling headphones. Step 2: Move to low-lit Calm Corner. Step 3: Perform {cycles} cycles of 4-4-4 Box Breathing."
    if alert_mother:
        protocol += " Step 4: System notified Mother Ananya with urgent telemetry alert."

    return {
        "distress_level": distress_level,
        "correlated_trigger": correlated_trigger,
        "recommended_protocol": protocol,
        "box_breathing_cycles": cycles,
        "alert_triggered": alert_mother,
        "latency_ms": round((time.time() - start) * 1000, 2)
    }
