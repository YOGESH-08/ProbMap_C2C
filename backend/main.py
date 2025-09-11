import os
import io
import json
import re
import shutil
import logging
import asyncio
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from PIL import Image
import google.generativeai as genai

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Damage Reporting API")

# CORS - Allow all origins for cloud deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.warning("⚠️ GEMINI_API_KEY not set!")
genai.configure(api_key=GEMINI_API_KEY)

gemini_model = None

@app.on_event("startup")
def startup_event():
    global gemini_model
    logger.info("🚀 Initializing models")
    
    # Initialize Gemini model
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    logger.info("✅ Startup complete, models ready")

def parse_llm_response(response_text: str) -> dict:
    try:
        json_match = re.search(r"\{[\s\S]*\}", response_text)
        if json_match:
            return json.loads(json_match.group())
    except Exception as e:
        logger.error(f"Failed to parse LLM response: {e}")
    
    return {
        "category": "Others",
        "importance": None,
        "cost_estimate": "0",
        "confidence": 0.7,
        "is_public_property": False
    }

def analyze_image_with_gemini_sync(image: Image.Image) -> dict:
    try:
        prompt = """Analyze this image and determine if it shows damage to public property..."""  # Your prompt here
        response = gemini_model.generate_content([prompt, image])
        return parse_llm_response(response.text)
    except Exception as e:
        logger.error(f"❌ Gemini error: {e}")
        return {
            "category": "Others",
            "importance": None,
            "cost_estimate": "0",
            "confidence": 0.7,
            "is_public_property": False
        }

@app.post("/analyze-image")
async def analyze_image_only(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Analyze with Gemini
        analysis_result = await asyncio.to_thread(analyze_image_with_gemini_sync, pil_image)
        return analysis_result
        
    except Exception as e:
        logger.exception("Error in /analyze-image")
        raise HTTPException(status_code=500, detail=f"Error: {e}")

@app.post("/issue")
async def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Analyze with Gemini
        analysis_result = await asyncio.to_thread(analyze_image_with_gemini_sync, pil_image)

        return {
            "message": "Issue created successfully!",
            "title": title,
            "description": description,
            "location": json.loads(location),
            "analysis": analysis_result
        }
    except Exception as e:
        logger.exception("Error in /issue")
        raise HTTPException(status_code=500, detail=f"Error: {e}")

@app.get("/")
async def root():
    return {"message": "✅ API running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)