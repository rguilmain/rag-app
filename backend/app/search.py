import os
from dotenv import load_dotenv

from langchain_community.tools import WikipediaQueryRun, WolframAlphaQueryRun
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_community.utilities.wolfram_alpha import WolframAlphaAPIWrapper
from langchain_openai import ChatOpenAI

from app.agent import Agent

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
tavily_api_key = os.getenv("TAVILY_API_KEY")
wolfram_alpha_appid = os.getenv("WOLFRAM_ALPHA_APPID")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set or empty")

if not tavily_api_key:
    raise ValueError("TAVILY_API_KEY is not set or empty")

if not wolfram_alpha_appid:
    raise ValueError("WOLFRAM_ALPHA_APPID is not set or empty")

model = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=openai_api_key)

tools = [
    TavilySearchResults(max_results=3, api_key=tavily_api_key),
    WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper()),
    WolframAlphaQueryRun(api_wrapper=WolframAlphaAPIWrapper()),
]

prompt = """You are a smart research assistant. \
Use Wikipedia and Tavily to look up relevant information, and Wolfram Alpha to perform any necessary calculations. \
You are allowed to make multiple calls to these tools either simultaneously or in sequence. \
Only look up information when you are sure of what you want. \
Your output should be beautifully formatted in Markdown.
"""

search_bot = Agent(model, tools, system=prompt)


async def perform_search(query: str) -> str:
    return search_bot(query)
