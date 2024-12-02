// page.tsx 拆分后的,能跑,报错了
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
  const [piece, setPiece] = useState(randomTetromino()); // piece 是 Tetromino 类型
  const [position, setPosition] = useState({ row: 0, col: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const startGameHandler = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setGrid(createGrid());
    setPiece(randomTetromino());
    setPosition({ row: 0, col: 5 });
  };

  const resetGameHandler = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setGrid(createGrid());
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
      <TetrisBoard grid={grid} piece={piece} position={position} />{" "}
      {/* 传递 piece 作为 Tetromino */}
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
