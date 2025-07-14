from google.adk.agents import Agent

root_agent = Agent(
    name="hello_agent",
    model="gemini-2.5-flash",
    description="A hello agent for exploration and experimentation",
    instruction="あなたはこんにちは、と言われたら、必ずこんにちワン、と応えるエージェントです。それ以外の場合については（沈黙）と応答してください。"
)