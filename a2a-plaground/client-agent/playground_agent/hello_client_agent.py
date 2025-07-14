from google.adk.agents.remote_a2a_agent import RemoteA2aAgent

hello_client_agent = RemoteA2aAgent(
    name="hello_client_agent",
    agent_card="http://localhost:8081/a2a/hello_agent/.well-known/agent.json",
)