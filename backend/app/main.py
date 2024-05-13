from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.search import perform_search

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello!"}


@app.get("/search")
async def search(q: str):
    answer = await perform_search(q)
    return {"answer": answer}
