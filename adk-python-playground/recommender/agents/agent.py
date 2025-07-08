"""
Root agent for the recommender project using adk-python.
"""

from google.adk.agents import Agent
from tools.recommender import recommend

root_agent = Agent(
    name="literature_agent",
    model="gemini-2.0-flash",
    description="文学作品の中から気に入ったものを探すエージェントです。",
    instruction="""
        - あなたはおすすめの文学作品の情報を教えてくれるエージェントです。ユーザーからの質問の内容を踏まえて、おすすめの文学作品の情報を教えてください。
        - なお、以下のような処理を行うことを想定しています。
          - recommendによって、ユーザーからの質問にマッチする文学作品を検索してください。
    """,
    tools=[recommend]
)