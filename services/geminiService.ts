
import { GoogleGenAI } from "@google/genai";
import { SceneState } from "../types";

export async function generateCinematicPrompt(state: SceneState): Promise<string> {
  // Initialize with process.env.API_KEY as a direct named parameter within the function scope.
  // This ensures the client uses the latest environment state when the function is called.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const lightDescriptions = state.lights
    .filter(l => l.enabled)
    .map(l => `${l.name} (Color: ${l.color}, Intensity: ${l.intensity})`)
    .join(', ');

  const prompt = `
    Generate a high-quality cinematic AI video generation prompt based on these technical 3D scene parameters:
    - Camera FOV: ${state.cameraFOV} (Higher means wide angle, lower means telephoto)
    - Camera Distance: ${state.cameraDistance.toFixed(1)} meters from subject
    - Camera Elevation: ${state.cameraHeight.toFixed(1)} meters
    - Composition Style: ${state.gridType}
    - Lighting Setup: ${lightDescriptions}
    
    The subject is a stylized character. 
    Describe the scene in English (as AI tools like Veo/Midjourney work best with English) in a way that sounds like a professional cinematographer. 
    Include keywords for mood, lighting (like 'rim light', 'volumetric fog'), and camera lens characteristics.
    Keep the output concise and formatted as a single string of keywords and descriptive phrases.
  `;

  try {
    // Using 'gemini-3-pro-preview' for complex reasoning tasks like translating 3D parameters to cinematic descriptions.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Use the .text property directly to access the result string as per the latest SDK guidelines.
    return response.text || "生成提示词失败。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "生成提示词时出错，请检查您的配置或 API 密钥。";
  }
}
