from google.adk.agents import SequentialAgent

from playground_agent.hello_client_agent import hello_client_agent

greeting_agent = SequentialAgent(
    name="greeting_agent",
    description="ユーザーからの挨拶に応答します。",
    sub_agents=[hello_client_agent],
)