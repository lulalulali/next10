// pages.tsx 主游戏页面
"use client";
import React, { useState, useEffect } from "react";
import TetrisBoard from "./components/TetrisBoard";
import TetrisControls from "./components/TetrisControls";
import {
  createGrid,
  randomTetromino,
  isValidMove,
  mergePiece,
} from "./utils/gameLogic";

const Tetris: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(createGrid());
  const [pieceData, setPieceData] = useState({
    shape: randomTetromino().shape,
    color: "#FFA500", // 默认颜色
  });
  const [position, setPosition] = useState({ row: 0, col: Math.floor(10 / 2) });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0); // 添加分数状态

  // 将随机颜色生成和设置放入 useEffect 中，确保它只在客户端生成
  useEffect(() => {
    const colors = [
      "#ADD8E6", // Light Blue
      "#32CD32", // Lime Green
      "#FFA500", // Bright Orange
      "#FFFF00", // Bright Yellow
      "#EE82EE", // Violet
      "#FF69B4", // Hot Pink
      "#FF0000", // Bright Red
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setPieceData((prev) => ({ ...prev, color: randomColor }));
  }, []);
  // 只有在第一次渲染后执行

  // 初始生成方块数据的逻辑
  useEffect(() => {
    setPieceData(randomTetromino());
    // 这里会在客户端初始化时生成新的方块
  }, []);
  // 只有在客户端加载后执行

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setGrid(createGrid());
    setPieceData(randomTetromino());
    setPosition({ row: 0, col: Math.floor(10 / 2) });
    setScore(0); // 重置分数
  };

  const resetGame = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setGrid(createGrid());
    setScore(0); // 重置分数
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      movePiece(1, 0);
      // 方块每 500ms 下落一次
    }, 500);
    return () => clearInterval(timer);
  }, [isPlaying, position.row, position.col]);

  const movePiece = (rowOffset: number, colOffset: number) => {
    const newPosition = {
      row: position.row + rowOffset,
      col: position.col + colOffset,
    };

    if (isValidMove(newPosition, pieceData.shape, grid)) {
      setPosition(newPosition);
    } else if (rowOffset === 1) {
      // 将合并的方块和清除的行数传递回来
      const { clearedGrid, clearedRows } = mergePiece(
        pieceData.shape,
        position,
        grid
      );
      setGrid(clearedGrid);
      // 更新得分，每消除一行得100分
      setScore((prevScore) => prevScore + clearedRows * 100);
      setPieceData(randomTetromino());
      setPosition({ row: 0, col: Math.floor(10 / 2) });
      if (position.row === 0) {
        setIsGameOver(true);
      }
    }
  };

  const rotatePiece = () => {
    const rotated = pieceData.shape[0].map((_, index) =>
      pieceData.shape.map((row) => row[index]).reverse()
    );
    if (isValidMove({ row: position.row, col: position.col }, rotated, grid)) {
      setPieceData({ shape: rotated, color: pieceData.color });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    // 阻止默认的滚动行为
    if (e.key === "ArrowLeft") movePiece(0, -1);
    if (e.key === "ArrowRight") movePiece(0, 1);
    if (e.key === "ArrowDown") movePiece(1, 0);
    if (e.key === "ArrowUp") rotatePiece();
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
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
      <TetrisBoard
        grid={grid}
        piece={pieceData.shape}
        position={position}
        color={pieceData.color}
        onScoreChange={handleScoreChange} // 传递分数更新回调
      />

      <TetrisControls
        isPlaying={isPlaying}
        isGameOver={isGameOver}
        startGame={startGame}
        resetGame={resetGame}
      />
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>Score: {score}</div>
    </div>
  );
};

export default Tetris;
//aha,this is how i tset githubversion
