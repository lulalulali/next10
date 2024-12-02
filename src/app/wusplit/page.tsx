// pages/Tetris.tsx 主游戏页面
"use client";
import React, { useState, useEffect } from "react";
import TetrisBoard from "./components/TetrisBoard";
import TetrisControls from "./components/TetrisControls";
import {
  createGrid,
  randomTetromino,
  isValidMove,
  clearRows,
  mergePiece,
} from "./utils/gameLogic";

const Tetris: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(createGrid());
  const [piece, setPiece] = useState<number[][]>(randomTetromino());
  const [position, setPosition] = useState({ row: 0, col: Math.floor(10 / 2) });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPiece(randomTetromino());
    }
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setGrid(createGrid());
    setPiece(randomTetromino());
    setPosition({ row: 0, col: Math.floor(10 / 2) });
  };

  const resetGame = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setGrid(createGrid());
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      movePiece(1, 0); // 方块每 500ms 下落一次
    }, 500);

    return () => clearInterval(timer);
  }, [isPlaying, position.row, position.col]);

  const movePiece = (rowOffset: number, colOffset: number) => {
    const newPosition = {
      row: position.row + rowOffset,
      col: position.col + colOffset,
    };

    if (isValidMove(newPosition, piece, grid)) {
      setPosition(newPosition);
    } else if (rowOffset === 1) {
      const newGrid = mergePiece(piece, position, grid);
      const clearedGrid = clearRows(newGrid);
      setGrid(clearedGrid);
      setPiece(randomTetromino());
      setPosition({ row: 0, col: Math.floor(10 / 2) });

      if (position.row === 0) {
        setIsGameOver(true);
      }
    }
  };

  const rotatePiece = () => {
    const rotated = piece[0].map((_, index) =>
      piece.map((row) => row[index]).reverse()
    );
    if (isValidMove({ row: position.row, col: position.col }, rotated, grid)) {
      setPiece(rotated);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") movePiece(0, -1);
    if (e.key === "ArrowRight") movePiece(0, 1);
    if (e.key === "ArrowDown") movePiece(1, 0);
    if (e.key === "ArrowUp") rotatePiece();
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      <TetrisBoard grid={grid} piece={piece} position={position} />
      <TetrisControls
        isPlaying={isPlaying}
        isGameOver={isGameOver}
        startGame={startGame}
        resetGame={resetGame}
      />
    </div>
  );
};

export default Tetris;
