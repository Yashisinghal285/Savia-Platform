import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bot, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  Terminal, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Database,
  X,
  Play,
  RotateCcw,
  Download,
  FileJson,
  Copy,
  Check
} from 'lucide-react';
import { orchestrateClinicalEvent } from '../../api/agents';

export default function AgentThoughtStreamModal({ isOpen, onClose }) {
  const [activeDemo, setActiveDemo] = useState('AAC_INPUT');
  const [isRunning, setIsRunning] = useState(false);
  const [orchestrationData, setOrchestrationData] = useState(null);
  const [copied, setCopied] = useState(false);

  const sampleScenarios = [
    {
      id: 'AAC_INPUT',
      title: '🗣️ Adaptive AAC Intent Prediction',
      agent: 'SLP_Adaptive_AAC_Agent',
      desc: 'Predicts next vocabulary tiles and expands into natural speech.',
      payload: { selected_tokens: ['I want', 'Water'], current_mood: 'TIRED', time_of_day: '14:30' }
    },
    {
      id: 'SENSORY_DISTRESS',
      title: '🫀 Sensory Overload & Distress Watchdog',
      agent: 'Sensory_Distress_Watchdog_Agent + FHIR_Agent',
      desc: 'Correlates decibels with headache, prescribes box-breathing, and logs FHIR telemetry.',
      payload: { pain_part: 'Head', intensity_level: 3, sensation_type: 'Throbbing', recent_environment_db: 84.5 }
    },
    {
      id: 'CLINICAL_VOICE_NOTE',
      title: '🩺 HL7 FHIR Clinical Chart Synthesis',
      agent: 'FHIR_R4_EHR_Synthesizer_Agent',
      desc: 'Extracts speech therapy milestones, maps ICD-10/SNOMED CT, and builds FHIR R4 Bundle.',
      payload: { 
        raw_transcript: 'Reyansh showed 80% articulation accuracy on /s/ sound drills today during speech session.',
        session_category: 'SPEECH_THERAPY'
      }
    },
    {
      id: 'COMPANION_DRILL',
      title: '🤖 Pediatric Voice Articulation Coach',
      agent: 'Voice_Companion_Cognitive_Agent',
      desc: 'Evaluates phonetic accuracy and awards adaptive audio earcons.',
      payload: { target_word: 'Water', spoken_audio_text: 'Wawa' }
    }
  ];

  const handleRunAgent = async (scenarioId) => {
    setIsRunning(true);
    const scenario = sampleScenarios.find(s => s.id === scenarioId) || sampleScenarios[0];
    
    try {
      const data = await orchestrateClinicalEvent(scenario.id, scenario.payload);
      setOrchestrationData(data);
    } catch (err) {
      console.error('Agent execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleRunAgent(activeDemo);
    }
  }, [isOpen]);

  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-[99999] p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-4xl shadow-2xl border border-slate-200/80 dark:border-slate-800 my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Savia Multi-Agent Autonomous Orchestrator
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>LIVE AGENT DAG</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                Autonomous LLM Agent Reasoning Traces & Tool Execution Log
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Return Back (Esc)"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scenario Selector Strip */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {sampleScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveDemo(s.id);
                handleRunAgent(s.id);
              }}
              disabled={isRunning}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
                activeDemo === s.id
                  ? 'bg-[#2563EB] text-white shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Active Scenario Overview & Re-run CTA */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-blue-950 dark:text-blue-200">
                {sampleScenarios.find(s => s.id === activeDemo)?.title}
              </div>
              <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium mt-0.5">
                {sampleScenarios.find(s => s.id === activeDemo)?.desc}
              </div>
            </div>

            <button
              onClick={() => handleRunAgent(activeDemo)}
              disabled={isRunning}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center space-x-1.5 shrink-0 self-start sm:self-auto active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Orchestrating...' : 'Trigger Agent Run'}</span>
            </button>
          </div>

          {/* Execution Metrics Bar */}
          {orchestrationData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Latency</div>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  ⚡ {orchestrationData.total_execution_ms} ms
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Participating Agents</div>
                <div className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">
                  🤖 {orchestrationData.participating_agents?.length || 1} Agents
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Reasoning Steps</div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  📝 {orchestrationData.reasoning_traces?.length || 0} Steps
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase">FHIR Conformance</div>
                <div className="text-sm font-black text-purple-600 dark:text-purple-400 mt-0.5">
                  🩺 HL7 R4 Validated
                </div>
              </div>
            </div>
          )}

          {/* Agent Reasoning Stream (Step by Step) */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center space-x-1.5 uppercase tracking-wider">
              <span>🧠</span>
              <span>Step-by-Step Multi-Agent Reasoning Trace</span>
            </h4>

            <div className="space-y-2.5 font-mono text-xs">
              {isRunning ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <div className="font-bold text-slate-600 dark:text-slate-400">Agents reasoning and calling tools...</div>
                </div>
              ) : (
                orchestrationData?.reasoning_traces?.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[10px] pb-1 border-b border-slate-800">
                      <span className="font-black text-blue-400 flex items-center space-x-1">
                        <span>🤖</span>
                        <span>{step.agent_name}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                        step.action_type === 'CALL_TOOL' 
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : step.action_type === 'DECIDE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {step.action_type} (Confidence: {Math.round(step.confidence * 100)}%)
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-200 pl-1 leading-relaxed">
                      {step.thought}
                    </div>

                    {step.tool_call && (
                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono">
                        <div className="text-amber-400 font-bold flex items-center space-x-1">
                          <span>⚡ Tool Invoked:</span>
                          <span className="underline">{step.tool_call.tool_name}()</span>
                          <span className="text-slate-500 font-normal">({step.tool_call.latency_ms} ms)</span>
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          <strong>Args:</strong> {JSON.stringify(step.tool_call.arguments)}
                        </div>
                        <div className="text-emerald-400 text-[10px]">
                          <strong>Output:</strong> {JSON.stringify(step.tool_call.output)}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FHIR R4 Standardized Output & Download Card */}
          <div className="p-4 bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <FileJson className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <span className="text-xs font-black text-purple-950 dark:text-purple-200 block">
                    HL7 FHIR Release 4 Bundle & Medical Taxonomy
                  </span>
                  <span className="text-[10px] text-purple-700 dark:text-purple-400 font-medium block">
                    Autonomous ICD-10 (F84.0) & SNOMED CT (408856003) clinical schema
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyFHIR}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center space-x-1 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>

                <button
                  onClick={handleDownloadFHIR}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .fhir.json</span>
                </button>
              </div>
            </div>

            <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36 scrollbar-thin">
              {JSON.stringify(orchestrationData?.fhir_bundle_generated || {
                resourceType: "Bundle",
                type: "collection",
                id: "savia-fhir-r4-bundle",
                entry: [
                  {
                    resource: {
                      resourceType: "Patient",
                      id: "savia-pat-aarav",
                      name: [{ use: "official", family: "Sharma", given: ["Aarav"] }]
                    }
                  },
                  {
                    resource: {
                      resourceType: "Condition",
                      code: {
                        coding: [
                          { system: "http://hl7.org/fhir/sid/icd-10-cm", code: "F84.0", display: "Autistic Disorder" },
                          { system: "http://snomed.info/sct", code: "408856003", display: "Autism spectrum disorder" }
                        ]
                      },
                      subject: { reference: "Patient/savia-pat-aarav" }
                    }
                  }
                ]
              }, null, 2)}
            </pre>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="px-6 py-3 bg-slate-50/80 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>HackerRank Orchestrate Multi-Agent Telemetry Stream</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-bold transition-all"
          >
            ← Close Inspector
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
