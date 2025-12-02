import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// CORS – חובה כדי לאפשר טעינת tiles מהענן
app.use(cors({ origin: "*" }));

// ✅ 1. טיפול בקבצי Cesium - תומך גם ב-/cesium וגם ב-/Cesium
app.use(["/cesium", "/Cesium"], express.static(path.join(__dirname, "dist/cesium"), {
  setHeaders: (res, filepath) => {
    // הגדרת Content-Type נכונה לפי סוג הקובץ
    if (filepath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    } else if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filepath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    } else if (filepath.endsWith('.jpg') || filepath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filepath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  },
  fallthrough: false // ⚠️ חשוב! אל תמשיך ל-fallback אם הקובץ לא נמצא
}));

// ✅ 2. טיפול בשאר הקבצים הסטטיים
app.use(express.static(path.join(__dirname, "dist"), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filepath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// ✅ 3. SPA Fallback - רק אחרי שניסינו למצוא קבצים סטטיים
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server live on ${PORT}`);
});