// src/app/tetris/page.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./tetris.module.css";

const COLS = 10;
const ROWS = 20;
const INITIAL_SCORE = 0;

const TETROMINOS = [
  { shape: [[1, 1, 1, 1]], color: "cyan" }, // I
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "yellow",
  }, // O
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "purple",
  }, // T
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "orange",
  }, // L
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "blue",
  }, // J
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "green",
  }, // S
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "red",
  }, // Z
];

const Tetris: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [currentTetromino, setCurrentTetromino] = useState<any>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(INITIAL_SCORE);
  const gameInterval = useRef<any>(null);

  const startGame = () => {
    console.log("游戏开始");
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setScore(INITIAL_SCORE);
    spawnTetromino();
    if (gameInterval.current) clearInterval(gameInterval.current);
    gameInterval.current = setInterval(moveDown, 1000);
  };

  const spawnTetromino = () => {
    const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
    console.log("生成方块:", TETROMINOS[randomIndex]);
    setCurrentTetromino(TETROMINOS[randomIndex]);
    setPosition({ x: Math.floor(COLS / 2) - 1, y: 0 });
  };

  const moveDown = () => {
    const newY = position.y + 1;
    console.log("尝试下移到:", { x: position.x, y: newY });
    if (canMove(position.x, newY, currentTetromino.shape)) {
      setPosition({ ...position, y: newY });
    } else {
      console.log("无法下移，合并到棋盘");
      mergeToBoard();
      const linesCleared = clearLines(); // 获取消除的行数
      if (linesCleared > 0) {
        console.log("消除行数:", linesCleared);
        updateScore(linesCleared);
      }
      spawnTetromino();
      if (!canMove(position.x, position.y, currentTetromino.shape)) {
        console.log("游戏结束！");
        alert("游戏结束！");
        clearInterval(gameInterval.current);
      }
    }
  };

  const canMove = (x: number, y: number, shape: number[][]) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (
            newX < 0 ||
            newX >= COLS ||
            newY >= ROWS ||
            (newY >= 0 && board[newY][newX])
          ) {
            console.log("移动无效:", { newX, newY });
            return false;
          }
        }
      }
    }
    console.log("移动有效:", { x, y });
    return true;
  };

  const mergeToBoard = () => {
    const newBoard = board.map((row) => row.slice());
    currentTetromino.shape.forEach((row: number[], rowIndex: number) => {
      row.forEach((value: number, colIndex: number) => {
        if (value) {
          newBoard[position.y + rowIndex][position.x + colIndex] =
            currentTetromino.color; // 使用颜色值
        }
      });
    });
    console.log("合并后的棋盘:", newBoard);
    setBoard(newBoard);
  };

  const clearLines = () => {
    const newBoard = board.filter((row) => row.every((cell) => cell !== 0)); // 过滤掉未填满的行
    const linesCleared = ROWS - newBoard.length; // 计算消除的行数
    console.log("当前棋盘:", board);
    console.log("消除行数:", linesCleared);

    // 在顶部添加空行以保持行数不变
    for (let i = 0; i < linesCleared; i++) {
      newBoard.unshift(Array(COLS).fill(0));
    }

    setBoard(newBoard);
    return linesCleared; // 返回消除的行数
  };

  const updateScore = (linesCleared: number) => {
    let points = 0;
    switch (linesCleared) {
      case 1:
        points = 100;
        break;
      case 2:
        points = 300;
        break;
      case 3:
        points = 500;
        break;
      case 4:
        points = 800; // Tetris
        break;
      default:
        break;
    }
    console.log("得分更新:", points);
    setScore((prevScore) => prevScore + points);
  };

  const rotateTetromino = () => {
    if (!currentTetromino || !currentTetromino.shape) return;

    const newShape: number[][] = currentTetromino.shape[0].map(
      (value: number, index: number) =>
        currentTetromino.shape.map((row: number[]) => row[index]).reverse()
    );

    console.log("旋转后的形状:", newShape);
    if (canMove(position.x, position.y, newShape)) {
      setCurrentTetromino({ ...currentTetromino, shape: newShape });
    }
  };

  const moveTetromino = (direction: number) => {
    const newX = position.x + direction;
    console.log("尝试移动到:", { x: newX, y: position.y });
    if (canMove(newX, position.y, currentTetromino.shape)) {
      setPosition({ ...position, x: newX });
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    console.log("按下的键:", event.key);
    switch (event.key) {
      case "ArrowLeft":
        moveTetromino(-1); // 向左移动
        break;
      case "ArrowRight":
        moveTetromino(1); // 向右移动
        break;
      case "ArrowDown":
        moveDown(); // 快速下移
        break;
      case "ArrowUp":
        rotateTetromino(); // 旋转方块
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      if (gameInterval.current) clearInterval(gameInterval.current);
    };
  }, [currentTetromino]);

  return (
    <div className={styles.tetris}>
      <h1>俄罗斯方块</h1>
      <div className={styles.score}>得分: {score}</div>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.cell} ${cell ? styles.filled : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={startGame}>开始游戏</button>
    </div>
  );
};

export default Tetris;
