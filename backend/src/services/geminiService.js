import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/index.js";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ 
  model: config.gemini.model,
  generationConfig: {
    temperature: 0.1,
    topK: 32,
    topP: 1,
    maxOutputTokens: 4096,
  }
});

const ANALYSIS_PROMPT = `Analyze this image and determine if it shows damage to public infrastructure or civic issues (such as potholes, road cracks, broken streetlights, water leakage, pipelines, blocked drainage, damaged sidewalks, traffic signals, garbage dumps, or public taps).

Return ONLY a JSON object with:
- category: One of ("Pothole", "Road Damage", "Drainage", "Street Light", "Pipelines", "Traffic Signals", "Garbage", "Public Tap", "Others")
- importance: "High", "Medium", or "Low"
- cost_estimate: estimated repair cost range (e.g. "2000-5000 INR" or "$150-$300")
- confidence: float between 0.7 and 1.0
- is_public_property: boolean (true if public road/infrastructure, false if strictly private home/interior)

If there is NO public damage (e.g. indoor room, pet, food, selfie), return:
{"category": "Others", "importance": "Low", "cost_estimate": "0", "confidence": 0.9, "is_public_property": false}`;

export function parseLLMResponse(responseText) {
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.category) {
        // Normalize category capitalization
        parsed.category = parsed.category.charAt(0).toUpperCase() + parsed.category.slice(1);
      }
      if (parsed.importance) {
        parsed.importance = parsed.importance.charAt(0).toUpperCase() + parsed.importance.slice(1);
      }
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse LLM response:", e);
  }
  return {
    category: "Others",
    importance: null,
    cost_estimate: "0",
    confidence: 0.7,
    is_public_property: false,
  };
}

export function simpleNSFWDetection(imageBuffer) {
  return false;
}

export async function analyzeImageWithGemini(imageBuffer, mimeType) {
  try {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("Empty image buffer");
    }

    console.log(`Analyzing image: ${imageBuffer.length} bytes, type: ${mimeType}`);
    
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    console.log("Sending to Gemini model:", config.gemini.model);
    
    const result = await model.generateContent([ANALYSIS_PROMPT, imagePart]);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini response:", text);
    return parseLLMResponse(text);
  } catch (error) {
    console.error("❌ Gemini error:", error.message);
    if (error.message.includes("does not support image")) {
      console.error("Model may not support vision. Check GEMINI_API_KEY and model name.");
    }
    return {
      category: "Others",
      importance: null,
      cost_estimate: "0",
      confidence: 0.7,
      is_public_property: false,
    };
  }
}

export async function analyzeImageForNSFW(imageBuffer, mimeType) {
  return simpleNSFWDetection(imageBuffer);
}