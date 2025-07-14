from google.adk.agents import Agent

from playground_agent.greeting_agent import greeting_agent

root_agent = Agent(
    name="playground_agent",
    model="gemini-2.5-flash",
    description="A playground agent for exploration and experimentation",
    instruction="あなたは優れたAIアシスタントです。sub_agentsやtoolsを利用して、得られた回答を加工して、ユーザーに返答してください。",
    sub_agents=[greeting_agent],
)