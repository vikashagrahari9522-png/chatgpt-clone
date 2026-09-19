const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(chatHistory) {
  const prompt = chatHistory
    .map((item) => `${item.role}: ${String(item.content)}`)
    .join("\n");

  console.log("Prompt sent to Gemini:", prompt);

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    
  });

  console.log("Gemini response:", response.text);

  return response.text;
}

async function generateVectors(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
}

module.exports = {
  generateResponse,
  generateVectors,
};