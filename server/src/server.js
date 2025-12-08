// src/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import { createPlayer } from "./services/playerService.js";
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const app = express();
const corsOptions = {
  origin:
    NODE_ENV === "production"
      ? process.env.CLIENT_URL
      : "http://localhost:5173",
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/api/players", (req, res) => {
  try {
    const { name } = req.body;

    const player = createPlayer(name.trim());

    res.status(201).json({
      success: true,
      player,
    });
  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create player",
    });
  }
});

app.use((req, res) => {
  res.status(404).send("page not found");
});

// express uses FUNCTION ARITY (parameter count) as a signal 2-3 params are regular middleware
// 4 params are error middleware param order always (err, req, res, next)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    msg: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
