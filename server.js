import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// ✅ Add CSP header middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://apis.google.com"
  );
  next();
});

// 🔑 Use your OpenRouter API key
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // 👈 important change
});

// 💬 Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mixtral-8x7b", // ✅ free model example
      messages: [{ role: "user", content: req.body.message }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error from OpenRouter:", error);
    if (error.status === 429) {
      res.json({
        reply: "⚠️ Free API limit reached. Please try again later.",
      });
    } else {
      res.json({ reply: "❌ Server error: " + error.message });
    }
  }
});

// 🚀 Start server
app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
