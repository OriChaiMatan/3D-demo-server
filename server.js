import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ מאפשר טעינת משאבים חיצוניים (Firebase tiles וכו')
app.use(cors());

// 🧱 מגיש את אתר ה־build שלך (תיקיית dist)
app.use(express.static(path.join(__dirname, "dist")));

// 🖼️ מגיש גם את תיקיית cesium אם צריך גישה ישירה אליה
app.use("/cesium", express.static(path.join(__dirname, "dist/cesium")));

// 🧠 כל route אחר מחזיר את index.html (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// 🚀 הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Open http://localhost:${PORT}`);
});
