import os
from dotenv import load_dotenv
from langchain_community.retrievers import TavilySearchAPIRetriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI


load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

retriever = TavilySearchAPIRetriever(k=3)

prompt = ChatPromptTemplate.from_template(
    """Answer the question based only on the search results provided.

Search results: {context}

Question: {question}"""
)
chain = (
    RunnablePassthrough.assign(context=(lambda x: x["question"]) | retriever)
    | prompt
    | ChatOpenAI(api_key=openai_api_key)
    | StrOutputParser()
)

def search(q: str) -> str:
    return chain.invoke({"question": q})