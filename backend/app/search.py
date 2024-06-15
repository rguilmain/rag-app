import os
from dotenv import load_dotenv

from langchain_community.tools import WikipediaQueryRun
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_openai import ChatOpenAI

from app.agent import Agent

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
tavily_api_key = os.getenv("TAVILY_API_KEY")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set or empty")

if not tavily_api_key:
    raise ValueError("TAVILY_API_KEY is not set or empty")

model = ChatOpenAI(model="gpt-4o", temperature=0, api_key=openai_api_key)

prompt = """You are a smart research assistant. Use the search engine to look up information. \
You are allowed to make multiple calls (either together or in sequence). \
Only look up information when you are sure of what you want. \
If you need to look up some information before asking a follow up question, you are allowed to do that.
"""

tools = [
    WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper()),
    TavilySearchResults(max_results=3, api_key=tavily_api_key)
]

search_bot = Agent(model, tools, system=prompt)


async def perform_search(query: str) -> str:
    return search_bot(query)
