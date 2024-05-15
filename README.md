# rag-app

A Retrieval-Augmented Generation (RAG) application made with LangChain, Tavily, FastAPI, and React.

# Setup

Once you've cloned this repository locally, you'll need to provide the application with API keys to interact with the OpenAI and Tavily. To do this, copy the `.env.example` file in the `backend` directory into a new file called `.env` and populate it with your OpenAI and Tavily API keys. You can aquire these keys here:

- OpenAI API key: https://platform.openai.com/api-keys
- Tavily API key: https://app.tavily.com/

# Usage

In the root of the project, run:

```
docker compose up --build
```

Once running, navigate to http://localhost:5173 in your browser.
