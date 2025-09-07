import express from "express";
import http from "http";
import cors from "cors";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const server = http.createServer(app);

// ✅ Allow CORS from frontend
app.use(cors({
  origin: "http://localhost:5001",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ API key middleware (only for /api routes)
app.use("/api", (req, res, next) => {
  const apiKey = req.headers["authorization"];
  if (apiKey !== "2HJ3MMxNppRpYxwHZsI35A48WiMqflvC9sVjYzAZ") {
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }
  next();
});

async function start() {
  try {
    if (process.env.NODE_ENV === "production") {
      serveStatic(app); // 🚀 Serve built frontend
    } else {
      await setupVite(app, server); // 🛠️ Dev mode with Vite
    }

    const PORT: number = Number(process.env.PORT) || 5000;
    const HOST = "127.0.0.1";

    server.listen(PORT, HOST, () => {
      log(`✅ Server running at http://${HOST}:${PORT}`, "server");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
