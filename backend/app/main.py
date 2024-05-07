from fastapi import FastAPI

from app.search import perform_search

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello!"}


@app.get("/search")
async def search(text: str):
    answer = await perform_search(text)
    return {"answer": answer}
