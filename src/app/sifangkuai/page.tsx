"use client";

import React, { useState, useEffect } from "react";

const ROWS = 20;
const COLS = 10;

const TETROMINOS = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const randomTetromino = () =>
  Object.values(TETROMINOS)[
    Math.floor(Math.random() * Object.values(TETROMINOS).length)
  ];

const createGrid = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const Tetris: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(createGrid());
  const [piece, setPiece] = useState<number[][]>([]); // 初始为空
  const [position, setPosition] = useState({
    row: 0,
    col: Math.floor(COLS / 2),
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 只在客户端渲染时生成随机方块 //改动
      setPiece(randomTetromino());
    }
  }, []); // 只在组件挂载时生成一次
  const startGame = () => {
    console.log("Starting game...");
    setIsPlaying(true);
    setIsGameOver(false);
    setGrid(createGrid());
    setPiece(randomTetromino());
    setPosition({ row: 0, col: Math.floor(COLS / 2) });
  };

  const resetGame = () => {
    console.log("Resetting game...");
    setIsPlaying(false);
    setIsGameOver(false);
    setGrid(createGrid());
  };

  // 方块下落定时器
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      movePiece(1, 0); // 方块每 500ms 下落一次
    }, 500);

    return () => clearInterval(timer); // 清理定时器
  }, [isPlaying, position.row, position.col]); // 监听 position 更新

  // 移动方块
  const movePiece = (rowOffset: number, colOffset: number) => {
    const newPosition = {
      row: position.row + rowOffset,
      col: position.col + colOffset,
    };

    if (isValidMove(newPosition)) {
      setPosition(newPosition);
    } else if (rowOffset === 1) {
      console.log("Merging piece and clearing rows...");
      mergePiece(); // 调用合并方块
      setPiece(randomTetromino());
      setPosition({ row: 0, col: Math.floor(COLS / 2) });

      if (position.row === 0) {
        setIsGameOver(true);
      }
    }
  };

  // 验证方块的移动是否合法
  const isValidMove = (
    { row, col }: { row: number; col: number },
    pieceShape: number[][] = piece
  ) => {
    return pieceShape.every((line, y) =>
      line.every((cell, x) => {
        if (!cell) return true;
        const newRow = row + y;
        const newCol = col + x;
        return (
          newRow >= 0 &&
          newRow < ROWS &&
          newCol >= 0 &&
          newCol < COLS &&
          grid[newRow][newCol] === 0
        );
      })
    );
  };

  // 清除填满的行
  const clearRows = (newGrid: number[][]) => {
    const filteredGrid = newGrid.filter((row, rowIndex) => {
      const isFullRow = row.every((cell) => cell === 1);
      if (isFullRow) {
        console.log("Clearing full row at index:", rowIndex);
      }
      return !isFullRow;
    });

    const rowsToAdd = ROWS - filteredGrid.length;
    const emptyRows = Array.from({ length: rowsToAdd }, () =>
      Array(COLS).fill(0)
    );
    const updatedGrid = [...emptyRows, ...filteredGrid];

    // 打印出原始 grid 和更新后的 grid 进行对比
    console.log("Current grid before update:", newGrid);
    console.log("Updated grid after clearing rows:", updatedGrid);

    // 如果 grid 发生了变化才更新
    setGrid(updatedGrid);
  };

  // 合并方块到网格
  const mergePiece = () => {
    const newGrid = grid.map((row) => [...row]);
    piece.forEach((line, y) =>
      line.forEach((cell, x) => {
        if (cell) {
          newGrid[position.row + y][position.col + x] = 1;
        }
      })
    );

    // 合并方块后，清除满行
    clearRows(newGrid); // 调用清除满行的函数

    // 更新 grid
    setGrid(newGrid);

    // 检查游戏结束条件
    if (position.row === 0) {
      setIsGameOver(true);
    }
  };

  // 旋转方块
  const rotatePiece = () => {
    const rotated = piece[0].map((_, index) =>
      piece.map((row) => row[index]).reverse()
    );
    if (isValidMove({ row: position.row, col: position.col }, rotated)) {
      setPiece(rotated);
    }
  };

  // 键盘控制
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
        display: "flex", // 使用 Flexbox 布局
        flexDirection: "row", // 按水平方向排列网格和按钮
        justifyContent: "center", // 水平方向居中
        alignItems: "center", // 垂直方向居中
        gap: "20px", // 增加网格和按钮之间的间距
        marginTop: "20px", // 页面整体顶部留空
      }}
    >
      {/* 网格部分 */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${ROWS}, 20px)`,
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
          gap: "0px",
          outline: "none",
          backgroundColor: "#d9d9d9",
          border: "2px solid #333",
          boxSizing: "border-box",
          borderRadius: "10px",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.7)",
          overflow: "hidden",
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              // 在这里添加唯一的 key
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: piece.some((line, y) =>
                  line.some(
                    (block, x) =>
                      block &&
                      position.row + y === rowIndex &&
                      position.col + x === colIndex
                  )
                )
                  ? "blue"
                  : cell
                  ? "gray"
                  : "transparent",
                border: "1px solid #333",
              }}
            />
          ))
        )}
      </div>

      {/* 按钮部分 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {!isPlaying ? (
          <button
            onClick={startGame}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Start Game
          </button>
        ) : (
          <button
            onClick={resetGame}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Reset Game
          </button>
        )}
      </div>
    </div>
  );
};

export default Tetris;
