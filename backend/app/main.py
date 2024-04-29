from typing import Union
from fastapi import FastAPI

from app.search import search


app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/search")
def read_item(q: Union[str, None] = None):
    response = {}
    if q:
        response.update({"answer": search(q)})
    else:
        response.update({"error": "No query provided"})
    
    return response