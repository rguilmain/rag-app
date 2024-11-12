# rag-app

Creates a local Retreival-Augmented Generation (RAG) API. 

## Setup

Copy the `.env.example` file in this directory to a new file, `.env`, and fill it in with your OpenAI API key, Tavily API key, and Wolfram Alpha App ID. You can aquire these here:
 - OpenAI API key: https://platform.openai.com/api-keys
 - Tavily API key: https://app.tavily.com/
 - Wolfram Alpha App ID: https://developer.wolframalpha.com/access

 To enable tracing with LangSmith, fill in your LangChain API key and project name here. You can set these up and view tracing here:
 - LangSmith: https://smith.langchain.com/

## Docker
Build and run.
```
docker build -t ragimage .
docker run --name ragcontainer -p 80:80 ragimage
```
If you run in detached mode [-d] and it fails, you can check the logs.
```
docker ps -a
docker logs [container-id]
```

## Interactive Documentation
With the instance running, navigate to:
 - http://127.0.0.1/docs
 - http://127.0.0.1/redoc