// page.tsx
"use client";
import React, { useState, useEffect } from "react";
import TetrisBoard from "./components/TetrisBoard";
import TetrisControls from "./components/TetrisControls";
import {
  createGrid,
  randomTetromino,
  startGame,
  resetGame,
  movePiece,
  isValidMove,
} from "./utils/gameLogic";

const TetrisPage = () => {
  const [grid, setGrid] = useState(createGrid());
  const [piece, setPiece] = useState(randomTetromino());
  const [position, setPosition] = useState({ row: 0, col: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // 启动游戏的回调
  const startGameHandler = () => {
    startGame(setIsPlaying, setGrid, setPiece, setPosition);
  };

  // 重置游戏的回调
  const resetGameHandler = () => {
    resetGame(setIsPlaying, setGrid, setPiece, setPosition);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const result = movePiece(grid, piece, position, 1, 0); // 每500ms下落
      setGrid(result.newGrid);
      setPosition(result.position);
      if (
        result.position.row === 0 &&
        !isValidMove(grid, piece, result.position)
      ) {
        setIsGameOver(true);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [isPlaying, position, piece, grid]);

  return (
    <div>
      <TetrisBoard grid={grid} piece={piece} position={position} />
      <TetrisControls
        startGame={startGameHandler}
        resetGame={resetGameHandler}
        isPlaying={isPlaying}
        isGameOver={isGameOver}
      />
    </div>
  );
};

export default TetrisPage;
