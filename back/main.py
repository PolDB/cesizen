from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.auth import router as auth_router
from app.controllers.informations import router as informations_router
from app.controllers.admin import router as admin_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(informations_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {"message": "Backend is running"}