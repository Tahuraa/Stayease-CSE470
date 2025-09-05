// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Remove top-level API_KEY and instantiation

// function safeParseJson(text) {
//   try {
//     const cleaned = text
//       .trim()
//       .replace(/^```json\s*/i, "")
//       .replace(/^```\s*/i, "")
//       .replace(/```$/i, "");
//     return JSON.parse(cleaned);
//   } catch (e) {
//     const err = new Error("Gemini returned non-JSON response");
//     err.raw = text;
//     throw err;
//   }
// }

// /**
//  * Ask Gemini to rank/suggest rooms.
//  * @param {Object} params
//  * @param {Object} params.preferences - guest preferences (budget, view, bedType, dates, pax, etc.)
//  * @param {Array<Object>} params.availableRooms - rooms from DB (type, price, amenities, capacity, view, etc.)
//  * @returns {Promise<{suggestions: Array, reasoning: string}>}
//  */
// export async function suggestRooms({ preferences, availableRooms }) {
//   if (!preferences || !availableRooms) {
//     throw new Error("suggestRooms requires { preferences, availableRooms }");
//   }

//   const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
//   if (!API_KEY) {
//     throw new Error("Missing GOOGLE_GEMINI_API_KEY in environment variables");
//   }

//   const genAI = new GoogleGenerativeAI(API_KEY);

//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     generationConfig: {
//       temperature: 0.2,
//       responseMimeType: "application/json",
//       maxOutputTokens: 1024,
//     },
//   });

//   const prompt = `
// You are a hotel room recommendation engine. You will receive:
// 1) guest "preferences"
// 2) a finite list of "availableRooms" from the database.

// Return only valid JSON in this exact shape:

// {
//   "suggestions": [
//     {
//       "roomType": "string",
//       "matchScore": 0-100,
//       "pricePerNight": number,
//       "reasons": ["short bullet", "short bullet"],
//       "upsell": "optional short suggestion or empty string"
//     }
//   ],
//   "reasoning": "1-2 sentence overall rationale"
// }

// Scoring guidance:
// - Penalize rooms that exceed budget by a lot; small overruns are ok if they strongly match preferences.
// - Capacity must meet or exceed number of guests.
// - Consider: price, capacity, bed type, view,  amenities (wifi, breakfast, kitchen, etc.), date availability window.


// Input:
// "preferences": ${JSON.stringify(preferences)}
// "availableRooms": ${JSON.stringify(availableRooms)}
// `.trim();

//   try {
//     const result = await model.generateContent(prompt);
//     const text = result?.response?.text() ?? "";
//     const json = safeParseJson(text);

//     // Minimal shape validation
//     if (!json || !Array.isArray(json.suggestions)) {
//       throw new Error("Gemini JSON missing 'suggestions' array");
//     }


//     json.suggestions = (json.suggestions || []).map((s) => ({
//       roomType: String(s.roomType ?? ""),
//       matchScore: Math.max(0, Math.min(100, Number(s.matchScore ?? 0))),
//       pricePerNight: Number(s.pricePerNight ?? 0),
      
//       reasons: Array.isArray(s.reasons) ? s.reasons.slice(0, 5).map(String) : [],
//       upsell: typeof s.upsell === "string" ? s.upsell : "",
//     }));

//     return {
//       suggestions: json.suggestions,
//       reasoning: typeof json.reasoning === "string" ? json.reasoning : "",
//     };
//   } catch (err) {
//     console.error("[Gemini] suggestion error:", err.message, err.raw ? `\nRaw:\n${err.raw}` : "");
//     throw new Error("Failed to generate room suggestions");
//   }
// }


// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Safely parse JSON even if AI wraps it in code fences
 */
function safeParseJson(text) {
  try {
    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "");
    return JSON.parse(cleaned);
  } catch (e) {
    const err = new Error("Gemini returned non-JSON response");
    err.raw = text;
    throw err;
  }
}

/**
 * Ask Gemini to rank/suggest rooms.
 * @param {Object} params
 * @param {string} params.preferences - guest preferences in natural language
 * @param {Array<Object>} params.availableRooms - rooms from DB (type, price, amenities, capacity, view, etc.)
 * @returns {Promise<{suggestions: Array, reasoning: string}>}
 */
export async function suggestRooms({ preferences, availableRooms }) {
  if (!preferences || !availableRooms) {
    throw new Error("suggestRooms requires { preferences, availableRooms }");
  }

  const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("Missing GOOGLE_GEMINI_API_KEY in environment variables");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // flash is sufficient for natural language + structured data
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json", // enforce JSON output
      maxOutputTokens: 1024,
    },
  });

  const prompt = `
You are a hotel room recommendation engine. You will receive:
1) Guest preferences as natural language text.
2) A list of available rooms from the database in structured JSON.

Return only valid JSON in this shape:

{
  "suggestions": [
    {
      "roomType": "string",
      "matchScore": 0-100,
      "pricePerNight": number,
      "reasons": ["short bullet", "short bullet"],
      "upsell": "optional short suggestion or empty string"
    }
  ],
  "reasoning": "1-2 sentence overall rationale"
}

Scoring guidance:
- Penalize rooms that exceed budget; small overruns ok if strong match.
- Capacity must meet or exceed guest count.
- Consider price, capacity, bed type, view, amenities (wifi, breakfast, kitchen), availability dates.

Input:
"preferences": ${JSON.stringify(preferences)}
"availableRooms": ${JSON.stringify(availableRooms)}
`.trim();

  try {
    const result = await model.generateContent(prompt);
    const text = result?.response?.text() ?? "";
    const json = safeParseJson(text);

    // Minimal validation & sanitize
    if (!json || !Array.isArray(json.suggestions)) {
      throw new Error("Gemini JSON missing 'suggestions' array");
    }

    json.suggestions = (json.suggestions || []).map((s) => ({
      roomType: String(s.roomType ?? ""),
      matchScore: Math.max(0, Math.min(100, Number(s.matchScore ?? 0))),
      pricePerNight: Number(s.pricePerNight ?? 0),
      reasons: Array.isArray(s.reasons) ? s.reasons.slice(0, 5).map(String) : [],
      upsell: typeof s.upsell === "string" ? s.upsell : "",
    }));

    return {
      suggestions: json.suggestions,
      reasoning: typeof json.reasoning === "string" ? json.reasoning : "",
    };
  } catch (err) {
    console.error("[Gemini] suggestion error:", err.message, err.raw ? `\nRaw:\n${err.raw}` : "");
    throw new Error("Failed to generate room suggestions");
  }
}


