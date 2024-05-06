from fastapi import FastAPI

from app.search import search


app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello!"}


@app.post("/search")
async def search(text: str):
    return {"response": search(text)}