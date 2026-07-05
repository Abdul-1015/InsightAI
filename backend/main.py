import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI App
app = FastAPI(
    title="InsightAI API",
    description="Deterministic AI-powered Business Intelligence Platform Backend",
    version="0.1.0"
)

# Configure CORS for local development
# Astro runs on http://localhost:4321 by default
origins = [
    "http://localhost:4321",
    "http://127.0.0.1:4321",
    "http://localhost:3000", # Common alternative
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Health Check Endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "app": "InsightAI Business Intelligence Engine",
        "python_version": sys.version,
        "platform": sys.platform,
        "api_keys_configured": {
            "gemini": bool(os.environ.get("GEMINI_API_KEY")),
            "openai": bool(os.environ.get("OPENAI_API_KEY"))
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
