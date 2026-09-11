import os
import time
from typing import List, Dict, Any, Callable, Optional
from app.schemas.agent_schemas import AgentThoughtStep, ToolInvocationRecord

class BaseAgent:
    def __init__(self, name: str, role: str, system_prompt: str):
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.tools: Dict[str, Callable] = {}
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")

    def register_tool(self, name: str, func: Callable):
        """Registers a callable tool on this agent."""
        self.tools[name] = func

    def call_tool(self, tool_name: str, **kwargs) -> ToolInvocationRecord:
        """Executes a registered tool and captures execution latency."""
        start = time.time()
        if tool_name not in self.tools:
            raise ValueError(f"Tool {tool_name} not registered on agent {self.name}")
        
        output = self.tools[tool_name](**kwargs)
        latency = round((time.time() - start) * 1000, 2)
        
        return ToolInvocationRecord(
            tool_name=tool_name,
            arguments=kwargs,
            output=output,
            latency_ms=latency
        )

    def add_thought(
        self, 
        thought: str, 
        action_type: str = "REASON", 
        tool_call: Optional[ToolInvocationRecord] = None, 
        confidence: float = 0.95
    ) -> AgentThoughtStep:
        """Records an explicit thought step in the agent's trajectory."""
        return AgentThoughtStep(
            agent_name=self.name,
            thought=thought,
            action_type=action_type,
            tool_call=tool_call,
            confidence=confidence
        )

    async def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Subclasses must implement their autonomous execution loop."""
        raise NotImplementedError
