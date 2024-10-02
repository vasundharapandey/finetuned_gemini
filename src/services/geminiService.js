import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (userMessage) => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const modelId = import.meta.env.VITE_FINETUNED_MODEL_ID;
  const model = genAI.getGenerativeModel({ model: modelId });
  const prompt = userMessage;

  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    return "Sorry, there was an error generating a response.";
  }
};