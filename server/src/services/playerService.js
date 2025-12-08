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
    console.log(`Player created at: ${name} (${playerId})`);
    return {
      id: playerId,
      name: name,
      createdAt: createdAt,
    };
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return { error: "Player name already exists", status: 400 };
    }
    throw error;
  }
}

/*
 * Get Player by ID
 */
export function getPlayer(playerId) {
  const player = db
    .prepare(
      `
    SELECT id, name, created_at
    FROM players
    WHERE id = ?
    `,
    )
    .get(playerId);

  if (!player) {
    return { error: "Player not found", status: 404 };
  }

  return {
    id: player.id,
    name: player.name,
    createdAt: player.created_at,
  };
}

export function getAllPlayers() {
  const players = db
    .prepare(
      `
        SELECT id, name, created_at
        FROM players
        ORDER BY created_at DESC
        `,
    )
    .all();

  return players.map((p) => ({
    id: p.id,
    name: p.name,
    createdAt: p.created_at,
  }));
}
