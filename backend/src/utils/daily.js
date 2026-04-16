import { Game } from "../models/game.model.js";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const MAX_RETRIES = 3;

// Fallback puzzles (so your app NEVER breaks)
const FALLBACK_PUZZLES = [
  {
    word: "SOLAR FLARE",
    hint: "A sudden burst from the sun that can disrupt satellites.",
  },
  {
    word: "IRON CURTAIN",
    hint: "A metaphorical divide that once split Europe in two.",
  },
  {
    word: "DEEP LEARNING",
    hint: "A subset of AI inspired by neural networks.",
  },
];

export const generateDailyPuzzle = async () => {
  const today = new Date().toISOString().split("T")[0];

  const existing = await Game.findOne({ isDaily: true, dailyDate: today });
  if (existing) {
    console.log(`Daily puzzle for ${today} already exists.`);
    return existing;
  }

  const prompt = `Generate a daily word puzzle (moderate level) for a word guessing game.

Respond ONLY with valid JSON.
No markdown. No explanation.

Format:
{"word":"UPPERCASE WORD","hint":"One sentence hint."}`;

  let parsed = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to generate puzzle...`);

      const response = await fetch(
        `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300, // 🔥 increased
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API error: ${err}`);
      }

      const data = await response.json();
      const raw =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      console.log("RAW GEMINI RESPONSE:\n", raw);

      // Clean markdown
      const clean = raw.replace(/```json|```/g, "").trim();

      // Extract JSON
      const match = clean.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new Error("No JSON found");
      }

      parsed = JSON.parse(match[0]);

      // Validate
      if (!parsed.word || !parsed.hint) {
        throw new Error("Invalid structure");
      }

      // ✅ Success → break retry loop
      break;
    } catch (err) {
      console.warn(`Attempt ${attempt} failed:`, err.message);

      if (attempt === MAX_RETRIES) {
        console.warn("Using fallback puzzle...");
        parsed =
          FALLBACK_PUZZLES[
            Math.floor(Math.random() * FALLBACK_PUZZLES.length)
          ];
      }
    }
  }

  const game = await Game.create({
    word: parsed.word.trim().toUpperCase(),
    hint: parsed.hint.trim(),
    createdBy: "ai_system",
    creatorName: "VaultBreak AI",
    creatorAvatar: "",
    isDaily: true,
    dailyDate: today,
  });

  console.log(`Daily puzzle generated for ${today}: "${game.word}"`);

  return game;
};