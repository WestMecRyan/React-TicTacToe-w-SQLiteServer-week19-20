// client/src/components/Game/Game.jsx
import { useState, useEffect } from "react";
import Board from "./Board";
import GameStatus from "./GameStatus";
import PlayerSetup from "../PlayerSetup";
import {
  checkForWin,
  isValidMove,
  applyMove,
  switchPlayer,
  createInitialGameState,
} from "../../utils/gameLogic";

export default function Game() {
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState(createInitialGameState());

  const { board, currentPlayer, gameOver, winner, winningCombo } = gameState;

  useEffect(() => {
    const savedPlayerId = localStorage.getItem("playerId");
    const savedPlayerName = localStorage.getItem("playerName");

    if (savedPlayerId && savedPlayerName) {
      setPlayer({
        id: savedPlayerId,
        name: savedPlayerName,
      });
    }
  }, []);

  const handleCellClick = (position) => {
    if (gameOver) return;

    // validate move
    const validation = isValidMove(board, position);
    if (!validation.valid) {
      console.log("Invalid move:", validation.reason);
      return;
    }
    // apply move
    const newBoard = applyMove(board, position, currentPlayer);
    // check for win/draw
    const result = checkForWin(newBoard);
    // update state
    setGameState({
      board: newBoard,
      currentPlayer: result.winner
        ? currentPlayer
        : switchPlayer(currentPlayer),
      gameOver: result.winner !== null,
      winner: result.winner,
      winningCombo: result.winningCombo,
    });
  };
  /* Reset the Game */
  const handleReset = () => {
    setGameState(createInitialGameState());
  };

  const handleLogout = () => {
    localStorage.removeItem("playerId");
    localStorage.removeItem("playerName");
    setPlayer(null);
    setGameState(createInitialGameState());
  };
  if (!player) {
    return <PlayerSetup onPlayerSet={setPlayer} />;
  }
  return (
    <>
      <div className="game-container">
        <h1>Tic-Tac-Toe</h1>
        <GameStatus
          currentPlayer={currentPlayer}
          winner={winner}
          gameOver={gameOver}
        />
        <Board
          board={board}
          onCellClick={handleCellClick}
          winningCombo={winningCombo}
        />
        <button className={`reset-button`} onClick={handleReset}>
          New Game
        </button>
      </div>
    </>
  );
}
