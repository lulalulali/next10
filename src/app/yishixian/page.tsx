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
      setPiece(randomTetromino());
    }
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setGrid(createGrid());
    setPiece(randomTetromino());
    setPosition({ row: 0, col: Math.floor(COLS / 2) });
  };

  const resetGame = () => {
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
  }, [isPlaying, position.row, position.col]);

  // 移动方块
  const movePiece = (rowOffset: number, colOffset: number) => {
    const newPosition = {
      row: position.row + rowOffset,
      col: position.col + colOffset,
    };

    if (isValidMove(newPosition)) {
      setPosition(newPosition);
    } else if (rowOffset === 1) {
      mergePiece();
      setPiece(randomTetromino());
      setPosition({ row: 0, col: Math.floor(COLS / 2) });

      if (position.row === 0) {
        setIsGameOver(true);
      }
    }
  };

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

  // 清除满行
  const clearRows = (newGrid: number[][]) => {
    // 过滤出没有满的行
    const filteredGrid = newGrid.filter((row) =>
      row.some((cell) => cell === 0)
    );

    // 计算满的行数
    const rowsToAdd = ROWS - filteredGrid.length;

    // 生成空行并加入到顶部
    const emptyRows = Array.from({ length: rowsToAdd }, () =>
      Array(COLS).fill(0)
    );

    // 返回最终的网格
    const updatedGrid = [...emptyRows, ...filteredGrid];

    // 更新网格状态
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

    // 调用 clearRows 以清除满行
    clearRows(newGrid);
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
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginTop: "20px",
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
        {!isPlaying && !isGameOver && (
          <button onClick={startGame}>Start Game</button>
        )}
        {isGameOver && <button onClick={resetGame}>Restart Game</button>}
      </div>
    </div>
  );
};

export default Tetris;
