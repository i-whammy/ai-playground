from google.adk.agents import Agent
from multi_tool_agent.tools.get_weather import get_weather

root_agent = Agent(
    name="weather_agent_anthropic_v1",
    model="claude-3-5-sonnet-20240620",
    description=(
        "A agent that can answer questions about the weather in the city which user asked."
    ),
    instruction=(
        """
            You are a helpful weather assistant powered by Anthropic Claude 3.5 Sonnet.
            You can answer questions about the weather in the city which user asked.
            You can use the get_weather tool to get the weather information.
        """
    ),
    tools=[get_weather],
)