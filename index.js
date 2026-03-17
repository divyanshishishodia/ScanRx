// ===== server.js =====
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ===== MySQL CONNECTION =====
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "divyanshi", // <-- change this
  database: "scanrx", // make sure this database exists in MySQL
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection error:", err);
  } else {
    console.log("✅ MySQL connected successfully!");
  }
});

// ===== VERIFY MEDICINE =====
app.post("/verify", (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "Input required" });

  const query = "SELECT * FROM medicines WHERE barcode = ? OR batch = ?";
  db.query(query, [input, input], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }

    if (results.length > 0) {
      res.json({ status: "genuine", medicine: results[0] });
    } else {
      res.json({ status: "suspicious" });
    }
  });
});

// ===== SEARCH MEDICINE =====
app.post("/search-medicine", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });

  const search = `%${name}%`;
  const query = "SELECT * FROM pharmacies WHERE medicine_name LIKE ?";

  db.query(query, [search], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      return res.json({ found: true, pharmacies: results });
    }

    // if not found, look for alternatives
    const altQuery = "SELECT * FROM alternatives WHERE medicine_name LIKE ?";
    db.query(altQuery, [search], (err, altResults) => {
      if (err) return res.status(500).send(err);

      if (altResults.length > 0) {
        res.json({
          found: false,
          alternative: altResults[0].alternative,
        });
      } else {
        res.json({
          found: false,
          alternative: null,
        });
      }
    });
  });
});

// ===== GEMINI AI ENDPOINT =====
app.post("/ask-ai", async (req, res) => {
  const { question } = req.body;

  console.log("📥 Question received:", question);

  if (!question) {
    console.log("❌ No question provided");
    return res.status(400).json({ error: "Question required" });
  }

  try {
    const API_KEY = "AIzaSyBdIYc7dMwF7Ah-u4AJs9QT7nVp1pLgGo0";

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
      {
        contents: [
          {
            parts: [
              {
                text:
                  "Answer in 4-5 short lines only in plain text, no bullet points, no symbols, no formatting: " +
                  question,
              },
            ],
          },
        ],
      }
    );

    console.log("✅ Gemini raw response:", JSON.stringify(response.data, null, 2));

    // 🔥 FIXED REPLY EXTRACTION
    let reply = "";

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates.length > 0
    ) {
      const parts = response.data.candidates[0].content.parts;

      reply = parts.map((p) => p.text).join(" ");
    }

    if (!reply) {
      console.log("⚠️ Empty AI reply:", response.data);
      return res.json({ answer: "AI did not respond properly" });
    }

    console.log("🤖 Final AI Reply:", reply);

    res.json({ answer: reply });

  } catch (err) {
    console.error("❌ AI API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI Error" });
  }
});
// ===== START SERVER =====
app.listen(5000, () => console.log("🚀 Server running on [localhost](http://localhost:5000)"));