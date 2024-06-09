from fastapi import FastAPI, HTTPException
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
async def read_root():
    return {"message": "Hello!"}


@app.get("/search")
async def search(q: str):
    if not q:
        raise HTTPException(status_code=400,
                            detail="Query parameter `q` is required")
    try:
        answer = await perform_search(q)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
