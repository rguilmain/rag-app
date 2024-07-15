import operator
from typing import TypedDict, Annotated
from pydantic import BaseModel, Field

from langgraph.graph import StateGraph, END
from langchain_core.messages import AnyMessage, HumanMessage, SystemMessage, ToolMessage


class ToolParamsSchema(BaseModel):
    query: str = Field(..., description="The search query")


class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]


class Agent:

    def __init__(self, model, tools, system=""):
        self.system = system
        graph = StateGraph(AgentState)
        graph.add_node("llm", self.call_openai)
        graph.add_node("action", self.take_action)
        graph.add_edge("action", "llm")
        graph.add_conditional_edges(
            "llm", self.exists_action, {True: "action", False: END}
        )
        graph.set_entry_point("llm")
        self.graph = graph.compile()
        for tool in tools:
            tool.args_schema = ToolParamsSchema
        self.tools = {t.name: t for t in tools}
        self.model = model.bind_tools(tools)

    def __call__(self, query):
        messages = [HumanMessage(content=query)]
        result = self.graph.invoke({"messages": messages})
        return result["messages"][-1].content

    def exists_action(self, state: AgentState):
        result = state["messages"][-1]
        return len(result.tool_calls) > 0

    def call_openai(self, state: AgentState):
        messages = state["messages"]
        if self.system:
            messages = [SystemMessage(content=self.system)] + messages
        message = self.model.invoke(messages)
        return {"messages": [message]}

    def take_action(self, state: AgentState):
        tool_calls = state["messages"][-1].tool_calls
        results = []
        for t in tool_calls:
            print(f"Calling {t}")
            if t["name"] not in self.tools:
                result = "bad tool name, retry"
            else:
                result = self.tools[t["name"]].invoke(t["args"])
            results.append(
                ToolMessage(tool_call_id=t["id"], name=t["name"], content=str(result))
            )
        return {"messages": results}
