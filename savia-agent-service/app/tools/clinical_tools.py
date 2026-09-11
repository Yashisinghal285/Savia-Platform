import time
from typing import Dict, Any, List
import uuid

# Official ICD-10-CM and SNOMED-CT Clinical Ontology Map for Pediatrics
CLINICAL_ONTOLOGY = {
    "autism": {
        "icd10": {"code": "F84.0", "display": "Autistic disorder"},
        "snomed": {"code": "408856003", "display": "Autism spectrum disorder (disorder)"}
    },
    "speech_delay": {
        "icd10": {"code": "F80.2", "display": "Mixed receptive-expressive language disorder"},
        "snomed": {"code": "229721007", "display": "Expressive language delay (finding)"}
    },
    "articulation": {
        "icd10": {"code": "F80.0", "display": "Phonological disorder"},
        "snomed": {"code": "289190003", "display": "Speech sound disorder (disorder)"}
    },
    "sensory_overload": {
        "icd10": {"code": "R45.89", "display": "Other symptoms and signs involving emotional state"},
        "snomed": {"code": "709230008", "display": "Sensory overload (finding)"}
    },
    "headache": {
        "icd10": {"code": "R51.9", "display": "Headache, unspecified"},
        "snomed": {"code": "25064002", "display": "Headache (finding)"}
    },
    "ear_pain": {
        "icd10": {"code": "H92.09", "display": "Otalgia, unspecified ear"},
        "snomed": {"code": "271807003", "display": "Ear pain (finding)"}
    },
    "abdominal_pain": {
        "icd10": {"code": "R10.9", "display": "Unspecified abdominal pain"},
        "snomed": {"code": "21522000", "display": "Abdominal pain (finding)"}
    },
    "peanut_allergy": {
        "icd10": {"code": "Z91.010", "display": "Allergy to peanuts"},
        "snomed": {"code": "91935009", "display": "Allergy to peanut (disorder)"}
    }
}

def map_clinical_codes(terms: List[str]) -> Dict[str, Any]:
    """Matches text keywords to official ICD-10 & SNOMED CT medical codes."""
    start = time.time()
    matched_icd = []
    matched_snomed = []

    text_blob = " ".join(terms).lower()

    for key, ontology in CLINICAL_ONTOLOGY.items():
        if key in text_blob or key.replace("_", " ") in text_blob:
            matched_icd.append(ontology["icd10"])
            matched_snomed.append(ontology["snomed"])

    # Fallback to general speech/pediatric code if none matched
    if not matched_icd:
        matched_icd.append(CLINICAL_ONTOLOGY["speech_delay"]["icd10"])
        matched_snomed.append(CLINICAL_ONTOLOGY["speech_delay"]["snomed"])

    return {
        "icd10": matched_icd,
        "snomed": matched_snomed,
        "latency_ms": round((time.time() - start) * 1000, 2)
    }

# Official LOINC Clinical Observation Ontology
LOINC_ONTOLOGY = {
    "aac": {"code": "75276-6", "display": "Augmentative and alternative communication device usage"},
    "pain": {"code": "72514-3", "display": "Pain severity - 0-10 verbal numeric rating"},
    "speech": {"code": "96440-3", "display": "Speech-Language Pathology assessment note"},
    "sensory": {"code": "96773-7", "display": "Sensory processing assessment"}
}

def generate_fhir_r4_bundle(patient_name: str, child_id: str, observations: List[Dict[str, Any]], session_notes: str) -> Dict[str, Any]:
    """Generates an interoperable HL7 FHIR Release 4 Clinical Bundle with LOINC and SNOMED CT."""
    start = time.time()
    bundle_id = f"urn:uuid:{uuid.uuid4()}"
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    patient_resource = {
        "fullUrl": f"urn:uuid:{child_id}",
        "resource": {
            "resourceType": "Patient",
            "id": child_id,
            "name": [{"use": "official", "text": patient_name}],
            "gender": "male",
            "active": True
        }
    }

    obs_entries = []
    for obs in observations:
        loinc_code = obs.get("loinc_code", "75276-6")
        loinc_display = obs.get("loinc_display", "Augmentative communication observation")
        snomed_code = obs.get("snomed_code", "229721007")
        snomed_display = obs.get("title", "Clinical Session Observation")

        obs_entries.append({
            "fullUrl": f"urn:uuid:{uuid.uuid4()}",
            "resource": {
                "resourceType": "Observation",
                "status": "final",
                "category": [{
                    "coding": [{
                        "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                        "code": "therapy",
                        "display": "Therapy Session"
                    }]
                }],
                "code": {
                    "coding": [
                        {
                            "system": "http://loinc.org",
                            "code": loinc_code,
                            "display": loinc_display
                        },
                        {
                            "system": "http://snomed.info/sct",
                            "code": snomed_code,
                            "display": snomed_display
                        }
                    ]
                },
                "subject": {"reference": f"Patient/{child_id}"},
                "effectiveDateTime": timestamp,
                "valueString": obs.get("value", session_notes)
            }
        })

    bundle = {
        "resourceType": "Bundle",
        "id": bundle_id,
        "type": "collection",
        "timestamp": timestamp,
        "meta": {
            "profile": ["http://hl7.org/fhir/StructureDefinition/Bundle"]
        },
        "entry": [patient_resource, *obs_entries]
    }

    return {
        "bundle": bundle,
        "entry_count": len(bundle["entry"]),
        "latency_ms": round((time.time() - start) * 1000, 2)
    }
