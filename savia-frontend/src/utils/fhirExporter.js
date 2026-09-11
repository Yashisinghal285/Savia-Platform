/**
 * Savia HL7 FHIR R4 Clinical Bundle Exporter
 * Generates standardized FHIR R4 JSON bundles for EHR interoperability.
 */

export function generateFHIRBundle(patientInfo = {}, sessionLogs = [], painHistory = [], customCards = []) {
  const patientId = patientInfo.id ? `pat-${patientInfo.id}` : 'pat-reyansh-sharma';
  const timestamp = new Date().toISOString();

  const bundle = {
    resourceType: "Bundle",
    id: `bundle-savia-${Date.now()}`,
    type: "document",
    timestamp: timestamp,
    meta: {
      profile: ["http://hl7.org/fhir/StructureDefinition/document"],
      lastUpdated: timestamp
    },
    entry: [
      // 1. Patient Resource
      {
        fullUrl: `urn:uuid:${patientId}`,
        resource: {
          resourceType: "Patient",
          id: patientId,
          active: true,
          name: [
            {
              use: "official",
              family: patientInfo.lastName || "Sharma",
              given: [patientInfo.firstName || "Reyansh"]
            }
          ],
          gender: "male",
          birthDate: patientInfo.dateOfBirth || "2017-06-10",
          extension: [
            {
              url: "http://savia.care/fhir/StructureDefinition/developmental-condition",
              valueString: patientInfo.disabilityType || "Autism Spectrum Disorder (Level 2)"
            }
          ]
        }
      },

      // 2. Clinical Condition (Autism Spectrum / Speech Delay)
      {
        fullUrl: `urn:uuid:cond-asd-01`,
        resource: {
          resourceType: "Condition",
          id: "cond-asd-01",
          clinicalStatus: {
            coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }]
          },
          verificationStatus: {
            coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "confirmed" }]
          },
          category: [
            {
              coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-category", code: "encounter-diagnosis", display: "Encounter Diagnosis" }]
            }
          ],
          code: {
            coding: [
              { system: "http://snomed.info/sct", code: "408856003", display: "Autism spectrum disorder" },
              { system: "http://hl7.org/fhir/sid/icd-10-cm", code: "F84.0", display: "Autistic disorder" }
            ],
            text: "Autism Spectrum Disorder Level 2 with Expressive Language Delay"
          },
          subject: { reference: `urn:uuid:${patientId}` }
        }
      },

      // 3. Observations from Pain & Sensory Incident History
      ...painHistory.map((pain, idx) => ({
        fullUrl: `urn:uuid:obs-pain-${idx + 1}`,
        resource: {
          resourceType: "Observation",
          id: `obs-pain-${idx + 1}`,
          status: "final",
          category: [
            {
              coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "survey", display: "Survey" }]
            }
          ],
          code: {
            coding: [{ system: "http://loinc.org", code: "72514-3", display: "Pain severity - 0-10 verbal numeric rating" }],
            text: `Sensory / Pain Incident: ${pain.bodyPart || 'General'}`
          },
          subject: { reference: `urn:uuid:${patientId}` },
          effectiveDateTime: pain.timestamp || timestamp,
          valueQuantity: {
            value: pain.intensity || 5,
            unit: "points",
            system: "http://unitsofmeasure.org",
            code: "1"
          },
          note: [{ text: pain.note || `Pain logged at ${pain.bodyPart || 'body area'}` }]
        }
      })),

      // 4. CarePlan & Clinical Session Logs
      ...sessionLogs.map((session, idx) => ({
        fullUrl: `urn:uuid:careplan-session-${idx + 1}`,
        resource: {
          resourceType: "CarePlan",
          id: `careplan-session-${idx + 1}`,
          status: "completed",
          intent: "order",
          title: session.title || "Therapy Session",
          subject: { reference: `urn:uuid:${patientId}` },
          period: {
            start: session.sessionDate || timestamp
          },
          activity: [
            {
              detail: {
                kind: "Procedure",
                code: { text: session.category || "THERAPY" },
                status: "completed",
                description: `Duration: ${session.durationMinutes || 30} mins. Milestones: ${session.milestones || 'Practiced target goals'}. Provider: ${session.provider || 'Care Team'}`
              }
            }
          ]
        }
      }))
    ]
  };

  return bundle;
}

export function downloadFHIRBundle(patientInfo, sessionLogs, painHistory, customCards) {
  const bundle = generateFHIRBundle(patientInfo, sessionLogs, painHistory, customCards);
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("download", `savia_fhir_r4_bundle_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
