import logging
from typing import Annotated

from fastapi import FastAPI, HTTPException, Query

from app.search import perform_search

logger = logging.getLogger(__name__)

app = FastAPI()


@app.get("/")
async def read_root():
    return {"message": "Hello!"}


@app.get("/search")
async def search(q: Annotated[str, Query(max_length=400)]):
    if not q:
        raise HTTPException(status_code=400,
                            detail="Query parameter `q` is required")
    try:
        answer = await perform_search(q)
        return {"answer": answer}
    except Exception as e:
        logger.exception("Search failed for query %r", q)
        raise HTTPException(status_code=500, detail=str(e)) from e
