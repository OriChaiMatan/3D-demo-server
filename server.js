import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// CORS – חובה כדי לאפשר טעינת tiles מהענן
app.use(cors({ origin: "*"}));

// 🔧 FIX: שירות סטטי עם הגדרות נכונות
app.use(express.static(path.join(__dirname, "dist"), {
  maxAge: '1d', // Cache למשך יום
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // 🔧 FIX: הגדרת Content-Type נכונה לקבצי WASM
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
    // 🔧 FIX: הגדרת Content-Type נכונה לקבצי JSON
    if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
    // 🔧 FIX: CORS headers לכל הקבצים
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// 🔧 FIX: טיפול מיוחד בקבצי Cesium (lowercase!)
app.use('/cesium', express.static(path.join(__dirname, "dist", "cesium"), {
  maxAge: '1d',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// 🔧 FIX: תמיכה גם ב-Cesium uppercase (redirect)
app.use('/Cesium', express.static(path.join(__dirname, "dist", "cesium"), {
  maxAge: '1d',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// 🔧 FIX: טיפול מיוחד ב-assets
app.use('/assets', express.static(path.join(__dirname, "dist", "assets"), {
  maxAge: '1d',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// SPA fallback - חייב להיות אחרון!
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server live on ${PORT}`);
  console.log(`📁 Serving from: ${path.join(__dirname, "dist")}`);
});