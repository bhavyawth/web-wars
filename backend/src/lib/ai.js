import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // set this in .env
});

export const generateAISummary = async (text, promptPrefix = "") => {
  try {
    if (!text || text.trim() === "") return "No reviews available to summarize.";

    const prompt = `
      ${promptPrefix}
      You are given some customer reviews. 
      Even if the reviews are very short, vague, or look like names/usernames, 
      you must generate a summary anyway.

      Rules:
      - Do NOT mention seller IDs, product IDs, usernames, or system-related details.
      - Do NOT start with generic phrases like "Customer reviews for seller ID...".
      - Write the summary as if it were for a person reading reviews, not a database.
      - Always produce 3–5 sentences.
      - If reviews are unclear, imagine a plausible neutral summary (e.g., "The reviews are brief but suggest some engagement with the seller").
      - Never say "insufficient data" or "too short".
      - Keep the tone professional and neutral.

      Here are the reviews:
      ${text}
      `;



    const response = await genai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // ✅ Gemini response parsing
    const summary =
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No summary generated.";

    return summary;
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return "Failed to generate summary.";
  }
};
