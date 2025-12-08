// server/src/services/playerService.js
import { v4 as uuidv4 } from "uuid";
import db from "../config/database.js";

export function createPlayer(name) {
  const playerId = uuidv4();
  const createdAt = Date.now();

  try {
    db.prepare(
      `
      INSERT INTO players (id, name, created_at)
      VALUES (?, ?, ?)
    `,
    ).run(playerId, name, createdAt);

    return {
      id: playerId,
      name: name,
      createdAt: createdAt,
    };
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      console.log(error.message);
      return { error: "Player name already exists", status: 400 };
    }
    throw error;
  }
}

export function getAllPlayers() {
  return db.prepare("SELECT * FROM players").all();
}

export function getPlayer(id) {
  const player = db.prepare("SELECT * FROM players WHERE id = ?").get(id);
  if (!player) {
    return { error: "Player not found", status: 404 };
  }
  return player;
}
