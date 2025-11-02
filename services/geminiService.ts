import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateImageFromPrompt(prompt: string): Promise<string> {
  try {
    const mimeType = 'image/jpeg';
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: mimeType,
        aspectRatio: '1:1',
      },
    });

    const image = response.generatedImages?.[0]?.image?.imageBytes;

    if (image) {
      const base64ImageBytes: string = image;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image data found in the API response.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid API Key. Please check your configuration.");
        }
        // Re-throw a more informative error
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("Failed to generate image due to an unknown error.");
  }
}
