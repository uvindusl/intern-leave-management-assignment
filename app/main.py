from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import employees, leaves

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Leave Management System", version="1.0.0")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router, prefix="/api")
app.include_router(leaves.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Employee Leave Management System API"}
