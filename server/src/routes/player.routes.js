// server/src/routes/player.routes.js
import express from "express";
import {
  createPlayer,
  getPlayer,
  getAllPlayers,
} from "../services/playerService.js";

const router = express.Router();

/**
 * POST /api/players
 * Create a new player
 */
router.post("/", (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Player name is required",
      });
    }

    const player = createPlayer(name.trim());

    if (player.error) {
      return res.status(player.status).json({
        success: false,
        error: player.error,
      });
    }

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

export default router;
