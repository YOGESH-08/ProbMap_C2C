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
import torch
import google.generativeai as genai

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Damage Reporting API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.warning("⚠️ GEMINI_API_KEY not set, set it in your .env file!")
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
    
    # Default response for non-public property images
    return {
        "category": "Others",
        "importance": None,
        "cost_estimate": "0",
        "confidence": 0.7,
        "is_public_property": False
    }


def analyze_image_with_gemini_sync(image: Image.Image) -> dict:
    try:
        prompt = """Analyze this image and determine if it shows damage to public property.
        
        If it shows public property damage (pothole, street light, road damage, drainage, traffic signals, pipelines, public tap, or similar), return a JSON object with these fields:
        - category (Pothole, Traffic Signals, Pipelines, Drainage, Street Light, Public Tap, Road Damage, Others)
        - importance (High, Medium, Low)
        - cost_estimate (USD range, e.g. "500-1000")
        - confidence (0-1 float)
        - is_public_property (true)

        If it shows people, animals, private property, nature scenes,mobilephone or any non-public-property content, or public propert damage in mobile return:
        - category: "Others"
        - importance: null
        - cost_estimate: "0"
        - confidence: (0-1 float)
        - is_public_property: false

        Example for public property: {"category": "Pothole", "importance": "High", "cost_estimate": "500-1000", "confidence": 0.85, "is_public_property": true}
        Example for non-public property: {"category": "Others", "importance": null, "cost_estimate": "0", "confidence": 0.9, "is_public_property": false}"""
        
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


def is_likely_nsfw_simple(image: Image.Image) -> bool:
    """
    Simple NSFW detection using basic image analysis
    This is a basic heuristic approach - consider using a proper NSFW detection service
    for production use
    """
    try:
        # Convert to RGB if not already
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Get image data
        pixels = list(image.getdata())
        
        # Check for predominantly skin-toned colors (simple heuristic)
        skin_pixel_count = 0
        total_pixels = len(pixels)
        
        for r, g, b in pixels:
            # Simple skin tone detection (adjust thresholds as needed)
            if (r > 150 and g > 100 and g < 200 and b > 70 and b < 180 and 
                r > g and r > b and abs(r - g) > 20):
                skin_pixel_count += 1
        
        skin_ratio = skin_pixel_count / total_pixels
        
        # If more than 30% of pixels are skin-toned, flag as potentially NSFW
        if skin_ratio > 0.3:
            logger.warning(f"⚠️ Potential NSFW content detected (skin ratio: {skin_ratio:.2f})")
            return True
            
        return False
        
    except Exception as e:
        logger.error(f"Error in simple NSFW detection: {e}")
        return False


@app.post("/issue")
async def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        # Save uploaded image
        save_path = f"uploads/{image.filename}"
        os.makedirs("uploads", exist_ok=True)
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        contents = open(save_path, "rb").read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Run simple NSFW detection
        is_nsfw = await asyncio.to_thread(is_likely_nsfw_simple, pil_image)
        if is_nsfw:
            return {
                "error": "Potential NSFW content detected",
                "analysis_blocked": True
            }

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
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    # Add this to your Python backend (main.py)
@app.post("/analyze-image")
async def analyze_image_only(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Run simple NSFW detection
        is_nsfw = await asyncio.to_thread(is_likely_nsfw_simple, pil_image)
        if is_nsfw:
            return {
                "error": "Potential NSFW content detected",
                "analysis_blocked": True
            }

        # Analyze with Gemini
        analysis_result = await asyncio.to_thread(analyze_image_with_gemini_sync, pil_image)
        
        return analysis_result
        
    except Exception as e:
        logger.exception("Error in /analyze-image")
        raise HTTPException(status_code=500, detail=f"Error: {e}")